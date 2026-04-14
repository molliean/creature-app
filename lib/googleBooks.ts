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
  /** Open Library large cover — ?default=false means real 404 on miss so onError fires. */
  coverUrl?: string;
  /** Open Library medium cover (first fallback). */
  coverFallbackUrl?: string;
  /** Google Books fife cover (last resort, found via title+author search). */
  coverLastResortUrl?: string;
  isbn?: string;
  ratingsCount?: number;
};

// ---------------------------------------------------------------------------
// Cover URL helpers (exported so other pages can reuse them)
// ---------------------------------------------------------------------------

/**
 * Open Library cover URL.
 * CRITICAL: ?default=false forces a real HTTP 404 when no cover exists.
 * Without it, OL returns a 43-byte 1×1 transparent GIF (HTTP 200) which
 * looks like a success — onError never fires and the fallback chain breaks.
 */
export function olCoverUrl(isbn: string, size: "L" | "M"): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`;
}

/** Google Books fife cover — high-res, used as last resort. */
export function googleCoverUrl(volumeId: string): string {
  return `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&fife=w800`;
}

// ---------------------------------------------------------------------------
// Google Books API internals
// ---------------------------------------------------------------------------

function getApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ?? "";
}

function buildUrl(path: string, params: Record<string, string> = {}): string {
  const key = getApiKey();
  const allParams = key ? { ...params, key } : params;
  const qs = new URLSearchParams(allParams).toString();
  return `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;
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
    ratingsCount?: number;
    averageRating?: number;
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
    // OL primary (real 404 on miss) → OL medium fallback → Google last resort
    coverUrl:         isbn ? olCoverUrl(isbn, "L") : hasCover ? googleCoverUrl(volume.id) : undefined,
    coverFallbackUrl: isbn ? olCoverUrl(isbn, "M") : undefined,
    coverLastResortUrl: isbn && hasCover ? googleCoverUrl(volume.id) : undefined,
    isbn,
    ratingsCount: info.ratingsCount,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------


function normalizeTitle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

/**
 * Score a book for re-ranking.
 *
 * Ranking priority:
 *  1. All query words appear in title + high ratingsCount (popular title match)
 *  2. All query words appear in title but lower ratings
 *  3. Pure popularity (ratingsCount) for everything else
 *
 * Deliberately avoids huge exact-title bonuses so an obscure book titled
 * exactly "goon squad" doesn't beat "A Visit from the Goon Squad" (Egan).
 */
function scoreBook(book: GoogleBook, queryWords: string[], authorSearch = false): number {
  const ratingsCount = book.ratingsCount ?? 0;
  if (authorSearch) return ratingsCount;
  const title = normalizeTitle(book.title);
  const allWordsInTitle = queryWords.every((w) => title.includes(w));
  return (allWordsInTitle ? 5_000 : 0) + ratingsCount;
}

async function fetchVolumes(q: string, startIndex = 0, maxResults = 20): Promise<VolumeRaw[]> {
  const url = buildUrl("/volumes", {
    q,
    startIndex: String(startIndex),
    maxResults: String(maxResults),
    orderBy: "relevance",
    langRestrict: "en",
  });
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []) as VolumeRaw[];
}

/** Fetch up to 50 volumes for a query using two parallel requests (API cap is 40/request). */
async function fetchVolumes50(q: string): Promise<VolumeRaw[]> {
  const [first, second] = await Promise.all([
    fetchVolumes(q, 0, 40),
    fetchVolumes(q, 40, 10),
  ]);
  const seen = new Set<string>();
  const merged: VolumeRaw[] = [];
  for (const v of [...first, ...second]) {
    if (!seen.has(v.id)) { seen.add(v.id); merged.push(v); }
  }
  return merged;
}

/**
 * Returns true if the query looks like a person's name:
 * exactly two words, no digits, no common non-name words.
 * Case-insensitive — users often type author names in lowercase.
 */
const NON_NAME_WORDS = new Set(["the", "and", "or", "of", "in", "a", "an", "by", "for", "with", "from"]);
function looksLikePersonName(query: string): boolean {
  const words = query.trim().split(/\s+/);
  if (words.length !== 2) return false;
  if (/\d/.test(query)) return false;
  return words.every((w) => !NON_NAME_WORDS.has(w.toLowerCase()));
}

/**
 * Search books by title, author, or keyword.
 *
 * Strategy:
 * 1. If the query looks like a person's name (two words, no digits), run
 *    inauthor: and broad searches in parallel (50 results each path), merge,
 *    deduplicate, and rank by ratingsCount so the author's own books dominate.
 * 2. For short queries (≤ 3 words), try intitle: first (50 results); falls back
 *    to a broad 50-result search if fewer than 3 results come back.
 * 3. Deduplicates and re-ranks client-side: books where all query words appear
 *    in the title get a moderate bonus, then ratingsCount breaks all ties.
 * 4. limit controls how many results are returned (default 50 for keyword
 *    search; pass 8 for AI recommendations).
 */
