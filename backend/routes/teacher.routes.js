import express from "express";
import {
    registerTeacher,
    getTeacherStats,
    getTeacherDashboardStats,
    suspendTeacher,
    resumeTeacher,
    getAllTeachers,
    teacherOnboardingAnalytics,
    courseCreationAnalytics,
    feedbackAnalytics,
    updateTeacherProfile,
    getMyStudents,
    markAttendance,
    getAttendance,
    getStudentAttendance,
    getStudentPerformanceAnalytics,
    getTeacherDashboardAttendance,
    getStudentGenderStats,
    getTeacherPerformanceMetrics,
    getTeacherTodayLectures,
    getTeacherStatisticsOverview,
    getStudentPerformanceTrends,
    getTeacherSettings,
    updateTeacherSettings,
    changeTeacherPassword,
    getTeacherProfile,
    getTeacherAnnouncements,
} from "../controllers/teacherAuth.controller.js";


import { protect, teacherOnly } from "../middlewares/auth.middleware.js";
import upload  from "../middlewares/multer.js";

const router = express.Router();

/* ================= TEACHER ROUTES ================= */

router.post(
    "/register",
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "class10Certificate", maxCount: 1 },
        { name: "class12Certificate", maxCount: 1 },
        { name: "collegeCertificate", maxCount: 1 },
        { name: "phdOrOtherCertificate", maxCount: 1 },
    ]),
    registerTeacher
);

// Update teacher profile
router.patch(
    "/update/:teacherId",
    protect,
    teacherOnly,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "class10Certificate", maxCount: 1 },
        { name: "class12Certificate", maxCount: 1 },
        { name: "collegeCertificate", maxCount: 1 },
        { name: "phdOrOtherCertificate", maxCount: 1 },
    ]),
    updateTeacherProfile
);

// 🔥 Admin / Dashboard stats
router.get("/stats", protect, getTeacherStats);

// 🔥 Teacher Dashboard Stats (Real-time)
router.get("/dashboard/stats", protect, teacherOnly, getTeacherDashboardStats);


// 🔥 GET ALL TEACHERS (THIS FIXES 404)
router.get("/", protect, getAllTeachers);

// 🔥 GET MY STUDENTS (Students enrolled in teacher's courses)
router.get("/students", protect, teacherOnly, getMyStudents);


// 🔥 Suspend a teacher (admin action)
router.patch("/:teacherId/suspend", protect, suspendTeacher);

// 🔥 Resume a teacher (admin action)
router.patch("/:teacherId/resume", protect, resumeTeacher);

// (Future) Teacher dashboard
// router.get("/dashboard", protect, teacherOnly, getTeacherDashboard);


router.get("/analytics/onboarding", protect, teacherOnboardingAnalytics);
router.get("/analytics/courses", protect, courseCreationAnalytics);
router.get("/analytics/feedback", protect, feedbackAnalytics);


// 🔥 MARK ATTENDANCE (For a course on a specific date)
router.post(
    "/attendance/:courseId/mark",
    protect,
    teacherOnly,
    markAttendance
);

// 🔥 GET ATTENDANCE (For a course)
router.get(
    "/attendance/:courseId",
    protect,
    teacherOnly,
    getAttendance
);

// 🔥 GET STUDENT ATTENDANCE (For a specific student in a course)
router.get(
    "/attendance/:courseId/student/:studentId",
    protect,
    teacherOnly,
    getStudentAttendance
);

// 🔥 GET STUDENT PERFORMANCE ANALYTICS (Weekly/Monthly/Yearly)
router.get(
    "/dashboard/student-performance",
    protect,
    teacherOnly,
    getStudentPerformanceAnalytics
);

// 🔥 GET TEACHER DASHBOARD ATTENDANCE (For MainHeaderDashboard)
router.get(
    "/dashboard/attendance",
    protect,
    teacherOnly,
    getTeacherDashboardAttendance
);

// 🔥 GET STUDENT GENDER STATS (For MainHeaderDashboard)
router.get(
    "/dashboard/gender-stats",
    protect,
    teacherOnly,
    getStudentGenderStats
);

// 🔥 GET TEACHER PERFORMANCE METRICS (For Performance.jsx)
router.get(
    "/dashboard/performance-metrics",
    protect,
    teacherOnly,
    getTeacherPerformanceMetrics
);

// 🔥 GET TEACHER TODAY'S LECTURES (For TodayLectures.jsx)
router.get(
    "/dashboard/today-lectures",
    protect,
    teacherOnly,
    getTeacherTodayLectures
);

// 🔥 GET TEACHER STATISTICS OVERVIEW (For TeacherStatistics.jsx)
router.get(
    "/dashboard/statistics-overview",
    protect,
    teacherOnly,
    getTeacherStatisticsOverview
);

// 🔥 GET STUDENT PERFORMANCE TRENDS (For StudentPerformanceGraph.jsx)
router.get(
    "/dashboard/student-performance-trends",
    protect,
    teacherOnly,
    getStudentPerformanceTrends
);

// 🔥 GET TEACHER SETTINGS
router.get(
    "/settings",
    protect,
    teacherOnly,
    getTeacherSettings
);

// 🔥 UPDATE TEACHER SETTINGS
router.patch(
    "/settings",
    protect,
    teacherOnly,
    updateTeacherSettings
);

// 🔥 CHANGE PASSWORD
router.post(
    "/change-password",
    protect,
    teacherOnly,
    changeTeacherPassword
);

