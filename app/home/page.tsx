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
    <div className="flex h-screen flex-col w-full bg-[#CBDEE1] text-black">
      <TopNav />
      <main className="flex flex-1 min-h-0 flex-col w-full">
        <section className="flex flex-1 min-h-0 flex-col gap-[17px] pl-6 pt-10">
          <div className="flex items-center justify-start gap-[10px] p-[10px]">
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
