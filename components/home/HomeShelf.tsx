"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "./Tabs";
import { BookCarousel } from "./BookCarousel";
import { SUGGESTION_CHIPS } from "@/components/explore/ExplorePrompt";
import type { ShelfBook, ShelfStatus } from "@/lib/shelf";

type HomeShelfProps = {
  shelf: ShelfBook[];
};

type TabFilter = ShelfStatus | "all" | "favorites";

const STATUS_TABS: { label: string; filter: TabFilter }[] = [
  { label: "All",               filter: "all" },
  { label: "Currently reading", filter: "reading" },
  { label: "Want to read",      filter: "want_to_read" },
  { label: "Finished",          filter: "finished" },
  { label: "Didn't finish",     filter: "dnf" },
  { label: "Favorites",         filter: "favorites" },
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

  function handleChip(chip: string) {
    router.push(`/explore/results?q=${encodeURIComponent(chip)}`);
  }

  return (
    // Mobile: normal document flow. Desktop: fixed overlay centred in viewport.
    <div className="flex flex-col items-center py-8 md:pointer-events-none md:fixed md:inset-0 md:justify-center md:py-0">
      <div className="flex w-full max-w-[480px] flex-col gap-6 md:pointer-events-auto">

        {/* Heading */}
        <h2 className="type-h1 text-center text-[#1A1A1A]">Your shelf is empty</h2>

        {/* Regular search */}
        <div className="flex w-full flex-col gap-2">
          <p className="type-body text-center text-[#1A1A1A]">Search by title, author, or keyword</p>
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search titles..."
              className="type-body w-full rounded-[5px] border border-black bg-transparent py-[10px] pl-4 pr-14 text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[20px] text-black transition-opacity hover:opacity-60 active:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>

        {/* AI mood search */}
        <div className="flex w-full flex-col gap-2">
          <p className="type-body text-[#1A1A1A]">or ask the bookseller for something new...</p>
          <form onSubmit={handleMood} className="relative w-full">
            <textarea
              rows={3}
              value={moodValue}
              onChange={(e) => setMoodValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleMood(e as unknown as React.FormEvent);
                }
              }}
              placeholder="A sweeping historical novel set in 1920s Paris..."
              className="type-body min-h-[80px] w-full resize-none rounded-[5px] border border-black py-4 pl-6 pr-14 text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-black"
              style={{ background: "linear-gradient(105deg, rgba(114,227,189,0.247) 0%, rgba(219,165,253,0.194) 48%, rgba(255,198,247,0.212) 88%), #CBDEE1" }}
            />
            <button
              type="submit"
              aria-label="Submit mood search"
              className="absolute bottom-3 right-2 flex h-8 w-8 items-center justify-center rounded-[6px] border border-black bg-transparent transition-opacity hover:opacity-60 active:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M5.5 4L6.8 8.2L11 9.5L6.8 10.8L5.5 15L4.2 10.8L0 9.5L4.2 8.2Z" fill="black"/>
                <path d="M12.5 1.5L13.1 3.4L15 4L13.1 4.6L12.5 6.5L11.9 4.6L10 4L11.9 3.4Z" fill="black"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Suggestion chips */}
        <div className="flex w-full flex-col gap-3">
          <p className="font-dm-sans font-normal leading-[1.302em] text-[14px] text-[#4A4A4A]">Try something like…</p>
          <div className="flex justify-center">
            <div className="flex flex-col items-start gap-y-2 md:inline-grid md:grid-cols-2 md:gap-x-6">
              {SUGGESTION_CHIPS.slice(0, 4).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChip(chip)}
                  className="type-body inline-flex w-fit items-center justify-start rounded-[20px] border border-black px-[10px] py-[6px] text-black transition-colors hover:bg-black/10 active:bg-black/20"
                  style={{ borderWidth: "0.5px" }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
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

const MOBILE_GROUPS: { label: string; filter: Exclude<TabFilter, "all"> }[] = [
  { label: "Currently reading", filter: "reading" },
  { label: "Want to read",      filter: "want_to_read" },
  { label: "Finished",          filter: "finished" },
  { label: "Didn't finish",     filter: "dnf" },
  { label: "Favorites",         filter: "favorites" },
];

export function HomeShelf({ shelf }: HomeShelfProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeFilter = STATUS_TABS[activeIndex].filter;
  const filtered =
    activeFilter === "all"      ? shelf :
    activeFilter === "favorites" ? shelf.filter((b) => b.isFavorite) :
    shelf.filter((b) => b.status === activeFilter);

  const tabItems = STATUS_TABS.map(({ label, filter }) => ({
    label,
    count:
      filter === "all"       ? shelf.length :
      filter === "favorites" ? shelf.filter((b) => b.isFavorite).length :
      shelf.filter((b) => b.status === filter).length,
  }));

  const rows = chunk(filtered.map(shelfBookToCarouselBook), 6);

  // Mobile: status-grouped carousels (non-empty groups only)
  const mobileGroups = MOBILE_GROUPS.map(({ label, filter }) => ({
    label,
    books: (
      filter === "favorites"
        ? shelf.filter((b) => b.isFavorite)
        : shelf.filter((b) => b.status === filter)
    ).map(shelfBookToCarouselBook),
  })).filter((g) => g.books.length > 0);

  return (
    <div className="flex flex-col">
      {/* Desktop: sticky tabs */}
      <div className="hidden md:block sticky top-[67px] z-10 bg-[#CBDEE1]">
        <Tabs items={tabItems} activeIndex={activeIndex} onSelect={setActiveIndex} />
      </div>

      {/* Desktop: tab-filtered rows */}
      <div className="hidden md:block">
        {filtered.length === 0 ? (
          activeIndex === 0 ? <EmptyShelf /> : <EmptyTab />
        ) : (
          <div className="flex flex-col gap-9 pl-3 pb-12 pt-6">
            {rows.map((row, i) => (
              <div
                key={i}
                className="w-full overflow-x-auto pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                <BookCarousel books={row} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: grouped carousels */}
      <div className="flex flex-col md:hidden">
        {shelf.length === 0 ? (
          <EmptyShelf />
        ) : mobileGroups.length === 0 ? (
          <EmptyShelf />
        ) : (
          <div className="flex flex-col gap-3 px-1 pb-12 pt-3">
            {mobileGroups.map((group) => (
              <section key={group.label}>
                <BookCarousel books={group.books} heading={group.label} />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
