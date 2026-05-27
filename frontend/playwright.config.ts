import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "npm run dev",
      cwd: "../backend",
      port: 3001,
      reuseExistingServer: true,
    },
    {
      command: "npm run dev -- --host localhost --port 5173",
      cwd: ".",
      url: "http://localhost:5173",
      reuseExistingServer: true,
    },
  ],
});
