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
      <p className="font-shippori-mincho text-[24px] leading-[1.049em] font-normal text-black">
        By genre
      </p>
      <div className="flex flex-col gap-3">
        {data.map(({ genre, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={genre} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="font-ligconsolata text-[13px] leading-[1.049em] text-black">
                  {genre}
                </span>
                <span className="font-ligconsolata text-[12px] leading-[1.049em] text-[#686868]">
                  {count}
                </span>
              </div>
              <div className="h-[1px] w-full bg-black/10">
                <div className="h-full bg-black" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
