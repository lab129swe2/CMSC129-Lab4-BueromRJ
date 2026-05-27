import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../auth/firebase";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { FormField } from "./FormField";
import { PasswordInput } from "./PasswordInput";
import { SectionCard } from "./SectionCard";

type AuthCardProps = {
  onLogin?: () => void;
};

export function AuthCard({ onLogin }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      onLogin?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to sign in. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard className="shadow-lg">
      <div className="card-body gap-5 p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <h2 className="card-title justify-center text-2xl">Welcome Back</h2>
          <p className="text-sm text-base-content/70">Enter your details to access your task list.</p>
        </div>

        <FormField label="Email" required>
          <input
            data-testid="auth-email"
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
            data-testid="auth-password"
            className="input input-bordered w-full"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>

        {error ? (
          <div role="alert" className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        ) : null}

        <button
          data-testid="auth-login"
          type="button"
          className="btn btn-primary mt-2 w-full"
          disabled={submitting}
          onClick={handleLogin}
        >
          {submitting ? <span className="loading loading-spinner loading-sm" /> : null}
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex items-center justify-between gap-4 pt-2 text-sm">
          <p className="text-base-content/70">
            No account?{" "}
            <Link data-testid="auth-signup" to="/signup" className="link link-primary">
              Sign Up
            </Link>
          </p>
          <Link to="/forgot-password" className="link link-primary whitespace-nowrap">
            Forgot Password?
          </Link>
        </div>
      </div>
    </SectionCard>
  );
}
