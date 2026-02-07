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

// Get finance dashboard stats
router.get(
    "/finance/stats",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            const FinanceTransaction = (await import("../models/financeTransactionModel.js")).default;
            
            // Get all paid enrollments for revenue calculation
            const paidEnrollments = await Enrollment.find({ paymentStatus: "PAID" });
            
            // Calculate total revenue
            const totalRevenue = paidEnrollments.reduce((sum, e) => sum + (e.amount || 0), 0);
            
            // Calculate admin and teacher amounts
            const totalAdminAmount = paidEnrollments.reduce((sum, e) => sum + (e.adminAmount || 0), 0);
            const totalTeacherAmount = paidEnrollments.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);
            
            // Get transaction counts
            const totalTransactions = await FinanceTransaction.countDocuments();
            const completedTransactions = await FinanceTransaction.countDocuments({ status: "COMPLETED" });
            const pendingTransactions = await FinanceTransaction.countDocuments({ status: "PENDING" });
            
            // Get recent transactions
            const recentTransactions = await FinanceTransaction.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            res.json({
                success: true,
                stats: {
                    totalRevenue,
                    totalAdminAmount,
                    totalTeacherAmount,
                    totalTransactions,
                    completedTransactions,
                    pendingTransactions,
                    transactionCompletionRate: totalTransactions > 0 
                        ? Math.round((completedTransactions / totalTransactions) * 100) 
                        : 0
                },
                recentTransactions: recentTransactions.map(t => ({
                    id: t._id,
                    type: t.type,
                    amount: t.grossAmount,
                    status: t.status,
                    createdAt: t.createdAt
                }))
            });
        } catch (error) {
            console.error("Finance stats error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Get all transactions
router.get(
    "/finance/transactions",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const { page = 1, limit = 10, status, type, search } = req.query;
            const FinanceTransaction = (await import("../models/financeTransactionModel.js")).default;
            
            let query = {};
            
            if (status && status !== 'all') {
                query.status = status;
            }
            
            if (type && type !== 'all') {
                query.type = type;
            }
            
            const skip = (parseInt(page) - 1) * parseInt(limit);
            
            const transactions = await FinanceTransaction.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean();
            
            const total = await FinanceTransaction.countDocuments(query);
            
            res.json({
                success: true,
                transactions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            console.error("Get transactions error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Get teacher payments/earnings
router.get(
    "/finance/teachers/earnings",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            const Teacher = (await import("../models/teacherModel.js")).default;
            
            // Get all teachers with their earnings
            const teachers = await Teacher.find().lean();
            
            const teacherEarnings = await Promise.all(
                teachers.map(async (teacher) => {
                    const enrollments = await Enrollment.find({
                        course: { $in: teacher.courses || [] },
                        paymentStatus: "PAID"
                    });
                    
                    const totalEarnings = enrollments.reduce(
                        (sum, e) => sum + (e.teacherAmount || 0), 
                        0
                    );
                    
                    return {
                        id: teacher._id,
                        name: teacher.name,
                        email: teacher.email,
                        totalEarnings,
                        courseCount: teacher.courses?.length || 0,
                        enrollmentCount: enrollments.length
                    };
                })
            );
            
            // Sort by earnings descending
            teacherEarnings.sort((a, b) => b.totalEarnings - a.totalEarnings);
            
            res.json({
                success: true,
                teachers: teacherEarnings,
                totalTeachers: teacherEarnings.length,
                totalEarningsAll: teacherEarnings.reduce((sum, t) => sum + t.totalEarnings, 0)
            });
        } catch (error) {
            console.error("Teacher earnings error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Get revenue reports
router.get(
    "/finance/reports",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const { period = '30days' } = req.query;
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            
            // Calculate date range
            const now = new Date();
            let startDate = new Date();
            
            switch (period) {
                case '7days':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case '30days':
                    startDate.setDate(startDate.getDate() - 30);
                    break;
                case '90days':
                    startDate.setDate(startDate.getDate() - 90);
                    break;
                case '1year':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                default:
                    startDate.setDate(startDate.getDate() - 30);
            }
            
            // Get enrollments in date range
            const enrollments = await Enrollment.find({
                paymentStatus: "PAID",
                createdAt: { $gte: startDate }
            });
            
            // Calculate revenue by day
            const revenueByDay = {};
            enrollments.forEach(e => {
                const date = e.createdAt.toISOString().split('T')[0];
                if (!revenueByDay[date]) {
                    revenueByDay[date] = { date, revenue: 0, count: 0 };
                }
                revenueByDay[date].revenue += e.amount || 0;
                revenueByDay[date].count += 1;
            });
            
            // Sort by date
            const dailyRevenue = Object.values(revenueByDay)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Calculate totals
            const totalRevenue = enrollments.reduce((sum, e) => sum + (e.amount || 0), 0);
            const totalAdminAmount = enrollments.reduce((sum, e) => sum + (e.adminAmount || 0), 0);
            const totalTeacherAmount = enrollments.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);
            
            res.json({
                success: true,
                period,
                stats: {
                    totalRevenue,
                    totalAdminAmount,
                    totalTeacherAmount,
                    transactionCount: enrollments.length,
                    avgTransactionValue: enrollments.length > 0 
                        ? Math.round(totalRevenue / enrollments.length) 
                        : 0
                },
                dailyRevenue
            });
        } catch (error) {
            console.error("Revenue reports error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

export default router;
