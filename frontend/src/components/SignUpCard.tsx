import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../auth/firebase";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { FormField } from "./FormField";
import { PasswordInput } from "./PasswordInput";
import { SectionCard } from "./SectionCard";

export function SignUpCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup() {
    if (!name.trim()) {
      setError("Enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(credential.user, { displayName: name.trim() });
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to create your account. Please try again."));
      setSubmitting(false);
    }
  }

  return (
    <SectionCard className="shadow-lg">
      <div className="card-body gap-5 p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-sm text-base-content/70">Start organizing your tasks in one place.</p>
        </div>

        <FormField label="Full Name" required>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Rei Jansen Buerom"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>
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
        <FormField label="Password" required>
          <PasswordInput
            className="input input-bordered w-full"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
        <FormField label="Confirm Password" required>
          <PasswordInput
            className="input input-bordered w-full"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </FormField>

        {error ? <div role="alert" className="alert alert-error text-sm">{error}</div> : null}

        <button type="button" className="btn btn-primary mt-2 w-full" disabled={submitting} onClick={handleSignup}>
          {submitting ? <span className="loading loading-spinner loading-sm" /> : null}
          {submitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link to="/" className="link link-primary">
            Sign In
          </Link>
        </p>
      </div>
    </SectionCard>
  );
}
