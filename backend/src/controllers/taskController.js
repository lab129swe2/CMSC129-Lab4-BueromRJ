const { normalizeCreateTask, normalizeUpdateTask } = require("../domain/taskDomain");
const taskRepository = require("../repositories/taskRepository");
const { asyncHandler } = require("../utils/asyncHandler");
const { jsonError } = require("../utils/httpErrors");

function requireUid(req, res) {
  const uid = req.user?.uid;
  if (!uid) {
    jsonError(res, 401, "Unauthorized");
    return null;
  }
  return uid;
}

const createTask = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  let normalized;
  try {
    normalized = normalizeCreateTask(req.body);
  } catch (error) {
    return jsonError(res, 400, error.message);
  }

  const created = await taskRepository.createTask(uid, normalized);
  return res.status(201).json(created);
});

const listTasks = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  const tasks = await taskRepository.listTasks(uid, { archived: req.query.archived === "true" });
  res.status(200).json(tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  let normalized;
  try {
    normalized = normalizeUpdateTask(req.body);
  } catch (error) {
    return jsonError(res, 400, error.message);
  }

  const updated = await taskRepository.updateTask(uid, req.params.id, normalized);
  if (!updated) {
    return jsonError(res, 404, "Task not found");
  }

  return res.status(200).json(updated);
});

const archiveTask = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  const archived = await taskRepository.archiveTask(uid, req.params.id);
  if (!archived) {
    return jsonError(res, 404, "Task not found");
  }

  return res.status(204).send();
});

const restoreTask = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  const restored = await taskRepository.restoreTask(uid, req.params.id);
  if (!restored) {
    return jsonError(res, 404, "Task not found");
  }

  return res.status(200).json(restored);
});

const purgeTask = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  const purged = await taskRepository.purgeTask(uid, req.params.id);
  if (!purged) {
    return jsonError(res, 404, "Archived task not found");
  }

  return res.status(204).send();
});

module.exports = {
  archiveTask,
  createTask,
  listTasks,
  purgeTask,
  restoreTask,
  updateTask,
};
