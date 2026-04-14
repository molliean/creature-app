import { getAdminClient } from "./supabase";

export type MonthData = { month: string; count: number };
export type GenreData = { genre: string; count: number };

export type UserStats = {
  booksReadAllTime: number;
  booksReadThisYear: number;
  booksPerMonthThisYear: number;
  pagesReadThisYear: number;
  wantToRead: number;
  didntFinish: number;
  favorites: number;
  booksByMonth: MonthData[];
  booksByGenre: GenreData[];
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getUserStats(userId: string): Promise<UserStats> {
  const db = getAdminClient();
  const now = new Date();
  const currentYear = now.getFullYear();
  const yearStart = `${currentYear}-01-01T00:00:00.000Z`;
  const yearEnd   = `${currentYear + 1}-01-01T00:00:00.000Z`;

  // Fetch all shelf rows for the user in one query
  const { data, error } = await db
    .from("shelf_books")
    .select("status, is_favorite, page_count, genres, date_finished")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  const rows = data ?? [];

  // --- Scalar stats ---
  const booksReadAllTime = rows.filter((r) => r.status === "finished").length;
  const wantToRead       = rows.filter((r) => r.status === "want_to_read").length;
  const didntFinish      = rows.filter((r) => r.status === "dnf").length;
  const favorites        = rows.filter((r) => r.is_favorite).length;

  const finishedThisYear = rows.filter(
    (r) => r.status === "finished" && r.date_finished >= yearStart && r.date_finished < yearEnd
  );

  const booksReadThisYear = finishedThisYear.length;

  const pagesReadThisYear = finishedThisYear.reduce(
    (sum, r) => sum + (typeof r.page_count === "number" ? r.page_count : 0),
    0
  );

  // Months elapsed so far this year (at least 1 to avoid divide-by-zero in January)
  const monthsElapsed = Math.max(1, now.getMonth() + 1);
  const booksPerMonthThisYear = parseFloat((booksReadThisYear / monthsElapsed).toFixed(1));

  // --- Books by month (all 12 months of current year) ---
  const monthlyCounts = new Array<number>(12).fill(0);
  for (const r of finishedThisYear) {
    if (r.date_finished) {
      const month = new Date(r.date_finished).getMonth(); // 0-indexed
      monthlyCounts[month]++;
    }
  }
  const booksByMonth: MonthData[] = MONTH_LABELS.map((month, i) => ({
    month,
    count: monthlyCounts[i],
  }));

  // --- Books by genre (all finished books with genres) ---
  const genreMap = new Map<string, number>();
  for (const r of rows.filter((r) => r.status === "finished")) {
    const genres = r.genres as string[] | null;
    if (!genres) continue;
    for (const g of genres) {
      if (g) genreMap.set(g, (genreMap.get(g) ?? 0) + 1);
    }
  }
  const booksByGenre: GenreData[] = Array.from(genreMap.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  return {
    booksReadAllTime,
    booksReadThisYear,
    booksPerMonthThisYear,
    pagesReadThisYear,
    wantToRead,
    didntFinish,
    favorites,
    booksByMonth,
    booksByGenre,
  };
}
