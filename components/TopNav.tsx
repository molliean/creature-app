import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

type TopNavProps = {
  brand?: string;
  links?: NavItem[];
  searchPlaceholder?: string;
};

const defaultLinks: NavItem[] = [
  { label: "My Shelf", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Shop", href: "#" },
  { label: "Stats", href: "#" },
];

export function TopNav({
  brand = "C",
  links = defaultLinks,
  searchPlaceholder = "Search titles...",
}: TopNavProps) {
  return (
    <header className="w-full border-b border-black bg-[#CBDEE1]">
      <div className="flex w-full items-center justify-between gap-[10px] px-8 py-[10px]">
        <div className="flex min-w-0 items-center gap-[39px]">
          <Link href="/" className="font-rubik-beastly h-[47px] w-[30px] shrink-0 text-left text-[40px] leading-[1.185em] font-normal text-[#F79E1B]">
            {brand}
          </Link>
          <nav aria-label="Primary">
            <ul className="font-ligconsolata flex flex-wrap items-center gap-10 text-[20px] leading-[1.049em] font-normal text-black">
              {links.map((link) => (
                <li key={link.label}>
                  <Link className="transition-opacity hover:opacity-70" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <form className="w-[259px] shrink-0" role="search">
          <label className="sr-only" htmlFor="site-search">
            Search
          </label>
          <div className="flex h-[41px] w-[259px] items-center justify-center gap-[10px] rounded-[10px] border border-black bg-[#CBDEE1] px-3 py-2">
            <div className="flex h-6 w-[235px] items-center justify-between gap-[95px]">
              <input
                id="site-search"
                className="font-ligconsolata h-[15px] min-w-0 flex-1 bg-transparent text-[14px] leading-[1.049em] font-normal text-[#4A4A4A] placeholder:text-[#4A4A4A] focus:outline-none"
                placeholder={searchPlaceholder}
                type="text"
              />
              <svg aria-hidden className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="#000000" strokeWidth="1" />
                <path d="M16.5 16.5L21 21" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </form>
      </div>
    </header>
  );
}
