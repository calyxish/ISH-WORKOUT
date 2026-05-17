import { STORAGE_KEYS, type StorageKey } from "@/lib/storage/keys";
import { dayKey } from "@/lib/date";

const APP_NAME = "ISH Workout";
const FORMAT_VERSION = 1;

type ExportPayload = {
  app: typeof APP_NAME;
  version: typeof FORMAT_VERSION;
  exportedAt: string;
  data: Partial<Record<StorageKey, unknown>>;
};

const ALL_KEYS = Object.values(STORAGE_KEYS) as StorageKey[];

export function exportAll(): string {
  const data: Partial<Record<StorageKey, unknown>> = {};
  for (const key of ALL_KEYS) {
    const raw = window.localStorage.getItem(key);
    if (raw == null) continue;
    try {
      data[key] = JSON.parse(raw);
    } catch {
      // Skip corrupt entries — don't poison the export.
    }
  }
  const payload: ExportPayload = {
    app: APP_NAME,
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadJson(filename: string, json: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function defaultExportFilename(): string {
  return `ish-workout-${dayKey()}.json`;
}

export type ImportResult = {
  imported: StorageKey[];
  skipped: string[];
};

export function importAll(json: string): ImportResult {
  const parsed = JSON.parse(json) as Partial<ExportPayload>;
  if (!parsed || typeof parsed !== "object" || !parsed.data) {
    throw new Error("Not a valid ISH Workout export file.");
  }

  const imported: StorageKey[] = [];
  const skipped: string[] = [];

  for (const [key, value] of Object.entries(parsed.data)) {
    if ((ALL_KEYS as string[]).includes(key)) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        imported.push(key as StorageKey);
      } catch {
        skipped.push(key);
      }
    } else {
      skipped.push(key);
    }
  }

  return { imported, skipped };
}

export function clearAll() {
  for (const key of ALL_KEYS) {
    window.localStorage.removeItem(key);
  }
}
