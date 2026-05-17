"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { RangePills } from "@/components/weight/RangePills";
import { CustomRangePicker } from "@/components/weight/CustomRangePicker";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import {
  formatBucketDetail,
  formatBucketLabel,
  resolveRange,
  type Range,
} from "@/lib/chart/range";
import { bucketPushupEntries } from "@/lib/pushups/bucket";
import { dayKey, parseDayKey } from "@/lib/date";
import type { PushupEntry } from "@/types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function todayDayString() {
  return dayKey(new Date());
}

function defaultFromDayString() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type TooltipPayload = {
  active?: boolean;
  payload?: Array<{
    payload?: { at: number; value: number; count: number };
  }>;
};

function ChartTooltip({
  active,
  payload,
  bucketLabel,
  isAggregated,
}: TooltipPayload & {
  bucketLabel: (at: number) => string;
  isAggregated: boolean;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  if (!p) return null;
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-xs shadow-md">
      <div className="font-semibold text-text-primary">{p.value} reps</div>
      <div className="text-text-muted">{bucketLabel(p.at)}</div>
      {isAggregated && p.count > 1 && (
        <div className="text-text-muted">
          sum of {p.count} sets
        </div>
      )}
    </div>
  );
}

export function PushupChart() {
  const { items, hydrated } = useCollection<PushupEntry>(STORAGE_KEYS.pushups);

  const [range, setRange] = useState<Range>("7D");
  const [customFrom, setCustomFrom] = useState<string>(defaultFromDayString);
  const [customTo, setCustomTo] = useState<string>(todayDayString);
  const [now] = useState(() => Date.now());

  const window = useMemo(() => {
    if (range === "CUSTOM") {
      const fromMs = parseDayKey(customFrom).getTime();
      const toMs = parseDayKey(customTo).getTime() + 24 * 60 * 60 * 1000 - 1;
      return resolveRange("CUSTOM", now, { fromMs, toMs });
    }
    return resolveRange(range, now);
  }, [range, customFrom, customTo, now]);

  const points = useMemo(
    () => bucketPushupEntries(items, window),
    [items, window]
  );

  const yDomain = useMemo<[number, number] | undefined>(() => {
    if (points.length === 0) return undefined;
    const values = points.map((p) => p.value);
    const min = Math.min(0, ...values);
    const max = Math.max(...values);
    const padded = Math.max((max - min) * 0.15, 5);
    return [Math.floor(min), Math.ceil(max + padded)];
  }, [points]);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Trend</CardTitle>
        <RangePills value={range} onChange={setRange} />
      </div>

      {range === "CUSTOM" && (
        <div className="mt-3">
          <CustomRangePicker
            fromDay={customFrom}
            toDay={customTo}
            onChange={({ fromDay, toDay }) => {
              setCustomFrom(fromDay);
              setCustomTo(toDay);
            }}
          />
        </div>
      )}

      <div className="mt-4 h-64 w-full">
        {!hydrated ? (
          <div className="h-full w-full animate-pulse rounded-xl bg-bg-input" />
        ) : points.length === 0 ? (
          <EmptyState
            title="No data in this range"
            description={
              items.length === 0
                ? "Log a set to start building your trend."
                : "Try a wider range or log a fresh set."
            }
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={points}
              margin={{ top: 8, right: 12, bottom: 0, left: -10 }}
            >
              <CartesianGrid
                stroke="var(--border-default)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="at"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => formatBucketLabel(v, window.bucket)}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                stroke="var(--border-default)"
                tickMargin={6}
                minTickGap={32}
              />
              <YAxis
                dataKey="value"
                domain={yDomain ?? ["auto", "auto"]}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                stroke="var(--border-default)"
                width={42}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ stroke: "var(--accent)", strokeWidth: 1 }}
                content={
                  <ChartTooltip
                    bucketLabel={(at) => formatBucketDetail(at, window.bucket)}
                    isAggregated={window.bucket !== "raw"}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--accent)"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  fill: "var(--accent)",
                  stroke: "var(--bg-surface)",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
