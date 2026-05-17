"use client";

import { useMemo } from "react";
import { MealForm } from "./MealForm";
import { MealRow } from "./MealRow";
import { CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { isToday } from "@/lib/date";
import type { MealEntry } from "@/types";

export function TodayMeals() {
  const { items, hydrated, update, remove } = useCollection<MealEntry>(
    STORAGE_KEYS.meals
  );

  const todays = useMemo(
    () =>
      items.filter((m) => isToday(m.at)).sort((a, b) => a.at - b.at),
    [items]
  );

  return (
    <section aria-label="Today's meals" className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <CardTitle>Today</CardTitle>
        {hydrated && todays.length > 0 && (
          <span className="text-sm font-medium text-text-muted">
            <span className="text-text-primary">{todays.length}</span>{" "}
            {todays.length === 1 ? "meal" : "meals"}
          </span>
        )}
      </div>

      <MealForm />

      {!hydrated ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-bg-surface"
              aria-hidden
            />
          ))}
        </div>
      ) : todays.length === 0 ? (
        <EmptyState
          title="No meals logged today"
          description="Log when you eat — label is optional."
        />
      ) : (
        <ul className="space-y-2">
          {todays.map((meal) => (
            <MealRow
              key={meal.id}
              meal={meal}
              onUpdate={(patch) => update(meal.id, patch)}
              onDelete={() => remove(meal.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
