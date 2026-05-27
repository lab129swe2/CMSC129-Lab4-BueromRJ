import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function PublicNavbar() {
  return (
    <header className="border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="navbar mx-auto max-w-6xl px-4 sm:px-6" aria-label="Public navigation">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2 px-2 text-xl font-bold">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-7 text-primary" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3 3L22 4M2 12l5 5m1-9 4-4" />
            </svg>
            Taski
          </Link>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
