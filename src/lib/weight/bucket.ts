import type { WeightEntry } from "@/types";
import {
  bucketKey,
  type ChartPoint,
  type RangeWindow,
} from "@/lib/chart/range";

// Re-export shared types/helpers so existing call sites can keep importing
// from `@/lib/weight/bucket`.
export type {
  Bucket,
  ChartPoint,
  Range,
  RangeWindow,
} from "@/lib/chart/range";
export {
  autoBucket,
  formatBucketDetail,
  formatBucketLabel,
  resolveRange,
} from "@/lib/chart/range";

/**
 * Aggregate weight entries into chart points by averaging kg within each
 * bucket. Push-ups (sum) live in `lib/pushups/bucket.ts`.
 */
export function bucketEntries(
  entries: WeightEntry[],
  window: RangeWindow
): ChartPoint[] {
  const { from, to, bucket } = window;

  const filtered = entries.filter((e) => {
    if (e.at > to) return false;
    if (from != null && e.at < from) return false;
    return true;
  });

  if (bucket === "raw") {
    return filtered
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((e) => ({
        at: e.at,
        kg: Math.round(e.kg * 10) / 10,
        count: 1,
      }));
  }

  const groups = new Map<number, { sum: number; count: number }>();
  for (const e of filtered) {
    const k = bucketKey(e.at, bucket);
    const g = groups.get(k);
    if (g) {
      g.sum += e.kg;
      g.count += 1;
    } else {
      groups.set(k, { sum: e.kg, count: 1 });
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([at, g]) => ({
      at,
      kg: Math.round((g.sum / g.count) * 10) / 10,
      count: g.count,
    }));
}
