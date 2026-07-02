"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/banners", label: "Banners" },
  { href: "/reviews", label: "Reviews" },
  { href: "/messages", label: "Messages" },
];

export default function NavLinks({ vertical = false }: { vertical?: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={
        vertical
          ? "flex flex-col gap-1"
          : "no-scrollbar flex gap-1 overflow-x-auto"
      }
    >
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-burgundy text-white"
                : "text-ink/70 hover:bg-cream hover:text-burgundy"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
