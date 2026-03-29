import { TopNav } from "@/components/TopNav";
import { ExplorePrompt } from "@/components/explore/ExplorePrompt";

export default function ExplorePage() {
  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav />
      <main className="flex min-h-[calc(100vh-69px)] flex-col justify-center px-8 py-12">
        <section className="flex w-full max-w-[860px] flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-shippori-mincho text-[40px] leading-[1.448em] font-normal text-black">
              Explore
            </h1>
            <p className="font-ligconsolata text-[16px] leading-[1.4em] font-normal text-[#4A4A4A]">
              Describe what you&apos;re in the mood for and we&apos;ll find the perfect book.
            </p>
          </div>
          <ExplorePrompt />
        </section>
      </main>
    </div>
  );
}
