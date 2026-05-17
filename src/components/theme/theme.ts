import { clearKey, getValue, setValue } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_KEY = STORAGE_KEYS.theme;
export const SYSTEM_FALLBACK: ThemeChoice = "system";

export function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function readChoice(): ThemeChoice {
  const v = getValue<ThemeChoice>(THEME_KEY);
  if (v === "light" || v === "dark") return v;
  return "system";
}

export function resolve(choice: ThemeChoice): ResolvedTheme {
  return choice === "system" ? systemTheme() : choice;
}

export function applyChoice(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolve(choice));
  if (choice === "system") clearKey(THEME_KEY);
  else setValue<ThemeChoice>(THEME_KEY, choice);
}
