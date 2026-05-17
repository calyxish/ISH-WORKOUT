"use client";

import { useMemo } from "react";
import { CurrentWeightCard } from "./CurrentWeightCard";
import { TargetCard } from "./TargetCard";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { WeightEntry } from "@/types";

export function WeightDashboardHeader() {
  const { items, hydrated } = useCollection<WeightEntry>(STORAGE_KEYS.weights);
  const sorted = useMemo(
    () => [...items].sort((a, b) => b.at - a.at),
    [items]
  );
  const latest = sorted[0];
  const previous = sorted[1];

  return (
    <div
      className={
        "grid gap-4 sm:grid-cols-2 " + (hydrated ? "" : "opacity-0")
      }
    >
      <CurrentWeightCard latest={latest} previous={previous} />
      <TargetCard latestKg={latest?.kg} />
    </div>
  );
}
