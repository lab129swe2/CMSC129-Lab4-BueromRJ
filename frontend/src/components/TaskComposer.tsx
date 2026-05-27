import { FormField } from "./FormField";

type TaskComposerProps = {
  onAdd?: () => void;
};

export function TaskComposer({ onAdd }: TaskComposerProps) {
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
          />
        </FormField>

        <FormField label="Description (optional)">
          <textarea
            data-testid="task-desc-input"
            className="textarea textarea-bordered w-full"
            placeholder="Details..."
            rows={3}
            maxLength={500}
          />
        </FormField>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-base-content/60">Tip: keep titles short and clear.</span>
          <button
            data-testid="task-add"
            type="button"
            className="btn btn-primary"
            onClick={onAdd}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
