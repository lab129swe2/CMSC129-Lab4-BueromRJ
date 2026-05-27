import { apiFetch } from "./client";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
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

