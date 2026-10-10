"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getVisited, setVisited, subscribe } from "@/lib/visited-store";

// The server (and the first client render during hydration) sees null, so
// callers render a skeleton until the stored state is available.
const getServerSnapshot = () => null;

export function useVisited() {
  const ids = useSyncExternalStore(subscribe, getVisited, getServerSnapshot);
  const ready = ids !== null;
  const visited = useMemo(() => new Set(ids ?? []), [ids]);

  const toggle = useCallback((id: string) => {
    const current = getVisited();
    setVisited(
      current.includes(id)
        ? current.filter((existing) => existing !== id)
        : [...current, id],
    );
  }, []);

  return { visited, ready, toggle };
}
