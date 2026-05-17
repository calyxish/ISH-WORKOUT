"use client";

import { Card } from "@/components/ui/Card";
import { relativeTime } from "@/lib/date";
import type { WeightEntry } from "@/types";

type Props = {
  latest?: WeightEntry;
  previous?: WeightEntry;
};

export function CurrentWeightCard({ latest, previous }: Props) {
  if (!latest) {
    return (
      <Card>
        <p className="text-sm uppercase tracking-wider text-text-muted">
          Current weight
        </p>
        <p className="mt-2 text-2xl font-bold text-text-muted">No data yet</p>
        <p className="mt-1 text-sm text-text-muted">
          Log your first weigh-in above.
        </p>
      </Card>
    );
  }

  const delta = previous ? latest.kg - previous.kg : null;

  return (
    <Card>
      <p className="text-sm uppercase tracking-wider text-text-muted">
        Current weight
      </p>
      <p className="mt-2 flex items-baseline gap-2 text-4xl font-bold text-text-primary">
        {latest.kg.toFixed(1)}
        <span className="text-lg font-medium text-text-muted">kg</span>
      </p>
      <p className="mt-1 text-sm text-text-muted">
        {delta != null ? (
          <span
            className={
              Math.abs(delta) < 0.05
                ? "text-text-muted"
                : delta > 0
                ? "text-danger"
                : "text-success"
            }
          >
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)} kg since last
          </span>
        ) : (
          <span>First entry</span>
        )}
        <span className="mx-2 text-text-muted/60">·</span>
        <span>{relativeTime(latest.at)}</span>
      </p>
    </Card>
  );
}
