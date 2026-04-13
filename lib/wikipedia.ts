type WikiSummary = {
  type: string;
  extract?: string;
  description?: string;
};

function trimToWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

/**
 * Fetch a short author bio from the Wikipedia REST summary API.
 *
 * Returns the extract trimmed to 250 words, or null if:
 * - No article is found
 * - The article is a disambiguation page
 * - The article has no extract (e.g. redirect stubs)
 */
export async function getAuthorBio(authorName: string): Promise<string | null> {
  // Wikipedia REST API: spaces → underscores, then percent-encode
  const title = encodeURIComponent(authorName.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "CreatureBooks/1.0 (book discovery app)" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as WikiSummary;

    // Skip disambiguation pages and articles with no usable content
    if (data.type === "disambiguation" || !data.extract?.trim()) return null;

    return trimToWords(data.extract.trim(), 250);
  } catch {
    return null;
  }
}
