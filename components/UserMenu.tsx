"use client";

import { useRef, useState, useEffect } from "react";
import { signOut } from "@/app/actions/auth";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        className="flex items-center justify-center rounded-full border border-black/30 bg-transparent p-1 transition-opacity hover:opacity-70"
      >
        {/* User circle icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="1.5" />
          <circle cx="14" cy="11" r="4" stroke="black" strokeWidth="1.5" />
          <path
            d="M5 23c0-4.418 4.03-8 9-8s9 3.582 9 8"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[160px] border border-black bg-[#CBDEE1] shadow-md z-50">
          <ul className="font-ligconsolata text-[14px] leading-[1.049em]">
            <li>
              <a
                href="/home"
                className="block px-4 py-3 transition-opacity hover:opacity-70"
                onClick={() => setOpen(false)}
              >
                My Shelf
              </a>
            </li>
            <li>
              <a
                href="/stats"
                className="block px-4 py-3 transition-opacity hover:opacity-70"
                onClick={() => setOpen(false)}
              >
                Stats
              </a>
            </li>
            <li className="border-t border-black/20">
              <form action={signOut}>
                <button
                  type="submit"
                  className="block w-full px-4 py-3 text-left transition-opacity hover:opacity-70"
                >
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
