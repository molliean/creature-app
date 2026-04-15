"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

type NavItem = {
  label: string;
  href: string;
};

export function MobileMenuButton({ links }: { links: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function isActive(href: string) {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setOpen(false);
    }
  }

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center text-black"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Full-screen overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#CBDEE1]">
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-[10px] border-b border-black">
            <Link href="/home" className="type-logo h-[47px] w-[30px] text-left text-[#F79E1B]">
              C
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center text-black"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Menu body */}
          <div className="flex flex-1 flex-col gap-0 overflow-y-auto px-4 pt-6 pb-8">
            {/* Search */}
            <form onSubmit={handleSearch} role="search" className="mb-8">
              <label className="sr-only" htmlFor="mobile-search">Search</label>
              <div className="flex h-[48px] items-center gap-2 border border-black bg-[#CBDEE1] px-3">
                <input
                  id="mobile-search"
                  type="text"
                  placeholder="Search titles..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="font-dm-sans min-w-0 flex-1 bg-transparent text-[16px] text-[#4A4A4A] placeholder:text-[#4A4A4A] focus:outline-none"
                />
                <button type="submit" aria-label="Search" className="shrink-0">
                  <svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" stroke="#000000" strokeWidth="1" />
                    <path d="M16.5 16.5L21 21" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Nav links */}
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.label} className="border-b border-black/20">
                    <Link
                      href={link.href}
                      className={`font-shippori-mincho block py-5 text-[24px] leading-[1.2em] text-black transition-opacity hover:opacity-70 ${isActive(link.href) ? "font-bold" : "font-normal"}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sign out */}
            <div className="mt-auto pt-8">
              <button
                type="button"
                className="font-ligconsolata text-[16px] text-black underline transition-opacity hover:opacity-70"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
