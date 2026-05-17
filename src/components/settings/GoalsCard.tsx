"use client";

import { useMemo } from "react";
import { TargetCard } from "@/components/weight/TargetCard";
import { WaterGoalCard } from "@/components/water/WaterGoalCard";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { WeightEntry } from "@/types";

export function GoalsCard() {
  const { items } = useCollection<WeightEntry>(STORAGE_KEYS.weights);
  const latestKg = useMemo(() => {
    if (items.length === 0) return undefined;
    return items.reduce((acc, e) => (e.at > acc.at ? e : acc)).kg;
  }, [items]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TargetCard latestKg={latestKg} />
      <WaterGoalCard />
    </div>
  );
}
