type StatCardProps = {
  value: string;
  label: string;
  sublabel?: string;
};

export function StatCard({ value, label, sublabel }: StatCardProps) {
  return (
    <div className="inline-flex w-fit flex-col justify-between bg-[#CBDEE1] p-6">
      <p className="font-shippori-mincho text-[72px] leading-[1em] font-normal text-black">
        {value}
      </p>
      <div className="flex flex-col gap-1">
        <p className="font-ligconsolata text-[16px] leading-[1.049em] font-normal text-black">
          {label}
        </p>
        {sublabel && (
          <p className="font-ligconsolata text-[12px] leading-[1.049em] font-normal text-[#686868]">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
