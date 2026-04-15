import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { TopNav } from "@/components/TopNav";
import { StatCard } from "@/components/stats/StatCard";
import { MonthlyChart } from "@/components/stats/MonthlyChart";
import { GenreChart } from "@/components/stats/GenreChart";
import { getUserStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Reading Stats — Creature",
};

export default async function StatsPage() {
  const { userId } = await auth();

  const stats = userId
    ? await getUserStats(userId)
    : {
        booksReadAllTime: 0,
        booksReadThisYear: 0,
        booksPerMonthThisYear: 0,
        pagesReadThisYear: 0,
        wantToRead: 0,
        didntFinish: 0,
        favorites: 0,
        booksByMonth: [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec",
        ].map((month) => ({ month, count: 0 })),
        booksByGenre: [],
      };

  const maxMonthCount = Math.max(...stats.booksByMonth.map((d) => d.count), 1);
  const genreTotal    = stats.booksByGenre.reduce((sum, d) => sum + d.count, 0);

  const pagesDisplay = stats.pagesReadThisYear > 0
    ? stats.pagesReadThisYear.toLocaleString()
    : "0";

  const perMonthDisplay = stats.booksReadThisYear === 0
    ? "0"
    : stats.booksPerMonthThisYear.toString();

  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-[#1A1A1A]">
      <TopNav />
      <main className="flex w-full flex-col gap-[17px] px-4 pt-8 pb-16 md:px-8 md:pt-10">
        <div className="flex items-center gap-[10px] p-[10px]">
          <h1 className="type-h1 text-[#1A1A1A]">
            Reading stats
          </h1>
        </div>

        {/* Mobile stat layout */}
        <div className="flex flex-col gap-1 md:hidden">
          {/* Row 1: 3 stats */}
          <div className="grid grid-cols-3 gap-x-2 gap-y-2">
            <StatCard value={String(stats.booksReadAllTime)}  label="Books read"      sublabel="all time" />
            <StatCard value={String(stats.booksReadThisYear)} label="Books read"      sublabel="this year" />
            <StatCard value={perMonthDisplay}                 label="Books per month" sublabel="this year" />
          </div>

          {/* Row 2: 3 stats */}
          <div className="grid grid-cols-3 gap-x-2 gap-y-2">
            <StatCard value={String(stats.wantToRead)}  label="Want to read"  sublabel="on your list" />
            <StatCard value={String(stats.didntFinish)} label="Didn't finish" sublabel="all time" />
            <StatCard value={String(stats.favorites)}   label="Favorites"     sublabel="all time" />
          </div>

          {/* Row 3: pages read full width, centered */}
          <div className="flex justify-center">
            <StatCard value={pagesDisplay} label="Pages read" sublabel="this year" />
          </div>
        </div>

        {/* Desktop stat layout — single row */}
        <div className="hidden md:flex md:justify-center md:gap-24">
          <StatCard value={String(stats.booksReadAllTime)}    label="Books read"      sublabel="all time" />
          <StatCard value={String(stats.booksReadThisYear)}   label="Books read"      sublabel="this year" />
          <StatCard value={perMonthDisplay}                   label="Books per month" sublabel="this year" />
          <StatCard value={pagesDisplay}                      label="Pages read"      sublabel="this year" />
          <StatCard value={String(stats.wantToRead)}          label="Want to read"    sublabel="on your list" />
          <StatCard value={String(stats.didntFinish)}         label="Didn't finish"   sublabel="all time" />
          <StatCard value={String(stats.favorites)}           label="Favorites"       sublabel="all time" />
        </div>

        {/* Charts */}
        <MonthlyChart
          data={stats.booksByMonth.map((d) => ({ month: d.month, books: d.count }))}
          max={maxMonthCount}
        />
        {stats.booksByGenre.length > 0 && (
          <GenreChart
            data={stats.booksByGenre.map((d) => ({ genre: d.genre, count: d.count }))}
            total={genreTotal}
          />
        )}
      </main>
    </div>
  );
}
