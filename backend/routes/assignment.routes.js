import express from "express";
import {
    createAssignment,
    getTeacherAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    togglePublish,
    getCourseAssignments,
    getAssignmentStats,
    getStudentAssignments,
    downloadAssignmentAttachment,
} from "../controllers/assignment.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student routes
router.get("/student", getStudentAssignments);
router.get("/course/:courseId", getCourseAssignments);

// Teacher routes
router.post(
    "/",
    teacherOnly,
    upload.array("attachments", 5),
    createAssignment
);

router.get("/teacher", teacherOnly, getTeacherAssignments);
router.get("/teacher/stats", teacherOnly, getAssignmentStats);

router.get("/:id", getAssignmentById);

router.put(
    "/:id",
    teacherOnly,
    upload.array("attachments", 5),
    updateAssignment
);

router.delete("/:id", teacherOnly, deleteAssignment);
router.patch("/:id/toggle-publish", teacherOnly, togglePublish);
router.delete("/:id/attachments/:publicId", teacherOnly, async (req, res) => {
    try {
        const Assignment = (await import("../models/assignmentModel.js")).default;
        
        const assignment = await Assignment.findById(req.params.id);
        
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        
        if (assignment.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        // Remove attachment by index (now using filename as identifier)
        const index = parseInt(req.params.publicId);
        if (!isNaN(index) && index >= 0 && index < assignment.attachments.length) {
            assignment.attachments.splice(index, 1);
            await assignment.save();
        } else {
            return res.status(404).json({ message: "Attachment not found" });
        }
        
        res.status(200).json({
            success: true,
            message: "Attachment deleted successfully",
            assignment,
        });
    } catch (error) {
        console.error("Delete attachment error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Download assignment attachment
router.get("/:assignmentId/download", protect, async (req, res) => {
    try {
        const { attachmentIndex } = req.query;
        const Assignment = (await import("../models/assignmentModel.js")).default;
        
        const assignment = await Assignment.findById(req.params.assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const index = parseInt(attachmentIndex);
        if (isNaN(index) || index < 0 || index >= assignment.attachments.length) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        const attachment = assignment.attachments[index];

        res.setHeader("Content-Type", attachment.contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${attachment.originalName}"`);
        res.send(attachment.data);
    } catch (error) {
        console.error("Download attachment error:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;

