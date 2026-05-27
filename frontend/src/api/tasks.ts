import { apiFetch } from "./client";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  createdAt?: number;
  updatedAt?: number;
};

export async function listTasks(idToken: string) {
  return apiFetch("/api/tasks", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }) as Promise<Task[]>;
}

export async function createTask(
  idToken: string,
  body: { title: string; description?: string },
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
  patch: Partial<Pick<Task, "title" | "description" | "status">>,
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

export async function deleteTask(idToken: string, taskId: string) {
  await apiFetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}
