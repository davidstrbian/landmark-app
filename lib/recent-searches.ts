// Recent map searches, newest first, kept in this browser like the visited
// state. Every storage access is guarded: private mode or blocked storage
// just means no history.
const KEY = "map.recentSearches.v1";
const MAX = 5;

export function getRecentSearches(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string").slice(0, MAX)
      : [];
  } catch {
    return [];
  }
}

function save(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage unavailable; the list still works for this visit.
  }
}

// Adds a search to the front, dropping an older copy (ignoring case).
export function addRecentSearch(list: string[], search: string): string[] {
  const term = search.trim();
  if (!term) return list;
  const next = [
    term,
    ...list.filter((s) => s.toLowerCase() !== term.toLowerCase()),
  ].slice(0, MAX);
  save(next);
  return next;
}

export function removeRecentSearch(list: string[], search: string): string[] {
  const next = list.filter((s) => s !== search);
  save(next);
  return next;
}
