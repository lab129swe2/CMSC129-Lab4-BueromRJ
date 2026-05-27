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

module.exports = {
  createTask,
  listTasks,
};
