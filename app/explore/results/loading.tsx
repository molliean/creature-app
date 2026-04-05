import { TopNav } from "@/components/TopNav";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav isAuthenticated />
      <main className="flex flex-col gap-6 px-8 py-8">
        <div className="flex flex-col gap-4">
          <p className="font-ligconsolata text-[18px] leading-[1.5em] text-[#686868] animate-pulse">
            Asking the bookseller…
          </p>
          {/* Skeleton cards */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-[57px] border border-black bg-[#CBDEE1] p-8 opacity-50"
            >
              <div
                className="shrink-0 border border-black bg-[#8B9DAA] animate-pulse"
                style={{ width: "160px", aspectRatio: "2/3" }}
              />
              <div className="flex flex-1 flex-col gap-3 justify-center">
                <div className="h-10 w-3/4 bg-black/10 animate-pulse rounded" />
                <div className="h-6 w-1/3 bg-black/10 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-black/10 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
