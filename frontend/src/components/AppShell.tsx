import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { firebaseAuth } from "../auth/firebase";
import { AccountMenu } from "./AccountMenu";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";

export function AppShell() {
  const { user } = useAuth();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await firebaseAuth.signOut();
    } finally {
      setLoggingOut(false);
      setConfirmingLogout(false);
    }
  }

  return (
    <div className="min-h-dvh bg-base-200">
      <a className="sr-only focus:not-sr-only focus:btn focus:btn-primary" href="#main">
        Skip to content
      </a>

      <header className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur sm:px-6">
        <div className="flex-1">
          <Link to="/dashboard" className="btn btn-ghost gap-2 px-2 text-xl font-bold">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6 text-primary" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3 3L22 4M2 12l5 5m1-9 4-4" />
            </svg>
            Taski
          </Link>
        </div>
        <div className="flex-none items-center gap-2">
          <span className="badge badge-outline hidden sm:inline-flex">TDD Lab</span>
          <AccountMenu user={user} onLogout={() => setConfirmingLogout(true)} />
        </div>
      </header>

      <div id="main">
        <Outlet />
      </div>

      <LogoutConfirmDialog
        open={confirmingLogout}
        pending={loggingOut}
        onCancel={() => setConfirmingLogout(false)}
        onConfirm={() => void handleLogout()}
      />
    </div>
  );
}
