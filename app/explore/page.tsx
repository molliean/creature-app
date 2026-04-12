import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Explore — Creature",
};
import { ExplorePrompt } from "@/components/explore/ExplorePrompt";

export default function ExplorePage() {
  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav />
      <main className="flex min-h-[calc(100vh-69px)] flex-col items-center justify-start px-8 pt-[96px] pb-16">
        <section className="flex w-full max-w-[864px] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-shippori-mincho text-[52px] leading-[1.3em] font-normal text-black">
              What would you like to read?
            </h1>
            <p className="font-ligconsolata text-[18px] leading-[1.5em] font-normal text-[#4A4A4A]">
              Describe the kind of book you&apos;re in the mood for.
            </p>
          </div>
          <ExplorePrompt />
        </section>
      </main>
    </div>
  );
}
