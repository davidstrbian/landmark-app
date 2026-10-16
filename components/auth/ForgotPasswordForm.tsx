"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/(auth)/actions";
import { Field } from "./Field";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, undefined);
  if (state?.message) return <FormMessage state={state} />;
  return (
    <form action={action} className="space-y-4">
      <Field id="email" name="email" type="email" label="Email" autoComplete="email" required defaultValue={state?.email} />
      <FormMessage state={state} />
      <SubmitButton pendingText="Sending…">Send reset link</SubmitButton>
    </form>
  );
}
