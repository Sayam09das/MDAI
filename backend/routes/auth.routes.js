import express from "express";
import {
  register,
  unifiedLogin,
  logout,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  refreshToken,
  getMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= AUTH ROUTES ================= */

// register & verification
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// login / logout
router.post("/login", unifiedLogin);
router.post("/logout", logout);

// password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// token refresh
router.post("/refresh-token", refreshToken);

// current user (protected)
router.get("/me", protect, getMe);

export default router;
