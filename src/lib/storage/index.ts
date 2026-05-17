/**
 * Typed localStorage wrapper with a tiny pub/sub layer so React components can
 * subscribe to changes without a full state-management library.
 *
 * Returned values are reference-stable: the same parsed array/object is handed
 * back on every `getCollection` / `getValue` call until the underlying raw
 * string changes. This is required for `useSyncExternalStore` to avoid infinite
 * re-renders.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
let crossTabHooked = false;

// Stable empty array — same reference every time, lets useSyncExternalStore
// see "nothing changed" for keys with no data.
const EMPTY_ARRAY: readonly unknown[] = Object.freeze([]);

// raw → parsed cache, keyed by storage key
const parseCache = new Map<string, { raw: string; parsed: unknown }>();

function ensureCrossTabHook() {
  if (crossTabHooked || typeof window === "undefined") return;
  crossTabHooked = true;
  window.addEventListener("storage", (e) => {
    if (e.key) {
      parseCache.delete(e.key);
      notify(e.key);
    }
  });
}

export function subscribe(key: string, cb: Listener): () => void {
  ensureCrossTabHook();
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(cb);
  return () => {
    set!.delete(cb);
    if (set!.size === 0) listeners.delete(key);
  };
}

function notify(key: string) {
  listeners.get(key)?.forEach((cb) => cb());
}

function readParsed(key: string): unknown {
  if (typeof window === "undefined") return undefined;
  const raw = window.localStorage.getItem(key);
  if (raw == null) {
    if (parseCache.has(key)) parseCache.delete(key);
    return undefined;
  }
  const cached = parseCache.get(key);
  if (cached && cached.raw === raw) return cached.parsed;
  try {
    const parsed = JSON.parse(raw);
    parseCache.set(key, { raw, parsed });
    return parsed;
  } catch {
    return undefined;
  }
}

function writeRaw(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value === undefined) {
      window.localStorage.removeItem(key);
      parseCache.delete(key);
    } else {
      const raw = JSON.stringify(value);
      window.localStorage.setItem(key, raw);
      parseCache.set(key, { raw, parsed: value });
    }
    notify(key);
  } catch {
    // Quota exceeded or storage disabled — silent.
  }
}

// ---------- Collection (array) helpers ----------

export function getCollection<T>(key: string): T[] {
  const v = readParsed(key);
  return (Array.isArray(v) ? v : EMPTY_ARRAY) as T[];
}

export function setCollection<T>(key: string, items: T[]) {
  writeRaw(key, items);
}

export function pushItem<T>(key: string, item: T) {
  setCollection<T>(key, [...getCollection<T>(key), item]);
}

export function updateItem<T extends { id: string }>(
  key: string,
  id: string,
  patch: Partial<T>
) {
  const next = getCollection<T>(key).map((x) =>
    x.id === id ? { ...x, ...patch } : x
  );
  setCollection<T>(key, next);
}

export function removeItem<T extends { id: string }>(key: string, id: string) {
  setCollection<T>(
    key,
    getCollection<T>(key).filter((x) => x.id !== id)
  );
}

// ---------- Singleton-value helpers ----------

export function getValue<T>(key: string): T | undefined {
  return readParsed(key) as T | undefined;
}

export function setValue<T>(key: string, value: T) {
  writeRaw(key, value);
}

export function clearKey(key: string) {
  writeRaw(key, undefined);
}

// ---------- ID generator ----------

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
