import type { WaterDay } from "@/types";
import { dayKey } from "@/lib/date";
import { newId } from "@/lib/storage";

/** Storage row: WaterDay + id (so it works with the standard collection hook). */
export type WaterRow = WaterDay & { id: string };

export const DEFAULT_GOAL = 8;

/** Return today's row from the list, or undefined. */
export function findToday(rows: WaterRow[]): WaterRow | undefined {
  const today = dayKey();
  return rows.find((r) => r.day === today);
}

/** Build a fresh row for today with the given cups. */
export function createTodayRow(cups: number): WaterRow {
  return { id: newId(), day: dayKey(), cups };
}
