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
      <main className="flex min-h-[calc(100vh-69px)] flex-col items-center justify-start px-6 pt-12 pb-16 md:px-8 md:pt-[96px]">
        <section className="flex w-full max-w-[864px] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="type-h1 text-black">
              What would you like<br className="md:hidden" /> to read?
            </h1>
            <p className="font-dm-sans font-normal leading-[1.302em] text-[18px] text-[#4A4A4A] md:text-[20px]">
              Describe the kind of book <br/> you&apos;re in the mood for.
            </p>
          </div>
          <ExplorePrompt />
        </section>
      </main>
    </div>
  );
}
