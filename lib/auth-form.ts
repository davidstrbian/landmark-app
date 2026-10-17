// Shared by the auth forms and their Server Actions.
export type FormState = { error?: string; message?: string; email?: string } | undefined;

export const PASSWORD_MIN = 8;
// bcrypt, which Supabase uses, ignores anything after 72 bytes.
export const PASSWORD_MAX = 72;

// These match the checks on public.profiles.
export const DISPLAY_NAME_MAX = 80;
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
export const BIO_MAX = 160;

// Avatars: what the picker accepts before resizing, and what is uploaded.
export const AVATAR_INPUT_MAX_BYTES = 10 * 1024 * 1024;
export const AVATAR_SIZE_PX = 256;
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

// What to type to confirm deleting an account.
export const DELETE_PHRASE = "DELETE";

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
