import { useEffect, useState } from "react";
import { archiveTask, purgeTask, restoreTask, type Task, updateTask } from "../api/tasks";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { ConfirmDialog } from "./ConfirmDialog";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";
import { getStatusLabel, StatusBadge } from "./StatusBadge";

type TaskItemProps = {
  task: Task;
  archived?: boolean;
  idToken?: string;
  onTaskChanged?: () => void;
};

const categoryLabels: Record<Task["category"], string> = {
  general: "General",
  personal: "Personal",
  work: "Work",
  school: "School",
  errands: "Errands",
  health: "Health",
};

const priorityDetails: Record<Task["priority"], { label: string; className: string }> = {
  low: { label: "Low priority", className: "badge-ghost" },
  medium: { label: "Medium priority", className: "badge-info badge-soft" },
  high: { label: "High priority", className: "badge-error badge-soft" },
};

function formatTimestamp(timestamp?: number) {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(timestamp));
}

function formatDueDate(dueDate?: string | null) {
  if (!dueDate) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(`${dueDate}T00:00:00`),
  );
}

export function TaskItem({ task, archived = false, idToken, onTaskChanged }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmation, setConfirmation] = useState<"archive" | "purge" | null>(null);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [category, setCategory] = useState<Task["category"]>(task.category || "general");
  const [priority, setPriority] = useState<Task["priority"]>(task.priority || "medium");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategory(task.category || "general");
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate || "");
    }
    setStatus(task.status);
  }, [isEditing, task.category, task.description, task.dueDate, task.priority, task.status, task.title]);

  async function saveEdit() {
    if (!idToken || !title.trim()) return;
    setError(null);
    setFeedback(null);
    setPending(true);
    try {
      await updateTask(idToken, task.id, { title, description, category, priority, dueDate: dueDate || null });
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

  async function archive() {
    if (!idToken) return;
    setPending(true);
    setError(null);
    try {
      await archiveTask(idToken, task.id);
      setConfirmation(null);
      onTaskChanged?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to archive this task. Please try again."));
      setPending(false);
      setConfirmation(null);
    }
  }

  async function restore() {
    if (!idToken) return;
    setPending(true);
    setError(null);
    try {
      await restoreTask(idToken, task.id);
      onTaskChanged?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to restore this task. Please try again."));
      setPending(false);
    }
  }

  async function purge() {
    if (!idToken) return;
    setPending(true);
    setError(null);
    try {
      await purgeTask(idToken, task.id);
      setConfirmation(null);
      onTaskChanged?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to permanently delete this task. Please try again."));
      setPending(false);
      setConfirmation(null);
    }
  }

  const date = formatTimestamp(task.updatedAt || task.createdAt);
  const due = formatDueDate(task.dueDate);
  const completed = status === "done";
  const taskCategory = categoryLabels[task.category || "general"];
  const taskPriority = priorityDetails[task.priority || "medium"];

  return (
    <>
      <SectionCard>
        <article data-testid="task-item" className={`card-body gap-4 p-5 ${archived ? "opacity-80" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="rounded-box border border-primary/30 bg-primary/5 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Editing task</p>
                  <div className="flex flex-col gap-3">
                    <FormField label="Title" helper={`${title.length}/120`} required>
                      <input className="input input-bordered input-sm w-full" value={title} maxLength={120} required onChange={(event) => setTitle(event.target.value)} />
                    </FormField>
                    <FormField label="Description (optional)" helper={`${description.length}/500`}>
                      <textarea className="textarea textarea-bordered textarea-sm w-full" value={description} maxLength={500} onChange={(event) => setDescription(event.target.value)} />
                    </FormField>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField label="Category" required>
                        <select className="select select-bordered select-sm w-full" value={category} onChange={(event) => setCategory(event.target.value as Task["category"])}>
                          <option value="general">General</option><option value="personal">Personal</option><option value="work">Work</option><option value="school">School</option><option value="errands">Errands</option><option value="health">Health</option>
                        </select>
                      </FormField>
                      <FormField label="Priority" required>
                        <select className="select select-bordered select-sm w-full" value={priority} onChange={(event) => setPriority(event.target.value as Task["priority"])}>
                          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                        </select>
                      </FormField>
                    </div>
                    <FormField label="Due date (optional)">
                      <input className="input input-bordered input-sm w-full" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                    </FormField>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 title={task.title} className={`font-semibold ${completed ? "text-base-content/60 line-through" : ""}`}>{task.title}</h3>
                    {archived ? <span className="badge badge-neutral badge-sm">Archived</span> : <StatusBadge status={status} />}
                    <span className={`badge badge-sm ${taskPriority.className}`}>{taskPriority.label}</span>
                    <span className="badge badge-outline badge-sm">{taskCategory}</span>
                  </div>
                  <p title={task.description} className="mt-2 text-sm text-base-content/70">{task.description || "No description added."}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-base-content/60">
                    {due ? <span className={task.dueDate && !completed && task.dueDate < new Date().toISOString().slice(0, 10) ? "text-error" : ""}>Due {due}</span> : null}
                    {date ? <span>Updated {date}</span> : null}
                  </div>
                </>
              )}
            </div>

            {!archived && (isEditing ? (
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="button" className="btn btn-primary btn-sm" disabled={pending || !title.trim()} onClick={() => void saveEdit()}>{pending ? <span className="loading loading-spinner loading-xs" /> : null}Save</button>
              </div>
            ) : (
              <button data-testid="task-edit" type="button" className="btn btn-ghost btn-sm" disabled={!idToken || pending} onClick={() => setIsEditing(true)}>Edit</button>
            ))}
          </div>

          {!archived ? (
            <div className="flex flex-col gap-3 border-t border-base-300 pt-4 sm:flex-row sm:items-end sm:justify-between">
              <FormField label="Status" required>
                <select data-testid="task-status" aria-label="Task status" className="select select-bordered select-sm w-full sm:w-44" value={status} required disabled={!idToken || pending} onChange={(event) => void changeStatus(event.target.value as Task["status"])}>
                  <option value="todo">To Do</option><option value="doing">In Progress</option><option value="done">Completed</option>
                </select>
              </FormField>
              <button data-testid="task-delete" type="button" className="btn btn-ghost btn-sm text-warning hover:bg-warning/10" disabled={!idToken || pending} onClick={() => setConfirmation("archive")}>Archive</button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-2 border-t border-base-300 pt-4">
              <button type="button" className="btn btn-outline btn-sm" disabled={!idToken || pending} onClick={() => void restore()}>Restore</button>
              <button type="button" className="btn btn-ghost btn-sm text-error hover:bg-error/10" disabled={!idToken || pending} onClick={() => setConfirmation("purge")}>Permanently Delete</button>
            </div>
          )}

          {feedback ? <div role="status" className="alert alert-success text-sm">{feedback}</div> : null}
          {error ? <div role="alert" className="alert alert-error text-sm">{error}</div> : null}
        </article>
      </SectionCard>

      <ConfirmDialog
        open={confirmation === "archive"}
        title="Archive this task?"
        description="The task will be removed from your active list. You can restore it later from the archive."
        confirmLabel="Archive"
        confirmClassName="btn-warning"
        pending={pending}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => void archive()}
      />
      <ConfirmDialog
        open={confirmation === "purge"}
        title="Permanently delete this task?"
        description="This task will be removed permanently and cannot be restored."
        confirmLabel="Delete Permanently"
        pending={pending}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => void purge()}
      />
    </>
  );
}
