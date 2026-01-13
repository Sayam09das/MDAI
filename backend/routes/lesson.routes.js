import express from "express";
import {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
} from "../controllers/lesson.controller.js";

import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   TEACHER ONLY ROUTES
================================ */

// Create live session
router.post("/create", protect, teacherOnly, createLesson);

// Update live session
router.put("/:id", protect, teacherOnly, updateLesson);

// Delete live session
router.delete("/:id", protect, teacherOnly, deleteLesson);

/* ===============================
   PUBLIC / AUTH ROUTES
================================ */

// Get all live sessions
router.get("/", protect, getAllLessons);

// Get single live session
router.get("/:id", protect, getLessonById);

export default router;
