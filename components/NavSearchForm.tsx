"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NavSearchForm({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/explore/results?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form className="w-[259px] shrink-0" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="site-search">
        Search
      </label>
      <div className="flex h-[41px] w-[259px] items-center justify-center gap-[10px] rounded-[10px] border border-black bg-[#CBDEE1] px-3 py-2">
        <div className="flex h-6 w-[235px] items-center justify-between gap-[95px]">
          <input
            id="site-search"
            className="font-ligconsolata h-[15px] min-w-0 flex-1 bg-transparent text-[14px] leading-[1.049em] font-normal text-[#4A4A4A] placeholder:text-[#4A4A4A] focus:outline-none"
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" aria-label="Search" className="shrink-0">
            <svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#000000" strokeWidth="1" />
              <path d="M16.5 16.5L21 21" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
