import { useMemo, useState } from "react";
import type { Task } from "../api/tasks";
import { EmptyState } from "./EmptyState";
import { LoadErrorState } from "./LoadErrorState";
import { SectionHeader } from "./SectionHeader";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  title?: string;
  badge?: string;
  tasks?: Task[];
  loading?: boolean;
  error?: string | null;
  idToken?: string | null;
  onTaskChanged: () => void;
  onRetry?: () => void;
  preview?: boolean;
  emptyActionHref?: string;
  onCreateRequested?: () => void;
  archived?: boolean;
};

const previewTask: Task = {
  id: "example",
  title: "Prepare laboratory submission",
  status: "doing",
  priority: "medium",
  category: "school",
  description: "Verify test outputs and update documentation.",
};

export function TaskList({
  title,
  badge,
  tasks = [],
  loading = false,
  error = null,
  idToken,
  onTaskChanged,
  onRetry,
  preview = false,
  emptyActionHref,
  onCreateRequested,
  archived = false,
}: TaskListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | Task["status"]>("all");
  const [priority, setPriority] = useState<"all" | Task["priority"]>("all");
  const [sortBy, setSortBy] = useState<"newest" | "dueSoon" | "priority">("newest");
  const filteredTasks = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const query = search.trim().toLowerCase();
    return tasks
      .filter((task) => {
        const matchesSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          (task.description || "").toLowerCase().includes(query) ||
          (task.category || "general").toLowerCase().includes(query);
        const matchesStatus = status === "all" || task.status === status;
        const matchesPriority = priority === "all" || (task.priority || "medium") === priority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((first, second) => {
        if (sortBy === "priority") {
          const result =
            priorityOrder[first.priority || "medium"] - priorityOrder[second.priority || "medium"];
          return result || (second.createdAt || 0) - (first.createdAt || 0);
        }
        if (sortBy === "dueSoon") {
          const firstDate = first.dueDate || "9999-12-31";
          const secondDate = second.dueDate || "9999-12-31";
          return firstDate.localeCompare(secondDate) || (second.createdAt || 0) - (first.createdAt || 0);
        }
        return (second.createdAt || 0) - (first.createdAt || 0);
      });
  }, [priority, search, sortBy, status, tasks]);
  const filtersApplied = Boolean(search) || status !== "all" || priority !== "all";

  return (
    <section data-testid="task-list" className="flex flex-col gap-4" aria-label="Task list">
      <SectionHeader
        title={title || (preview ? "Task List" : "Your Tasks")}
        badge={badge || (archived ? "Stored safely" : "Newest first")}
      />

      {!preview ? (
        <div className="rounded-box border border-base-300 bg-base-100 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="input input-bordered input-sm flex items-center gap-2 sm:col-span-2">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 opacity-60" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.5-4.5m2-5a7 7 0 11-14 0 7 7 0 0114 0Z" />
              </svg>
              <input
                type="search"
                className="grow"
                aria-label={`Search ${archived ? "archived" : "active"} tasks`}
                placeholder="Search tasks"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            {!archived ? (
              <select className="select select-bordered select-sm w-full" aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                <option value="all">All statuses</option>
                <option value="todo">To Do</option>
                <option value="doing">In Progress</option>
                <option value="done">Completed</option>
              </select>
            ) : null}
            <select className="select select-bordered select-sm w-full" aria-label="Filter by priority" value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}>
              <option value="all">All priorities</option>
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <select className={`select select-bordered select-sm w-full ${archived ? "" : "sm:col-span-2"}`} aria-label="Sort tasks" value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
              <option value="newest">Newest first</option>
              <option value="dueSoon">Due date: soonest</option>
              <option value="priority">Priority: highest</option>
            </select>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading tasks">
          <p className="text-sm text-base-content/70">Loading your tasks...</p>
          {[1, 2].map((item) => (
            <div key={item} className="skeleton h-32 w-full" />
          ))}
        </div>
      ) : null}
      {!loading && error ? (
        <LoadErrorState
          title={archived ? "Archive unavailable" : "Your tasks will appear here"}
          message={
            archived
              ? "We could not sync your archived tasks right now. Try again to restore or permanently delete saved items."
              : "We could not sync your task list right now. Try again to check for existing tasks or begin creating new ones."
          }
          onRetry={onRetry}
        />
      ) : null}

      {!loading && preview ? <TaskItem task={previewTask} /> : null}

      {!loading && !error && idToken && !preview ? (
        filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} archived={archived} idToken={idToken} onTaskChanged={onTaskChanged} />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow={archived ? "Archive" : "Get started"}
            title={filtersApplied ? "No matching tasks" : archived ? "No archived tasks" : "No tasks yet"}
            description={
              filtersApplied
                ? "Try clearing or changing your filters to see more tasks."
                : archived
                ? "Archived tasks remain here until you restore them or permanently delete them."
                : "Plan your next action and watch your progress grow from here."
            }
            action={
              !filtersApplied && !archived && (onCreateRequested || emptyActionHref) ? (
                onCreateRequested ? (
                  <button type="button" className="btn btn-primary" onClick={onCreateRequested}>
                    Create your first task
                  </button>
                ) : (
                  <a className="btn btn-primary" href={emptyActionHref}>
                    Create your first task
                  </a>
                )
              ) : undefined
            }
          />
        )
      ) : null}
    </section>
  );
}
