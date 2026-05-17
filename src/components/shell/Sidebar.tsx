"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NAV_ITEMS, SETTINGS_ITEM, type NavItem } from "./nav-items";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-accent text-[#111110]"
          : "text-text-primary hover:bg-bg-surface"
      }`}
    >
      <Icon className={active ? "text-[#111110]" : "text-text-muted"} />
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border-default md:bg-bg-primary">
      <div className="flex h-16 items-center px-5">
        <Logo height={28} />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-3">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>
      <div className="space-y-1 border-t border-border-default px-3 py-3">
        <SidebarLink item={SETTINGS_ITEM} active={isActive(pathname, SETTINGS_ITEM.href)} />
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="text-xs text-text-muted">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
