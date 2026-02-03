import express from "express";
import {
  getStudentAttendance,
  getStudentPerformance,
  getStudentOverview,
  getStudentActivityHours,
  getStudentDashboardStats,
} from "../controllers/student.controller.js";
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

export default router;

