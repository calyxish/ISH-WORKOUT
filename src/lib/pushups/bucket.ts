import type { PushupEntry } from "@/types";
import {
  bucketKey,
  type ChartPoint,
  type RangeWindow,
} from "@/lib/chart/range";

/**
 * Aggregate push-up entries into chart points by **summing** reps within
 * each bucket. Mirrors `bucketEntries` in `lib/weight/bucket.ts` but with a
 * sum aggregator (vs avg) — total reps per day reads more naturally than an
 * average over scattered set logs.
 */
export function bucketPushupEntries(
  entries: PushupEntry[],
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
      .map((e) => ({ at: e.at, value: e.reps, count: 1 }));
  }

  const groups = new Map<number, { sum: number; count: number }>();
  for (const e of filtered) {
    const k = bucketKey(e.at, bucket);
    const g = groups.get(k);
    if (g) {
      g.sum += e.reps;
      g.count += 1;
    } else {
      groups.set(k, { sum: e.reps, count: 1 });
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([at, g]) => ({
      at,
      value: g.sum,
      count: g.count,
    }));
}
