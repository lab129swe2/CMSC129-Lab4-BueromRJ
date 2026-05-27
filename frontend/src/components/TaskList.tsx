import { TaskItem } from "./TaskItem";

export function TaskList() {
  return (
    <section data-testid="task-list" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <div className="text-sm text-base-content/70">Newest first</div>
      </div>

      <div className="flex flex-col gap-3">
        <TaskItem title="Example task" />
      </div>
    </section>
  );
}

