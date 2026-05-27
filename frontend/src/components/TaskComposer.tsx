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
};

export function TaskComposer({ onAdd, preview = false, sectionId }: TaskComposerProps) {
  const { idToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      });
      setTitle("");
      setDescription("");
      setSuccess("Task created successfully.");
      onAdd?.();
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to create this task. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id={sectionId}>
      <SectionCard className={preview ? "shadow-none" : "shadow-sm"}>
        <div className="card-body gap-5 p-5 sm:p-6">
          <SectionHeader title="Create Task" badge={preview ? "Preview" : undefined} />
          <p className="-mt-3 text-sm text-base-content/70">Add a focused, actionable item to your list.</p>

          <FormField label="Title" helper={`${title.length}/120`} required>
            <input
              data-testid="task-title-input"
              className="input input-bordered w-full"
              type="text"
              placeholder="e.g., Buy milk"
              maxLength={120}
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

          <button
            data-testid="task-add"
            type="button"
            className="btn btn-primary w-full"
            disabled={preview || !idToken || loading || !title.trim()}
            onClick={handleAdd}
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : null}
            {preview ? "Sign in to create tasks" : loading ? "Adding task..." : "Add Task"}
          </button>

          {success ? <div role="status" className="alert alert-success text-sm">{success}</div> : null}
          {error ? <div role="alert" className="alert alert-error text-sm">{error}</div> : null}
        </div>
      </SectionCard>
    </section>
  );
}
