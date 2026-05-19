"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { Settings } from "@/types";

const EMPTY: Settings = {};

const OPTIONS = [
  {
    value: true,
    label: "On",
    hint: "Carry unfinished todos into today.",
  },
  {
    value: false,
    label: "Off",
    hint: "Leave unfinished todos in history.",
  },
] as const;

export function TodosCard() {
  const [settings, setSettings] = useValue<Settings>(
    STORAGE_KEYS.settings,
    EMPTY
  );
  const mounted = useHasMounted();
  const enabled = settings.carryForwardTodos !== false;

  return (
    <Card>
      <CardTitle>Todos</CardTitle>
      <p className="mt-2 text-sm text-text-muted">
        Carry forward unfinished todos into today.
      </p>
      <div
        role="radiogroup"
        aria-label="Carry forward todos"
        className="mt-3 grid gap-2 sm:grid-cols-2"
      >
        {OPTIONS.map((opt) => {
          const active = mounted && enabled === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() =>
                setSettings({ ...settings, carryForwardTodos: opt.value })
              }
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
