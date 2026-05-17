/**
 * Typed localStorage wrapper with a tiny pub/sub layer so React components can
 * subscribe to changes without a full state-management library.
 *
 * Cross-tab updates piggy-back on the native `storage` event; same-tab updates
 * are dispatched manually since `storage` doesn't fire in the originating tab.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
let crossTabHooked = false;

function ensureCrossTabHook() {
  if (crossTabHooked || typeof window === "undefined") return;
  crossTabHooked = true;
  window.addEventListener("storage", (e) => {
    if (e.key) notify(e.key);
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

function readRaw(key: string): unknown {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function writeRaw(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    notify(key);
  } catch {
    // Quota exceeded or storage disabled — silent. UI hooks will keep their
    // optimistic state and the next read will reflect reality.
  }
}

// ---------- Collection (array) helpers ----------

export function getCollection<T>(key: string): T[] {
  const v = readRaw(key);
  return Array.isArray(v) ? (v as T[]) : [];
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
  return readRaw(key) as T | undefined;
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
