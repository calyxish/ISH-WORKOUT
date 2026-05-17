"use client";

import { useMemo } from "react";
import { PushupRow } from "./PushupRow";
import { CardTitle } from "@/components/ui/Card";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { dayKey, parseDayKey } from "@/lib/date";
import type { PushupEntry } from "@/types";

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

export function PushupHistory() {
  const { items, hydrated } = useCollection<PushupEntry>(STORAGE_KEYS.pushups);

  const groups = useMemo(() => {
    const today = dayKey();
    const byDay = new Map<string, PushupEntry[]>();
    for (const p of items) {
      const k = dayKey(p.at);
      if (k === today) continue;
      const arr = byDay.get(k);
      if (arr) arr.push(p);
      else byDay.set(k, [p]);
    }
    return Array.from(byDay.entries())
      .map(([day, list]) => ({
        day,
        list: list.slice().sort((a, b) => a.at - b.at),
        total: list.reduce((s, p) => s + p.reps, 0),
      }))
      .sort((a, b) => (a.day < b.day ? 1 : -1));
  }, [items]);

  if (!hydrated || groups.length === 0) return null;

  return (
    <section aria-label="Previous days" className="space-y-5">
      <CardTitle>History</CardTitle>
      {groups.map(({ day, list, total }) => (
        <div key={day} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-text-primary">
              {dayLabel(day)}
            </p>
            <p className="text-xs text-text-muted">
              <span className="font-semibold text-text-primary">{total}</span>{" "}
              reps · {list.length} {list.length === 1 ? "set" : "sets"}
            </p>
          </div>
          <ul className="space-y-2">
            {list.map((entry) => (
              <PushupRow key={entry.id} entry={entry} readOnly />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
