import { useState } from "react";
import { createTask } from "../api/tasks";
import { useAuth } from "../auth/AuthProvider";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";
import { SectionHeader } from "./SectionHeader";

type TaskComposerProps = {
  onAdd?: () => void;
  preview?: boolean;
  sectionId?: string;
  contained?: boolean;
  onCancel?: () => void;
  autoFocusTitle?: boolean;
};

export function TaskComposer({
  onAdd,
  preview = false,
  sectionId,
  contained = true,
  onCancel,
  autoFocusTitle = false,
}: TaskComposerProps) {
  const { idToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"general" | "personal" | "work" | "school" | "errands" | "health">("general");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!idToken || preview) return;

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await createTask(idToken, {
        title,
        description: description.trim() ? description : undefined,
        category,
        priority,
        dueDate: dueDate || null,
      });
      setTitle("");
      setDescription("");
      setCategory("general");
      setPriority("medium");
      setDueDate("");
      setSuccess("Task created successfully.");
      onAdd?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to create this task. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  const content = (
    <div className={`flex flex-col gap-5 ${contained ? "card-body p-5 sm:p-6" : ""}`}>
          <SectionHeader title="Create Task" badge={preview ? "Preview" : undefined} />
          <p className="-mt-3 text-sm text-base-content/70">Add a focused, actionable item to your list.</p>

          <FormField label="Title" helper={`${title.length}/120`} required>
            <input
              data-testid="task-title-input"
              className="input input-bordered w-full"
              type="text"
              placeholder="e.g., Buy milk"
              maxLength={120}
              autoFocus={autoFocusTitle}
              required
              value={title}
              disabled={preview}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormField>

          <FormField label="Description (optional)" helper={`${description.length}/500`}>
            <textarea
              data-testid="task-desc-input"
              className="textarea textarea-bordered w-full"
              placeholder="Add any details..."
              rows={3}
              maxLength={500}
              value={description}
              disabled={preview}
              onChange={(event) => setDescription(event.target.value)}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Category" required>
              <select
                className="select select-bordered w-full"
                value={category}
                disabled={preview}
                required
                onChange={(event) => setCategory(event.target.value as typeof category)}
              >
                <option value="general">General</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="errands">Errands</option>
                <option value="health">Health</option>
              </select>
            </FormField>

            <FormField label="Priority" required>
              <select
                className="select select-bordered w-full"
                value={priority}
                disabled={preview}
                required
                onChange={(event) => setPriority(event.target.value as typeof priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </FormField>
          </div>

          <FormField label="Due date (optional)">
            <input
              className="input input-bordered w-full"
              type="date"
              value={dueDate}
              disabled={preview}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </FormField>

          <div className={`flex gap-3 ${onCancel ? "flex-row-reverse" : ""}`}>
            <button
              data-testid="task-add"
              type="button"
              className={`btn btn-primary ${onCancel ? "" : "w-full"}`}
              disabled={preview || !idToken || loading || !title.trim()}
              onClick={handleAdd}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : null}
              {preview ? "Sign in to create tasks" : loading ? "Adding task..." : "Add Task"}
            </button>
            {onCancel ? (
              <button type="button" className="btn btn-ghost" disabled={loading} onClick={onCancel}>
                Cancel
              </button>
            ) : null}
          </div>

          {success ? <div role="status" className="alert alert-success text-sm">{success}</div> : null}
          {error ? <div role="alert" className="alert alert-error text-sm">{error}</div> : null}
    </div>
  );

  return (
    <section id={sectionId}>
      {contained ? <SectionCard className={preview ? "shadow-none" : "shadow-sm"}>{content}</SectionCard> : content}
    </section>
  );
}
