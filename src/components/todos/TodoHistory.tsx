"use client";

import { useMemo } from "react";
import { TodoRow } from "./TodoRow";
import { CardTitle } from "@/components/ui/Card";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { dayKey, parseDayKey } from "@/lib/date";
import type { TodoItem } from "@/types";

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

export function TodoHistory() {
  const { items, hydrated } = useCollection<TodoItem>(STORAGE_KEYS.todos);

  const groups = useMemo(() => {
    const today = dayKey();
    const byDay = new Map<string, TodoItem[]>();
    for (const t of items) {
      if (t.day === today) continue;
      const arr = byDay.get(t.day);
      if (arr) arr.push(t);
      else byDay.set(t.day, [t]);
    }
    return Array.from(byDay.entries())
      .map(([day, list]) => ({
        day,
        list: list.slice().sort((a, b) => a.createdAt - b.createdAt),
      }))
      .sort((a, b) => (a.day < b.day ? 1 : -1));
  }, [items]);

  if (!hydrated || groups.length === 0) return null;

  return (
    <section aria-label="Previous days" className="space-y-5">
      <CardTitle>History</CardTitle>
      {groups.map(({ day, list }) => {
        const done = list.filter((t) => t.done).length;
        return (
          <div key={day} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-text-primary">
                {dayLabel(day)}
              </p>
              <p className="text-xs text-text-muted">
                {done} / {list.length} done
              </p>
            </div>
            <ul className="space-y-2">
              {list.map((todo) => (
                <TodoRow key={todo.id} todo={todo} readOnly />
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
