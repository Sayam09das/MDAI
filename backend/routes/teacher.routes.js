import express from "express";
import { registerTeacher } from "../controllers/teacherAuth.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= TEACHER ROUTES ================= */

// Register teacher
router.post("/register", registerTeacher);

// (Future) Teacher dashboard routes
// router.get("/dashboard", protect, teacherOnly, getTeacherDashboard);

export default router;
