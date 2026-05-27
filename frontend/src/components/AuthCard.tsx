import { FormField } from "./FormField";

type AuthCardProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export function AuthCard({ onLogin, onSignup }: AuthCardProps) {
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
          />
        </FormField>

        <FormField label="Password">
          <input
            data-testid="auth-password"
            className="input input-bordered w-full"
            type="password"
            placeholder="********"
            autoComplete="current-password"
          />
        </FormField>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            data-testid="auth-signup"
            type="button"
            className="btn btn-primary flex-1"
            onClick={onSignup}
          >
            Sign up
          </button>
          <button
            data-testid="auth-login"
            type="button"
            className="btn btn-outline flex-1"
            onClick={onLogin}
          >
            Log in
          </button>
        </div>

        <p className="text-sm text-base-content/70">
          UI-only for now. Firebase auth wiring comes in later commits.
        </p>
      </div>
    </div>
  );
}
