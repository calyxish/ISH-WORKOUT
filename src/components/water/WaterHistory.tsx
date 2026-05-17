"use client";

import { useMemo } from "react";
import { CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCollection } from "@/lib/hooks/useCollection";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { dayKey, parseDayKey } from "@/lib/date";
import { DEFAULT_GOAL, type WaterRow } from "@/lib/water";
import type { Settings } from "@/types";

const EMPTY: Settings = {};

function dayLabel(key: string): string {
  const today = dayKey();
  if (key === today) return "Today";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (key === dayKey(yesterday)) return "Yesterday";
  return parseDayKey(key).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year:
      parseDayKey(key).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  });
}

export function WaterHistory() {
  const { items, hydrated } = useCollection<WaterRow>(STORAGE_KEYS.water);
  const [settings] = useValue<Settings>(STORAGE_KEYS.settings, EMPTY);
  const goal = settings.waterGoal ?? DEFAULT_GOAL;

  const previous = useMemo(() => {
    const today = dayKey();
    return items
      .filter((w) => w.day !== today && w.cups > 0)
      .sort((a, b) => (a.day < b.day ? 1 : -1));
  }, [items]);

  if (!hydrated || previous.length === 0) return null;

  return (
    <section aria-label="Water history" className="space-y-3">
      <CardTitle>History</CardTitle>
      <ul className="space-y-2">
        {previous.map((row) => {
          const hit = row.cups >= goal;
          return (
            <li
              key={row.id}
              className="rounded-xl border border-border-default bg-bg-surface p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-text-primary">
                  {dayLabel(row.day)}
                </p>
                <p className="text-sm">
                  <span
                    className={
                      hit ? "text-success font-semibold" : "text-text-primary font-semibold"
                    }
                  >
                    {row.cups}
                  </span>
                  <span className="text-text-muted"> / {goal} cups</span>
                </p>
              </div>
              <ProgressBar value={row.cups} max={goal} className="mt-2" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
