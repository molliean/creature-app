"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BookResultCard, type BookResult, type CardShelfInfo } from "@/components/explore/BookResultCard";

const PAGE_SIZE = 10;

type Props = {
  initialQuery: string;
  initialResults: BookResult[];
  initialPage?: number;
};

export function SearchClient({ initialQuery, initialResults, initialPage = 1 }: Props) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [results, setResults] = useState<BookResult[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [shelfStatuses, setShelfStatuses] = useState<Record<string, CardShelfInfo>>({});
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Sync state when the page navigates to a new query (e.g. from the nav bar
  // while already on the search page — same component instance, new props).
  useEffect(() => {
    setInputValue(initialQuery);
    setActiveQuery(initialQuery);
    setResults(initialResults);
    setPage(initialPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Fetch shelf status for all results whenever results or auth state changes.
  useEffect(() => {
    if (!isSignedIn || results.length === 0) {
      setShelfStatuses({});
      return;
    }
    const bookIds = results.map((b) => b.id).join(",");
    fetch(`/api/shelf/status?bookIds=${bookIds}`)
      .then((r) => r.json())
      .then((data) => setShelfStatuses(data as Record<string, CardShelfInfo>))
      .catch(() => setShelfStatuses({}));
  }, [results, isSignedIn]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q || q === activeQuery) return;

    setIsLoading(true);
    setActiveQuery(q);
    setPage(1);
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

  function goToPage(next: number) {
    setPage(next);
    const url = activeQuery
      ? `/search?q=${encodeURIComponent(activeQuery)}&page=${next}`
      : `/search?page=${next}`;
    router.replace(url, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageResults = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
      <form onSubmit={handleSubmit} role="search" className="flex gap-3 w-full md:max-w-[480px]">
        <label className="sr-only" htmlFor="search-input">
          Search books
        </label>
        <input
          id="search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="type-body h-[41px] flex-1 rounded-[5px] border border-black bg-transparent px-4 text-[#1a1a1a] placeholder:text-[#4A4A4A] outline-none focus:ring-1 focus:ring-black"
          placeholder="Search titles, authors, keywords…"
        />
        <button
          type="submit"
          className="type-body h-[41px] rounded-[20px] border border-black bg-black px-6 text-white transition-opacity hover:opacity-80"
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
          {pageResults.map((book) => (
            <BookResultCard
              key={book.id}
              book={book}
              shelfInfo={shelfStatuses[book.id]}
              isAuthenticated={isSignedIn ?? false}
            />
          ))}
          {!isLoading && activeQuery && results.length === 0 && (
            <p className="font-ligconsolata text-[18px] text-[#686868]">
              No results found. Try a different search.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center gap-4 w-full md:max-w-[480px]">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
            className="font-ligconsolata h-[36px] rounded-[20px] border border-black bg-transparent px-5 text-[14px] text-black transition-opacity hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="font-ligconsolata flex-1 text-center text-[14px] text-[#686868]">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="font-ligconsolata h-[36px] rounded-[20px] border border-black bg-transparent px-5 text-[14px] text-black transition-opacity hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
