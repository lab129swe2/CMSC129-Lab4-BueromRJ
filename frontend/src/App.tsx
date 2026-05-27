import { AuthCard } from "./components/AuthCard";
import { TaskComposer } from "./components/TaskComposer";
import { TaskList } from "./components/TaskList";

export function App() {
  return (
    <div className="min-h-dvh bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl">Task Manager</span>
        </div>
      </div>

      <main className="mx-auto grid max-w-5xl gap-6 p-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <AuthCard />
          <TaskComposer />
        </div>

        <TaskList />
      </main>
    </div>
  );
}
