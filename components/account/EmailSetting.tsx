"use client";

import { useActionState, useState } from "react";
import { changeEmail } from "@/app/(auth)/account/actions";
import { Field } from "@/components/auth/Field";
import { FormMessage } from "@/components/auth/FormMessage";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { SettingsRow, settingsButton } from "./Settings";

export function EmailSetting({
  email,
  pendingEmail,
  canChange,
}: {
  email: string;
  pendingEmail: string | null;
  canChange: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(changeEmail, undefined);
  const sent = Boolean(state?.message);

  return (
    <SettingsRow
      title="Email address"
      description={
        <>
          <span className="text-foreground">{email}</span>
          {pendingEmail && <span className="block">Waiting for confirmation: {pendingEmail}</span>}
          {!canChange && <span className="block">Managed by your Google account.</span>}
        </>
      }
      action={
        canChange && !open ? (
          <button type="button" onClick={() => setOpen(true)} className={settingsButton}>
            Change
          </button>
        ) : undefined
      }
    >
      {open && (
        <div className="mt-4 rounded-2xl bg-subtle/60 p-4">
          {sent ? (
            <div className="space-y-3">
              <FormMessage state={state} />
              <button type="button" onClick={() => setOpen(false)} className={settingsButton}>
                Done
              </button>
            </div>
          ) : (
            <form action={action} className="space-y-3">
              <Field id="new-email" name="email" type="email" label="New email address" autoComplete="email" required defaultValue={state?.email} />
              <FormMessage state={state} />
              <div className="flex flex-wrap gap-2">
                <div className="w-full sm:w-auto [&>button]:px-5 [&>button]:py-2">
                  <SubmitButton pendingText="Sending…">Send confirmation</SubmitButton>
                </div>
                <button type="button" onClick={() => setOpen(false)} className={settingsButton}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </SettingsRow>
  );
}
