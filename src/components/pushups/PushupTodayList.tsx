"use client";

import { useMemo } from "react";
import { PushupRow } from "./PushupRow";
import { CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { isToday } from "@/lib/date";
import type { PushupEntry } from "@/types";

export function PushupTodayList() {
  const { items, hydrated, update, remove } = useCollection<PushupEntry>(
    STORAGE_KEYS.pushups
  );
  const todays = useMemo(
    () =>
      items.filter((p) => isToday(p.at)).sort((a, b) => a.at - b.at),
    [items]
  );

  return (
    <section aria-label="Today's push-up sets">
      <CardTitle className="mb-2">Sets today</CardTitle>
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
          title="No sets logged today"
          description="Log your first set above."
        />
      ) : (
        <ul className="space-y-2">
          {todays.map((entry) => (
            <PushupRow
              key={entry.id}
              entry={entry}
              onUpdate={(patch) => update(entry.id, patch)}
              onDelete={() => remove(entry.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
