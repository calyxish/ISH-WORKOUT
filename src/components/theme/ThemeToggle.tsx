"use client";

import { useEffect } from "react";
import { useValue } from "@/lib/hooks/useValue";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import {
  applyChoice,
  resolve,
  SYSTEM_FALLBACK,
  THEME_KEY,
  type ResolvedTheme,
  type ThemeChoice,
} from "./theme";

export function ThemeToggle() {
  const [choice] = useValue<ThemeChoice>(THEME_KEY, SYSTEM_FALLBACK);
  const mounted = useHasMounted();

  // Keep the DOM in sync when the user's OS preference changes while we're in
  // "system" mode. The initial application happens in <ThemeScript> before
  // paint.
  useEffect(() => {
    if (choice !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyChoice("system");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [choice]);

  const resolved: ResolvedTheme = mounted ? resolve(choice) : "light";

  function toggle() {
    // Sidebar toggle is a quick light↔dark override; "system" lives in Settings.
    applyChoice(resolved === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-surface text-text-primary transition hover:border-accent"
    >
      {mounted ? (
        resolved === "dark" ? <SunIcon /> : <MoonIcon />
      ) : (
        <span className="block h-4 w-4 rounded-full bg-text-muted/30" />
      )}
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}
