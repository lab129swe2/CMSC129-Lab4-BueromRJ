import { useState } from "react";
import { CreateTaskDialog } from "../components/CreateTaskDialog";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { TaskList } from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";

export function TasksDashboardPage() {
  const { idToken, tasks, loading, error, refresh } = useTasks();
  const archivedTasksState = useTasks({ archived: true });
  const [creatingTask, setCreatingTask] = useState(false);
  const inProgress = tasks.filter((task) => task.status === "doing").length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const summaryValue = (count: number) => (loading || error ? "-" : count);

  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Dashboard"
          description="Create, organize, and complete your daily tasks."
        >
          <button type="button" className="btn btn-primary" onClick={() => setCreatingTask(true)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14" />
            </svg>
            Create Task
          </button>
        </PageHeader>

        <section className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Task summary">
          <StatCard label="Total Tasks" value={summaryValue(tasks.length)} accent="primary" />
          <StatCard label="In Progress" value={summaryValue(inProgress)} accent="warning" />
          <StatCard label="Completed" value={summaryValue(completed)} accent="success" />
          <StatCard
            label="Archived"
            value={archivedTasksState.loading || archivedTasksState.error ? "-" : archivedTasksState.tasks.length}
          />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            idToken={idToken}
            onCreateRequested={() => setCreatingTask(true)}
            onTaskChanged={() => {
              void refresh();
              void archivedTasksState.refresh();
            }}
            onRetry={() => void refresh()}
          />

          <TaskList
            title="Archive"
            badge="Soft deleted"
            archived
            tasks={archivedTasksState.tasks}
            loading={archivedTasksState.loading}
            error={archivedTasksState.error}
            idToken={archivedTasksState.idToken}
            onTaskChanged={() => {
              void refresh();
              void archivedTasksState.refresh();
            }}
            onRetry={() => void archivedTasksState.refresh()}
          />
        </div>
      </div>

      <CreateTaskDialog
        open={creatingTask}
        onClose={() => setCreatingTask(false)}
        onCreated={() => void refresh()}
      />
    </main>
  );
}
