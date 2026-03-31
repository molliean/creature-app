const BASE_URL = "https://www.googleapis.com/books/v1";

export type GoogleBook = {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  description?: string;
  /** Open Library large cover (primary). Real 404 when missing — onError fires correctly. */
  coverUrl?: string;
  /** Open Library medium cover (first fallback). */
  coverFallbackUrl?: string;
  /** Google Books fife cover (last resort). */
  coverLastResortUrl?: string;
  isbn?: string;
};

function getApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ?? "";
}

function buildUrl(path: string, params: Record<string, string> = {}): string {
  const key = getApiKey();
  const allParams = key ? { ...params, key } : params;
  const qs = new URLSearchParams(allParams).toString();
  return `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;
}

function olCoverUrl(isbn: string, size: "L" | "M" | "S"): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

/** Google Books high-res cover — used only as last resort. */
function googleCoverUrl(volumeId: string): string {
  return `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&fife=w600`;
}

/** Returns true if `returned` roughly matches `expected` (case-insensitive, ignores punctuation). */
function titlesMatch(returned: string, expected: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const a = normalize(returned);
  const b = normalize(expected);
  return a.includes(b) || b.includes(a);
}

type VolumeRaw = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    categories?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    industryIdentifiers?: { type: string; identifier: string }[];
  };
};

function volumeToGoogleBook(volume: VolumeRaw): GoogleBook {
  const info = volume.volumeInfo ?? {};

  const hasCover = !!(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail);

  const isbn =
    info.industryIdentifiers?.find((x) => x.type === "ISBN_13")?.identifier ??
    info.industryIdentifiers?.find((x) => x.type === "ISBN_10")?.identifier;

  const yearRaw = info.publishedDate ? parseInt(info.publishedDate.slice(0, 4), 10) : NaN;
  const year = isNaN(yearRaw) ? undefined : yearRaw;

  // Cover priority: OL Large → OL Medium → Google Books fife
  // Open Library returns a real 404 for missing covers so onError fires correctly.
  const coverUrl = isbn ? olCoverUrl(isbn, "L") : hasCover ? googleCoverUrl(volume.id) : undefined;
  const coverFallbackUrl = isbn ? olCoverUrl(isbn, "M") : undefined;
  const coverLastResortUrl = isbn && hasCover ? googleCoverUrl(volume.id) : undefined;

  return {
    id: volume.id,
    title: info.title ?? "Unknown Title",
    authors: info.authors ?? [],
    year,
    publisher: info.publisher,
    pageCount: info.pageCount,
    categories: info.categories,
    description: info.description,
    coverUrl,
    coverFallbackUrl,
    coverLastResortUrl,
    isbn,
  };
}

/** Search books by title, author, or keyword. */
export async function searchBooks(
  query: string,
  maxResults = 20
): Promise<GoogleBook[]> {
  const url = buildUrl("/volumes", {
    q: query,
    maxResults: String(maxResults),
    langRestrict: "en",
  });

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = await res.json();
  return ((data.items ?? []) as VolumeRaw[]).map(volumeToGoogleBook);
}

/** Fetch a single book's full details by Google Books volume ID. */
export async function getBookById(id: string): Promise<GoogleBook | null> {
  const url = buildUrl(`/volumes/${id}`);

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = await res.json();
  return volumeToGoogleBook(data as VolumeRaw);
}

export type CoverUrls = { primary: string; fallback: string; lastResort?: string };

/**
 * Build cover URLs for a book by ISBN.
 *
 * Primary:    Open Library large  (real 404 when missing → onError fires)
 * Fallback:   Open Library medium
 * Last resort: Google Books fife  (via title+author search for a volume with real cover)
 */
export async function getCoverUrlByIsbn(
  isbn: string,
  { title, author }: { title: string; author: string }
): Promise<CoverUrls> {
  const primary = olCoverUrl(isbn, "L");
  const fallback = olCoverUrl(isbn, "M");

  // Find a Google Books volume with a real cover for last-resort fallback
  const lastName = author.split(" ").pop() ?? author;
  const titleUrl = buildUrl("/volumes", {
    q: `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(lastName)}`,
    maxResults: "8",
    langRestrict: "en",
  });

  let lastResort: string | undefined;
  try {
    const res = await fetch(titleUrl, { next: { revalidate: 86400 } });
    if (res.ok) {
      const data = await res.json();
      const items: VolumeRaw[] = data.items ?? [];
      for (const item of items) {
        if (item.volumeInfo?.imageLinks && titlesMatch(item.volumeInfo.title ?? "", title)) {
          lastResort = googleCoverUrl(item.id);
          break;
        }
      }
    }
  } catch {
    // Non-fatal — we still have OL as primary and fallback
  }

  return { primary, fallback, lastResort };
}

/**
 * Search for books based on a mood or vibe description.
 * Appends a subject:fiction hint to steer results toward literary titles.
 */
export async function searchByMood(
  prompt: string,
  maxResults = 20
): Promise<GoogleBook[]> {
  const query = `${prompt}+subject:fiction`;
  return searchBooks(query, maxResults);
}
