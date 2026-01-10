import express from "express";
import {
  register,
  unifiedLogin,
  logout,
  forgotPassword,
  getMe,
  refreshToken,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", unifiedLogin);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.get("/me", protect, getMe);
router.post("/refresh-token", refreshToken);

export default router;
