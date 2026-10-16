"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getSnapshot, subscribe, toggleVisited } from "@/lib/visited-sync";

// The server (and the first client render during hydration) sees null, so
// callers render a skeleton until the visitor's list is available: their
// account's when signed in, this browser's otherwise.
const getServerSnapshot = () => null;

export function useVisited() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = snapshot !== null && snapshot.mode !== "loading";
  const ids = snapshot?.ids;
  const visited = useMemo(() => new Set(ready ? ids : []), [ready, ids]);
  return { visited, ready, toggle: toggleVisited };
}
