"use client";

import { useState } from "react";
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
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-center pointer-events-auto">
            <p className="type-h2 text-[#1A1A1A]">
              {activeIndex === 0
                ? "Your shelf is empty"
                : "No books here yet"}
            </p>
            <p className="type-body text-[#686868]">
              {activeIndex === 0
                ? "Explore books and add them to your shelf to get started."
                : "Add books by visiting a book page and choosing a status."}
            </p>
          </div>
        </div>
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
