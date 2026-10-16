import type { ReactNode } from "react";

// The white card every sign-in page sits in, on the night band.
export function AuthCard({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-3xl bg-card p-6 font-body text-foreground shadow-lift sm:p-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      {intro && <p className="mt-2 text-sm leading-relaxed text-muted">{intro}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
