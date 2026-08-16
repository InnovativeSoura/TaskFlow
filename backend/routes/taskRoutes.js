// backend/routes/taskRoutes.js

import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  isAdmin,
  isAdminOrManager,
} from "../middleware/permissions.js";

const router = express.Router();

/* =========================================================
   GLOBAL PROTECTION

   Every task route requires authentication.
========================================================= */

router.use(protect);

/* =========================================================
   GET ALL TASKS

   All authenticated users.
========================================================= */

router.get(
  "/",
  getTasks
);

/* =========================================================
   GET SINGLE TASK

   All authenticated users.
========================================================= */

router.get(
  "/:id",
  getTaskById
);

/* =========================================================
   CREATE TASK

   Admin + Manager.
========================================================= */

router.post(
  "/",
  isAdminOrManager,
  createTask
);

/* =========================================================
   UPDATE ENTIRE TASK

   Admin + Manager.
========================================================= */

router.put(
  "/:id",
  isAdminOrManager,
  updateTask
);

/* =========================================================
   UPDATE TASK STATUS

   All authenticated users.

   Team Members are restricted inside the controller
   to their own assigned tasks.
========================================================= */

router.patch(
  "/:id/status",
  updateTaskStatus
);

/* =========================================================
   DELETE TASK

   Admin only.
========================================================= */

router.delete(
  "/:id",
  isAdmin,
  deleteTask
);

/* =========================================================
   EXPORT
========================================================= */

export default router;