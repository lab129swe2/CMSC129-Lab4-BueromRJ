import { useEffect, useState } from "react";
import { listTasks, type Task } from "../api/tasks";
import { useAuth } from "../auth/AuthProvider";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const { idToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!idToken) return;
    setError(null);
    setLoading(true);
    try {
      const result = await listTasks(idToken);
      setTasks(result);
    } catch (e) {
      setError(String((e as any)?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToken]);

  return (
    <section data-testid="task-list" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <div className="text-sm text-base-content/70">Newest first</div>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? <div className="text-sm text-base-content/70">Loading…</div> : null}
        {error ? <div className="alert alert-error text-sm">{error}</div> : null}

        {idToken ? (
          tasks.length > 0 ? (
            tasks.map((t) => <TaskItem key={t.id} title={t.title} />)
          ) : (
            <div className="text-sm text-base-content/70">No tasks yet.</div>
          )
        ) : (
          <TaskItem title="Example task" />
        )}
      </div>
    </section>
  );
}
