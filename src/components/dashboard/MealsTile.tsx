"use client";

import { Tile, TileSkeleton } from "@/components/ui/Tile";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { isToday, formatTime } from "@/lib/date";
import type { MealEntry } from "@/types";

export function MealsTile() {
  const { items, hydrated } = useCollection<MealEntry>(STORAGE_KEYS.meals);
  if (!hydrated) return <TileSkeleton href="/meals" label="Meals today" />;

  const todays = items
    .filter((m) => isToday(m.at))
    .sort((a, b) => b.at - a.at);
  const latest = todays[0];
  const count = todays.length;

  if (count === 0) {
    return (
      <Tile
        href="/meals"
        label="Meals today"
        primary={<span className="text-text-muted">None yet</span>}
        secondary="Log when you eat"
      />
    );
  }

  return (
    <Tile
      href="/meals"
      label="Meals today"
      primary={
        <>
          {count}
          <span className="ml-1 text-base font-medium text-text-muted">
            {count === 1 ? "meal" : "meals"}
          </span>
        </>
      }
      secondary={
        latest && (
          <>
            Last: <span className="text-text-primary">{formatTime(latest.at)}</span>
            {latest.label && (
              <span className="text-text-muted"> — {latest.label}</span>
            )}
          </>
        )
      }
    />
  );
}
