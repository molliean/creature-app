"use client";

import { useState } from "react";

type Status = "finished" | "reading" | "want" | "dnf" | null;

type ActionButtonsProps = {
  initialStatus?: Status;
};

const ACTIONS: { status: Status & string; label: string; icon: string }[] = [
  { status: "finished", label: "Finished", icon: "✓" },
  { status: "reading", label: "Reading", icon: "◎" },
  { status: "want", label: "Want to read", icon: "+" },
  { status: "dnf", label: "Didn't finish", icon: "×" },
];

export function ActionButtons({ initialStatus = null }: ActionButtonsProps) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [favorited, setFavorited] = useState(false);

  function toggle(s: Status) {
    setStatus((prev) => (prev === s ? null : s));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFavorited((f) => !f)}
          className={`font-ligconsolata inline-flex items-center gap-2 border border-black px-4 py-2 text-[16px] leading-[1.049em] transition-colors ${
            favorited ? "bg-black text-[#CBDEE1]" : "bg-transparent text-black hover:bg-black/10"
          }`}
        >
          <span>{favorited ? "♥" : "♡"}</span>
          Favorite
        </button>

        {ACTIONS.map(({ status: s, label, icon }) => (
          <button
            key={s}
            type="button"
            onClick={() => toggle(s)}
            className={`font-ligconsolata inline-flex items-center gap-2 border border-black px-4 py-2 text-[16px] leading-[1.049em] transition-colors ${
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
    </div>
  );
}
