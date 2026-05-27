type TaskItemProps = {
  title: string;
};

export function TaskItem({ title }: TaskItemProps) {
  return (
    <div data-testid="task-item" className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold truncate">{title}</div>
            <div className="text-sm text-base-content/70 truncate">Example description</div>
          </div>

          <button data-testid="task-edit" type="button" className="btn btn-sm btn-outline">
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="form-control w-full sm:max-w-xs">
            <div className="label">
              <span className="label-text">Status</span>
            </div>
            <select
              data-testid="task-status"
              className="select select-bordered w-full"
              defaultValue="todo"
            >
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
          </label>

          <button data-testid="task-delete" type="button" className="btn btn-sm btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

