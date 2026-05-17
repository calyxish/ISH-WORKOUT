/**
 * Date / time utilities. All "day" calculations are local-time and computed
 * read-time — nothing is scheduled to flip at midnight.
 */

export function startOfDay(d: Date | number = new Date()): Date {
  const date = typeof d === "number" ? new Date(d) : new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(d: Date | number = new Date()): Date {
  const date = typeof d === "number" ? new Date(d) : new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
}

/** YYYY-MM-DD in local time. Stable key for "today". */
export function dayKey(d: Date | number = new Date()): string {
  const date = typeof d === "number" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function isSameDay(a: Date | number, b: Date | number): boolean {
  return dayKey(a) === dayKey(b);
}

export function isToday(at: Date | number): boolean {
  return dayKey(at) === dayKey(new Date());
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const TIME = { HOUR, DAY } as const;

/** Format a timestamp as "9:42 AM" (locale-aware). */
export function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Format a timestamp as "May 16, 9:42 AM". */
export function formatDateTime(at: number): string {
  return new Date(at).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Format a timestamp as "May 16, 2026". */
export function formatDate(at: number): string {
  return new Date(at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Human "2h ago" / "3d ago" / "just now". */
export function relativeTime(at: number, now: number = Date.now()): string {
  const diff = now - at;
  if (diff < 60_000) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  const days = Math.floor(diff / DAY);
  if (days < 7) return `${days}d ago`;
  return formatDate(at);
}
