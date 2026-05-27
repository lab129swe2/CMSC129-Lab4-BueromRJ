import { useState } from "react";
import { deleteTask, type Task, updateTask } from "../api/tasks";

type TaskItemProps = {
  task: Task;
  idToken?: string;
  onTaskChanged?: () => void;
};

export function TaskItem({ task, idToken, onTaskChanged }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveEdit() {
    if (!idToken) return;

    setError(null);
    setPending(true);
    try {
      await updateTask(idToken, task.id, { title, description });
      setIsEditing(false);
      onTaskChanged?.();
    } catch (caught) {
      setError(String((caught as Error).message || caught));
    } finally {
      setPending(false);
    }
  }

  async function changeStatus(nextStatus: Task["status"]) {
    setStatus(nextStatus);
    if (!idToken) return;

    setError(null);
    setPending(true);
    try {
      await updateTask(idToken, task.id, { status: nextStatus });
      onTaskChanged?.();
    } catch (caught) {
      setStatus(task.status);
      setError(String((caught as Error).message || caught));
    } finally {
      setPending(false);
    }
  }

  async function removeTask() {
    if (!idToken || !window.confirm("Delete this task?")) return;

    setError(null);
    setPending(true);
    try {
      await deleteTask(idToken, task.id);
      onTaskChanged?.();
    } catch (caught) {
      setError(String((caught as Error).message || caught));
      setPending(false);
    }
  }

  return (
    <div data-testid="task-item" className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  className="input input-bordered input-sm w-full"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <textarea
                  className="textarea textarea-bordered textarea-sm w-full"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="truncate font-semibold">{task.title}</div>
                <div className="truncate text-sm text-base-content/70">
                  {task.description || "No description"}
                </div>
              </>
            )}
          </div>

          {isEditing ? (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              disabled={pending}
              onClick={() => void saveEdit()}
            >
              Save
            </button>
          ) : (
            <button
              data-testid="task-edit"
              type="button"
              className="btn btn-sm btn-outline"
              disabled={!idToken || pending}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="form-control w-full sm:max-w-xs">
            <div className="label">
              <span className="label-text">Status</span>
            </div>
            <select
              data-testid="task-status"
              className="select select-bordered w-full"
              value={status}
              disabled={!idToken || pending}
              onChange={(event) => void changeStatus(event.target.value as Task["status"])}
            >
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
          </label>

          <button
            data-testid="task-delete"
            type="button"
            className="btn btn-sm btn-error"
            disabled={!idToken || pending}
            onClick={() => void removeTask()}
          >
            Delete
          </button>
        </div>

        {error ? <div className="alert alert-error text-sm">{error}</div> : null}
      </div>
    </div>
  );
}
