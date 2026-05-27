import { AuthCard } from "../components/AuthCard";
import { TaskComposer } from "../components/TaskComposer";
import { TaskList } from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";

export function HomePage() {
  const { idToken, tasks, loading, error, refresh } = useTasks();

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <section className="flex flex-col gap-6">
        <AuthCard />
        <TaskComposer onAdd={() => void refresh()} />
      </section>

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        idToken={idToken}
        onTaskChanged={() => void refresh()}
        onRetry={() => void refresh()}
      />
    </main>
  );
}
