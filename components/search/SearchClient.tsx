"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookResultCard, type BookResult } from "@/components/explore/BookResultCard";

type Props = {
  initialQuery: string;
  initialResults: BookResult[];
};

export function SearchClient({ initialQuery, initialResults }: Props) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [results, setResults] = useState<BookResult[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q || q === activeQuery) return;

    setIsLoading(true);
    setActiveQuery(q);
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.books ?? []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const skeletons = (
    <div className="flex flex-col gap-4">
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

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <form onSubmit={handleSubmit} role="search" className="flex gap-3">
        <label className="sr-only" htmlFor="search-input">
          Search books
        </label>
        <input
          id="search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="font-ligconsolata h-[41px] flex-1 border border-black bg-transparent px-4 text-[15px] text-[#1a1a1a] placeholder:text-[#4A4A4A] outline-none focus:ring-1 focus:ring-black"
          placeholder="Search titles, authors, keywords…"
        />
        <button
          type="submit"
          className="font-ligconsolata h-[41px] border border-black bg-black px-6 text-[15px] text-white transition-opacity hover:opacity-80"
        >
          Search
        </button>
      </form>

      {/* Results header */}
      {!isLoading && activeQuery && (
        <div className="flex flex-col gap-1">
          <p className="font-ligconsolata text-[13px] uppercase tracking-widest text-[#686868]">
            Search results
          </p>
          <p className="font-ligconsolata text-[18px] text-[#686868]">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{activeQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Results */}
      {isLoading ? skeletons : (
        <div className="flex flex-col gap-4">
          {results.map((book) => (
            <BookResultCard key={book.id} book={book} />
          ))}
          {!isLoading && activeQuery && results.length === 0 && (
            <p className="font-ligconsolata text-[18px] text-[#686868]">
              No results found. Try a different search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
