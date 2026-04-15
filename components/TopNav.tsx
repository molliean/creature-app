import Link from "next/link";
import { NavSearchForm } from "@/components/NavSearchForm";
import { NavLinks } from "@/components/NavLinks";
import { UserMenu } from "@/components/UserMenu";
import { MobileMenuButton } from "@/components/MobileMenuButton";

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
  { label: "Lists", href: "/lists" },
  { label: "Stats", href: "/stats" },
];

export function TopNav({
  brand = "C",
  links = defaultLinks,
  searchPlaceholder = "Search titles...",
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#1A1A1A] bg-[#CBDEE1]">
      <div className="flex w-full items-center justify-between gap-[10px] px-4 md:px-8 py-[10px]">
        <div className="flex min-w-0 items-center gap-[39px]">
          <Link href="/home" className="type-logo h-[47px] w-[30px] shrink-0 text-left text-[#F79E1B]">
            {brand}
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <NavLinks links={links} />
          </nav>
        </div>

        {/* Desktop: search + user menu */}
        <div className="hidden md:flex items-center gap-4">
          <NavSearchForm placeholder={searchPlaceholder} />
          <UserMenu />
        </div>

        {/* Mobile: hamburger only */}
        <div className="flex md:hidden">
          <MobileMenuButton links={links} />
        </div>
      </div>
    </header>
  );
}
