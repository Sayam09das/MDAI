import express from "express";
import {
    registerTeacher,
    getTeacherStats,
    suspendTeacher,
    resumeTeacher,
    getAllTeachers,
    teacherOnboardingAnalytics,
    courseCreationAnalytics,
    feedbackAnalytics,
    updateTeacherProfile,
} from "../controllers/teacherAuth.controller.js";

import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= TEACHER ROUTES ================= */

// Register teacher (public)
router.post("/register", registerTeacher);

router.patch("/update/:teacherId", protect, teacherOnly, updateTeacherProfile);


// 🔥 Admin / Dashboard stats
router.get("/stats", protect, getTeacherStats);


// 🔥 GET ALL TEACHERS (THIS FIXES 404)
router.get("/", protect, getAllTeachers);


// 🔥 Suspend a teacher (admin action)
router.patch("/:teacherId/suspend", protect, suspendTeacher);

// 🔥 Resume a teacher (admin action)
router.patch("/:teacherId/resume", protect, resumeTeacher);

// (Future) Teacher dashboard
// router.get("/dashboard", protect, teacherOnly, getTeacherDashboard);


router.get("/analytics/onboarding", protect, teacherOnboardingAnalytics);
router.get("/analytics/courses", protect, courseCreationAnalytics);
router.get("/analytics/feedback", protect, feedbackAnalytics);



export default router;
