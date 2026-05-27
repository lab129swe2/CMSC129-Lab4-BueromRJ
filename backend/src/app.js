const express = require("express");
const cors = require("cors");
const { taskRoutes } = require("./routes/taskRoutes");

function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN || "http://127.0.0.1:5173";
  app.use(
    cors({
      origin: corsOrigin,
      credentials: false,
    }),
  );

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use("/api/tasks", taskRoutes);

  return app;
}

module.exports = { createApp };
