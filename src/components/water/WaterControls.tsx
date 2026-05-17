"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { useCollection } from "@/lib/hooks/useCollection";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import {
  DEFAULT_GOAL,
  createTodayRow,
  findToday,
  type WaterRow,
} from "@/lib/water";
import { WaterProgressRing } from "./WaterProgressRing";
import type { Settings } from "@/types";

const EMPTY: Settings = {};

export function WaterControls() {
  const { items, hydrated, add, update } = useCollection<WaterRow>(
    STORAGE_KEYS.water
  );
  const [settings] = useValue<Settings>(STORAGE_KEYS.settings, EMPTY);
  const goal = settings.waterGoal ?? DEFAULT_GOAL;

  const today = useMemo(() => findToday(items), [items]);
  const cups = today?.cups ?? 0;

  function increment() {
    if (today) {
      update(today.id, { cups: today.cups + 1 });
    } else {
      add(createTodayRow(1));
    }
  }

  function decrement() {
    if (!today || today.cups <= 0) return;
    update(today.id, { cups: today.cups - 1 });
  }

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className={hydrated ? "" : "opacity-0"}>
        <WaterProgressRing cups={cups} goal={goal} />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="md"
          onClick={decrement}
          disabled={cups <= 0}
          aria-label="Remove a cup"
          className="h-12 w-12 rounded-full"
        >
          <MinusIcon className="h-5 w-5" />
        </Button>

        <Button
          size="md"
          onClick={increment}
          aria-label="Add a cup"
          className="h-14 w-14 rounded-full text-base"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>

      <p className="text-sm text-text-muted" aria-live="polite">
        {!hydrated
          ? " "
          : cups >= goal
          ? "Goal hit — keep sipping."
          : `${goal - cups} cup${goal - cups === 1 ? "" : "s"} to go`}
      </p>
    </div>
  );
}
