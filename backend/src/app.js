const express = require("express");
const cors = require("cors");
const { taskRoutes } = require("./routes/taskRoutes");

function normalizeOrigin(origin) {
  if (!origin) {
    return "http://localhost:5173";
  }

  if (/^https?:\/\//i.test(origin)) {
    return origin;
  }

  return `https://${origin}`;
}

function createApp() {
  const app = express();

  const corsOrigin = normalizeOrigin(process.env.CORS_ORIGIN);
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
