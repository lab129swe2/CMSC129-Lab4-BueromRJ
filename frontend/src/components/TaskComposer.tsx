import { FormField } from "./FormField";
import { useState } from "react";
import { createTask } from "../api/tasks";
import { useAuth } from "../auth/AuthProvider";

type TaskComposerProps = {
  onAdd?: () => void;
};

export function TaskComposer({ onAdd }: TaskComposerProps) {
  const { idToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!idToken) {
      setError("Please log in first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createTask(idToken, {
        title,
        description: description.trim() ? description : undefined,
      });
      setTitle("");
      setDescription("");
      onAdd?.();
    } catch (e) {
      setError(String((e as any)?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="card-title">New Task</h2>
          <span className="badge badge-outline">Newest first</span>
        </div>

        <FormField label="Title">
          <input
            data-testid="task-title-input"
            className="input input-bordered w-full"
            type="text"
            placeholder="e.g., Buy milk"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>

        <FormField label="Description (optional)">
          <textarea
            data-testid="task-desc-input"
            className="textarea textarea-bordered w-full"
            placeholder="Details..."
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-base-content/60">Tip: keep titles short and clear.</span>
          <button
            data-testid="task-add"
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={handleAdd}
          >
            Add Task
          </button>
        </div>

        {error ? <div className="alert alert-error text-sm">{error}</div> : null}
      </div>
    </div>
  );
}
