import type { WeightEntry } from "@/types";
import { TIME } from "@/lib/date";

export type Range =
  | "1H"
  | "24H"
  | "7D"
  | "30D"
  | "1Y"
  | "ALL"
  | "CUSTOM";

export type Bucket = "raw" | "hour" | "day" | "month";

export type RangeWindow = {
  /** Inclusive lower bound (ms). undefined = open-ended (for "ALL"). */
  from?: number;
  /** Inclusive upper bound (ms). */
  to: number;
  bucket: Bucket;
};

export type ChartPoint = {
  /** Bucket center / raw timestamp in ms */
  at: number;
  /** Average (or raw) weight in kg, rounded to 1 decimal */
  kg: number;
  /** Number of entries aggregated into this bucket */
  count: number;
};

/**
 * Resolve a Range into a concrete time window + bucket strategy.
 *
 * - 1H / 24H stay raw (each entry shown as-is).
 * - 7D / 30D bucket to one point per day.
 * - 1Y buckets to one point per month.
 * - ALL auto-picks based on the data span (handled by caller — we just return
 *   bucket="raw" here so the caller can decide).
 */
export function resolveRange(
  range: Range,
  now: number,
  custom?: { fromMs: number; toMs: number }
): RangeWindow {
  switch (range) {
    case "1H":
      return { from: now - TIME.HOUR, to: now, bucket: "raw" };
    case "24H":
      return { from: now - TIME.DAY, to: now, bucket: "raw" };
    case "7D":
      return { from: now - 7 * TIME.DAY, to: now, bucket: "day" };
    case "30D":
      return { from: now - 30 * TIME.DAY, to: now, bucket: "day" };
    case "1Y":
      return { from: now - 365 * TIME.DAY, to: now, bucket: "month" };
    case "ALL":
      return { to: now, bucket: "raw" };
    case "CUSTOM": {
      if (!custom) return { to: now, bucket: "raw" };
      const span = custom.toMs - custom.fromMs;
      return {
        from: custom.fromMs,
        to: custom.toMs,
        bucket: autoBucket(span),
      };
    }
  }
}

/** Pick a sensible bucket for an arbitrary span (used by ALL & CUSTOM). */
export function autoBucket(spanMs: number): Bucket {
  if (spanMs <= 2 * TIME.DAY) return "raw";
  if (spanMs <= 90 * TIME.DAY) return "day";
  return "month";
}

/** Compute the bucket key (epoch ms at bucket start) for a timestamp. */
function bucketKey(at: number, bucket: Bucket): number {
  const d = new Date(at);
  switch (bucket) {
    case "raw":
      return at;
    case "hour":
      d.setMinutes(0, 0, 0);
      return d.getTime();
    case "day":
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    case "month":
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
  }
}

/**
 * Aggregate entries into chart points for the given window.
 *
 * - Filters by [from, to].
 * - Groups by bucket key.
 * - Averages kg within each bucket.
 * - Returns ascending by time.
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

/** Label for chart X-axis ticks, varies by bucket. */
export function formatBucketLabel(at: number, bucket: Bucket): string {
  const d = new Date(at);
  switch (bucket) {
    case "raw":
    case "hour":
      return d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
    case "day":
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    case "month":
      return d.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
  }
}

/** Full tooltip label (more detail than axis). */
export function formatBucketDetail(at: number, bucket: Bucket): string {
  const d = new Date(at);
  switch (bucket) {
    case "raw":
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    case "hour":
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
      });
    case "day":
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "month":
      return d.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
  }
}
