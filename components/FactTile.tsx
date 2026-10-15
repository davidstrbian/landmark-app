import type { ReactNode } from "react";

// Tile colours for the dark detail views: "night" (fells), "tundra"
// (wilderness areas) and "forest" (national parks).
const TONES = {
  night: { bg: "bg-night-raised", muted: "text-night-muted" },
  tundra: { bg: "bg-tundra-raised", muted: "text-tundra-muted" },
  forest: { bg: "bg-forest-raised", muted: "text-forest-muted" },
} as const;

// A fact tile. A missing value is shown as such, so gaps in the data are
// visible and can be filled in later.
export function FactTile({
  label,
  note,
  wide,
  tone = "night",
  children,
}: {
  label: string;
  note?: string;
  wide?: boolean;
  tone?: keyof typeof TONES;
  children?: ReactNode;
}) {
  const { bg, muted } = TONES[tone];
  // Callers pass `cond && <el />`, so a missing value arrives as false.
  const missing = children == null || children === false;
  return (
    <div className={`rounded-2xl px-4 py-3 ${bg} ${wide ? "sm:col-span-2" : ""}`}>
      <dt
        className={`font-body text-xs font-medium uppercase tracking-wide ${muted}`}
      >
        {label}
      </dt>
      <dd className="mt-1 font-body text-white">
        {missing ? <span className={muted}>Not found</span> : children}
      </dd>
      {(missing || note) && (
        <p className="mt-2 font-body text-xs leading-relaxed text-dusk">
          {note ?? "No reliable source found yet. Needs to be added."}
        </p>
      )}
    </div>
  );
}
