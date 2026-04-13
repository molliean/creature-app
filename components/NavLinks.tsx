"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

export function NavLinks({ links }: { links: NavItem[] }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "#") return false;
    // /explore should match /explore and /explore/results
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <ul className="font-shippori-mincho flex flex-wrap items-center gap-10 text-[20px] leading-[1.049em] text-black">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className={`transition-opacity hover:opacity-70 ${isActive(link.href) ? "font-bold" : "font-normal"}`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
