import express from "express";
import {
    submitAssignment,
    getAssignmentSubmissions,
    getSubmissionById,
    gradeSubmission,
    getMySubmissions,
    deleteSubmission,
    getCourseSubmissionStats,
} from "../controllers/submission.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student routes
router.post(
    "/:assignmentId",
    upload.array("files", 10),
    submitAssignment
);

router.get("/my", getMySubmissions);

router.delete("/:submissionId", deleteSubmission);

// Teacher routes
router.get(
    "/assignment/:assignmentId",
    teacherOnly,
    getAssignmentSubmissions
);

router.get("/course/:courseId/stats", teacherOnly, getCourseSubmissionStats);

router.get("/:submissionId", getSubmissionById);

router.put("/:submissionId/grade", teacherOnly, gradeSubmission);

export default router;

