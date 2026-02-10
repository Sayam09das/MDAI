import Assignment from "../models/assignmentModel.js";
import Submission from "../models/submissionModel.js";
import Course from "../models/Course.js";

// Create a new assignment
export const createAssignment = async (req, res) => {
    try {
        const {
            title,
            description,
            instructions,
            course,
            dueDate,
            maxMarks,
            submissionType,
            allowedFileTypes,
            maxFileSize,
            reminderDaysBeforeDue,
        } = req.body;

        // Verify course belongs to teacher
        const courseDoc = await Course.findOne({
            _id: course,
            instructor: req.user.id,
        });

        if (!courseDoc) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        // Handle attachments - store file data directly in MongoDB
        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map((file) => ({
                filename: file.originalname,
                contentType: file.mimetype,
                size: file.size,
                data: file.buffer, // Store binary data directly
                originalName: file.originalname,
            }));
        }

        const assignment = await Assignment.create({
            title,
            description,
            instructions: instructions || "",
            course,
            instructor: req.user.id,
            dueDate: new Date(dueDate),
            maxMarks: parseInt(maxMarks),
            submissionType: submissionType || "file",
            allowedFileTypes: allowedFileTypes || [".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"],
            maxFileSize: parseInt(maxFileSize) || 10,
            reminderDaysBeforeDue: parseInt(reminderDaysBeforeDue) || 1,
            attachments,
        });

        res.status(201).json({
            success: true,
            assignment,
        });
    } catch (error) {
        console.error("Create assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments for a teacher
export const getTeacherAssignments = async (req, res) => {
    try {
        const { status, course, search } = req.query;

        const query = { instructor: req.user.id };

        if (status && status !== "all") {
            query.status = status;
        }

        if (course && course !== "all") {
            query.course = course;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const assignments = await Assignment.find(query)
            .populate("course", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            assignments,
        });
    } catch (error) {
        console.error("Get teacher assignments error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single assignment by ID
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("course", "title description")
            .populate("instructor", "name email profileImage");

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization for teachers
        if (req.user.role === "teacher" && assignment.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            success: true,
            assignment,
        });
    } catch (error) {
        console.error("Get assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update assignment
export const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization
        if (assignment.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const allowedUpdates = [
            "title",
            "description",
            "instructions",
            "dueDate",
            "maxMarks",
            "submissionType",
            "allowedFileTypes",
            "maxFileSize",
            "status",
            "reminderDaysBeforeDue",
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === "dueDate") {
                    assignment[field] = new Date(req.body[field]);
                } else {
                    assignment[field] = req.body[field];
                }
            }
        });

        // Handle new attachments - store file data directly in MongoDB
        if (req.files && req.files.length > 0) {
            const newAttachments = req.files.map((file) => ({
                filename: file.originalname,
                contentType: file.mimetype,
                size: file.size,
                data: file.buffer,
                originalName: file.originalname,
            }));
            assignment.attachments = [...assignment.attachments, ...newAttachments];
        }

        await assignment.save();

        res.status(200).json({
            success: true,
            assignment,
        });
    } catch (error) {
        console.error("Update assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization
        if (assignment.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Delete all submissions for this assignment
        await Submission.deleteMany({ assignment: assignment._id });

        // Delete assignment
        await assignment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
        });
    } catch (error) {
        console.error("Delete assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Publish/unpublish assignment
export const togglePublish = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization
        if (assignment.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        assignment.isPublished = !assignment.isPublished;

        if (assignment.isPublished && !assignment.publishedAt) {
            assignment.publishedAt = new Date();
        }

        if (assignment.isPublished) {
            assignment.status = "active";
        } else {
            assignment.status = "draft";
        }

        await assignment.save();

        res.status(200).json({
            success: true,
            message: assignment.isPublished ? "Assignment published" : "Assignment unpublished",
            assignment,
        });
    } catch (error) {
        console.error("Toggle publish error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get assignments for a course (for students)
export const getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;

        const assignments = await Assignment.find({
            course: courseId,
            isPublished: true,
        })
            .populate("instructor", "name email profileImage")
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            assignments,
        });
    } catch (error) {
        console.error("Get course assignments error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get assignment statistics for teacher dashboard
export const getAssignmentStats = async (req, res) => {
    try {
        const assignments = await Assignment.find({ instructor: req.user.id });

        const stats = {
            total: assignments.length,
            active: assignments.filter((a) => a.status === "active").length,
            draft: assignments.filter((a) => a.status === "draft").length,
            closed: assignments.filter((a) => a.status === "closed").length,
            totalSubmissions: assignments.reduce((sum, a) => sum + (a.totalSubmissions || 0), 0),
            gradedSubmissions: assignments.reduce((sum, a) => sum + (a.gradedSubmissions || 0), 0),
        };

        res.status(200).json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error("Get assignment stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments for student (enrolled courses)
export const getStudentAssignments = async (req, res) => {
    try {
        const Enrollment = (await import("../models/enrollmentModel.js")).default;

        const enrollments = await Enrollment.find({
            student: req.user.id,
            status: "ACTIVE",
        }).select("course");

        const courseIds = enrollments.map((e) => e.course);

        const assignments = await Assignment.find({
            course: { $in: courseIds },
            isPublished: true,
        })
            .populate("course", "title")
            .populate("instructor", "name email")
            .sort({ dueDate: 1 });

        // Get submission status for each assignment
        const assignmentsWithStatus = await Promise.all(
            assignments.map(async (assignment) => {
                const submission = await Submission.findOne({
                    assignment: assignment._id,
                    student: req.user.id,
                });

                const now = new Date();
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = now > dueDate;

                return {
                    ...assignment.toObject(),
                    submission: submission
                        ? {
                              id: submission._id,
                              status: submission.status,
                              submittedAt: submission.submittedAt,
                              isLate: submission.isLate,
                              marks: submission.marks,
                          }
                        : null,
                    isOverdue,
                };
            })
        );

        res.status(200).json({
            success: true,
            assignments: assignmentsWithStatus,
        });
    } catch (error) {
        console.error("Get student assignments error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Download assignment attachment
export const downloadAssignmentAttachment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { attachmentIndex } = req.query;

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const attachment = assignment.attachments[attachmentIndex];

        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        res.setHeader("Content-Type", attachment.contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${attachment.originalName}"`);
        res.send(attachment.data);
    } catch (error) {
        console.error("Download attachment error:", error);
        res.status(500).json({ message: error.message });
    }
};

