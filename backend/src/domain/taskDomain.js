const ALLOWED_STATUSES = new Set(["todo", "doing", "done"]);
const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);
const ALLOWED_CATEGORIES = new Set(["general", "personal", "work", "school", "errands", "health"]);

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

function normalizePriority(value, { defaultIfMissing } = {}) {
  const priority = value == null && defaultIfMissing != null ? defaultIfMissing : value;
  if (!ALLOWED_PRIORITIES.has(priority)) {
    throw new Error("Invalid priority");
  }
  return priority;
}

function normalizeCategory(value, { defaultIfMissing } = {}) {
  const category = value == null && defaultIfMissing != null ? defaultIfMissing : value;
  if (!ALLOWED_CATEGORIES.has(category)) {
    throw new Error("Invalid category");
  }
  return category;
}

function normalizeDueDate(value) {
  if (value == null || value === "") {
    return null;
  }
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Invalid due date");
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error("Invalid due date");
  }
  return value;
}

function normalizeCreateTask(input) {
  const title = normalizeTitle(input?.title);
  const status = normalizeStatus(input?.status, { defaultIfMissing: "todo" });
  const priority = normalizePriority(input?.priority, { defaultIfMissing: "medium" });
  const category = normalizeCategory(input?.category, { defaultIfMissing: "general" });

  const created = { title, status, priority, category, dueDate: normalizeDueDate(input?.dueDate) };
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

  if (patch.priority !== undefined) {
    normalized.priority = normalizePriority(patch.priority);
  }

  if (patch.category !== undefined) {
    normalized.category = normalizeCategory(patch.category);
  }

  if (patch.dueDate !== undefined) {
    normalized.dueDate = normalizeDueDate(patch.dueDate);
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

