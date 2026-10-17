import { Inter } from "next/font/google";
import type { ReactNode } from "react";

// The settings page sets its controls and labels in Inter, a typeface made
// for interface text, to read a little more like a tool than the rest of the
// site; headings stay in Manrope. Loaded on this route only.
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <div className={`${inter.variable} contents`}>{children}</div>;
}
