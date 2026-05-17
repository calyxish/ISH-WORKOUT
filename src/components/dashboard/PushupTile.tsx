"use client";

import { useMemo } from "react";
import { Tile, TileSkeleton } from "@/components/ui/Tile";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCollection } from "@/lib/hooks/useCollection";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { isToday, relativeTime } from "@/lib/date";
import type { PushupEntry, Settings } from "@/types";

const EMPTY_SETTINGS: Settings = {};

export function PushupTile() {
  const { items, hydrated } = useCollection<PushupEntry>(STORAGE_KEYS.pushups);
  const [settings] = useValue<Settings>(STORAGE_KEYS.settings, EMPTY_SETTINGS);
  const goal = settings.dailyPushupGoal;

  const todays = useMemo(
    () =>
      items.filter((p) => isToday(p.at)).sort((a, b) => b.at - a.at),
    [items]
  );
  const total = useMemo(() => todays.reduce((s, p) => s + p.reps, 0), [todays]);
  const latest = todays[0];

  if (!hydrated)
    return <TileSkeleton href="/gym/pushups" label="Push-ups today" />;

  if (total === 0 && goal == null) {
    return (
      <Tile
        href="/gym/pushups"
        label="Push-ups today"
        primary={<span className="text-text-muted">No sets yet</span>}
        secondary="Log your first set"
      />
    );
  }

  return (
    <Tile
      href="/gym/pushups"
      label="Push-ups today"
      primary={
        <>
          {total}
          {goal != null && (
            <span className="text-text-muted"> / {goal}</span>
          )}
          <span className="ml-1 text-base font-medium text-text-muted">reps</span>
        </>
      }
      secondary={
        goal != null ? (
          total >= goal ? (
            <span className="text-success">Goal hit</span>
          ) : (
            <>
              <span>{goal - total} reps to go</span>
              {latest && (
                <>
                  <span className="mx-1.5 text-text-muted/60">·</span>
                  <span>{relativeTime(latest.at)}</span>
                </>
              )}
            </>
          )
        ) : latest ? (
          <>
            {todays.length} {todays.length === 1 ? "set" : "sets"}
            <span className="mx-1.5 text-text-muted/60">·</span>
            <span>last {relativeTime(latest.at)}</span>
          </>
        ) : null
      }
      meta={goal != null ? <ProgressBar value={total} max={goal} /> : null}
    />
  );
}
