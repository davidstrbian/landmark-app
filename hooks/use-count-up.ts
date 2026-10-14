"use client";

import { useEffect, useRef, useState } from "react";

// Animates a number towards `target`, starting from 0 the first time `run`
// is true (each page load) and from the current value on later changes.
// Jumps straight to the target under prefers-reduced-motion.
export function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    if (!run) return;
    const from = valueRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const length = reduced || from === target ? 0 : duration;
    let start: number | null = null;
    let frame = requestAnimationFrame(function step(now) {
      start ??= now;
      const t = length === 0 ? 1 : Math.min((now - start) / length, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      valueRef.current = from + (target - from) * eased;
      setValue(valueRef.current);
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, run, duration]);

  return value;
}
