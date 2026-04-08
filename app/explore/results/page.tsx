import { TopNav } from "@/components/TopNav";
import { ResultsClient } from "@/components/explore/ResultsClient";
import { getAiRecommendations } from "@/lib/aiRecommendations";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const initialResults = query ? await getAiRecommendations(query) : [];

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav isAuthenticated />
      <main className="flex flex-col gap-6 px-8 py-8">
        <ResultsClient initialQuery={query} initialResults={initialResults} />
      </main>
    </div>
  );
}
