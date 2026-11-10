"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavLink = {
  href: string;
  label: string;
};

export function DesktopNav({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-surface text-ink ring-line shadow-sm ring-1"
                : "text-body hover:bg-surface hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
