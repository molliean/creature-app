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
    <div className="flex w-full flex-col gap-5">
      <form onSubmit={handleSubmit}>
        <div className="relative w-full rounded-[13px] border border-black" style={{ background: "linear-gradient(135deg, #EBE4F7 0%, #FFFFFF 100%)" }}>
          <textarea
            className="font-ligconsolata h-[200px] w-full resize-none bg-transparent px-6 py-5 text-[18px] leading-[1.5em] font-normal text-black placeholder:text-[#8A8A8A] focus:outline-none"
            placeholder="Describe what you want to read…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Submit prompt"
            className="absolute bottom-4 right-4 flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#989898] bg-[#D79E2D] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80 active:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M3 9H15M15 9L10 4M15 9L10 14"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        <p className="font-ligconsolata text-[13px] leading-[1.049em] font-normal text-[#4A4A4A]">
          Try something like…
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="font-ligconsolata inline-flex items-center justify-start rounded-[7px] border border-black px-[10px] py-[6px] text-[14px] leading-[1.049em] font-normal text-black transition-colors hover:bg-black/10 active:bg-black/20"
              style={{ borderWidth: "0.5px" }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
