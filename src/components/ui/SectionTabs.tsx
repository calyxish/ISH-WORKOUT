"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SectionTab = {
  href: string;
  label: string;
};

type Props = {
  items: SectionTab[];
  /** Optional aria-label for the tablist */
  label?: string;
};

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  return pathname.startsWith(href + "/");
}

/**
 * Pill tab bar for section sub-routes. Renders `<Link>`s (so each tab is its
 * own page) but presents as a tablist with the active link highlighted in
 * the accent colour.
 */
export function SectionTabs({ items, label }: Props) {
  const pathname = usePathname();
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex gap-1 rounded-xl border border-border-default bg-bg-surface p-1"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            role="tab"
            aria-selected={active}
            className={`h-9 rounded-lg px-4 text-sm font-semibold transition flex items-center ${
              active
                ? "bg-accent text-[#111110]"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
