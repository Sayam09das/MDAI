import express from "express";
import {
    createExam,
    getTeacherExams,
    getExamById,
    updateExam,
    deleteExam,
    togglePublishExam,
    getExamSubmissions,
    getExamStats,
    getStudentExams,
    getMySubmission,
    submitExam,
    downloadAnswerFile,
    gradeSubmission,
    getSubmissionDetails,
    publishResult,
    publishAllResults,
    getMySubmissions,
    uploadQuestionPaper,
    downloadQuestionPaper
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

// Student's own submissions
router.get("/my-submissions", getMySubmissions);

// Get student's submission for specific exam
router.get("/:examId/my-submission", getMySubmission);

// Submit exam (upload answer file)
router.post(
    "/:examId/submit",
    examUpload.single("file"),
    submitExam
);

// ==================== TEACHER ROUTES ====================

// Exam CRUD
router.post("/", teacherOnly, createExam);
router.get("/teacher", teacherOnly, getTeacherExams);
router.get("/teacher/stats", teacherOnly, getExamStats);

// Upload question paper - with validation
router.post(
    "/:id/question-paper",
    teacherOnly,
    (req, res, next) => {
        const { id } = req.params;
        
        // Check if the ID is a valid MongoDB ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid exam ID format. ID must be a valid 24-character hex string." 
            });
        }
        
        // Also reject common literal path values
        const invalidPaths = ['my-submission', 'my-submissions', 'student', 'teacher', 'attempt', 'cron', 'start', 'submit'];
        if (invalidPaths.includes(id)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid route. '${id}' is not a valid exam ID.` 
            });
        }
        
        next();
    },
    examUpload.single("file"),
    uploadQuestionPaper
);

// Download question paper - with validation
router.get(
    "/:id/question-paper",
    (req, res, next) => {
        const { id } = req.params;
        
        // Check if the ID is a valid MongoDB ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid exam ID format. ID must be a valid 24-character hex string." 
            });
        }
        
        // Also reject common literal path values
        const invalidPaths = ['my-submission', 'my-submissions', 'student', 'teacher', 'attempt', 'cron', 'start', 'submit'];
        if (invalidPaths.includes(id)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid route. '${id}' is not a valid exam ID.` 
            });
        }
        
        next();
    },
    downloadQuestionPaper
);

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
    const invalidPaths = ['my-submission', 'my-submissions', 'student', 'teacher', 'attempt', 'cron', 'start', 'submit'];
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

// Get exam submissions (for teachers)
router.get("/:id/submissions", teacherOnly, getExamSubmissions);

// Publish all results for an exam
router.post("/:id/publish-all", teacherOnly, publishAllResults);

// ==================== SUBMISSION ROUTES ====================

// Download student's answer file (teacher)
router.get(
    "/submission/:submissionId/download",
    teacherOnly,
    downloadAnswerFile
);

// Grade submission (teacher)
router.post(
    "/submission/:submissionId/grade",
    teacherOnly,
    gradeSubmission
);

// Publish single result (teacher)
router.post(
    "/submission/:submissionId/publish",
    teacherOnly,
    publishResult
);

// Get submission details (teacher)
router.get(
    "/submission/:submissionId/details",
    teacherOnly,
    getSubmissionDetails
);

export default router;

