import express from "express";
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
    getAllEnrollmentsForAdmin,
    updatePaymentStatusByAdmin,
    // Course management
    getAllCoursesAdmin,
    updateCourseAdmin,
    deleteCourseAdmin,
    // Resource management
    getAllResourcesAdmin,
    deleteResourceAdmin,
    // Announcements
    getAnnouncementsAdmin,
    createAnnouncementAdmin,
    deleteAnnouncementAdmin,
    // Audit logs
    getAuditLogsAdmin,
    // Reports
    getReportStatsAdmin,
    // System stats
    getSystemStatsAdmin,
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

/* =====================================
   ADMIN COURSE MANAGEMENT
===================================== */

// Get all courses (for admin dashboard)
router.get(
    "/courses",
    protect,
    adminOnly,
    getAllCoursesAdmin
);

// Update a course
router.patch(
    "/courses/:id",
    protect,
    adminOnly,
    updateCourseAdmin
);

// Delete a course
router.delete(
    "/courses/:id",
    protect,
    adminOnly,
    deleteCourseAdmin
);

/* =====================================
   ADMIN RESOURCE MANAGEMENT
===================================== */

// Get all resources (for admin dashboard)
router.get(
    "/resources",
    protect,
    adminOnly,
    getAllResourcesAdmin
);

// Delete a resource
router.delete(
    "/resources/:id",
    protect,
    adminOnly,
    deleteResourceAdmin
);

/* =====================================
   ADMIN ANNOUNCEMENTS
===================================== */

// Get all announcements
router.get(
    "/announcements",
    protect,
    adminOnly,
    getAnnouncementsAdmin
);

// Create announcement
router.post(
    "/announcements",
    protect,
    adminOnly,
    createAnnouncementAdmin
);

// Delete announcement
router.delete(
    "/announcements/:id",
    protect,
    adminOnly,
    deleteAnnouncementAdmin
);

/* =====================================
   ADMIN AUDIT LOGS
===================================== */

// Get all audit logs
router.get(
    "/audit-logs",
    protect,
    adminOnly,
    getAuditLogsAdmin
);

/* =====================================
   ADMIN REPORTS
===================================== */

// Get report statistics
router.get(
    "/reports/stats",
    protect,
    adminOnly,
    getReportStatsAdmin
);

/* =====================================
   ADMIN SYSTEM HEALTH
===================================== */

// Get system statistics
router.get(
    "/system/stats",
    protect,
    adminOnly,
    getSystemStatsAdmin
);

export default router;
