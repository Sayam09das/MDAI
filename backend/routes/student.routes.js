import express from "express";
import {
  getStudentAttendance,
  getStudentPerformance,
  getStudentOverview,
  getStudentActivityHours,
  getStudentDashboardStats,
} from "../controllers/student.controller.js";
import {
  getStudentCourseProgress,
  getCourseProgressById,
  markLessonComplete,
  unmarkLessonComplete,
  updateCourseStatus,
  getCourseStats,
} from "../controllers/progress.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= STUDENT ROUTES ================= */

// 🔥 GET STUDENT'S ATTENDANCE RECORDS
router.get(
  "/attendance",
  protect,
  getStudentAttendance
);

// 🔥 GET STUDENT'S PERFORMANCE DATA
router.get(
  "/performance",
  protect,
  getStudentPerformance
);

// 🔥 GET STUDENT'S OVERVIEW (Enrolled courses, stats)
router.get(
  "/overview",
  protect,
  getStudentOverview
);

// 🔥 GET STUDENT'S ACTIVITY HOURS
router.get(
  "/activity-hours",
  protect,
  getStudentActivityHours
);

// 🔥 GET STUDENT DASHBOARD STATS (Real-time)
router.get(
  "/dashboard/stats",
  protect,
  getStudentDashboardStats
);

/* ================= COURSE PROGRESS ROUTES ================= */

// 🔥 GET ALL COURSE PROGRESS
router.get(
  "/course-progress",
  protect,
  getStudentCourseProgress
);

// 🔥 GET SPECIFIC COURSE PROGRESS
router.get(
  "/course-progress/:courseId",
  protect,
  getCourseProgressById
);

// 🔥 MARK LESSON AS COMPLETE
router.patch(
  "/course-progress/:courseId/complete-lesson/:lessonId",
  protect,
  markLessonComplete
);

// 🔥 UNMARK LESSON AS COMPLETE
router.patch(
  "/course-progress/:courseId/uncomplete-lesson/:lessonId",
  protect,
  unmarkLessonComplete
);

// 🔥 UPDATE COURSE STATUS
router.patch(
  "/course-progress/:courseId/status",
  protect,
  updateCourseStatus
);

// 🔥 GET COURSE STATS (for dashboard)
router.get(
  "/course-stats",
  protect,
  getCourseStats
);

export default router;

