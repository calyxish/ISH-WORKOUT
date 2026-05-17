"use client";

import { useMemo } from "react";
import { WeightRow } from "./WeightRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardTitle } from "@/components/ui/Card";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { WeightEntry } from "@/types";

export function WeightList() {
  const { items, hydrated, update, remove } = useCollection<WeightEntry>(
    STORAGE_KEYS.weights
  );

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.at - a.at),
    [items]
  );

  if (!hydrated) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-bg-surface"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <EmptyState
        title="No weights logged yet"
        description="Your entries will show up here, newest first."
      />
    );
  }

  return (
    <section aria-label="Recent weight entries">
      <CardTitle className="mb-2">Recent</CardTitle>
      <ul className="space-y-2">
        {sorted.map((entry) => (
          <WeightRow
            key={entry.id}
            entry={entry}
            onUpdate={(patch) => update(entry.id, patch)}
            onDelete={() => remove(entry.id)}
          />
        ))}
      </ul>
    </section>
  );
}
