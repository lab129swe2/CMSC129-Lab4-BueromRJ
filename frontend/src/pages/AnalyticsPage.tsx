import { Link } from "react-router-dom";
import { DonutChart } from "../components/DonutChart";
import { EmptyState } from "../components/EmptyState";
import { LoadErrorState } from "../components/LoadErrorState";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { useTasks } from "../hooks/useTasks";

export function AnalyticsPage() {
  const { tasks, loading, error, refresh } = useTasks();
  const total = tasks.length;
  const toDo = tasks.filter((task) => task.status === "todo").length;
  const inProgress = tasks.filter((task) => task.status === "doing").length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const lowPriority = tasks.filter((task) => (task.priority || "medium") === "low").length;
  const mediumPriority = tasks.filter((task) => (task.priority || "medium") === "medium").length;
  const highPriority = tasks.filter((task) => task.priority === "high").length;
  const statusSegments = [
    { label: "To Do", count: toDo, color: "var(--color-neutral)", dotClassName: "bg-neutral" },
    { label: "In Progress", count: inProgress, color: "var(--color-warning)", dotClassName: "bg-warning" },
    { label: "Completed", count: completed, color: "var(--color-success)", dotClassName: "bg-success" },
  ];
  const prioritySegments = [
    { label: "High", count: highPriority, color: "var(--color-error)", dotClassName: "bg-error" },
    { label: "Medium", count: mediumPriority, color: "var(--color-info)", dotClassName: "bg-info" },
    { label: "Low", count: lowPriority, color: "var(--color-base-300)", dotClassName: "bg-base-300" },
  ];

  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Analytics"
          description="Understand your progress from your real task activity."
        >
          <Link className="btn btn-outline btn-sm" to="/dashboard">Back to Dashboard</Link>
        </PageHeader>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="status" aria-label="Loading analytics">
            {[1, 2, 3, 4, 5].map((item) => <div key={item} className="skeleton h-28" />)}
          </div>
        ) : null}
        {!loading && error ? (
          <LoadErrorState
            title="Your insights will appear here"
            message="We could not sync your task data right now. Try again to view your progress summary."
            onRetry={() => void refresh()}
          />
        ) : null}

        {!loading && !error && total === 0 ? (
          <EmptyState
            variant="analytics"
            eyebrow="Insights are waiting"
            title="No analytics yet"
            description="Your progress summary will appear after you create tasks and start updating their status."
            action={<Link className="btn btn-primary" to="/dashboard">Create a Task</Link>}
          />
        ) : null}

        {!loading && !error && total > 0 ? (
          <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Analytics summary">
              <StatCard label="Total Tasks" value={total} accent="primary" />
              <StatCard label="To Do" value={toDo} />
              <StatCard label="In Progress" value={inProgress} accent="warning" />
              <StatCard label="Completed" value={completed} accent="success" />
              <StatCard label="Completion Rate" value={`${completionRate}%`} accent="success" />
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-2" aria-label="Task charts">
              <DonutChart
                title="Status Breakdown"
                description="Distribution of your active tasks by progress state."
                total={total}
                segments={statusSegments}
              />
              <DonutChart
                title="Priority Mix"
                description="How your active tasks are prioritized."
                total={total}
                segments={prioritySegments}
              />
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
