import { TopNav } from "@/components/TopNav";
import { StatCard } from "@/components/stats/StatCard";
import { MonthlyChart } from "@/components/stats/MonthlyChart";
import { GenreChart } from "@/components/stats/GenreChart";

const monthlyData = [
  { month: "Jan", books: 3 },
  { month: "Feb", books: 2 },
  { month: "Mar", books: 4 },
  { month: "Apr", books: 1 },
  { month: "May", books: 5 },
  { month: "Jun", books: 3 },
  { month: "Jul", books: 6 },
  { month: "Aug", books: 4 },
  { month: "Sep", books: 2 },
  { month: "Oct", books: 5 },
  { month: "Nov", books: 3 },
  { month: "Dec", books: 4 },
];

const genreData = [
  { genre: "Literary fiction", count: 28 },
  { genre: "Historical fiction", count: 19 },
  { genre: "Contemporary fiction", count: 17 },
  { genre: "Classics", count: 14 },
  { genre: "Short stories", count: 9 },
  { genre: "Non-fiction", count: 7 },
  { genre: "Poetry", count: 6 },
];

const maxBooks = Math.max(...monthlyData.map((d) => d.books));
const genreTotal = genreData.reduce((sum, d) => sum + d.count, 0);

export default function StatsPage() {
  return (
    <div className="min-h-screen w-full bg-[#CBDEE1] text-black">
      <TopNav />
      <main className="flex w-full flex-col gap-[17px] px-8 pt-10 pb-16">
        <div className="flex items-center gap-[10px] p-[10px]">
          <h1 className="font-shippori-mincho text-[40px] leading-[1.448em] font-normal text-black">
            Reading stats
          </h1>
        </div>

        {/* Stat cards */}
        <div className="flex justify-center gap-16">
          <StatCard value="47" label="Books read" sublabel="all time" />
          <StatCard value="42" label="Books read" sublabel="this year" />
          <StatCard value="3.5" label="Books per month" sublabel="this year" />
          <StatCard value="12,480" label="Pages read" sublabel="this year" />
          <StatCard value="14" label="Want to read" sublabel="on your list" />
          <StatCard value="8" label="Didn't finish" sublabel="all time" />
          <StatCard value="12" label="Favorites" sublabel="all time" />
        </div>

        {/* Charts */}
        <MonthlyChart data={monthlyData} max={maxBooks} />
        <GenreChart data={genreData} total={genreTotal} />
      </main>
    </div>
  );
}
