"use client";

import { Tile, TileSkeleton } from "@/components/ui/Tile";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCollection } from "@/lib/hooks/useCollection";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { dayKey } from "@/lib/date";
import type { WaterDay, Settings } from "@/types";

const DEFAULT_GOAL = 8;

export function WaterTile() {
  const { items, hydrated } = useCollection<WaterDay & { id: string }>(
    STORAGE_KEYS.water
  );
  const [settings] = useValue<Settings>(STORAGE_KEYS.settings, {});

  if (!hydrated) return <TileSkeleton href="/water" label="Water today" />;

  const today = dayKey();
  const todayEntry = items.find((w) => w.day === today);
  const cups = todayEntry?.cups ?? 0;
  const goal = settings?.waterGoal ?? DEFAULT_GOAL;

  return (
    <Tile
      href="/water"
      label="Water today"
      primary={
        <>
          {cups}
          <span className="text-text-muted"> / {goal}</span>
          <span className="ml-1 text-base font-medium text-text-muted">cups</span>
        </>
      }
      secondary={
        cups >= goal
          ? "Goal hit — keep sipping."
          : `${goal - cups} cup${goal - cups === 1 ? "" : "s"} to go`
      }
      meta={<ProgressBar value={cups} max={goal} />}
    />
  );
}
