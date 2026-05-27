const { normalizeCreateTask } = require("../domain/taskDomain");
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

function notImplemented(_req, res) {
  return res.status(501).json({ error: "Not implemented" });
}

module.exports = {
  createTask,
  deleteTask: notImplemented,
  listTasks,
  updateTask: notImplemented,
};
