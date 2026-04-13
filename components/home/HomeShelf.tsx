"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "./Tabs";
import { BookCarousel } from "./BookCarousel";
import type { ShelfBook, ShelfStatus } from "@/lib/shelf";

type HomeShelfProps = {
  shelf: ShelfBook[];
};

const STATUS_TABS: { label: string; status: ShelfStatus | null }[] = [
  { label: "All",               status: null },
  { label: "Currently reading", status: "reading" },
  { label: "Want to read",      status: "want_to_read" },
  { label: "Finished",          status: "finished" },
  { label: "Didn't finish",     status: "dnf" },
  { label: "Favorites",         status: "favorite" },
];

function shelfBookToCarouselBook(b: ShelfBook) {
  return {
    slug: b.bookId,
    title: b.title,
    author: b.author ?? "",
    coverTone: "bg-[#8B9DAA]",
    coverUrl: b.coverUrl ?? undefined,
    coverFallbackUrl: undefined,
    coverLastResortUrl: undefined,
  };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function EmptyShelf() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [moodValue, setMoodValue] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleMood(e: React.FormEvent) {
    e.preventDefault();
    const q = moodValue.trim();
    if (q) router.push(`/explore/results?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex w-[390px] flex-col items-center gap-7 pointer-events-auto">

        {/* Heading */}
        <p className="type-h1 whitespace-nowrap text-[#1A1A1A]">Your shelf is empty</p>

        {/* Regular search */}
        <div className="flex w-full flex-col gap-2">
          <p className="type-body text-center text-[#1A1A1A]">Search by title, author, or keyword</p>
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search titles..."
              className="type-body w-full rounded-[8px] border border-black bg-transparent py-[10px] pl-4 pr-14 text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black transition-opacity hover:opacity-60 active:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>

        {/* AI mood search */}
        <div className="flex flex-col gap-2 items-center">
        <p className="type-body text-[#1A1A1A]">or ask the bookseller for something new...</p>
        <form onSubmit={handleMood} className="relative w-[438px]">
          <input
            type="text"
            value={moodValue}
            onChange={(e) => setMoodValue(e.target.value)}
            placeholder="A sweeping historical novel set in 1920s Paris..."
            className="type-body w-full rounded-[8px] border border-black py-[18px] pl-6 pr-16 text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-black"
            style={{ background: "linear-gradient(105deg, rgba(114,227,189,0.247) 0%, rgba(219,165,253,0.194) 48%, rgba(255,198,247,0.212) 88%), #CBDEE1" }}
          />
          <button
            type="submit"
            aria-label="Submit mood search"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-[6px] border border-black bg-transparent transition-opacity hover:opacity-60 active:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        </div>

      </div>
    </div>
  );
}

function EmptyTab() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3 text-center pointer-events-auto">
        <p className="type-h2 text-[#1A1A1A]">No books here yet</p>
        <p className="type-body text-[#686868]">
          Add books by visiting a book page and choosing a status.
        </p>
      </div>
    </div>
  );
}

export function HomeShelf({ shelf }: HomeShelfProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeStatus = STATUS_TABS[activeIndex].status;
  const filtered = activeStatus === null
    ? shelf
    : shelf.filter((b) => b.status === activeStatus);

  const tabItems = STATUS_TABS.map(({ label, status }) => ({
    label,
    count: status === null ? shelf.length : shelf.filter((b) => b.status === status).length,
  }));

  const rows = chunk(filtered.map(shelfBookToCarouselBook), 6);

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-6">
      <Tabs items={tabItems} activeIndex={activeIndex} onSelect={setActiveIndex} />

      {filtered.length === 0 ? (
        activeIndex === 0 ? <EmptyShelf /> : <EmptyTab />
      ) : (
        <div className="flex flex-col gap-9 overflow-y-auto pl-3 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {rows.map((row, i) => (
            <div
              key={i}
              className="w-full overflow-x-auto overflow-y-hidden pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <BookCarousel books={row} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
