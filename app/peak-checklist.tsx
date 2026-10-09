"use client";

import { useState } from "react";

const peaks = ["Halti", "Sokosti", "Taivaskero", "Ukko-Koli", "Saana"];

export default function PeakChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(peak: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(peak)) {
        next.delete(peak);
      } else {
        next.add(peak);
      }
      return next;
    });
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-sm text-left">
      <h2 className="mb-4 text-xl font-semibold">Five Iconic Finnish Peaks</h2>
      <ul className="space-y-2">
        {peaks.map((peak) => (
          <li key={peak}>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={checked.has(peak)}
                onChange={() => toggle(peak)}
              />
              <span className={checked.has(peak) ? "line-through opacity-60" : ""}>
                {peak}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm opacity-70">
        {checked.size} of {peaks.length} climbed
      </p>
    </section>
  );
}
