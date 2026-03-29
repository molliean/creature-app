"use client";

import { useState } from "react";

const SUGGESTION_CHIPS = [
  "unreliable narrators",
  "rainy afternoon reads",
  "enemies to lovers",
  "dark academia",
  "slow burn",
  "found family",
  "haunted houses",
  "unrequited love",
];

export function ExplorePrompt() {
  const [value, setValue] = useState("");

  function handleChipClick(chip: string) {
    setValue(chip);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // API call wired up later
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex h-[72px] w-full items-center gap-3 rounded-[13px] border border-black bg-[#CBDEE1] px-5">
          <input
            className="font-ligconsolata min-w-0 flex-1 bg-transparent text-[20px] leading-[1.049em] font-normal text-black placeholder:text-[#4A4A4A] focus:outline-none"
            placeholder="Describe what you want to read…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
          <button
            type="submit"
            aria-label="Submit prompt"
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px] border border-[#989898] bg-[#D79E2D] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80 active:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="font-ligconsolata inline-flex items-center justify-center rounded-[7px] border border-black px-[10px] py-[5px] text-[14px] leading-[1.049em] font-normal text-black transition-colors hover:bg-black/10 active:bg-black/20"
            style={{ borderWidth: "0.5px" }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
