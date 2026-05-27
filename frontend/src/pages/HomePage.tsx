import { useState } from "react";
import { AuthCard } from "../components/AuthCard";
import { TaskComposer } from "../components/TaskComposer";
import { TaskList } from "../components/TaskList";

export function HomePage() {
  const [refreshVersion, setRefreshVersion] = useState(0);

  function refreshTasks() {
    setRefreshVersion((current) => current + 1);
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <section className="flex flex-col gap-6">
        <AuthCard />
        <TaskComposer onAdd={refreshTasks} />
      </section>

      <TaskList refreshVersion={refreshVersion} onTaskChanged={refreshTasks} />
    </main>
  );
}
