import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { TopNav } from "@/components/TopNav";
import { HomeShelf } from "@/components/home/HomeShelf";
import { getUserShelf } from "@/lib/shelf";

export const metadata: Metadata = {
  title: "My Shelf — Creature",
};

export default async function Home() {
  const { userId } = await auth();
  const shelf = userId ? await getUserShelf(userId) : [];

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav />
      <main className="flex flex-col w-full">
        <section className="flex flex-col gap-4 px-5 pt-5 md:gap-[17px] md:px-0 md:pl-6 md:pt-10">
          <div className="flex items-center justify-start gap-[10px] py-1 md:p-[10px]">
            <h1 className="type-h1 text-black">
              My Bookshelf
            </h1>
          </div>
          <HomeShelf shelf={shelf} />
        </section>
      </main>
    </div>
  );
}
