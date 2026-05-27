const request = require("supertest");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const { createApp } = require("../../src/app");

(() => {
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const envPath = path.join(repoRoot, ".env");
  const envExamplePath = path.join(repoRoot, ".env.example");

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    return;
  }

  if (fs.existsSync(envExamplePath)) {
    dotenv.config({ path: envExamplePath });
  }
})();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Create a repo-root .env (copy from .env.example) and start Firebase emulators.`,
    );
  }
  return value;
}

async function getIdTokenForTestUser() {
  const projectId = requireEnv("FIREBASE_PROJECT_ID");
  const authHost = requireEnv("FIREBASE_AUTH_EMULATOR_HOST");

  const email = `test+${Date.now()}@example.com`;
  const password = "Password123!";

  const apiKey = "fake-api-key";

  async function post(endpoint, body) {
    const url = `http://${authHost}${endpoint}?key=${apiKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error?.message || `HTTP ${res.status}`);
      }
      return json;
    } catch (err) {
      const message = String(err?.message || err);
      if (message.includes("fetch failed") || message.includes("ECONNREFUSED")) {
        throw new Error(
          `Auth emulator not reachable at http://${authHost}. Start emulators (repo root): npm run emulators:start`,
        );
      }
      throw err;
    }
  }

  await post("/identitytoolkit.googleapis.com/v1/accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
  });

  const signedIn = await post("/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });

  return signedIn.idToken;
}

describe("Tasks API (integration)", () => {
  test("GET /api/tasks returns 401 without Authorization bearer token", async () => {
    const app = createApp();

    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });

  test("POST then GET /api/tasks returns tasks newest-first (authorized)", async () => {
    const app = createApp();
    const idToken = await getIdTokenForTestUser();

    const headers = { Authorization: `Bearer ${idToken}` };

    const first = await request(app).post("/api/tasks").set(headers).send({ title: "First" });
    expect(first.status).toBe(201);

    const second = await request(app).post("/api/tasks").set(headers).send({ title: "Second" });
    expect(second.status).toBe(201);

    const list = await request(app).get("/api/tasks").set(headers);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body[0]).toEqual(expect.objectContaining({ title: "Second" }));
    expect(list.body[1]).toEqual(expect.objectContaining({ title: "First" }));
  });
});
