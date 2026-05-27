import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const env = import.meta.env;
const requiredKeys = ["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_PROJECT_ID", "VITE_FIREBASE_APP_ID"] as const;
const localDefaults = env.DEV
  ? {
      apiKey: "fake-api-key",
      authDomain: "task-manager-local.firebaseapp.com",
      projectId: "task-manager-local",
      appId: "fake-app-id",
    }
  : {};

if (env.PROD) {
  const missingKeys = requiredKeys.filter((key) => !env[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missingKeys.join(", ")}`);
  }
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || localDefaults.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || localDefaults.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || localDefaults.projectId,
  appId: env.VITE_FIREBASE_APP_ID || localDefaults.appId,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

const useAuthEmulator = env.VITE_USE_FIREBASE_EMULATORS === "true";
const authEmulatorHost = env.VITE_FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
if (useAuthEmulator) {
  connectAuthEmulator(firebaseAuth, `http://${authEmulatorHost}`, { disableWarnings: true });
}
