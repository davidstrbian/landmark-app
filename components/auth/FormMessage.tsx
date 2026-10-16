import type { FormState } from "@/lib/auth-form";

// The result of a form action, announced to screen readers as it appears.
export function FormMessage({ state }: { state: FormState }) {
  return (
    <div aria-live="polite" role="status">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800">{state.error}</p>
      )}
      {state?.message && (
        <p className="rounded-xl bg-primary-soft px-3.5 py-2.5 text-sm text-primary-hover">
          {state.message}
        </p>
      )}
    </div>
  );
}
