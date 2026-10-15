import type { SVGProps } from "react";

// Custom icons in lucide's style (24×24, 2px round strokes) for the nature
// types lucide has no fitting symbol for.
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

// Three small islands on the water, above a ripple.
export function IslandsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M2 14h1.5q3-5.5 6 0H11" />
      <path d="M12 9.5h1q2-3.5 4 0h1" />
      <path d="M13 16h1.5q3.25-5.5 6.5 0h1" />
      <path d="M5 20q1.5 1.2 3 0t3 0 3 0" />
    </Icon>
  );
}

// Like the lake waves, but smaller and packed closer together, as marsh is
// drawn on an orienteering map.
export function MireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M1.5 5q1.5 1.4 3 0t3 0 3 0 3 0 3 0 3 0 3 0" />
      <path d="M1.5 9.67q1.5 1.4 3 0t3 0 3 0 3 0 3 0 3 0 3 0" />
      <path d="M1.5 14.33q1.5 1.4 3 0t3 0 3 0 3 0 3 0 3 0 3 0" />
      <path d="M1.5 19q1.5 1.4 3 0t3 0 3 0 3 0 3 0 3 0 3 0" />
    </Icon>
  );
}

// A winding river between two banks, with ripples for the rapids.
export function RapidsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M2 2c0 5 5 5.5 5 10s-3 5.5-3 10" />
      <path d="M12.5 2c0 5 5 5.5 5 10s-3 5.5-3 10" />
      <path d="M7 7q.9 .9 1.8 0t1.8 0" />
      <path d="M10.4 12q.9 .9 1.8 0t1.8 0" />
      <path d="M7.9 17q.9 .9 1.8 0t1.8 0" />
    </Icon>
  );
}
