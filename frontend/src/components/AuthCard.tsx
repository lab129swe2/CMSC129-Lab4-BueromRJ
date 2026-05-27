type AuthCardProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export function AuthCard({ onLogin, onSignup }: AuthCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <h2 className="card-title">Account</h2>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            data-testid="auth-email"
            className="input input-bordered w-full"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            data-testid="auth-password"
            className="input input-bordered w-full"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
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
      </div>
    </div>
  );
}

