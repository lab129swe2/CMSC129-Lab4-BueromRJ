import type { Task } from "../api/tasks";

const statusDetails: Record<Task["status"], { label: string; className: string }> = {
  todo: { label: "To Do", className: "badge-neutral" },
  doing: { label: "In Progress", className: "badge-warning" },
  done: { label: "Completed", className: "badge-success" },
};

export function StatusBadge({ status }: { status: Task["status"] }) {
  const details = statusDetails[status];
  return <span className={`badge badge-sm ${details.className}`}>{details.label}</span>;
}

export function getStatusLabel(status: Task["status"]) {
  return statusDetails[status].label;
}
