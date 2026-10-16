import Link from "next/link";
import type { ComponentProps } from "react";

export function TextLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    />
  );
}
