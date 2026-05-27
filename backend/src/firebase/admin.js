const admin = require("firebase-admin");

function getProjectId() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID");
  }
  return projectId;
}

function initAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  admin.initializeApp({
    projectId: getProjectId(),
  });
}

let cachedDb;

function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  initAdmin();
  const db = admin.firestore();

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    db.settings({
      host: process.env.FIRESTORE_EMULATOR_HOST,
      ssl: false,
    });
  }

  cachedDb = db;
  return db;
}

module.exports = {
  admin,
  getDb,
  initAdmin,
};
