const ALLOWED_STATUSES = new Set(["todo", "doing", "done"]);

function normalizeCreateTask(input) {
  const rawTitle = input?.title;
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  if (!title) {
    throw new Error("Title is required");
  }

  const rawStatus = input?.status;
  const status = rawStatus == null ? "todo" : rawStatus;
  if (!ALLOWED_STATUSES.has(status)) {
    throw new Error("Invalid status");
  }

  const created = { title, status };
  if (input?.description !== undefined) {
    created.description = input.description;
  }
  return created;
}

function normalizeUpdateTask(patch) {
  if (!patch || typeof patch !== "object") {
    throw new Error("Patch is required");
  }
  const keys = Object.keys(patch);
  if (keys.length === 0) {
    throw new Error("Patch cannot be empty");
  }

  const normalized = {};

  if (patch.title !== undefined) {
    const title =
      typeof patch.title === "string" ? patch.title.trim() : String(patch.title ?? "").trim();
    if (!title) {
      throw new Error("Title is required");
    }
    normalized.title = title;
  }

  if (patch.status !== undefined) {
    if (!ALLOWED_STATUSES.has(patch.status)) {
      throw new Error("Invalid status");
    }
    normalized.status = patch.status;
  }

  if (patch.description !== undefined) {
    normalized.description = patch.description;
  }

  return normalized;
}

function applyTaskPatch(task, patch) {
  return { ...task, ...patch };
}

module.exports = {
  normalizeCreateTask,
  normalizeUpdateTask,
  applyTaskPatch,
};
