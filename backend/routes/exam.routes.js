import express from "express";
import {
    startExam,
    submitExam,
    heartbeat,
    reportViolation,
    getExamStatus,
    getActiveExams,
    getExamHistory,
    getExamAnalytics,
    autoSubmitExpired,
    resetExamSession
} from "../controllers/exam.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student routes
router.post("/:assignmentId/start", startExam);
router.post("/:examId/submit", submitExam);
router.post("/:examId/heartbeat", heartbeat);
router.post("/:examId/violation", reportViolation);
router.get("/:examId/status", getExamStatus);
router.get("/student/active", getActiveExams);
router.get("/student/history", getExamHistory);

// Teacher routes
router.get("/analytics/:assignmentId", teacherOnly, getExamAnalytics);

// Admin/Maintenance routes
router.post("/cron/expire", autoSubmitExpired);
router.post("/:examId/reset", resetExamSession);

export default router;

