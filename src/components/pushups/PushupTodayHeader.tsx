"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCollection } from "@/lib/hooks/useCollection";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { isToday } from "@/lib/date";
import type { PushupEntry, Settings } from "@/types";

const EMPTY: Settings = {};

export function PushupTodayHeader() {
  const { items } = useCollection<PushupEntry>(STORAGE_KEYS.pushups);
  const [settings] = useValue<Settings>(STORAGE_KEYS.settings, EMPTY);
  const goal = settings.dailyPushupGoal;

  const total = useMemo(
    () =>
      items
        .filter((p) => isToday(p.at))
        .reduce((sum, p) => sum + p.reps, 0),
    [items]
  );

  return (
    <Card>
      <p className="text-sm uppercase tracking-wider text-text-muted">Today</p>
      <p className="mt-2 flex items-baseline gap-2 text-4xl font-bold text-text-primary">
        {total}
        {goal != null && (
          <span className="text-lg font-medium text-text-muted">/ {goal}</span>
        )}
        <span className="text-lg font-medium text-text-muted">reps</span>
      </p>
      {goal != null ? (
        <>
          <p className="mt-1 text-sm text-text-muted">
            {total >= goal
              ? "Goal hit — well done."
              : `${goal - total} reps to go`}
          </p>
          <ProgressBar value={total} max={goal} className="mt-3" />
        </>
      ) : (
        <p className="mt-1 text-sm text-text-muted">
          {total === 0
            ? "No sets logged yet."
            : "Set a daily goal to track progress."}
        </p>
      )}
    </Card>
  );
}
