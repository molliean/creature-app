"use client";

type TabItem = {
  label: string;
  count: number;
};

type TabsProps = {
  items: TabItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
};

export function Tabs({ items, activeIndex = 0, onSelect }: TabsProps) {
  const active = items[activeIndex];
  const rest = items.map((item, index) => ({ item, index })).filter(({ index }) => index !== activeIndex);

  return (
    <div className="flex w-full gap-8 bg-[#CBDEE1] px-[10px] py-[10px]">
      <div className="flex gap-8">
        <div className="flex flex-col items-center justify-center gap-[3px]">
          <span className="font-shippori-mincho text-[17px] leading-[1.3em] text-black">
            {active.label} ({active.count})
          </span>
          <span className="h-0 w-[73px] border-t border-black" />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {rest.map(({ item, index }) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect?.(index)}
            className="font-shippori-mincho text-[17px] leading-[1.3em] text-[#686868] hover:text-black transition-colors"
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>
    </div>
  );
}
