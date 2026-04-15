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
      <header className="flex w-full items-center justify-between border-b border-[#1A1A1A] px-4 py-[10px] md:px-8 md:py-5">
        <span className="type-logo leading-none text-[#F79E1B]">
          Creature
        </span>
        <Link
          href="/sign-in"
          className="font-ligconsolata text-[16px] leading-[1.049em] text-black transition-opacity hover:opacity-70"
        >
          Sign in
        </Link>
      </header>

      {/* Mobile layout: stacked */}
      <main className="flex flex-1 flex-col overflow-hidden md:flex-row md:items-center md:gap-16 md:px-8">
        {/* Copy + CTAs */}
        <div className="flex shrink-0 flex-col gap-5 px-4 pt-6 pb-6 md:max-w-[480px] md:gap-8 md:px-0 md:pt-0 md:pb-0">
          <div className="flex flex-col gap-3 md:gap-4">
            <h1 className="type-h1 text-center text-black md:text-left">
              Upgrade your<br /> reading life.
            </h1>
            <p className="font-ligconsolata text-center text-[16px] leading-[1.6em] text-[#4A4A4A] md:text-left md:text-[18px]">
              Explore books that match your mood, keep track of everything you&rsquo;ve read, and discover what to read next.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
            <Link
              href="/sign-up"
              className="font-ligconsolata inline-flex w-[45vw] items-center justify-center gap-2 border border-black bg-[#D79E2D] px-6 py-3 text-[16px] leading-[1.049em] font-normal text-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80 md:w-auto"
            >
              Get started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/sign-in"
              className="font-ligconsolata text-center text-[16px] leading-[1.049em] text-black underline transition-opacity hover:opacity-70 md:text-left"
            >
              Already a member? Sign in
            </Link>
          </div>
        </div>

        {/* Animated book carousel — constrained height on mobile to keep covers small */}
        <div className="relative mx-4 mb-4 h-[440px] overflow-hidden md:mx-0 md:mb-0 md:h-full md:flex-1 md:max-h-[calc(100vh-120px)]">
          <LandingCarousel />
        </div>
      </main>
    </div>
  );
}
