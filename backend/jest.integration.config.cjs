/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/integration/**/*.test.js"],
  clearMocks: true,
  openHandlesTimeout: 5000,
  setupFilesAfterEnv: ["<rootDir>/tests/integration/setupEnvironment.js"],
};
