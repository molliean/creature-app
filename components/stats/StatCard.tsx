type StatCardProps = {
  value: string;
  label: string;
  sublabel?: string;
};

export function StatCard({ value, label, sublabel }: StatCardProps) {
  const hasDecimal = value.includes(".");
  return (
    <div className="flex w-full flex-col items-center gap-1 p-3 md:inline-flex md:w-fit md:gap-2 md:p-6">
      <p className={`font-ligconsolata text-[48px] leading-[1.049em] font-bold text-[#1A1A1A] md:text-[64px] ${hasDecimal ? "tracking-[-0.04em]" : ""}`}>
        {value}
      </p>
      <div className="flex flex-col items-center gap-0.5 text-center md:gap-1">
        <p className="type-body text-[#1A1A1A]">
          {label}
        </p>
        {sublabel && (
          <p className="type-label text-[#686868]">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
