type GenreData = {
  genre: string;
  count: number;
};

type GenreChartProps = {
  data: GenreData[];
  total: number;
};

export function GenreChart({ data, total }: GenreChartProps) {
  return (
    <div className="flex flex-col gap-4 border border-black bg-[#CBDEE1] p-6">
      <p className="type-h2 text-[#1A1A1A]">
        By genre
      </p>
      <div className="flex flex-col gap-3">
        {data.map(({ genre, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={genre} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="type-body text-[#1A1A1A]">
                  {genre}
                </span>
                <span className="type-body text-[#686868]">
                  {count}
                </span>
              </div>
              <div className="h-[1px] w-full bg-[#1A1A1A]/10">
                <div className="h-full bg-[#1A1A1A]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
