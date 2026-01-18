import express from "express";
import upload from "../middlewares/multer.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} from "../controllers/resource.Controller.js";

const router = express.Router();

/* =========================
   STUDENT + TEACHER (READ)
========================= */
router.get("/", protect, getAllResources);
router.get("/:id", protect, getResourceById);

/* =========================
   TEACHER ONLY (WRITE)
========================= */

// Create resource
router.post(
  "/create",
  protect,
  teacherOnly,
  upload.single("file"),
  createResource
);

// Update resource
router.put(
  "/:id",
  protect,
  teacherOnly,
  upload.single("file"),
  updateResource
);

// Delete resource
router.delete(
  "/:id",
  protect,
  teacherOnly,
  deleteResource
);

export default router;
