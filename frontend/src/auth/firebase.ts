import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "fake-api-key",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "task-manager-local.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "task-manager-local",
  appId: env.VITE_FIREBASE_APP_ID || "fake-app-id",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

const authEmulatorHost = (env.VITE_FIREBASE_AUTH_EMULATOR_HOST ||
  "127.0.0.1:9099") as string | undefined;
if (authEmulatorHost) {
  connectAuthEmulator(firebaseAuth, `http://${authEmulatorHost}`, { disableWarnings: true });
}
