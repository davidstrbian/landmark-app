import type { InputHTMLAttributes, ReactNode } from "react";

// A labelled input. Text is 16px on phones so mobile browsers don't zoom in
// when it's tapped.
export function Field({
  label,
  hint,
  id,
  ...input
}: { label: string; hint?: ReactNode; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hintId}
        className="mt-1.5 block w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted/70 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary sm:text-sm"
        {...input}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
