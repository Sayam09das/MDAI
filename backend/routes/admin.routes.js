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
    // User counts
    getUserCountsAdmin,
    // Audit logs
    getAuditLogsAdmin,
    // Reports
    getReportStatsAdmin,
    // System stats
    getSystemStatsAdmin,
    // Activity overview
    getActivityOverviewAdmin,
    // User analytics
    getUserAnalyticsAdmin,
    // Student analytics
    getStudentAnalyticsAdmin,
    // Course analytics
    getCourseAnalyticsAdmin,
    // Real-time system health
    getSystemHealthRealTime,
    // Finance
    getAllTransactionsAdmin,
    getTeacherPaymentsAdmin,
    getRevenueReportsAdmin,
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

// Get all enrollments
router.get(
    "/enrollments",
    protect,
    adminOnly,
    getAllEnrollmentsForAdmin
);

// Update enrollment status
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
    async (req, res) => {
        try {
            const { title, message, type } = req.body;

            // Import the model
            const Announcement = (await import("../models/announcementModel.js")).default;

            const announcement = await Announcement.create({
                title,
                message,
                type,
                createdBy: req.user.id,
            });

            // Get io instance and emit event
            const io = req.app.get("io");
            
            // Emit announcement to relevant rooms
            const announcementData = {
                id: announcement._id,
                title: announcement.title,
                message: announcement.message,
                type: announcement.type,
                priority: announcement.priority,
                createdAt: announcement.createdAt,
            };

            if (type === "all") {
                // Broadcast to both students and teachers
                io.to("students_room").emit("new_announcement", announcementData);
                io.to("teachers_room").emit("new_announcement", announcementData);
            } else if (type === "students") {
                io.to("students_room").emit("new_announcement", announcementData);
            } else if (type === "teachers") {
                io.to("teachers_room").emit("new_announcement", announcementData);
            }

            // Import audit log helper (inline to avoid circular imports)
            try {
                const AuditLog = (await import("../models/auditLogModel.js")).default;
                await AuditLog.create({
                    adminId: req.user.id,
                    action: "CREATE_ANNOUNCEMENT",
                    details: `Created announcement: ${title}`,
                    status: "success",
                });
            } catch (auditError) {
                console.error("Failed to create audit log:", auditError);
            }

            res.status(201).json({
                success: true,
                message: "Announcement created successfully",
                announcement,
            });
        } catch (error) {
            console.error("Create announcement error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Delete announcement
router.delete(
    "/announcements/:id",
    protect,
    adminOnly,
    deleteAnnouncementAdmin
);

/* =====================================
   ADMIN USER COUNTS (REAL-TIME)
===================================== */

// Get real-time user counts
router.get(
    "/users/count",
    protect,
    adminOnly,
    getUserCountsAdmin
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

// Get real-time system health (live metrics)
router.get(
    "/system/health/realtime",
    protect,
    adminOnly,
    getSystemHealthRealTime
);

/* =====================================
   ADMIN ACTIVITY OVERVIEW
===================================== */

// Get activity overview (real-time analytics)
router.get(
    "/activity/overview",
    protect,
    adminOnly,
    getActivityOverviewAdmin
);

/* =====================================
   ADMIN USER ANALYTICS
===================================== */

// Get user analytics (real-time)
router.get(
    "/analytics/users",
    protect,
    adminOnly,
    getUserAnalyticsAdmin
);

/* =====================================
   ADMIN STUDENT ANALYTICS
===================================== */

// Get student analytics (real-time)
router.get(
    "/analytics/students",
    protect,
    adminOnly,
    getStudentAnalyticsAdmin
);

/* =====================================
   ADMIN COURSE ANALYTICS
===================================== */

// Get course analytics (real-time)
router.get(
    "/courses/analytics",
    protect,
    adminOnly,
    getCourseAnalyticsAdmin
);

/* =====================================
   ADMIN FINANCE ROUTES
===================================== */

// Get all transactions
router.get(
    "/finance/transactions",
    protect,
    adminOnly,
    getAllTransactionsAdmin
);

// Get teacher payments
router.get(
    "/finance/teacher-payments",
    protect,
    adminOnly,
    getTeacherPaymentsAdmin
);

// Get revenue reports
router.get(
    "/finance/reports",
    protect,
    adminOnly,
    getRevenueReportsAdmin
);

export default router;

