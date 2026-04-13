"use client";

import { startTransition, useState } from "react";
import { setShelfStatus, toggleFavorite, removeFromShelf, type BookMeta } from "@/app/actions/shelf";
import type { ShelfStatus } from "@/lib/shelf";

type CardActionButtonsProps = {
  book: BookMeta;
  initialStatus: ShelfStatus | null;
  initialFavorite: boolean;
};

const CARD_STATUS_ACTIONS: { status: ShelfStatus; label: string; icon: string }[] = [
  { status: "want_to_read", label: "Want to read",   icon: "+" },
  { status: "finished",     label: "Finished",       icon: "✓" },
  { status: "dnf",          label: "Didn't finish",  icon: "×" },
];

export function CardActionButtons({ book, initialStatus, initialFavorite }: CardActionButtonsProps) {
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
        if (next === null) {
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

  const base = "font-ligconsolata inline-flex items-center gap-[6px] border border-black rounded-[20px] px-[10px] py-[5px] text-[13px] leading-[1.049em] transition-colors disabled:opacity-60";
  const inactive = "bg-transparent text-black hover:bg-black/10";
  const active = "bg-[#1D9E75] text-[#CBDEE1] border-transparent";

  return (
    <div className="flex flex-wrap gap-2" aria-busy={isPending}>
      <button
        type="button"
        onClick={handleFavoriteClick}
        disabled={isPending}
        className={`${base} ${isFavorite ? active : inactive}`}
      >
        <span>{isFavorite ? "♥" : "♡"}</span>
        Favorite
      </button>

      {CARD_STATUS_ACTIONS.map(({ status: s, label, icon }) => (
        <button
          key={s}
          type="button"
          onClick={() => handleStatusClick(s)}
          disabled={isPending}
          className={`${base} ${status === s ? active : inactive}`}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
