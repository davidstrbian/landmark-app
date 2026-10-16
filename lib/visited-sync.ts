// Which landmarks the visitor has completed, wherever they're kept:
// - signed out (or Supabase not configured): this browser's list,
//   lib/visited-store.ts, exactly as before accounts existed;
// - signed in: their rows in public.completions (lib/completions.ts). Any
//   list the browser holds is copied into the account once, then cleared.
// hooks/use-visited.ts reads it with useSyncExternalStore.
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  addCompletion,
  fetchCompletions,
  importLocalVisits,
  removeCompletion,
} from "./completions";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/client";
import * as local from "./visited-store";

export type SyncNotice = { id: number; tone: "info" | "error"; text: string };

export type VisitedSnapshot = {
  // "loading" until we know who's signed in and their list has arrived.
  mode: "loading" | "local" | "account";
  ids: readonly string[];
  notice: SyncNotice | null;
};

const EMPTY: readonly string[] = Object.freeze([]);
let snapshot: VisitedSnapshot = { mode: "loading", ids: EMPTY, notice: null };
const listeners = new Set<() => void>();

let supabase: SupabaseClient | null = null;
let userId: string | null | undefined; // undefined: not checked yet
let accountIds: readonly string[] = EMPTY;
let generation = 0; // bumped on every account switch; stale results are dropped
let writes: Promise<void> = Promise.resolve();
let noticeCounter = 0;
let unsubscribeLocal: (() => void) | null = null;
let stopAuthListener: (() => void) | null = null;

function emit(next: Partial<VisitedSnapshot>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener());
}

function notify(tone: SyncNotice["tone"], text: string) {
  emit({ notice: { id: ++noticeCounter, tone, text } });
}

export function dismissNotice() {
  if (snapshot.notice) emit({ notice: null });
}

function showLocal() {
  emit({ mode: "local", ids: local.getVisited() });
}

function showAccount() {
  emit({ mode: "account", ids: accountIds });
}

// Loads the account's list, copies in anything the browser still holds, and
// shows the result. Runs on sign-in, page load and when the tab comes back.
async function loadAccount(id: string, gen: number) {
  const client = supabase!;
  try {
    const remote = await fetchCompletions(client, id);
    if (gen !== generation) return;
    accountIds = Object.freeze(remote);
    showAccount();
  } catch {
    if (gen !== generation) return;
    notify("error", "Couldn't load your landmarks. Check your connection and reload the page.");
    return;
  }

  const pending = local.getVisited();
  if (pending.length === 0) return;
  try {
    const added = await importLocalVisits(client, id, pending, new Set(accountIds));
    if (gen !== generation) return;
    // Only now, with the rows confirmed, is the browser's copy cleared.
    local.clearVisited();
    accountIds = Object.freeze(await fetchCompletions(client, id));
    if (gen !== generation) return;
    showAccount();
    if (added > 0) {
      notify(
        "info",
        `Added ${added} ${added === 1 ? "landmark" : "landmarks"} from this browser to your account.`,
      );
    }
  } catch {
    if (gen !== generation) return;
    notify(
      "error",
      "Couldn't copy this browser's landmarks to your account. We'll try again next time.",
    );
  }
}

function setUser(id: string | null) {
  if (id === userId) return;
  userId = id;
  const gen = ++generation;
  accountIds = EMPTY;
  if (id) {
    emit({ mode: "loading", ids: EMPTY });
    void loadAccount(id, gen);
  } else {
    showLocal();
  }
}

// Asks the browser client who's signed in. Sign-in and sign-out happen on the
// server and then navigate within the app, so this runs whenever a page
// starts using the store, not only on auth events.
async function checkUser() {
  const { data } = await supabase!.auth.getSession();
  setUser(data.session?.user.id ?? null);
}

function onVisible() {
  if (document.visibilityState !== "visible" || !userId) return;
  // Pick up changes made on another device, once our own saves are done.
  const id = userId;
  const gen = generation;
  void writes.then(() => loadAccount(id, gen));
}

function start() {
  unsubscribeLocal = local.subscribe(() => {
    if (snapshot.mode === "local") showLocal();
  });
  if (!isSupabaseConfigured) {
    showLocal();
    return;
  }
  supabase ??= createClient();
  // A new page started using the store, perhaps right after signing in or
  // out on the server: forget who we thought it was and ask again, so the
  // previous account's list is never shown to the next visitor.
  userId = undefined;
  generation++;
  emit({ mode: "loading", ids: EMPTY });
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    // Supabase advises against awaiting other calls inside this callback.
    setTimeout(() => setUser(session?.user.id ?? null), 0);
  });
  stopAuthListener = () => data.subscription.unsubscribe();
  document.addEventListener("visibilitychange", onVisible);
  void checkUser();
}

function stop() {
  unsubscribeLocal?.();
  stopAuthListener?.();
  unsubscribeLocal = stopAuthListener = null;
  document.removeEventListener("visibilitychange", onVisible);
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) start();
  else if (isSupabaseConfigured && supabase) void checkUser();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

export function getSnapshot(): VisitedSnapshot {
  return snapshot;
}

export function toggleVisited(landmarkId: string) {
  if (snapshot.mode === "local") {
    const current = local.getVisited();
    local.setVisited(
      current.includes(landmarkId)
        ? current.filter((existing) => existing !== landmarkId)
        : [...current, landmarkId],
    );
    return;
  }
  if (snapshot.mode !== "account" || !userId) return;

  // Show the change straight away, then save it. Saves run one at a time so
  // a quick double tap can't reach the database out of order.
  const id = userId;
  const gen = generation;
  const adding = !accountIds.includes(landmarkId);
  accountIds = Object.freeze(
    adding ? [...accountIds, landmarkId] : accountIds.filter((existing) => existing !== landmarkId),
  );
  showAccount();
  const client = supabase!;
  writes = writes.then(async () => {
    try {
      if (adding) await addCompletion(client, id, landmarkId);
      else await removeCompletion(client, id, landmarkId);
    } catch {
      if (gen !== generation) return;
      // Undo just this change.
      accountIds = Object.freeze(
        adding ? accountIds.filter((existing) => existing !== landmarkId) : [...accountIds, landmarkId],
      );
      showAccount();
      notify("error", "That change wasn't saved. Check your connection and try again.");
    }
  });
}
