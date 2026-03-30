type MonthData = {
  month: string;
  books: number;
};

type MonthlyChartProps = {
  data: MonthData[];
  max: number;
};

export function MonthlyChart({ data, max }: MonthlyChartProps) {
  return (
    <div className="flex flex-col gap-4 border border-black bg-[#CBDEE1] p-6">
      <p className="font-shippori-mincho text-[24px] leading-[1.049em] font-normal text-black">
        Books read by month
      </p>
      <div className="flex h-[160px] items-end gap-[6px]">
        {data.map(({ month, books }) => {
          const pct = max > 0 ? (books / max) * 100 : 0;
          return (
            <div key={month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-col items-center justify-end" style={{ height: "128px" }}>
                <div
                  className="w-full bg-black"
                  style={{ height: `${pct}%`, minHeight: books > 0 ? "2px" : "0" }}
                />
              </div>
              <span className="font-ligconsolata text-[10px] leading-[1em] text-[#686868]">
                {month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
