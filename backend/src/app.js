const express = require("express");
const { taskRoutes } = require("./routes/taskRoutes");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use("/api/tasks", taskRoutes);

  return app;
}

module.exports = { createApp };
