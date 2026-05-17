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
  /** Aggregated value (avg for weight, sum for push-ups, etc.) */
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
 * - ALL returns raw — caller can decide based on data span if needed.
 * - CUSTOM auto-picks the bucket based on the span.
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
export function bucketKey(at: number, bucket: Bucket): number {
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