export async function searchBooks(query: string, limit = 50): Promise<GoogleBook[]> {
  const words = query.trim().split(/\s+/);
  const queryWords = words.map((w) => normalizeTitle(w)).filter(Boolean);
  const isName = looksLikePersonName(query);

  let raw: VolumeRaw[] = [];

  if (isName) {
    const [authorRaw, broadRaw] = await Promise.all([
      fetchVolumes50(`inauthor:"${query}"`),
      fetchVolumes50(query),
    ]);
    const seen = new Set(authorRaw.map((v) => v.id));
    raw = [...authorRaw, ...broadRaw.filter((v) => !seen.has(v.id))];

    const authorBooks = raw.map(volumeToGoogleBook);
    // For author searches: rank purely by ratingsCount so title-match bonus doesn't
    // elevate books *about* the author above books *by* the author. Stable sort
    // preserves inauthor: head-of-list position as tiebreaker when counts equal.
    authorBooks.sort((a, b) => (b.ratingsCount ?? 0) - (a.ratingsCount ?? 0));
    return authorBooks.slice(0, limit);
  } else {
    const isShort = words.length <= 3;
    if (isShort) {
      const titleRaw = await fetchVolumes50(`intitle:${query}`);
      if (titleRaw.length >= 3) {
        raw = titleRaw;
      } else {
        const broadRaw = await fetchVolumes50(query);
        const seen = new Set(titleRaw.map((v) => v.id));
        raw = [...titleRaw, ...broadRaw.filter((v) => !seen.has(v.id))];
      }
    } else {
      raw = await fetchVolumes50(query);
    }
  }

  const books = raw.map(volumeToGoogleBook);
  books.sort((a, b) => scoreBook(b, queryWords) - scoreBook(a, queryWords));
  return books.slice(0, limit);
}

/**
 * Find a book by title and author — used for resolving list covers.
 *
 * Strategy:
 * 1. Strip punctuation from the title (? ! , . ' " etc. confuse the API).
 * 2. Try intitle: + inauthor:lastName — most precise.
 * 3. Fall back to intitle: only if the combined query returns nothing
 *    (handles accent mismatches like Bolaño/Bolano, rare author spellings, etc.)
 */
export async function getBookByTitleAndAuthor(
  title: string,
  author: string
): Promise<GoogleBook | null> {
  const lastName = author.split(" ").pop() ?? author;
  const cleanTitle = title.replace(/[?!,'."":;]/g, "").trim();

  let raw = await fetchVolumes(`intitle:${cleanTitle}+inauthor:${lastName}`, 0, 5);

  // If combined query fails, try title-only (handles accent mismatches etc.)
  if (raw.length === 0) {
    raw = await fetchVolumes(`intitle:${cleanTitle}`, 0, 5);
  }

  // If title is too common (e.g. "Beloved"), fall back to a plain "title author"
  // query — Google Books relevance ranking surfaces the famous edition first.
  if (raw.length === 0 || !raw.some((v) =>
    (v.volumeInfo?.authors ?? []).some((a) =>
      a.toLowerCase().includes(lastName.toLowerCase())
    )
  )) {
    const plainRaw = await fetchVolumes(`${cleanTitle} ${author}`, 0, 5);
    if (plainRaw.length > 0) raw = plainRaw;
  }

  if (raw.length === 0) return null;
  return volumeToGoogleBook(raw[0]);
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
 * Build cover URLs for a static library book by ISBN.
 *
 * Chain: OL large → OL medium → Google Books fife
 *
 * OL uses ?default=false so missing covers return HTTP 404 (not 1×1 GIF).
 * Google Books: title+author search finds the popular edition with a real cover.
 */
export async function getCoverUrlByIsbn(
  isbn: string,
  { title, author }: { title: string; author: string }
): Promise<CoverUrls> {
  const primary  = olCoverUrl(isbn, "L");
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
      for (const item of (data.items ?? []) as VolumeRaw[]) {
        if (item.volumeInfo?.imageLinks && titlesMatch(item.volumeInfo.title ?? "", title)) {
          lastResort = googleCoverUrl(item.id);
          break;
        }
      }
    }
  } catch {
    // Non-fatal — OL primary and fallback are still in the chain
  }

  return { primary, fallback, lastResort };
}

/**
 * Search for books based on a mood or vibe description.
 * Appends a subject:fiction hint to steer results toward literary titles.
 */
export async function searchByMood(prompt: string): Promise<GoogleBook[]> {
  return searchBooks(`${prompt}+subject:fiction`, 8);
}
