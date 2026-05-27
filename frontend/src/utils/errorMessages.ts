export function getFriendlyErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("auth/invalid-credential") || message.includes("auth/wrong-password")) {
    return "Incorrect email or password. Please try again.";
  }
  if (message.includes("auth/email-already-in-use")) {
    return "An account already exists for this email. Try logging in.";
  }
  if (message.includes("auth/weak-password")) {
    return "Use a password with at least 6 characters.";
  }
  if (message.includes("auth/invalid-email")) {
    return "Enter a valid email address.";
  }
  if (message.includes("API 401")) {
    return "Your session has expired. Please log in again.";
  }
  if (message.includes("API 400")) {
    return "Check the task details and try again.";
  }

  return fallback;
}
