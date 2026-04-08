import { TopNav } from "@/components/TopNav";
import { SearchClient } from "@/components/search/SearchClient";
import { searchBooks } from "@/lib/googleBooks";
import type { BookResult } from "@/components/explore/BookResultCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  let initialResults: BookResult[] = [];
  if (query) {
    const googleBooks = await searchBooks(query);
    initialResults = googleBooks.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.authors.join(", "),
      year: b.year,
      publisher: b.publisher,
      pages: b.pageCount,
      genres: b.categories ?? [],
      coverUrl: b.coverUrl,
      coverFallbackUrl: b.coverFallbackUrl,
      coverLastResortUrl: b.coverLastResortUrl,
    }));
  }

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav isAuthenticated />
      <main className="flex flex-col gap-6 px-8 py-8">
        <SearchClient initialQuery={query} initialResults={initialResults} />
      </main>
    </div>
  );
}
