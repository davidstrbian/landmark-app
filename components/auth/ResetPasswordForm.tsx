"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/(auth)/actions";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/auth-form";
import { Field } from "./Field";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

export function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field
        id="password"
        name="password"
        type="password"
        label="New password"
        autoComplete="new-password"
        required
        minLength={PASSWORD_MIN}
        maxLength={PASSWORD_MAX}
        hint={`At least ${PASSWORD_MIN} characters.`}
      />
      <Field id="confirm" name="confirm" type="password" label="Repeat new password" autoComplete="new-password" required />
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Save new password</SubmitButton>
    </form>
  );
}
