"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookResultCard, type BookResult } from "@/components/explore/BookResultCard";

// ---------------------------------------------------------------------------
// Skeleton shown while the AI is fetching
// ---------------------------------------------------------------------------

function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-ligconsolata text-[18px] leading-[1.5em] text-[#686868] animate-pulse">
        Asking the bookseller…
      </p>
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
  );
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export function ResultsClient({
  initialQuery,
  initialResults,
}: {
  initialQuery: string;
  initialResults: BookResult[];
}) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [results, setResults] = useState(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q || q === activeQuery) return;

    setIsLoading(true);
    setActiveQuery(q);
    // Update the URL so the page is bookmarkable / shareable
    router.replace(`/explore/results?q=${encodeURIComponent(q)}`, { scroll: false });

    try {
      const res = await fetch("/api/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResults(data.books ?? []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="flex flex-col gap-2">
        <p className="font-ligconsolata text-[14px] leading-[1.049em] text-[#686868]">
          Refine your search
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className="relative w-full border border-black"
            style={{
              background:
                "linear-gradient(105deg, rgba(114,227,189,0.247) 0%, rgba(219,165,253,0.194) 48%, rgba(255,198,247,0.212) 88%), #CBDEE1",
            }}
          >
            <textarea
              className="font-ligconsolata h-[120px] w-full resize-none bg-transparent px-6 py-5 text-[18px] leading-[1.5em] font-normal text-black placeholder:text-[#8A8A8A] focus:outline-none"
              placeholder="A sweeping historical novel set in 1920s Paris..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Submit search"
              className="absolute bottom-4 right-4 flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-black bg-transparent transition-opacity hover:opacity-60 active:opacity-40 disabled:opacity-30"
            >
              {isLoading ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="animate-spin"
                  aria-hidden
                >
                  <circle cx="9" cy="9" r="7" stroke="black" strokeWidth="1.5" strokeDasharray="30" strokeDashoffset="10" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path
                    d="M3 9H15M15 9L10 4M15 9L10 14"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results count */}
      {activeQuery && !isLoading && (
        <p className="font-ligconsolata text-[24px] leading-[1.049em] font-normal text-black">
          {results.length} recommendation{results.length !== 1 ? "s" : ""} for &ldquo;{activeQuery}&rdquo;
        </p>
      )}

      {/* Results / loading / empty */}
      {isLoading ? (
        <ResultsSkeleton />
      ) : results.length > 0 ? (
        <div className="flex flex-col gap-6">
          {results.map((book) => (
            <BookResultCard key={activeQuery + book.id} book={book} />
          ))}
        </div>
      ) : activeQuery ? (
        <p className="font-ligconsolata text-[18px] text-[#686868]">
          No recommendations found. Try a different search.
        </p>
      ) : null}
    </div>
  );
}
