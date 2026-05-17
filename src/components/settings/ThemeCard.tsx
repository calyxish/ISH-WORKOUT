"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { useValue } from "@/lib/hooks/useValue";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import {
  applyChoice,
  SYSTEM_FALLBACK,
  THEME_KEY,
  type ThemeChoice,
} from "@/components/theme/theme";

const OPTIONS: { value: ThemeChoice; label: string; hint: string }[] = [
  { value: "system", label: "System", hint: "Follow your OS" },
  { value: "light", label: "Light", hint: "Chalk white" },
  { value: "dark", label: "Dark", hint: "Iron black" },
];

export function ThemeCard() {
  const [choice] = useValue<ThemeChoice>(THEME_KEY, SYSTEM_FALLBACK);
  const mounted = useHasMounted();

  return (
    <Card>
      <CardTitle>Theme</CardTitle>
      <div
        role="radiogroup"
        aria-label="Theme"
        className="mt-3 grid gap-2 sm:grid-cols-3"
      >
        {OPTIONS.map((opt) => {
          const active = mounted && choice === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => applyChoice(opt.value)}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                active
                  ? "border-accent bg-accent/5"
                  : "border-border-default bg-bg-surface hover:border-accent"
              }`}
            >
              <span className="text-sm font-semibold text-text-primary">
                {opt.label}
              </span>
              <span className="text-xs text-text-muted">{opt.hint}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
