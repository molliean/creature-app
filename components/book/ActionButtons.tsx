"use client";

import { startTransition, useState } from "react";
import { setShelfStatus, toggleFavorite, removeFromShelf, type BookMeta } from "@/app/actions/shelf";
import type { ShelfStatus } from "@/lib/shelf";

type ActionButtonsProps = {
  book: BookMeta;
  initialStatus: ShelfStatus | null;
  initialFavorite: boolean;
};

const STATUS_ACTIONS: { status: ShelfStatus; label: string; icon: string }[] = [
  { status: "finished",     label: "Finished",      icon: "✓" },
  { status: "reading",      label: "Reading",        icon: "◎" },
  { status: "want_to_read", label: "Want to read",   icon: "+" },
  { status: "dnf",          label: "Didn't finish",  icon: "×" },
];

export function ActionButtons({ book, initialStatus, initialFavorite }: ActionButtonsProps) {
  const [status, setStatus] = useState<ShelfStatus | null>(initialStatus);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, setIsPending] = useState(false);

  function handleStatusClick(s: ShelfStatus) {
    const next = status === s ? null : s;
    const prevStatus = status;
    const prevFavorite = isFavorite;

    setStatus(next);
    setIsPending(true);

    startTransition(async () => {
      try {
        if (next === null && !isFavorite) {
          await removeFromShelf(book.bookId);
        } else if (next === null) {
          // Keep row alive for the favorite — update status... but we have no status.
          // Just remove from shelf; favorite alone isn't a valid row state.
          await removeFromShelf(book.bookId);
        } else {
          await setShelfStatus(book, next, isFavorite);
        }
      } catch {
        setStatus(prevStatus);
        setIsFavorite(prevFavorite);
      } finally {
        setIsPending(false);
      }
    });
  }

  function handleFavoriteClick() {
    const next = !isFavorite;
    const prevFavorite = isFavorite;

    setIsFavorite(next);
    setIsPending(true);

    startTransition(async () => {
      try {
        await toggleFavorite(book, next, status);
      } catch {
        setIsFavorite(prevFavorite);
      } finally {
        setIsPending(false);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2" aria-busy={isPending}>
      {/* Favorite — independent of status */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        disabled={isPending}
        className={`font-ligconsolata inline-flex items-center gap-2 border border-black px-4 py-2 text-[16px] leading-[1.049em] transition-colors disabled:opacity-60 ${
          isFavorite ? "bg-black text-[#CBDEE1]" : "bg-transparent text-black hover:bg-black/10"
        }`}
      >
        <span>{isFavorite ? "♥" : "♡"}</span>
        Favorite
      </button>

      {/* Mutually exclusive status buttons */}
      {STATUS_ACTIONS.map(({ status: s, label, icon }) => (
        <button
          key={s}
          type="button"
          onClick={() => handleStatusClick(s)}
          disabled={isPending}
          className={`font-ligconsolata inline-flex items-center gap-2 border border-black px-4 py-2 text-[16px] leading-[1.049em] transition-colors disabled:opacity-60 ${
            status === s ? "bg-black text-[#CBDEE1]" : "bg-transparent text-black hover:bg-black/10"
          }`}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
