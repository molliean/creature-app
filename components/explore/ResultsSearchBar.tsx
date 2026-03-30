"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResultsSearchBar({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/explore/results?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="relative w-full border border-black"
        style={{
          background:
            "linear-gradient(105deg, rgba(114,227,189,0.247) 0%, rgba(219,165,253,0.194) 48%, rgba(255,198,247,0.212) 88%), #CBDEE1",
        }}
      >
        <textarea
          className="font-ligconsolata h-[120px] w-full resize-none bg-transparent px-6 py-5 text-[18px] leading-[1.5em] font-normal text-black placeholder:text-[#8A8A8A] focus:outline-none"
          placeholder="A sweeping historical novel set in 1920s Paris..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
        />
        <button
          type="submit"
          aria-label="Submit search"
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
  );
}
