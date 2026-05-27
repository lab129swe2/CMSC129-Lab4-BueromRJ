import { AuthCard } from "../components/AuthCard";
import { TaskComposer } from "../components/TaskComposer";
import { TaskList } from "../components/TaskList";

export function HomePage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <section className="flex flex-col gap-6">
        <AuthCard />
        <TaskComposer />
      </section>

      <TaskList />
    </main>
  );
}

