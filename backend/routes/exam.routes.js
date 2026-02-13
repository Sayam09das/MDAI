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
    autoSubmitExpired,
    uploadExamFile,
    downloadExamFile,
    gradeExamAnswer
} from "../controllers/exam.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";
import { examUpload } from "../middlewares/multer.js";
import mongoose from "mongoose";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && 
           (id.length === 24 || mongoose.Types.ObjectId.isValid(id));
};

// ==================== STUDENT ROUTES (MUST come before /:id parameterized route) ====================

// Available exams for student
router.get("/student/available", getStudentExams);

// Student attempts - these are LITERAL routes, must be before /:id
router.get("/my-attempts", getMyAttempts);
router.get("/:examId/my-attempts", getMyExamAttempts);

// Start exam attempt
router.post("/:examId/start", startExamAttempt);

// Exam attempt operations - these use :attemptId which should be validated
router.post("/attempt/:attemptId/heartbeat", sendHeartbeat);
router.post("/attempt/:attemptId/violation", reportViolation);
router.post("/attempt/:attemptId/submit", submitExamAttempt);

// ==================== TEACHER ROUTES ====================

// Exam CRUD
router.post("/", teacherOnly, createExam);
router.get("/teacher", teacherOnly, getTeacherExams);
router.get("/teacher/stats", teacherOnly, getExamStats);

// ==================== PARAMETERIZED EXAM ROUTES (/:id) ====================
// These MUST come after all literal and specific routes

// Get exam by ID - with validation for invalid ObjectIds
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    
    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid exam ID format. ID must be a valid 24-character hex string." 
        });
    }
    
    // Also reject common literal path values that shouldn't be treated as IDs
    const invalidPaths = ['my-attempts', 'student', 'teacher', 'attempt', 'cron', 'start'];
    if (invalidPaths.includes(id)) {
        return res.status(400).json({ 
            success: false, 
            message: `Invalid route. '${id}' is not a valid exam ID.` 
        });
    }
    
    next();
}, getExamById);

router.get("/:id/stats", teacherOnly, getExamStats);
router.put("/:id", teacherOnly, updateExam);
router.delete("/:id", teacherOnly, deleteExam);
router.patch("/:id/publish", teacherOnly, togglePublishExam);

// Results and Analytics
router.get("/:id/results", teacherOnly, getExamResults);

// ==================== ADMIN/CRON ROUTES ====================

router.post("/cron/expire", autoSubmitExpired);

// ==================== FILE UPLOAD ROUTES ====================

// Upload file for exam answer (student)
router.post(
    "/attempt/:attemptId/upload",
    protect,
    examUpload.single("file"),
    uploadExamFile
);

// Download uploaded file (teacher or student)
router.get(
    "/attempt/:attemptId/file/:questionId",
    protect,
    downloadExamFile
);

// Grade file upload question (teacher)
router.post(
    "/attempt/:attemptId/grade",
    teacherOnly,
    gradeExamAnswer
);

export default router;
