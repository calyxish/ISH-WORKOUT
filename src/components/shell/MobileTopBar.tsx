import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-default bg-bg-primary/95 px-4 backdrop-blur md:hidden">
      <Logo height={24} />
      <ThemeToggle />
    </header>
  );
}
