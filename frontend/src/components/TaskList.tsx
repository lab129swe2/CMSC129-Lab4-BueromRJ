import { useEffect, useState } from "react";
import { listTasks, type Task } from "../api/tasks";
import { useAuth } from "../auth/AuthProvider";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  refreshVersion: number;
  onTaskChanged: () => void;
};

export function TaskList({ refreshVersion, onTaskChanged }: TaskListProps) {
  const { idToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idToken) {
      setTasks([]);
      return;
    }

    async function refresh() {
      setError(null);
      setLoading(true);
      try {
        setTasks(await listTasks(idToken));
      } catch (caught) {
        setError(String((caught as Error).message || caught));
      } finally {
        setLoading(false);
      }
    }

    void refresh();
  }, [idToken, refreshVersion]);

  return (
    <section data-testid="task-list" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <div className="text-sm text-base-content/70">Newest first</div>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? <div className="text-sm text-base-content/70">Loading...</div> : null}
        {error ? <div className="alert alert-error text-sm">{error}</div> : null}

        {idToken ? (
          tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                idToken={idToken}
                onTaskChanged={onTaskChanged}
              />
            ))
          ) : (
            <div className="text-sm text-base-content/70">No tasks yet.</div>
          )
        ) : (
          <TaskItem
            task={{
              id: "example",
              title: "Example task",
              status: "todo",
              description: "Example description",
            }}
          />
        )}
      </div>
    </section>
  );
}
