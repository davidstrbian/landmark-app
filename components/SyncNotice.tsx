"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useSyncNotice } from "@/hooks/use-sync-notice";

const VISIBLE_MS = 6000;

// A small message at the bottom of the screen about saving visited landmarks:
// "Added 3 landmarks from this browser to your account", or a failed save.
export function SyncNotice() {
  const { notice, dismiss } = useSyncNotice();

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(dismiss, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [notice, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      {notice && (
        <div
          key={notice.id}
          className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl px-4 py-3 font-body text-sm shadow-lift motion-safe:animate-[notice-in_200ms_ease-out] ${
            notice.tone === "error" ? "bg-red-50 text-red-900 ring-1 ring-red-900/15" : "bg-night text-white ring-1 ring-white/15"
          }`}
        >
          <p className="leading-relaxed">{notice.text}</p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className={`-mr-1 shrink-0 rounded-lg p-0.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              notice.tone === "error"
                ? "text-red-900/70 hover:text-red-900 focus-visible:outline-red-900"
                : "text-white/70 hover:text-white focus-visible:outline-dusk"
            }`}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
