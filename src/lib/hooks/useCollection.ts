"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getCollection,
  pushItem,
  removeItem,
  setCollection,
  subscribe,
  updateItem,
} from "@/lib/storage";
import { useHasMounted } from "./useHasMounted";

const EMPTY: readonly unknown[] = Object.freeze([]);

/**
 * SSR-safe hook for an array stored in localStorage.
 *
 * `hydrated` flips to true once the client has mounted — gate skeleton UI on
 * this rather than on `items.length === 0` so the empty state doesn't flash
 * before the first localStorage read on slow devices.
 */
export function useCollection<T extends { id: string }>(key: string) {
  const sub = useCallback(
    (cb: () => void) => subscribe(key, cb),
    [key]
  );
  const getSnapshot = useCallback(() => getCollection<T>(key), [key]);
  const getServerSnapshot = useCallback(() => EMPTY as T[], []);

  const items = useSyncExternalStore(sub, getSnapshot, getServerSnapshot);
  const hydrated = useHasMounted();

  const add = useCallback((item: T) => pushItem<T>(key, item), [key]);
  const update = useCallback(
    (id: string, patch: Partial<T>) => updateItem<T>(key, id, patch),
    [key]
  );
  const remove = useCallback((id: string) => removeItem<T>(key, id), [key]);
  const replace = useCallback(
    (next: T[]) => setCollection<T>(key, next),
    [key]
  );

  return { items, hydrated, add, update, remove, replace };
}
