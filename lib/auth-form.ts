// Shared by the auth forms and their Server Actions.
export type FormState = { error?: string; message?: string; email?: string } | undefined;

export const PASSWORD_MIN = 8;
// bcrypt, which Supabase uses, ignores anything after 72 bytes.
export const PASSWORD_MAX = 72;

// Matches the check on profiles.display_name.
export const DISPLAY_NAME_MAX = 80;

export function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function checkEmail(email: string): string | undefined {
  if (!email) return "Enter your email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
}

export function checkPassword(password: string): string | undefined {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (new TextEncoder().encode(password).length > PASSWORD_MAX)
    return `Use at most ${PASSWORD_MAX} characters.`;
}
