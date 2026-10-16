"use client";

import { useActionState } from "react";
import { signIn } from "@/app/(auth)/actions";
import { Field } from "./Field";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { TextLink } from "./TextLink";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field id="email" name="email" type="email" label="Email" autoComplete="email" required defaultValue={state?.email} />
      <div>
        <Field id="password" name="password" type="password" label="Password" autoComplete="current-password" required />
        <p className="mt-1.5 text-right text-xs">
          <TextLink href="/forgot-password">Forgot password?</TextLink>
        </p>
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Logging in…">Log in</SubmitButton>
    </form>
  );
}
