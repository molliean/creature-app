"use client";

import { startTransition, useState } from "react";
import { setShelfStatus, removeFromShelf, type BookMeta } from "@/app/actions/shelf";
import type { ShelfStatus } from "@/lib/shelf";

type ActionButtonsProps = {
  book: BookMeta;
  initialStatus: ShelfStatus | null;
};

const ACTIONS: { status: ShelfStatus; label: string; icon: string }[] = [
  { status: "favorite",     label: "Favorite",      icon: "♥" },
  { status: "finished",     label: "Finished",       icon: "✓" },
  { status: "reading",      label: "Reading",        icon: "◎" },
  { status: "want_to_read", label: "Want to read",   icon: "+" },
  { status: "dnf",          label: "Didn't finish",  icon: "×" },
];

export function ActionButtons({ book, initialStatus }: ActionButtonsProps) {
  const [status, setStatus] = useState<ShelfStatus | null>(initialStatus);
  const [isPending, setIsPending] = useState(false);

  function handleClick(s: ShelfStatus) {
    const next = status === s ? null : s;

    // Optimistic update
    setStatus(next);
    setIsPending(true);

    startTransition(async () => {
      try {
        if (next === null) {
          await removeFromShelf(book.bookId);
        } else {
          await setShelfStatus(book, next);
        }
      } catch {
        // Roll back on error
        setStatus(status);
      } finally {
        setIsPending(false);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2" aria-busy={isPending}>
      {ACTIONS.map(({ status: s, label, icon }) => (
        <button
          key={s}
          type="button"
          onClick={() => handleClick(s)}
          disabled={isPending}
          className={`font-ligconsolata inline-flex items-center gap-2 border border-black px-4 py-2 text-[16px] leading-[1.049em] transition-colors disabled:opacity-60 ${
            status === s
              ? "bg-black text-[#CBDEE1]"
              : "bg-transparent text-black hover:bg-black/10"
          }`}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
