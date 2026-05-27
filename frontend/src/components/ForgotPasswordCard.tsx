import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../auth/firebase";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleResetPassword() {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setSuccess("Password reset email sent. Check your inbox for next steps.");
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to send a reset email. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard className="shadow-lg">
      <div className="card-body gap-5 p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Reset Password</h1>
          <p className="text-sm text-base-content/70">Enter the email used for your account.</p>
        </div>

        <FormField label="Email" required>
          <input
            className="input input-bordered w-full"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>

        {success ? <div role="status" className="alert alert-success text-sm">{success}</div> : null}
        {error ? <div role="alert" className="alert alert-error text-sm">{error}</div> : null}

        <button type="button" className="btn btn-primary mt-2 w-full" disabled={submitting || !email.trim()} onClick={handleResetPassword}>
          {submitting ? <span className="loading loading-spinner loading-sm" /> : null}
          {submitting ? "Sending email..." : "Send Reset Link"}
        </button>

        <Link to="/" className="link link-primary text-center text-sm">
          Back to Sign In
        </Link>
      </div>
    </SectionCard>
  );
}
