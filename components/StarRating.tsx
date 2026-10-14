import { Star } from "lucide-react";

type Props = {
  value: number; // 0–5, half steps fill half a star
  max?: number;
  label: string; // e.g. "Difficulty"
};

// Outlined stars filled from the left up to `value`, in the dusk accent.
export function StarRating({ value, max = 5, label }: Props) {
  return (
    <span
      role="img"
      aria-label={`${label}: ${value} out of ${max}`}
      className="inline-flex items-center gap-1 text-dusk"
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block size-5">
            <Star className="size-5" strokeWidth={1.75} aria-hidden="true" />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className="size-5 fill-current"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
