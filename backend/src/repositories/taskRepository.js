const { getDb } = require("../firebase/admin");

function tasksCollection(uid) {
  const db = getDb();
  return db.collection("users").doc(uid).collection("tasks");
}

async function createTask(uid, task) {
  const now = Date.now();
  const data = {
    ...task,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await tasksCollection(uid).add(data);
  return { id: docRef.id, ...data };
}

async function listTasks(uid) {
  const snapshot = await tasksCollection(uid).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function updateTask(uid, taskId, patch) {
  const docRef = tasksCollection(uid).doc(taskId);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return null;
  }

  const updates = {
    ...patch,
    updatedAt: Date.now(),
  };
  await docRef.update(updates);

  return {
    id: taskId,
    ...snapshot.data(),
    ...updates,
  };
}

async function deleteTask(uid, taskId) {
  const docRef = tasksCollection(uid).doc(taskId);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return false;
  }

  await docRef.delete();
  return true;
}

module.exports = {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
};
