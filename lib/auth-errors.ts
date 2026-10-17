import type { AuthError } from "@supabase/supabase-js";

// Supabase's error codes, in words a visitor can act on.
export function authErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "Wrong email or password.";
    case "email_not_confirmed":
      return "Confirm your email first: open the link we sent you.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Log in instead.";
    case "weak_password":
      return "Choose a stronger password: at least 8 characters, not a common one.";
    case "same_password":
      return "Choose a password different from your current one.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Wait a few minutes and try again.";
    case "email_address_invalid":
      return "That email address can't be used. Check it and try again.";
    case "reauthentication_needed":
      return "For security, log out and back in, then try again.";
    case "signup_disabled":
      return "Sign-ups are switched off at the moment.";
    default:
      return "Something went wrong. Please try again.";
  }
}
