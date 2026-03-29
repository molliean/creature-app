type TabItem = {
  label: string;
  count: number;
};

type TabsProps = {
  items: TabItem[];
  activeIndex?: number;
};

export function Tabs({ items, activeIndex = 0 }: TabsProps) {
  const active = items[activeIndex];
  const rest = items.filter((_, index) => index !== activeIndex);

  return (
    <div className="flex w-full gap-8 bg-[#CBDEE1] px-[10px] py-[10px]">
      <div className="flex gap-8">
        <div className="flex flex-col items-center justify-center gap-[3px]">
          <span className="font-ligconsolata text-[16px] leading-[1.049em] font-normal text-black">
            {active.label} ({active.count})
          </span>
          <span className="h-0 w-[73px] border-t border-black" />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {rest.map((item) => (
          <span
            key={item.label}
            className="font-ligconsolata text-[16px] leading-[1.049em] font-normal text-[#686868]"
          >
            {item.label} ({item.count})
          </span>
        ))}
      </div>
    </div>
  );
}
