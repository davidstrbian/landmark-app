"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteAccount } from "@/app/(auth)/account/actions";
import { Field } from "@/components/auth/Field";
import { FormMessage } from "@/components/auth/FormMessage";
import { DELETE_PHRASE } from "@/lib/auth-form";
import { SettingsRow, dangerButton, settingsButton } from "./Settings";

function ConfirmButton({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={!ready || pending}
      className="inline-flex items-center justify-center rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete account"}
    </button>
  );
}

// Deleting is permanent, so it asks for DELETE to be typed in a dialog first.
export function DeleteAccount() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [state, action] = useActionState(deleteAccount, undefined);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <SettingsRow
      title="Delete account"
      description="Permanently remove your account, profile, photo and every landmark you've marked."
      action={
        <button type="button" onClick={() => setOpen(true)} className={dangerButton}>
          Delete account
        </button>
      }
    >
      <dialog
        ref={ref}
        aria-labelledby="delete-title"
        onClose={() => {
          setOpen(false);
          setTyped("");
        }}
        className="font-settings m-auto w-[min(28rem,calc(100%-2rem))] rounded-3xl bg-card p-6 text-foreground shadow-lift backdrop:bg-black/60"
      >
        <h2 id="delete-title" className="font-heading text-xl font-semibold">
          Delete your account?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          This removes your account, your profile and photo, and every landmark you&apos;ve marked conquered or
          visited. It can&apos;t be undone.
        </p>
        <form action={action} className="mt-5 space-y-4">
          <Field
            id="delete-confirm"
            name="confirm"
            label={`Type ${DELETE_PHRASE} to confirm`}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
          <FormMessage state={state} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className={settingsButton}>
              Cancel
            </button>
            <ConfirmButton ready={typed.trim() === DELETE_PHRASE} />
          </div>
        </form>
      </dialog>
    </SettingsRow>
  );
}