// 🔥 GET TEACHER PROFILE (For Settings Page)
router.get(
    "/profile",
    protect,
    teacherOnly,
    getTeacherProfile
);

// 🔥 GET TEACHER ANNOUNCEMENTS
router.get(
    "/announcements",
    protect,
    teacherOnly,
    getTeacherAnnouncements
);

/* ======================================================
   TEACHER FINANCE ROUTES
====================================================== */

// Get teacher's earnings and payments
router.get(
    "/earnings",
    protect,
    teacherOnly,
    async (req, res) => {
        try {
            const teacherId = req.user.id;
            const Teacher = (await import("../models/teacherModel.js")).default;
            const Course = (await import("../models/Course.js")).default;
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            const User = (await import("../models/userModel.js")).default;
            
            // Get all courses by this teacher
            const courses = await Course.find({ instructor: teacherId }).select("_id title price category").lean();
            const courseIds = courses.map(c => c._id);
            
            // Get all enrollments for teacher's courses with payment info
            const enrollments = await Enrollment.find({
                course: { $in: courseIds },
                paymentStatus: "PAID"
            })
            .populate("student", "fullName email")
            .populate("course", "title price category")
            .sort({ createdAt: -1 })
            .lean();
            
            // Format payments for frontend
            const payments = enrollments.map(enrollment => ({
                _id: enrollment._id,
                student: enrollment.student,
                course: enrollment.course,
                amount: enrollment.amount || 0,
                teacherAmount: enrollment.teacherAmount || 0,
                adminAmount: enrollment.adminAmount || 0,
                paymentStatus: enrollment.paymentStatus,
                receipt: enrollment.receipt,
                createdAt: enrollment.createdAt,
                verifiedAt: enrollment.verifiedAt
            }));
            
            // Calculate stats
            const totalEarnings = payments.reduce((sum, p) => sum + (p.teacherAmount || 0), 0);
            const pendingEnrollments = await Enrollment.find({
                course: { $in: courseIds },
                paymentStatus: "PENDING"
            }).lean();
            const pendingAmount = pendingEnrollments.reduce((sum, e) => {
                const course = courses.find(c => c._id.toString() === e.course?.toString());
                return sum + (course ? (course.price * 0.9) : 0);
            }, 0);
            
            // Get unique students count
            const uniqueStudents = new Set(enrollments.map(e => e.student?._id?.toString()).filter(Boolean));
            
            res.json({
                success: true,
                payments,
                stats: {
                    totalEarnings: Math.round(totalEarnings * 100) / 100,
                    pendingEarnings: Math.round(pendingAmount * 100) / 100,
                    completedPayments: payments.length,
                    totalStudents: uniqueStudents.size
                }
            });
        } catch (error) {
            console.error("Teacher earnings error:", error);
            res.status(500).json({ message: "Failed to fetch earnings" });
        }
    }
);

// Get teacher's finance overview
router.get(
    "/finance/overview",
    protect,
    teacherOnly,
    async (req, res) => {
        try {
            const teacherId = req.user.id;
            const Teacher = (await import("../models/teacherModel.js")).default;
            const Course = (await import("../models/Course.js")).default;
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            
            // Get all courses by this teacher
            const courses = await Course.find({ instructor: teacherId }).select("_id price title").lean();
            const courseIds = courses.map(c => c._id);
            
            // Get all paid enrollments for teacher's courses
            const enrollments = await Enrollment.find({
                course: { $in: courseIds },
                paymentStatus: "PAID"
            }).lean();
            
            // Calculate total earnings
            let totalEarnings = 0;
            let pendingEarnings = 0;
            
            const coursesWithStats = courses.map(course => {
                const courseEnrollments = enrollments.filter(
                    e => e.course?.toString() === course._id.toString()
                );
                const studentCount = courseEnrollments.length;
                const courseEarnings = studentCount * (course.price || 0);
                const teacherShare = courseEarnings * 0.9; // 90%
                
                totalEarnings += teacherShare;
                pendingEarnings += teacherShare;
                
                return {
                    id: course._id,
                    title: course.title,
                    price: course.price || 0,
                    studentCount,
                    earnings: Math.round(teacherShare * 100) / 100
                };
            });
            
            // Get payment history from finance transactions
            const FinanceTransaction = (await import("../models/financeTransactionModel.js")).default;
            const payments = await FinanceTransaction.find({
                teacher: teacherId,
                type: "PAYMENT",
                status: "COMPLETED"
            }).sort({ completedAt: -1 }).limit(10).lean();
            
            const totalPaidOut = payments.reduce((sum, p) => sum + (p.teacherAmount || 0), 0);
            
            res.json({
                success: true,
                overview: {
                    totalEarnings: Math.round(totalEarnings * 100) / 100,
                    pendingEarnings: Math.round(pendingEarnings * 100) / 100,
                    totalPaidOut: Math.round(totalPaidOut * 100) / 100,
                    courseCount: courses.length,
                    studentCount: enrollments.length
                },
                courses: coursesWithStats,
                recentPayments: payments.map(p => ({
                    id: p._id,
                    amount: p.teacherAmount,
                    date: p.completedAt || p.createdAt,
                    description: p.description
                }))
            });
        } catch (error) {
            console.error("Teacher finance overview error:", error);
            res.status(500).json({ message: "Failed to fetch finance overview" });
        }
    }
);

export default router;
