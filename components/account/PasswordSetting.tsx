"use client";

import { useActionState, useState } from "react";
import { changePassword } from "@/app/(auth)/account/actions";
import { Field } from "@/components/auth/Field";
import { FormMessage } from "@/components/auth/FormMessage";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/auth-form";
import { SettingsRow, settingsButton } from "./Settings";

export function PasswordSetting({ hasPassword }: { hasPassword: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(changePassword, undefined);

  return (
    <SettingsRow
      title="Password"
      description={hasPassword ? "Use at least 8 characters." : "You sign in with Google, so there's no password to change here."}
      action={
        hasPassword && !open ? (
          <button type="button" onClick={() => setOpen(true)} className={settingsButton}>
            Change
          </button>
        ) : undefined
      }
    >
      {open && (
        <form action={action} className="mt-4 space-y-3 rounded-2xl bg-subtle/60 p-4">
          <Field id="current-password" name="current" type="password" label="Current password" autoComplete="current-password" required />
          <Field
            id="new-password"
            name="password"
            type="password"
            label="New password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
          />
          <Field id="confirm-password" name="confirm" type="password" label="Repeat new password" autoComplete="new-password" required />
          <FormMessage state={state} />
          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-auto [&>button]:px-5 [&>button]:py-2">
              <SubmitButton pendingText="Saving…">Update password</SubmitButton>
            </div>
            <button type="button" onClick={() => setOpen(false)} className={settingsButton}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </SettingsRow>
  );
}
