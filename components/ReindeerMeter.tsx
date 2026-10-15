import { REINDEER_LEVELS, type ReindeerLikelihood } from "@/data/landmarks";

// Four segments, all lit for "Very likely" and one for "Rare".
export function ReindeerMeter({ level }: { level: ReindeerLikelihood }) {
  const lit = REINDEER_LEVELS.length - REINDEER_LEVELS.indexOf(level);
  return (
    <span className="mt-1 flex items-center gap-4">
      <span
        className="flex w-40 shrink-0 gap-1.5"
        role="img"
        aria-label={`${level}: ${lit} of ${REINDEER_LEVELS.length}`}
      >
        {REINDEER_LEVELS.map((_, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 rounded-full ${i < lit ? "bg-dusk" : "bg-white/15"}`}
          />
        ))}
      </span>
      <span className="font-medium" aria-hidden="true">
        {level}
      </span>
    </span>
  );
}
