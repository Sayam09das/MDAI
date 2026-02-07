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
            const Teacher = (await import("../models/teacherModel.js")).default;
            
            // Get all paid enrollments
            const paidEnrollments = await Enrollment.find({ paymentStatus: "PAID" });
            
            // Calculate total revenue
            const totalRevenue = paidEnrollments.reduce((sum, e) => sum + (e.amount || 0), 0);
            
            // Calculate admin amount (10%)
            const totalAdminAmount = totalRevenue * 0.1;
            
            // Calculate teacher amount (90%)
            const totalTeacherAmount = totalRevenue * 0.9;
            
            // Get counts
            const totalTeachers = await Teacher.countDocuments();
            const totalStudents = new Set(paidEnrollments.map(e => e.student?.toString())).size;
            const totalTransactions = paidEnrollments.length;
            
            res.json({
                success: true,
                stats: {
                    totalRevenue: Math.round(totalRevenue * 100) / 100,
                    totalAdminAmount: Math.round(totalAdminAmount * 100) / 100,
                    totalTeacherAmount: Math.round(totalTeacherAmount * 100) / 100,
                    totalTeachers,
                    totalStudents,
                    totalTransactions
                }
            });
        } catch (error) {
            console.error("Finance stats error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Get all teachers with their courses and pending payments
router.get(
    "/finance/teachers/courses",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const Teacher = (await import("../models/teacherModel.js")).default;
            const Course = (await import("../models/Course.js")).default;
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            
            // Get all teachers with their courses
            const teachers = await Teacher.find().lean();
            
            const teachersWithCourses = await Promise.all(
                teachers.map(async (teacher) => {
                    // Get teacher's courses with enrollment info
                    const courses = await Course.find({ instructor: teacher._id }).lean();
                    
                    const coursesWithDetails = await Promise.all(
                        courses.map(async (course) => {
                            // Get paid enrollments for this course
                            const enrollments = await Enrollment.find({
                                course: course._id,
                                paymentStatus: "PAID"
                            }).lean();
                            
                            const coursePrice = course.price || 0;
                            const studentCount = enrollments.length;
                            const totalEarned = studentCount * coursePrice;
                            const teacherShare = totalEarned * 0.9; // 90%
                            
                            return {
                                id: course._id,
                                title: course.title,
                                price: coursePrice,
                                studentCount,
                                totalEarned: Math.round(totalEarned * 100) / 100,
                                teacherShare: Math.round(teacherShare * 100) / 100,
                                adminShare: Math.round((totalEarned * 0.1) * 100) / 100
                            };
                        })
                    );
                    
                    const totalPending = coursesWithDetails.reduce(
                        (sum, c) => sum + c.teacherShare, 
                        0
                    );
                    
                    return {
                        id: teacher._id,
                        name: teacher.fullName || teacher.name,
                        email: teacher.email,
                        courses: coursesWithDetails,
                        totalPending: Math.round(totalPending * 100) / 100,
                        totalCourses: coursesWithDetails.length
                    };
                })
            );
            
            // Sort by pending amount descending
            teachersWithCourses.sort((a, b) => b.totalPending - a.totalPending);
            
            const grandTotalPending = teachersWithCourses.reduce(
                (sum, t) => sum + t.totalPending, 
                0
            );
            
            res.json({
                success: true,
                teachers: teachersWithCourses,
                totalTeachers: teachersWithCourses.length,
                grandTotalPending: Math.round(grandTotalPending * 100) / 100
            });
        } catch (error) {
            console.error("Teacher courses error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Process payment to a teacher
router.post(
    "/finance/pay-teacher",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const { teacherId, amount, courseId, description } = req.body;
            const FinanceTransaction = (await import("../models/financeTransactionModel.js")).default;
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            const Teacher = (await import("../models/teacherModel.js")).default;
            
            if (!teacherId || !amount || amount <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Valid teacher ID and amount are required" 
                });
            }
            
            const teacher = await Teacher.findById(teacherId);
            if (!teacher) {
                return res.status(404).json({ success: false, message: "Teacher not found" });
            }
            
            // Create finance transaction
            const transaction = await FinanceTransaction.create({
                type: "PAYMENT",
                teacher: teacherId,
                course: courseId || null,
                grossAmount: amount,
                adminPercentage: 0, // No admin cut for payouts
                adminAmount: 0,
                teacherAmount: amount,
                status: "COMPLETED",
                paymentMethod: "BANK_TRANSFER",
                description: description || `Payment to ${teacher.fullName || teacher.name}`,
                processedAt: new Date(),
                completedAt: new Date()
            });
            
            res.json({
                success: true,
                message: "Payment processed successfully",
                transaction: {
                    id: transaction._id,
                    teacher: teacher.fullName || teacher.name,
                    amount: transaction.teacherAmount,
                    status: transaction.status,
                    processedAt: transaction.processedAt
                }
            });
        } catch (error) {
            console.error("Pay teacher error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Get payment history
router.get(
    "/finance/payment-history",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const FinanceTransaction = (await import("../models/financeTransactionModel.js")).default;
            
            const skip = (parseInt(page) - 1) * parseInt(limit);
            
            const transactions = await FinanceTransaction.find({
                type: "PAYMENT"
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("teacher", "fullName name email")
            .lean();
            
            const total = await FinanceTransaction.countDocuments({ type: "PAYMENT" });
            
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
            console.error("Payment history error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

export default router;
