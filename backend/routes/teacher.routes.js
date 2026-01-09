import express from "express";
import {
  registerTeacher,
  verifyTeacherOtp,
  resendTeacherOtp,
  teacherLogout,
} from "../controllers/teacherAuth.controller.js";

const router = express.Router();

/* ================= TEACHER AUTH ROUTES ================= */

router.post("/register", registerTeacher);
router.post("/verify-otp", verifyTeacherOtp);
router.post("/resend-otp", resendTeacherOtp);
router.post("/logout", teacherLogout);

export default router;
