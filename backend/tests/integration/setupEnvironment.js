process.env.FIREBASE_PROJECT_ID = "task-manager-local";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8081";
process.env.FIREBASE_SERVICE_ACCOUNT_JSON = "";
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = "";

const { closeAdmin } = require("../../src/firebase/admin");

afterAll(async () => {
  await closeAdmin();
});
