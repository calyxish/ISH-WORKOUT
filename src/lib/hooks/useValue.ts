"use client";

import { useCallback, useEffect, useState } from "react";
import { getValue, setValue as setStored, subscribe } from "@/lib/storage";

/**
 * SSR-safe hook for a single value stored in localStorage.
 *
 * Returns `[value, setValue, hydrated]`.
 */
export function useValue<T>(key: string, fallback: T) {
  const [value, setLocal] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const read = () => {
      const stored = getValue<T>(key);
      setLocal(stored === undefined ? fallback : stored);
    };
    read();
    setHydrated(true);
    return subscribe(key, read);
  }, [key, fallback]);

  const set = useCallback(
    (next: T) => {
      setStored<T>(key, next);
    },
    [key]
  );

  return [value, set, hydrated] as const;
}
