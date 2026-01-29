import express from "express";
import {
    registerTeacher,
    getTeacherStats,
    suspendTeacher,
    resumeTeacher,
    getAllTeachers,
    teacherOnboardingAnalytics,
    courseCreationAnalytics,
    feedbackAnalytics,
    updateTeacherProfile,
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


// 🔥 GET ALL TEACHERS (THIS FIXES 404)
router.get("/", protect, getAllTeachers);


// 🔥 Suspend a teacher (admin action)
router.patch("/:teacherId/suspend", protect, suspendTeacher);

// 🔥 Resume a teacher (admin action)
router.patch("/:teacherId/resume", protect, resumeTeacher);

// (Future) Teacher dashboard
// router.get("/dashboard", protect, teacherOnly, getTeacherDashboard);


router.get("/analytics/onboarding", protect, teacherOnboardingAnalytics);
router.get("/analytics/courses", protect, courseCreationAnalytics);
router.get("/analytics/feedback", protect, feedbackAnalytics);



export default router;
