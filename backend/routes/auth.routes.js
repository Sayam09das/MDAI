import express from "express";
import {
  register,
  unifiedLogin,
  logout,
  getMe,
  forgotPassword,
  verifyEmailStatus,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailStatus);
router.post("/login", unifiedLogin);
router.post("/forgot-password", forgotPassword);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
