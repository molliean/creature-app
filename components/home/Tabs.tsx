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
  return (
    <div className="flex w-full items-center gap-8 bg-[#CBDEE1] px-[10px] py-[10px]">
      {items.map((item, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect?.(index)}
            className="flex flex-col items-center gap-[3px]"
          >
            <span
              className={`font-dm-sans text-[17px] leading-[1.3em] transition-colors ${
                active ? "text-[#1A1A1A]" : "text-[#686868] hover:text-black"
              }`}
            >
              {item.label} ({item.count})
            </span>
            {active && <span className="h-0 w-full border-t border-black" />}
          </button>
        );
      })}
    </div>
  );
}
