import express from "express";
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
    getAllEnrollmentsForAdmin,
    updatePaymentStatusByAdmin,
} from "../controllers/admin.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================
   AUTH ROUTES (PUBLIC)
===================================== */

// Admin register
router.post("/register", registerAdmin);

// Admin login
router.post("/login", loginAdmin);

/* =====================================
   PROTECTED ROUTES (ADMIN ONLY)
===================================== */

// Admin logout
router.post("/logout", protect, adminOnly, logoutAdmin);

// Admin profile
router.get("/profile", protect, adminOnly, getAdminProfile);

// Get all enrollments (payment verification panel)
router.get(
    "/enrollments",
    protect,
    adminOnly,
    getAllEnrollmentsForAdmin
);

// Update payment status (PAID / LATER)
router.patch(
    "/enrollments/:enrollmentId/payment-status",
    protect,
    adminOnly,
    updatePaymentStatusByAdmin
);

export default router;
