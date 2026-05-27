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

  const normalized = normalizeCreateTask(req.body);
  const created = await taskRepository.createTask(uid, normalized);
  res.status(201).json(created);
});

const listTasks = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  const tasks = await taskRepository.listTasks(uid);
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

const deleteTask = asyncHandler(async (req, res) => {
  const uid = requireUid(req, res);
  if (!uid) return;

  const deleted = await taskRepository.deleteTask(uid, req.params.id);
  if (!deleted) {
    return jsonError(res, 404, "Task not found");
  }

  return res.status(204).send();
});

module.exports = {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
};
