"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { RangePills } from "./RangePills";
import { CustomRangePicker } from "./CustomRangePicker";
import { useCollection } from "@/lib/hooks/useCollection";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import {
  bucketEntries,
  formatBucketDetail,
  formatBucketLabel,
  resolveRange,
  type Range,
} from "@/lib/weight/bucket";
import { dayKey, parseDayKey } from "@/lib/date";
import type { Settings, WeightEntry } from "@/types";

const EMPTY: Settings = {};

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
    payload?: { at: number; kg: number; count: number };
  }>;
};

function ChartTooltip({
  active,
  payload,
  bucketLabel,
}: TooltipPayload & { bucketLabel: (at: number) => string }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  if (!p) return null;
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-xs shadow-md">
      <div className="font-semibold text-text-primary">{p.kg.toFixed(1)} kg</div>
      <div className="text-text-muted">{bucketLabel(p.at)}</div>
      {p.count > 1 && (
        <div className="text-text-muted">avg of {p.count} entries</div>
      )}
    </div>
  );
}

export function WeightChart() {
  const { items, hydrated } = useCollection<WeightEntry>(STORAGE_KEYS.weights);
  const [settings] = useValue<Settings>(STORAGE_KEYS.settings, EMPTY);

  const [range, setRange] = useState<Range>("7D");
  const [customFrom, setCustomFrom] = useState<string>(defaultFromDayString);
  const [customTo, setCustomTo] = useState<string>(todayDayString);
  // "Now" is captured once at mount — refresh the page to reset. Avoids
  // calling Date.now() during render and the ensuing re-render churn.
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
    () => bucketEntries(items, window),
    [items, window]
  );

  const target = settings.targetKg;

  // Y domain: pad so points + target sit comfortably in the chart
  const yDomain = useMemo<[number, number] | undefined>(() => {
    if (points.length === 0 && target == null) return undefined;
    const values: number[] = [];
    for (const p of points) values.push(p.kg);
    if (target != null) values.push(target);
    if (values.length === 0) return undefined;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = Math.max((max - min) * 0.15, 0.5);
    return [Math.floor((min - pad) * 10) / 10, Math.ceil((max + pad) * 10) / 10];
  }, [points, target]);

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
                ? "Log a weigh-in to start building your trend."
                : "Try a wider range or log a fresh entry."
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
                dataKey="kg"
                domain={yDomain ?? ["auto", "auto"]}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                stroke="var(--border-default)"
                width={42}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                cursor={{ stroke: "var(--accent)", strokeWidth: 1 }}
                content={
                  <ChartTooltip
                    bucketLabel={(at) => formatBucketDetail(at, window.bucket)}
                  />
                }
              />
              {target != null && (
                <ReferenceLine
                  y={target}
                  stroke="var(--text-muted)"
                  strokeDasharray="6 4"
                  ifOverflow="extendDomain"
                  label={{
                    value: `Target ${target.toFixed(1)} kg`,
                    position: "insideTopRight",
                    fill: "var(--text-muted)",
                    fontSize: 11,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="kg"
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
