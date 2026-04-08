import type { Metadata } from "next";
import Link from "next/link";
import { LandingCarousel } from "@/components/landing/LandingCarousel";

export const metadata: Metadata = {
  title: "Creature",
};

export default function LandingPage() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#CBDEE1]">
      {/* Top bar */}
      <header className="flex w-full items-center justify-between px-8 py-5">
        <span className="font-rubik-beastly text-[40px] leading-none text-[#F79E1B]">
          Creature
        </span>
        <Link
          href="/sign-in"
          className="font-ligconsolata text-[16px] leading-[1.049em] text-black transition-opacity hover:opacity-70"
        >
          Sign in
        </Link>
      </header>

      {/* Main content — two columns */}
      <main className="flex flex-1 items-center gap-16 px-8 overflow-hidden">
        {/* Left: copy + CTAs */}
        <div className="flex flex-col gap-8 shrink-0 max-w-[480px]">
          <div className="flex flex-col gap-4">
            <h1 className="font-shippori-mincho text-[52px] leading-[1.2em] font-normal text-black">
              Your reading life,<br />beautifully tracked.
            </h1>
            <p className="font-ligconsolata text-[18px] leading-[1.6em] text-[#4A4A4A]">
              Keep a shelf of everything you&rsquo;ve read, discover what to read next, and explore books that match your mood.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/sign-up"
              className="font-ligconsolata inline-flex items-center gap-2 border border-black bg-[#D79E2D] px-6 py-3 text-[16px] leading-[1.049em] font-normal text-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80"
            >
              Get started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/sign-in"
              className="font-ligconsolata text-[16px] leading-[1.049em] text-black underline transition-opacity hover:opacity-70"
            >
              Already a member? Sign in
            </Link>
          </div>
        </div>

        {/* Right: animated book carousel */}
        <div className="relative flex-1 h-full max-h-[calc(100vh-120px)] overflow-hidden border border-black shadow-[4px_4px_0px_rgba(0,0,0,0.15)]">
          <LandingCarousel />
        </div>
      </main>
    </div>
  );
}
