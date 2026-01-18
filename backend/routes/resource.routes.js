import express from "express"; // ✅ FIX
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

// Create resource (LINK + THUMBNAIL)
router.post(
  "/create",
  protect,
  teacherOnly,
  upload.single("thumbnail"),
  createResource
);

// Update resource (LINK + THUMBNAIL)
router.put(
  "/:id",
  protect,
  teacherOnly,
  upload.single("thumbnail"),
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
