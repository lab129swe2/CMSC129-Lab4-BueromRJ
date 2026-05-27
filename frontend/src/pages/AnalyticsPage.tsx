import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { LoadErrorState } from "../components/LoadErrorState";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { StatCard } from "../components/StatCard";
import { useTasks } from "../hooks/useTasks";

export function AnalyticsPage() {
  const { tasks, loading, error, refresh } = useTasks();
  const total = tasks.length;
  const toDo = tasks.filter((task) => task.status === "todo").length;
  const inProgress = tasks.filter((task) => task.status === "doing").length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const breakdown = [
    { label: "To Do", count: toDo, color: "progress-neutral" },
    { label: "In Progress", count: inProgress, color: "progress-warning" },
    { label: "Completed", count: completed, color: "progress-success" },
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

            <SectionCard className="mt-6">
              <div className="card-body gap-6 p-5 sm:p-6">
                <div>
                  <h2 className="text-xl font-semibold">Status Breakdown</h2>
                  <p className="mt-1 text-sm text-base-content/70">Distribution of your current tasks by progress state.</p>
                </div>
                <div className="space-y-5">
                  {breakdown.map(({ label, count, color }) => {
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <div key={label}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-medium">{label}</span>
                          <span className="text-base-content/70">{count} tasks ({percentage}%)</span>
                        </div>
                        <progress
                          className={`progress w-full ${color}`}
                          value={percentage}
                          max={100}
                          aria-label={`${label}: ${percentage}%`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>
          </>
        ) : null}
      </div>
    </main>
  );
}
