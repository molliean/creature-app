import Link from "next/link";
import { NavSearchForm } from "@/components/NavSearchForm";
import { NavLinks } from "@/components/NavLinks";
import { UserMenu } from "@/components/UserMenu";

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
  { label: "My Shelf", href: "/home" },
  { label: "Explore", href: "/explore" },
  { label: "Lists", href: "#" },
  { label: "Stats", href: "/stats" },
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
          <Link href="/home" className="type-logo h-[47px] w-[30px] shrink-0 text-left text-[#F79E1B]">
            {brand}
          </Link>
          <nav aria-label="Primary">
            <NavLinks links={links} />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <NavSearchForm placeholder={searchPlaceholder} />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
