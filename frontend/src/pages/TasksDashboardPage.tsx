import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { TaskComposer } from "../components/TaskComposer";
import { TaskList } from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";

export function TasksDashboardPage() {
  const { idToken, tasks, loading, error, refresh } = useTasks();
  const inProgress = tasks.filter((task) => task.status === "doing").length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const summaryValue = (count: number) => (loading || error ? "-" : count);

  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Dashboard"
          description="Create, organize, and complete your daily tasks."
        />

        <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Task summary">
          <StatCard label="Total Tasks" value={summaryValue(tasks.length)} accent="primary" />
          <StatCard label="In Progress" value={summaryValue(inProgress)} accent="warning" />
          <StatCard label="Completed" value={summaryValue(completed)} accent="success" />
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(18rem,22rem)_1fr]">
          <div className="h-fit md:sticky md:top-24">
            <TaskComposer sectionId="create-task" onAdd={() => void refresh()} />
          </div>

          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            idToken={idToken}
            emptyActionHref="#create-task"
            onTaskChanged={() => void refresh()}
            onRetry={() => void refresh()}
          />
        </div>
      </div>
    </main>
  );
}
