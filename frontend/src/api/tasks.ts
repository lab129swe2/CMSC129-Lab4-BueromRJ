import { apiFetch } from "./client";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  category: "general" | "personal" | "work" | "school" | "errands" | "health";
  priority: "low" | "medium" | "high";
  dueDate?: string | null;
  archivedAt?: number | null;
  createdAt?: number;
  updatedAt?: number;
};

export async function listTasks(idToken: string, options: { archived?: boolean } = {}) {
  const path = options.archived ? "/api/tasks?archived=true" : "/api/tasks";
  return apiFetch(path, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }) as Promise<Task[]>;
}

export async function createTask(
  idToken: string,
  body: {
    title: string;
    description?: string;
    category: Task["category"];
    priority: Task["priority"];
    dueDate?: string | null;
  },
) {
  return apiFetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  }) as Promise<Task>;
}

export async function updateTask(
  idToken: string,
  taskId: string,
  patch: Partial<Pick<Task, "title" | "description" | "status" | "category" | "priority" | "dueDate">>,
) {
  return apiFetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(patch),
  }) as Promise<Task>;
}

export async function archiveTask(idToken: string, taskId: string) {
  await apiFetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function restoreTask(idToken: string, taskId: string) {
  return apiFetch(`/api/tasks/${taskId}/restore`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }) as Promise<Task>;
}

export async function purgeTask(idToken: string, taskId: string) {
  await apiFetch(`/api/tasks/${taskId}/permanent`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}
