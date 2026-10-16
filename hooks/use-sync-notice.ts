"use client";

import { useSyncExternalStore } from "react";
import { dismissNotice, getSnapshot, subscribe } from "@/lib/visited-sync";

const getServerSnapshot = () => null;

// The latest message about saving visited landmarks (an import, a failed save).
export function useSyncNotice() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { notice: snapshot?.notice ?? null, dismiss: dismissNotice };
}
