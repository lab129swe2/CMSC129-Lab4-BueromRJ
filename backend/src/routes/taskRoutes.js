const express = require("express");
const taskController = require("../controllers/taskController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", taskController.listTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.post("/:id/restore", taskController.restoreTask);
router.delete("/:id/permanent", taskController.purgeTask);
router.delete("/:id", taskController.archiveTask);

module.exports = { taskRoutes: router };
