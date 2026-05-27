import { NavLink } from "react-router-dom";
import type { User } from "firebase/auth";
import { useTheme } from "../auth/ThemeProvider";
import { Avatar, getUserLabel } from "./Avatar";

type AccountMenuProps = {
  user: User | null;
  onLogout: () => void;
};

function menuLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "active font-medium" : "";
}

export function AccountMenu({ user, onLogout }: AccountMenuProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <button type="button" tabIndex={0} className="btn btn-ghost gap-2 px-2" aria-haspopup="menu" aria-label="Open account menu">
        <Avatar user={user} size="sm" />
        <span className="hidden max-w-32 truncate text-sm font-medium sm:block">{getUserLabel(user)}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="hidden size-4 sm:block" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul tabIndex={0} role="menu" className="menu dropdown-content z-[60] mt-2 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
        <li className="pointer-events-none mb-1 border-b border-base-300 px-3 pb-3 pt-2">
          <span className="block truncate p-0 font-semibold">{user?.displayName || "Taski user"}</span>
          <span className="block truncate p-0 text-xs text-base-content/60" title={user?.email || undefined}>{user?.email}</span>
        </li>
        <li><NavLink to="/dashboard" className={menuLinkClass}>Dashboard</NavLink></li>
        <li><NavLink to="/analytics" className={menuLinkClass}>Analytics</NavLink></li>
        <li><NavLink to="/profile" className={menuLinkClass}>Profile Settings</NavLink></li>
        <li>
          <button type="button" onClick={toggleTheme}>
            Switch to {theme === "light" ? "dark" : "light"} mode
          </button>
        </li>
        <li className="mt-1 border-t border-base-300 pt-1">
          <button type="button" className="text-error" onClick={onLogout}>
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
}
