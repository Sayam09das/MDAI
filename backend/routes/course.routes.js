import express from "express";
import {
  createCourse,
  getTeacherCourses,
  getAllPublishedCourses,
  publishCourse,
  getCourseById,
} from "../controllers/course.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

/* ===============================
   TEACHER ROUTES
================================ */

// Create course
router.post(
  "/create",
  protect,
  teacherOnly,
  upload.single("thumbnail"),
  createCourse
);

// Get teacher courses (for dashboard & live sessions)
router.get(
  "/teacher",
  protect,
  teacherOnly,
  getTeacherCourses
);

// Publish course
router.patch(
  "/:id/publish",
  protect,
  teacherOnly,
  publishCourse
);

/* ===============================
   PUBLIC ROUTES
================================ */

// Get all published courses
router.get("/", getAllPublishedCourses);

// Get course by id (KEEP LAST)
router.get("/:id", getCourseById);

export default router;
