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

// Cotton grass: three stems with fluffy white heads.
export function CottonGrassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 22c-1.2-4-4-7.5-6-11.5" />
      <path d="M12 22c.2-5 .4-10 .5-14.8" />
      <path d="M12 22c1.6-4 4.3-7.2 6.2-10.5" />
      <circle cx="4.5" cy="8.6" r="1.5" className="fill-white" stroke="none" />
      <circle cx="6.7" cy="8.6" r="1.5" className="fill-white" stroke="none" />
      <circle cx="5.6" cy="7.4" r="1.6" className="fill-white" stroke="none" />
      <circle cx="11.4" cy="5.2" r="1.5" className="fill-white" stroke="none" />
      <circle cx="13.6" cy="5.2" r="1.5" className="fill-white" stroke="none" />
      <circle cx="12.5" cy="4" r="1.6" className="fill-white" stroke="none" />
      <circle cx="17.3" cy="9.6" r="1.5" className="fill-white" stroke="none" />
      <circle cx="19.5" cy="9.6" r="1.5" className="fill-white" stroke="none" />
      <circle cx="18.4" cy="8.4" r="1.6" className="fill-white" stroke="none" />
    </Icon>
  );
}

// A canyon seen from the river: cliff walls closing in towards the
// distance, with the river widening towards the viewer.
export function CanyonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M2 4h4l1 2.5L6 9l2.5 4L5 22" />
      <path d="M22 4h-4.5L16 7.5l1 2-2.5 3.5L19 22" />
      <path d="M9.5 17.5q1.25 1 2.5 0t2.5 0" />
      <path d="M8 21.5q2 1.2 4 0t4 0" />
    </Icon>
  );
}
