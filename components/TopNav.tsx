import Link from "next/link";
import { NavSearchForm } from "@/components/NavSearchForm";
import { UserMenu } from "@/components/UserMenu";

type NavItem = {
  label: string;
  href: string;
};

type TopNavProps = {
  brand?: string;
  links?: NavItem[];
  searchPlaceholder?: string;
  isAuthenticated?: boolean;
};

const defaultLinks: NavItem[] = [
  { label: "My Shelf", href: "/home" },
  { label: "Explore", href: "/explore" },
  { label: "Lists", href: "#" },
  { label: "Stats", href: "/stats" },
];

export function TopNav({
  brand = "C",
  links = defaultLinks,
  searchPlaceholder = "Search titles...",
  isAuthenticated = false,
}: TopNavProps) {
  return (
    <header className="w-full border-b border-black bg-[#CBDEE1]">
      <div className="flex w-full items-center justify-between gap-[10px] px-8 py-[10px]">
        <div className="flex min-w-0 items-center gap-[39px]">
          <Link href="/home" className="font-rubik-beastly h-[47px] w-[30px] shrink-0 text-left text-[40px] leading-[1.185em] font-normal text-[#F79E1B]">
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

        <div className="flex items-center gap-4">
          <NavSearchForm placeholder={searchPlaceholder} />
          {isAuthenticated && <UserMenu />}
        </div>
      </div>
    </header>
  );
}
