import { useEffect, useState } from "react";
import { deleteTask, type Task, updateTask } from "../api/tasks";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { ConfirmDialog } from "./ConfirmDialog";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";
import { getStatusLabel, StatusBadge } from "./StatusBadge";

type TaskItemProps = {
  task: Task;
  idToken?: string;
  onTaskChanged?: () => void;
};

function formatTimestamp(timestamp?: number) {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(timestamp));
}

export function TaskItem({ task, idToken, onTaskChanged }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
    setStatus(task.status);
  }, [isEditing, task.description, task.status, task.title]);

  async function saveEdit() {
    if (!idToken || !title.trim()) return;

    setError(null);
    setFeedback(null);
    setPending(true);
    try {
      await updateTask(idToken, task.id, { title, description });
      setIsEditing(false);
      setFeedback("Task updated.");
      onTaskChanged?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to update this task. Please try again."));
    } finally {
      setPending(false);
    }
  }

  async function changeStatus(nextStatus: Task["status"]) {
    const previousStatus = status;
    setStatus(nextStatus);
    if (!idToken) return;

    setError(null);
    setFeedback(null);
    setPending(true);
    try {
      await updateTask(idToken, task.id, { status: nextStatus });
      setFeedback(`Status changed to ${getStatusLabel(nextStatus)}.`);
      onTaskChanged?.();
    } catch (caught) {
      setStatus(previousStatus);
      setError(getFriendlyErrorMessage(caught, "Unable to change the status. Please try again."));
    } finally {
      setPending(false);
    }
  }

  async function removeTask() {
    if (!idToken) return;

    setError(null);
    setFeedback(null);
    setPending(true);
    try {
      await deleteTask(idToken, task.id);
      setConfirmingDelete(false);
      onTaskChanged?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to delete this task. Please try again."));
      setPending(false);
      setConfirmingDelete(false);
    }
  }

  const date = formatTimestamp(task.updatedAt || task.createdAt);
  const completed = status === "done";

  return (
    <>
      <SectionCard>
        <article data-testid="task-item" className="card-body gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="rounded-box border border-primary/30 bg-primary/5 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Editing task</p>
                  <div className="flex flex-col gap-3">
                    <FormField label="Title" helper={`${title.length}/120`} required>
                      <input
                        className="input input-bordered input-sm w-full"
                        value={title}
                        maxLength={120}
                        required
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </FormField>
                    <FormField label="Description (optional)" helper={`${description.length}/500`}>
                      <textarea
                        className="textarea textarea-bordered textarea-sm w-full"
                        value={description}
                        maxLength={500}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 title={task.title} className={`font-semibold ${completed ? "text-base-content/60 line-through" : ""}`}>
                      {task.title}
                    </h3>
                    <StatusBadge status={status} />
                  </div>
                  <p title={task.description} className="mt-1 text-sm text-base-content/70">
                    {task.description || "No description added."}
                  </p>
                  {date ? <p className="mt-2 text-xs text-base-content/60">Updated {date}</p> : null}
                </>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary btn-sm" disabled={pending || !title.trim()} onClick={() => void saveEdit()}>
                  {pending ? <span className="loading loading-spinner loading-xs" /> : null}
                  Save
                </button>
              </div>
            ) : (
              <button
                data-testid="task-edit"
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={!idToken || pending}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-base-300 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <FormField label="Status" required>
              <select
                data-testid="task-status"
                aria-label="Task status"
                className="select select-bordered select-sm w-full sm:w-44"
                value={status}
                required
                disabled={!idToken || pending}
                onChange={(event) => void changeStatus(event.target.value as Task["status"])}
              >
                <option value="todo">To Do</option>
                <option value="doing">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </FormField>

            <button
              data-testid="task-delete"
              type="button"
              className="btn btn-ghost btn-sm text-error hover:bg-error/10"
              disabled={!idToken || pending}
              onClick={() => setConfirmingDelete(true)}
            >
              Delete
            </button>
          </div>

          {feedback ? <div role="status" className="alert alert-success text-sm">{feedback}</div> : null}
          {error ? <div role="alert" className="alert alert-error text-sm">{error}</div> : null}
        </article>
      </SectionCard>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this task?"
        description="This action cannot be undone. The task will be permanently removed."
        pending={pending}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => void removeTask()}
      />
    </>
  );
}
