import { TopNav } from "@/components/TopNav";
import { ResultsSearchBar } from "@/components/explore/ResultsSearchBar";
import { BookResultCard } from "@/components/explore/BookResultCard";
import { getAiRecommendations } from "@/lib/aiRecommendations";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const results = query ? await getAiRecommendations(query) : [];

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav isAuthenticated />
      <main className="flex flex-col gap-6 px-8 py-8">
        {/* Editable search input */}
        <ResultsSearchBar initialQuery={query} />

        {/* Results count */}
        {query && (
          <p className="font-ligconsolata text-[24px] leading-[1.049em] font-normal text-black">
            {results.length} recommendation{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}

        {/* Book cards */}
        {results.length > 0 ? (
          <div className="flex flex-col gap-6">
            {results.map((book) => (
              <BookResultCard key={book.id} book={book} />
            ))}
          </div>
        ) : query ? (
          <p className="font-ligconsolata text-[18px] text-[#686868]">
            No recommendations found. Try a different search.
          </p>
        ) : null}
      </main>
    </div>
  );
}
