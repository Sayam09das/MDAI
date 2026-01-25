import express from "express";
import {
    registerTeacher,
    getTeacherStats,
    suspendTeacher,
    resumeTeacher,
} from "../controllers/teacherAuth.controller.js";

import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= TEACHER ROUTES ================= */

// Register teacher (public)
router.post("/register", registerTeacher);

// 🔥 Admin / Dashboard stats
router.get("/stats", protect, getTeacherStats);

// 🔥 Suspend a teacher (admin action)
router.patch("/:teacherId/suspend", protect, suspendTeacher);

// 🔥 Resume a teacher (admin action)
router.patch("/:teacherId/resume", protect, resumeTeacher);

// (Future) Teacher dashboard
// router.get("/dashboard", protect, teacherOnly, getTeacherDashboard);

export default router;
