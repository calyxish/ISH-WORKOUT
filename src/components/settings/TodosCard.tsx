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
      <fieldset className="mt-3 grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">Carry forward todos</legend>
        {OPTIONS.map((opt) => {
          const active = mounted && enabled === opt.value;
          return (
            <label
              key={String(opt.value)}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                active
                  ? "border-accent bg-accent/5"
                  : "border-border-default bg-bg-surface hover:border-accent"
              }`}
            >
              <input
                type="radio"
                name="carry-forward-todos"
                checked={active}
                onChange={() =>
                  setSettings({ ...settings, carryForwardTodos: opt.value })
                }
                className="sr-only"
              />
              <span className="text-sm font-semibold text-text-primary">
                {opt.label}
              </span>
              <span className="text-xs text-text-muted">{opt.hint}</span>
            </label>
          );
        })}
      </fieldset>
    </Card>
  );
}
