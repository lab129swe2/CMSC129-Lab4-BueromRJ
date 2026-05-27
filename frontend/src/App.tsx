export function App() {
  return (
    <div className="min-h-dvh bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl">Task Manager</span>
        </div>
      </div>

      <main className="mx-auto max-w-3xl p-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h1 className="card-title">Phase 2 Baseline</h1>
            <p className="text-base-content/80">
              React + TailwindCSS + daisyUI is set up. UI and API wiring will be built
              via TDD in later commits.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

