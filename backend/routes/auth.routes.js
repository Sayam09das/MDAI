import express from "express";
import {
  registerUser,
  login,
  logout,
  getCurrentUser,
  getAllStudents,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= AUTH ROUTES ================= */

// User register
router.post("/register", registerUser);

// Unified login (User + Teacher)
router.post("/login", login);

// Logout (User + Teacher)
router.post("/logout", logout);

// Get current logged-in user
router.get("/me", protect, getCurrentUser);

router.get("/students", protect,getAllStudents);


export default router;
