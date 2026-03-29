type PillProps = {
  label: string;
  className?: string;
};

export function Pill({ label, className = "" }: PillProps) {
  return (
    <span
      className={`font-ligconsolata inline-flex items-center justify-center gap-[10px] rounded-[7px] border border-black px-[6px] py-[2px] text-[12px] leading-[1.049em] font-normal text-black ${className}`.trim()}
      style={{ borderWidth: "0.5px" }}
    >
      {label}
    </span>
  );
}
