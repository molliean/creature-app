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
    <div className="flex flex-col gap-4 border border-black bg-[#CBDEE1] p-3 md:p-6">
      <p className="type-h2 text-[#1A1A1A]">
        Books read by month
      </p>
      <div className="flex items-end gap-[3px] md:gap-[6px]">
        {data.map(({ month, books }) => {
          const pct = max > 0 ? (books / max) * 100 : 0;
          return (
            <div key={month} className="flex flex-1 flex-col items-center gap-1">
              {/* Fixed-height bar container — bar grows upward from bottom */}
              <div className="flex w-full items-end" style={{ height: "128px" }}>
                <div
                  className="w-full bg-[#1A1A1A]"
                  style={{ height: `${pct}%`, minHeight: books > 0 ? "2px" : "0" }}
                />
              </div>
              {/* Labels sit outside the bar container, never clipped */}
              <span className="font-dm-sans font-normal leading-[1.3em] text-[9px] text-[#686868] md:text-[15px]">{month}</span>
              <span className="font-dm-sans font-normal leading-[1.049em] text-[9px] text-[#1A1A1A] md:text-[12px]">{books}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
