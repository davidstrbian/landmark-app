import { COMPLETION, type Landmark, type LandmarkCategory } from "@/data/landmarks";

export type CompletionRow = { landmark_id: string; completed_at: string };

export type CategoryStat = { category: LandmarkCategory; done: number; total: number };

export type ProfileStats = {
  done: number;
  total: number;
  categories: CategoryStat[];
  highestFell: Landmark | null;
  areaKm2: number;
  thisYear: number;
  recent: { landmark: Landmark; verb: string; completedAt: string }[];
};

const ORDER: LandmarkCategory[] = ["peak", "wilderness-area", "national-park"];
const RECENT_COUNT = 8;

// Everything the profile page shows about a visitor's progress, from their
// completions and the landmark list. Completions of landmarks that no longer
// exist are ignored.
export function profileStats(landmarks: Landmark[], completions: CompletionRow[], now = new Date()): ProfileStats {
  const byId = new Map(landmarks.map((l) => [l.id, l]));
  const valid = completions.filter((c) => byId.has(c.landmark_id));
  const doneIds = new Set(valid.map((c) => c.landmark_id));
  const done = landmarks.filter((l) => doneIds.has(l.id));

  const categories = ORDER.map((category) => {
    const inCategory = landmarks.filter((l) => l.category === category);
    return { category, total: inCategory.length, done: inCategory.filter((l) => doneIds.has(l.id)).length };
  });

  const highestFell =
    done
      .filter((l) => l.category === "peak" && l.elevationM !== undefined)
      .sort((a, b) => (b.elevationM ?? 0) - (a.elevationM ?? 0))[0] ?? null;

  // Sea parks have no land area recorded, so they add nothing.
  const areaKm2 = Math.round(
    done.filter((l) => l.category !== "peak").reduce((sum, l) => sum + (l.areaKm2 ?? 0), 0),
  );

  const yearStart = new Date(now.getFullYear(), 0, 1).getTime();
  const thisYear = valid.filter((c) => new Date(c.completed_at).getTime() >= yearStart).length;

  const recent = [...valid]
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at))
    .slice(0, RECENT_COUNT)
    .map((c) => {
      const landmark = byId.get(c.landmark_id)!;
      return { landmark, verb: COMPLETION[landmark.category].done, completedAt: c.completed_at };
    });

  return { done: done.length, total: landmarks.length, categories, highestFell, areaKm2, thisYear, recent };
}
