import express from "express";
import {
  registerTeacher,
  verifyTeacherOtp,
} from "../controllers/teacherAuth.controller.js";

const router = express.Router();

router.post("/register", registerTeacher);
router.post("/verify-otp", verifyTeacherOtp);

export default router;
