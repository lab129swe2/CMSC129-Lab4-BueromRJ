import type { Task } from "../api/tasks";
import { EmptyState } from "./EmptyState";
import { LoadErrorState } from "./LoadErrorState";
import { SectionHeader } from "./SectionHeader";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks?: Task[];
  loading?: boolean;
  error?: string | null;
  idToken?: string | null;
  onTaskChanged: () => void;
  onRetry?: () => void;
  preview?: boolean;
  emptyActionHref?: string;
};

const previewTask: Task = {
  id: "example",
  title: "Prepare laboratory submission",
  status: "doing",
  description: "Verify test outputs and update documentation.",
};

export function TaskList({
  tasks = [],
  loading = false,
  error = null,
  idToken,
  onTaskChanged,
  onRetry,
  preview = false,
  emptyActionHref,
}: TaskListProps) {
  return (
    <section data-testid="task-list" className="flex flex-col gap-4" aria-label="Task list">
      <SectionHeader title={preview ? "Task List" : "Your Tasks"} badge="Newest first" />

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading tasks">
          <p className="text-sm text-base-content/70">Loading your tasks...</p>
          {[1, 2].map((item) => (
            <div key={item} className="skeleton h-32 w-full" />
          ))}
        </div>
      ) : null}
      {!loading && error ? (
        <LoadErrorState
          title="Your tasks will appear here"
          message="We could not sync your task list right now. Try again to check for existing tasks or begin creating new ones."
          onRetry={onRetry}
        />
      ) : null}

      {!loading && preview ? <TaskItem task={previewTask} /> : null}

      {!loading && !error && idToken && !preview ? (
        tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} idToken={idToken} onTaskChanged={onTaskChanged} />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="Get started"
            title="No tasks yet"
            description="Plan your next action and watch your progress grow from here."
            action={
              emptyActionHref ? (
                <a className="btn btn-primary" href={emptyActionHref}>
                  Create your first task
                </a>
              ) : undefined
            }
          />
        )
      ) : null}
    </section>
  );
}
