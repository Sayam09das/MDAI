import express from "express";
import {
    createExam,
    getTeacherExams,
    getExamById,
    updateExam,
    deleteExam,
    togglePublishExam,
    getExamResults,
    getExamStats,
    startExamAttempt,
    submitExamAttempt,
    sendHeartbeat,
    reportViolation,
    getMyAttempts,
    getMyExamAttempts,
    getStudentExams,
    autoSubmitExpired
} from "../controllers/exam.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// ==================== TEACHER ROUTES ====================

// Exam CRUD
router.post("/", teacherOnly, createExam);
router.get("/teacher", teacherOnly, getTeacherExams);
router.get("/teacher/stats", teacherOnly, getExamStats);
router.get("/:id", getExamById);
router.put("/:id", teacherOnly, updateExam);
router.delete("/:id", teacherOnly, deleteExam);
router.patch("/:id/publish", teacherOnly, togglePublishExam);

// Results and Analytics
router.get("/:id/results", teacherOnly, getExamResults);

// ==================== STUDENT ROUTES ====================

// Available exams for student
router.get("/student/available", getStudentExams);

// Student attempts
router.get("/my-attempts", getMyAttempts);
router.get("/:examId/my-attempts", getMyExamAttempts);

// Start exam attempt
router.post("/:examId/start", startExamAttempt);

// Exam attempt operations
router.post("/attempt/:attemptId/heartbeat", sendHeartbeat);
router.post("/attempt/:attemptId/violation", reportViolation);
router.post("/attempt/:attemptId/submit", submitExamAttempt);

// ==================== ADMIN/CRON ROUTES ====================

router.post("/cron/expire", autoSubmitExpired);

export default router;
