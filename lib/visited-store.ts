// The browser's own list of visited landmark ids, in localStorage. Signed-out
// visitors use it directly; for signed-in visitors lib/visited-sync.ts copies
// it into their account once and then clears it.

const STORAGE_KEY = "landmarks.visited.v1";
const EMPTY: readonly string[] = Object.freeze([]);

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedIds: readonly string[] = EMPTY;
let memoryOnly = false;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): readonly string[] {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

// Returns the same array instance until storage changes, as
// useSyncExternalStore requires a stable snapshot.
export function getVisited(): readonly string[] {
  if (memoryOnly) return cachedIds;
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = parse(raw);
  }
  return cachedIds;
}

export function setVisited(ids: readonly string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private mode, quota): keep the change in memory.
    memoryOnly = true;
    cachedIds = ids;
  }
  listeners.forEach((listener) => listener());
}

// Called once the list has been safely copied into the visitor's account.
export function clearVisited(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: the in-memory copy below is all there is.
  }
  cachedIds = EMPTY;
  cachedRaw = null;
  memoryOnly = false;
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
