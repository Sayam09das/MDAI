import express from "express";
import {
  registerTeacher,
  teacherLogout,
} from "../controllers/teacherAuth.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= TEACHER AUTH ROUTES ================= */

// Register teacher (no OTP)
router.post("/register", registerTeacher);

// Logout teacher (protected)
router.post("/logout", protect, teacherOnly, teacherLogout);

export default router;
