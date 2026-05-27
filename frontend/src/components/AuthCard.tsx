import { FormField } from "./FormField";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../auth/firebase";

type AuthCardProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export function AuthCard({ onLogin, onSignup }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      onSignup?.();
    } catch (e) {
      setError(String((e as any)?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      onLogin?.();
    } catch (e) {
      setError(String((e as any)?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="card-title">Account</h2>
          <span className="badge badge-ghost">Email/Password</span>
        </div>

        <FormField label="Email">
          <input
            data-testid="auth-email"
            className="input input-bordered w-full"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>

        <FormField label="Password">
          <input
            data-testid="auth-password"
            className="input input-bordered w-full"
            type="password"
            placeholder="********"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            data-testid="auth-signup"
            type="button"
            className="btn btn-primary flex-1"
            disabled={loading}
            onClick={handleSignup}
          >
            Sign up
          </button>
          <button
            data-testid="auth-login"
            type="button"
            className="btn btn-outline flex-1"
            disabled={loading}
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>

        {error ? <div className="alert alert-error text-sm">{error}</div> : null}
      </div>
    </div>
  );
}
