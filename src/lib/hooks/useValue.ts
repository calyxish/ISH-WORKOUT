"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getValue, setValue as setStored, subscribe } from "@/lib/storage";
import { useHasMounted } from "./useHasMounted";

/**
 * SSR-safe hook for a single value stored in localStorage.
 *
 * Returns `[value, setValue, hydrated]`. `fallback` must be a stable reference
 * (define it outside the component or memoize it) — it's used as the snapshot
 * on the server and when no value is stored, so a new object each render would
 * trigger infinite re-renders.
 */
export function useValue<T>(key: string, fallback: T) {
  const sub = useCallback(
    (cb: () => void) => subscribe(key, cb),
    [key]
  );
  const getSnapshot = useCallback(() => {
    const stored = getValue<T>(key);
    return stored === undefined ? fallback : stored;
  }, [key, fallback]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(sub, getSnapshot, getServerSnapshot);
  const hydrated = useHasMounted();

  const set = useCallback(
    (next: T) => {
      setStored<T>(key, next);
    },
    [key]
  );

  return [value, set, hydrated] as const;
}
