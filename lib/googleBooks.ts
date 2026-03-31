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
  /** High-res cover via fife=w600 (may be served from googleusercontent.com). */
  coverUrl?: string;
  /** Standard zoom=1 thumbnail from books.google.com — reliable fallback. */
  coverFallbackUrl?: string;
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

/** High-res cover URL (600px wide) from Google's image-serving CDN. */
function primaryCoverUrl(volumeId: string): string {
  return `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&fife=w600`;
}

/** Standard thumbnail from books.google.com — lower-res but very reliable. */
function fallbackCoverUrl(volumeId: string): string {
  return `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&zoom=1`;
}

/** Returns true if `returned` looks like it matches `expected` (case-insensitive, ignores punctuation). */
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

  return {
    id: volume.id,
    title: info.title ?? "Unknown Title",
    authors: info.authors ?? [],
    year,
    publisher: info.publisher,
    pageCount: info.pageCount,
    categories: info.categories,
    description: info.description,
    coverUrl: hasCover ? primaryCoverUrl(volume.id) : undefined,
    coverFallbackUrl: hasCover ? fallbackCoverUrl(volume.id) : undefined,
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

export type CoverUrls = { primary: string; fallback: string };

/**
 * Fetch cover URLs for a book, validated against the expected title.
 *
 * Strategy:
 * 1. Title + author search first — sorted by relevance, so the most popular
 *    edition (which has a real cover) comes first. ISBN-matched volumes are
 *    often catalog-only entries that return Google's "no cover" placeholder.
 * 2. Fall back to ISBN lookup only if the title search yields nothing.
 *
 * Returns both a high-res primary URL and a reliable fallback URL.
 */
export async function getCoverUrlByIsbn(
  isbn: string,
  { title, author }: { title: string; author: string }
): Promise<CoverUrls | undefined> {
  // --- Step 1: title + author search (most reliable for real cover images) ---
  const lastName = author.split(" ").pop() ?? author;
  const titleUrl = buildUrl("/volumes", {
    q: `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(lastName)}`,
    maxResults: "8",
    langRestrict: "en",
  });
  const titleRes = await fetch(titleUrl, { next: { revalidate: 86400 } });

  if (titleRes.ok) {
    const titleData = await titleRes.json();
    const items: VolumeRaw[] = titleData.items ?? [];

    for (const item of items) {
      if (
        item.volumeInfo?.imageLinks &&
        titlesMatch(item.volumeInfo.title ?? "", title)
      ) {
        return { primary: primaryCoverUrl(item.id), fallback: fallbackCoverUrl(item.id) };
      }
    }
  }

  // --- Step 2: ISBN lookup fallback ---
  const isbnUrl = buildUrl("/volumes", { q: `isbn:${isbn}`, maxResults: "1" });
  const isbnRes = await fetch(isbnUrl, { next: { revalidate: 86400 } });

  if (isbnRes.ok) {
    const data = await isbnRes.json();
    const item: VolumeRaw | undefined = data.items?.[0];
    if (item?.volumeInfo?.imageLinks && titlesMatch(item.volumeInfo.title ?? "", title)) {
      return { primary: primaryCoverUrl(item.id), fallback: fallbackCoverUrl(item.id) };
    }
  }

  return undefined;
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
