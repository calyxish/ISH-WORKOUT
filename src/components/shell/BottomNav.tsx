"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SETTINGS_ITEM, type NavItem } from "./nav-items";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const MOBILE_ITEMS: NavItem[] = [...NAV_ITEMS, SETTINGS_ITEM];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-30 grid grid-cols-5 gap-1 border-t border-border-default bg-bg-primary/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur md:hidden"
    >
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition ${
              active ? "text-accent" : "text-text-muted"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
