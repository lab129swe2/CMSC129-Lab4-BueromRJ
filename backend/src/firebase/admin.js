const admin = require("firebase-admin");

function getProjectId() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID");
  }
  return projectId;
}

function getCredential() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    const serviceAccount = JSON.parse(json);
    return admin.credential.cert(serviceAccount);
  }

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    const serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    return admin.credential.cert(serviceAccount);
  }

  return undefined;
}

function initAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  const credential = getCredential();
  admin.initializeApp(
    credential
      ? { credential, projectId: getProjectId() }
      : { projectId: getProjectId() },
  );
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

async function closeAdmin() {
  if (cachedDb) {
    await cachedDb.terminate();
    cachedDb = undefined;
  }

  await Promise.all(admin.apps.map((app) => app.delete()));
}

module.exports = {
  admin,
  closeAdmin,
  getDb,
  initAdmin,
};
