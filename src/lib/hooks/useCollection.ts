"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCollection,
  pushItem,
  removeItem,
  setCollection,
  subscribe,
  updateItem,
} from "@/lib/storage";

/**
 * SSR-safe hook for an array stored in localStorage.
 *
 * Returns `hydrated: false` until the first client read completes — guard
 * "empty" UI on this flag so the empty-state doesn't flash before real data
 * loads on slow devices.
 */
export function useCollection<T extends { id: string }>(key: string) {
  const [items, setItems] = useState<T[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const read = () => setItems(getCollection<T>(key));
    read();
    setHydrated(true);
    return subscribe(key, read);
  }, [key]);

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
