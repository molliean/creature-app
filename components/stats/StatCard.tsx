type StatCardProps = {
  value: string;
  label: string;
  sublabel?: string;
};

export function StatCard({ value, label, sublabel }: StatCardProps) {
  const hasDecimal = value.includes(".");
  return (
    <div className="inline-flex w-fit flex-col items-center gap-2 bg-[#CBDEE1] p-6">
      <p className={`font-ligconsolata text-[64px] leading-[1.049em] font-bold text-[#1A1A1A] ${hasDecimal ? "tracking-[-0.04em]" : ""}`}>
        {value}
      </p>
      <div className="flex flex-col items-center gap-1 text-center">
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
