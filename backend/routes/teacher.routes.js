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


export default router;
