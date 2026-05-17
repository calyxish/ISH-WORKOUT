"use client";

import { useMemo } from "react";
import { MealRow } from "./MealRow";
import { CardTitle } from "@/components/ui/Card";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { dayKey, parseDayKey } from "@/lib/date";
import type { MealEntry } from "@/types";

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

export function MealHistory() {
  const { items, hydrated } = useCollection<MealEntry>(STORAGE_KEYS.meals);

  const groups = useMemo(() => {
    const today = dayKey();
    const byDay = new Map<string, MealEntry[]>();
    for (const m of items) {
      const k = dayKey(m.at);
      if (k === today) continue;
      const arr = byDay.get(k);
      if (arr) arr.push(m);
      else byDay.set(k, [m]);
    }
    return Array.from(byDay.entries())
      .map(([day, list]) => ({
        day,
        list: list.slice().sort((a, b) => a.at - b.at),
      }))
      .sort((a, b) => (a.day < b.day ? 1 : -1));
  }, [items]);

  if (!hydrated || groups.length === 0) return null;

  return (
    <section aria-label="Previous days" className="space-y-5">
      <CardTitle>History</CardTitle>
      {groups.map(({ day, list }) => (
        <div key={day} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-text-primary">
              {dayLabel(day)}
            </p>
            <p className="text-xs text-text-muted">
              {list.length} {list.length === 1 ? "meal" : "meals"}
            </p>
          </div>
          <ul className="space-y-2">
            {list.map((meal) => (
              <MealRow key={meal.id} meal={meal} readOnly />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
