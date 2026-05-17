"use client";

import { Tile, TileSkeleton } from "@/components/ui/Tile";
import { useCollection } from "@/lib/hooks/useCollection";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { relativeTime } from "@/lib/date";
import type { WeightEntry, Settings } from "@/types";

const EMPTY_SETTINGS: Settings = {};

export function WeightTile() {
  const { items, hydrated } = useCollection<WeightEntry>(STORAGE_KEYS.weights);
  const [settings] = useValue<Settings>(STORAGE_KEYS.settings, EMPTY_SETTINGS);

  if (!hydrated) return <TileSkeleton href="/gym/weight" label="Weight" />;

  const sorted = [...items].sort((a, b) => b.at - a.at);
  const latest = sorted[0];
  const previous = sorted[1];

  if (!latest) {
    return (
      <Tile
        href="/gym/weight"
        label="Weight"
        primary={<span className="text-text-muted">No data yet</span>}
        secondary="Log your first weigh-in"
      />
    );
  }

  const delta = previous ? latest.kg - previous.kg : null;
  const target = settings?.targetKg;
  const toTarget = target != null ? latest.kg - target : null;

  return (
    <Tile
      href="/gym/weight"
      label="Weight"
      primary={
        <>
          {latest.kg.toFixed(1)}
          <span className="ml-1 text-base font-medium text-text-muted">kg</span>
        </>
      }
      secondary={
        <>
          {delta != null && (
            <span
              className={
                delta === 0
                  ? "text-text-muted"
                  : delta > 0
                  ? "text-danger"
                  : "text-success"
              }
            >
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} kg
            </span>
          )}
          {delta == null && <span>First entry</span>}
          <span className="mx-1.5 text-text-muted/60">·</span>
          <span>{relativeTime(latest.at)}</span>
        </>
      }
      meta={
        toTarget != null ? (
          <div className="text-xs text-text-muted">
            Target {target!.toFixed(1)} kg —{" "}
            <span className="font-medium">
              {Math.abs(toTarget).toFixed(1)} kg{" "}
              {toTarget > 0 ? "to lose" : toTarget < 0 ? "to gain" : "hit!"}
            </span>
          </div>
        ) : null
      }
    />
  );
}
