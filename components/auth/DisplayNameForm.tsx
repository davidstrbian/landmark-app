"use client";

import { useActionState } from "react";
import { updateDisplayName } from "@/app/(auth)/account/actions";
import { DISPLAY_NAME_MAX } from "@/lib/auth-form";
import { Field } from "./Field";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

export function DisplayNameForm({ current }: { current: string }) {
  const [state, action] = useActionState(updateDisplayName, undefined);
  return (
    <form action={action} className="space-y-3">
      <Field
        id="displayName"
        name="displayName"
        label="Display name"
        autoComplete="nickname"
        maxLength={DISPLAY_NAME_MAX}
        defaultValue={current}
        hint="Optional. Shown instead of your email in the future."
      />
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Save name</SubmitButton>
    </form>
  );
}
