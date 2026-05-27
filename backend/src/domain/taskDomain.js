const ALLOWED_STATUSES = new Set(["todo", "doing", "done"]);

function normalizeTitle(value) {
  const title = typeof value === "string" ? value.trim() : "";
  if (!title) {
    throw new Error("Title is required");
  }
  return title;
}

function normalizeStatus(value, { defaultIfMissing } = {}) {
  const status = value == null && defaultIfMissing != null ? defaultIfMissing : value;
  if (!ALLOWED_STATUSES.has(status)) {
    throw new Error("Invalid status");
  }
  return status;
}

function normalizeCreateTask(input) {
  const title = normalizeTitle(input?.title);
  const status = normalizeStatus(input?.status, { defaultIfMissing: "todo" });

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
    normalized.title = normalizeTitle(patch.title);
  }

  if (patch.status !== undefined) {
    normalized.status = normalizeStatus(patch.status);
  }

  if (patch.description !== undefined) {
    normalized.description = patch.description;
  }

  if (Object.keys(normalized).length === 0) {
    throw new Error("Patch has no supported fields");
  }

  return normalized;
}

function applyTaskPatch(task, patch) {
  return { ...task, ...patch };
}

module.exports = {
  applyTaskPatch,
  normalizeCreateTask,
  normalizeUpdateTask,
};

