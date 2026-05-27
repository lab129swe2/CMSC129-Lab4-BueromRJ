import { Link, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="min-h-dvh bg-base-200">
      <a className="sr-only focus:not-sr-only focus:btn focus:btn-primary" href="#main">
        Skip to content
      </a>

      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Task Manager
          </Link>
        </div>
        <div className="flex-none gap-2">
          <div className="badge badge-outline hidden sm:inline-flex">TDD</div>
        </div>
      </div>

      <div id="main">
        <Outlet />
      </div>
    </div>
  );
}

