/** Normalize email for sign-up (Supabase treats addresses case-insensitively). */
export function normalizeSignupEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/** User-facing copy for Supabase Auth errors + our domain gate. */
export function formatSignupError(message: string): string {
  const m = message.toLowerCase();

  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("user already exists") ||
    m.includes("duplicate")
  ) {
    return "That email already has an account. Sign in instead, or use a different email.";
  }

  if (
    message.includes("SIGNUP_DOMAIN_NOT_ALLOWED") ||
    m.includes("signup_domain_not_allowed")
  ) {
    return "Sign up is limited to your chapter’s allowed school email domains. Use your school-issued address, or ask an officer which email to use.";
  }

  if (m.includes("invalid email")) {
    return "Enter a valid email address.";
  }

  return message;
}
