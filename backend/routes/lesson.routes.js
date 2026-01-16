import express from "express";
import {
   createLesson,
   getAllLessons,
   getLessonById,
   updateLesson,
   deleteLesson,
   getLessonsByCourse,
} from "../controllers/lesson.controller.js";

import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   TEACHER ONLY ROUTES
================================ */

router.post("/create", protect, teacherOnly, createLesson);
router.put("/:id", protect, teacherOnly, updateLesson);
router.delete("/:id", protect, teacherOnly, deleteLesson);

/* ===============================
   STUDENT / AUTH ROUTES
================================ */

// ✅ MUST BE ABOVE "/:id"
router.get("/course/:courseId", protect, getLessonsByCourse);

// Get single live session
router.get("/:id", protect, getLessonById);

// (optional) all lessons
router.get("/", protect, getAllLessons);

export default router;
