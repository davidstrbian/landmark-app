import type { ReactNode } from "react";

// A group of settings under a small uppercase label.
export function SettingsSection({
  label,
  tone = "default",
  children,
}: {
  label: string;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border px-5 py-5 sm:px-8">
      <h2
        className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${tone === "danger" ? "text-red-700" : "text-muted"}`}
      >
        {label}
      </h2>
      <div className="mt-3 space-y-5">{children}</div>
    </section>
  );
}

// One setting: what it is on the left, its action on the right (stacked on
// phones), and room below for a form that opens in place.
export function SettingsRow({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {description && <div className="mt-0.5 text-sm break-words text-muted">{description}</div>}
        </div>
        {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
      </div>
      {children}
    </div>
  );
}

export const settingsButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium transition hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60";
export const dangerButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-card px-3.5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700";
