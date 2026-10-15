import { Mountain, Sailboat, Sprout, Trees, Waves } from "lucide-react";
import type { NatureType } from "@/data/landmarks";

const ICONS: Record<NatureType, typeof Trees> = {
  Forest: Trees,
  Fell: Mountain,
  Mire: Sprout,
  Archipelago: Sailboat,
  "Lake Scenery": Waves,
};

// A park known for one type shows just that; several types read as "Mixed",
// with each type listed as a chip.
export function NatureTypes({ types }: { types: NatureType[] }) {
  if (types.length === 1) {
    const Icon = ICONS[types[0]];
    return (
      <span className="mt-1 flex items-center gap-2.5 font-heading text-xl font-semibold">
        <Icon className="size-6 shrink-0 text-dusk" aria-hidden="true" />
        {types[0]}
      </span>
    );
  }
  return (
    <>
      <span className="mt-1 block font-heading text-xl font-semibold">
        Mixed
      </span>
      <ul className="mt-3 flex flex-wrap gap-2">
        {types.map((type) => {
          const Icon = ICONS[type];
          return (
            <li
              key={type}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest py-1 pl-2.5 pr-3 text-sm"
            >
              <Icon className="size-4 text-dusk" aria-hidden="true" />
              {type}
            </li>
          );
        })}
      </ul>
    </>
  );
}
