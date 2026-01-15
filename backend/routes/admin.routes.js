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
   AUTH ROUTES (NO PROTECT)
   ===================================== */

// Admin register
router.post("/register", registerAdmin);

// Admin login
router.post("/login", loginAdmin);

// Admin logout
router.post("/logout", protect, adminOnly, logoutAdmin);

/* =====================================
   ADMIN PROTECTED ROUTES
   ===================================== */

// Admin profile
router.get("/profile", protect, adminOnly, getAdminProfile);

// All enrollments (payment verification panel)
router.get("/enrollments", protect, adminOnly, getAllEnrollmentsForAdmin);

// Update payment status (paid / pay_later)
router.patch(
    "/enrollments/:enrollmentId/payment-status",
    protect,
    adminOnly,
    updatePaymentStatusByAdmin
);

export default router;
