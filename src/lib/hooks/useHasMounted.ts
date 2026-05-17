"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  // Schedule a notification once the subscription is registered (which only
  // happens on the client, after the first render). That flips the snapshot
  // from false to true, triggering a re-render with hasMounted=true.
  queueMicrotask(cb);
  return () => {};
}

const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * Returns false during SSR and the first client render (so output matches
 * server output and React doesn't complain about hydration mismatches), then
 * flips to true after hydration.
 *
 * Use to gate UI that depends on client-only data (localStorage, system theme,
 * window dimensions) without sprinkling `useEffect(() => setX(true), [])`
 * everywhere.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
