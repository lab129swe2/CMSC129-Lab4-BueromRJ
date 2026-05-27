type TaskComposerProps = {
  onAdd?: () => void;
};

export function TaskComposer({ onAdd }: TaskComposerProps) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <h2 className="card-title">New Task</h2>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <input
            data-testid="task-title-input"
            className="input input-bordered w-full"
            type="text"
            placeholder="e.g., Buy milk"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Description (optional)</span>
          </div>
          <textarea
            data-testid="task-desc-input"
            className="textarea textarea-bordered w-full"
            placeholder="Details..."
            rows={3}
          />
        </label>

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
  );
}

