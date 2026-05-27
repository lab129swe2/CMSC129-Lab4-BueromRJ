const { normalizeCreateTask } = require("../domain/taskDomain");
const taskRepository = require("../repositories/taskRepository");

async function createTask(req, res) {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const normalized = normalizeCreateTask(req.body);
  const created = await taskRepository.createTask(uid, normalized);
  return res.status(201).json(created);
}

async function listTasks(req, res) {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tasks = await taskRepository.listTasks(uid);
  return res.status(200).json(tasks);
}

function notImplemented(_req, res) {
  return res.status(501).json({ error: "Not implemented" });
}

module.exports = {
  createTask,
  deleteTask: notImplemented,
  listTasks,
  updateTask: notImplemented,
};
