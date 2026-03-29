"use client";

import { useState } from "react";

const SUGGESTION_CHIPS = [
  "Books with unreliable narrators",
  "A literary page-turner I can't put down",
  "Something to read on a rainy afternoon",
  "Poetic prose that lingers in your mind",
  "A slow burn with a lot of tension",
  "Found family in an unexpected place",
  "Unsettling books that stay with you",
  "Love stories that don't end happily",
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
        <div className="relative w-full border border-black" style={{ background: "linear-gradient(105deg, rgba(114,227,189,0.247) 0%, rgba(219,165,253,0.194) 48%, rgba(255,198,247,0.212) 88%), #CBDEE1" }}>
          <textarea
            className="font-ligconsolata h-[200px] w-full resize-none bg-transparent px-6 py-5 text-[18px] leading-[1.5em] font-normal text-black placeholder:text-[#8A8A8A] focus:outline-none"
            placeholder="A sweeping historical novel set in 1920s Paris..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Submit prompt"
            className="absolute bottom-4 right-4 flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-black bg-transparent transition-opacity hover:opacity-60 active:opacity-40"
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

      <div className="flex flex-col gap-[24px]">
        <p className="font-ligconsolata pl-[48px] text-[18px] leading-[1.049em] font-normal text-[#4A4A4A]">
          Try something like…
        </p>

        <div className="flex justify-center">
          <div className="inline-grid grid-cols-2 gap-x-[24px] gap-y-2">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="font-ligconsolata inline-flex w-fit items-center justify-start rounded-[7px] border border-black px-[10px] py-[6px] text-[14px] leading-[1.049em] font-normal text-black transition-colors hover:bg-black/10 active:bg-black/20"
                style={{ borderWidth: "0.5px" }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
