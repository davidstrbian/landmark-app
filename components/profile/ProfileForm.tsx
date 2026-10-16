"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/app/(auth)/profile/actions";
import { Field } from "@/components/auth/Field";
import { FormMessage } from "@/components/auth/FormMessage";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { BIO_MAX, DISPLAY_NAME_MAX, USERNAME_MAX, USERNAME_PATTERN } from "@/lib/auth-form";

export function ProfileForm(props: { displayName: string; username: string; bio: string }) {
  const [state, action] = useActionState(updateProfile, undefined);
  const [username, setUsername] = useState(props.username);
  const [bio, setBio] = useState(props.bio);
  const usernameOk = username === "" || USERNAME_PATTERN.test(username);

  return (
    <form action={action} className="space-y-4">
      <Field
        id="displayName"
        name="displayName"
        label="Name"
        autoComplete="name"
        maxLength={DISPLAY_NAME_MAX}
        defaultValue={props.displayName}
        hint="Your first name is used for your avatar when there's no photo."
      />
      <Field
        id="username"
        name="username"
        label="Username"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={USERNAME_MAX}
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
        aria-invalid={!usernameOk || state?.field === "username"}
        hint={
          usernameOk ? (
            "3–20 characters: lowercase letters, numbers and _. Only you can see it for now."
          ) : (
            <span className="text-red-800">Use 3–20 lowercase letters, numbers or _.</span>
          )
        }
      />
      <div>
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={BIO_MAX}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          aria-describedby="bio-count"
          aria-invalid={state?.field === "bio"}
          placeholder="Fell walker from Rovaniemi, collecting national parks one summer at a time."
          className="mt-1.5 block w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted/70 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary sm:text-sm"
        />
        <p id="bio-count" className="mt-1.5 text-right text-xs text-muted tabular-nums">
          {bio.length} / {BIO_MAX}
        </p>
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Save profile</SubmitButton>
    </form>
  );
}
