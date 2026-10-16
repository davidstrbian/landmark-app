"use client";

import { useActionState } from "react";
import { signUp } from "@/app/(auth)/actions";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/auth-form";
import { Field } from "./Field";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

export function SignupForm() {
  const [state, action] = useActionState(signUp, undefined);
  // After a successful sign-up, only the "check your inbox" message remains.
  if (state?.message) return <FormMessage state={state} />;
  return (
    <form action={action} className="space-y-4">
      <Field id="email" name="email" type="email" label="Email" autoComplete="email" required defaultValue={state?.email} />
      <Field
        id="password"
        name="password"
        type="password"
        label="Password"
        autoComplete="new-password"
        required
        minLength={PASSWORD_MIN}
        maxLength={PASSWORD_MAX}
        hint={`At least ${PASSWORD_MIN} characters.`}
      />
      <FormMessage state={state} />
      <SubmitButton pendingText="Creating account…">Create account</SubmitButton>
    </form>
  );
}
