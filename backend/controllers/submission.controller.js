import Submission from "../models/submissionModel.js";
import Assignment from "../models/assignmentModel.js";

// Submit or update an assignment
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { textAnswer, submissionType } = req.body;

        // Get assignment details
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if assignment is still accepting submissions
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const isLate = now > dueDate;

        // Check if submissions are still allowed (can customize this rule)
        if (assignment.status === "closed" || assignment.status === "archived") {
            return res.status(400).json({ message: "This assignment is no longer accepting submissions" });
        }

        // Check if student already has a submission
        let submission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user.id,
        });

        // Handle files - store file data directly in MongoDB
        const files = req.files ? req.files.map((file) => ({
            filename: file.originalname,
            contentType: file.mimetype,
            size: file.size,
            data: file.buffer, // Store binary data directly
            originalName: file.originalname,
        })) : [];

        if (submission) {
            // Update existing submission
            const previousData = {
                submittedAt: submission.submittedAt,
                files: submission.files,
                textAnswer: submission.textAnswer,
            };

            // Store previous submission data
            submission.previousSubmissions.push(previousData);

            // Update with new data
            submission.submissionNumber += 1;
            submission.submittedAt = now;
            submission.isLate = isLate || submission.isLate;
            submission.status = "submitted";

            if (files.length > 0) {
                submission.files = files;
            }

            if (textAnswer) {
                submission.textAnswer = textAnswer;
            }

            if (submissionType) {
                submission.submissionType = submissionType;
            }

            await submission.save();
        } else {
            // Create new submission
            submission = await Submission.create({
                assignment: assignmentId,
                student: req.user.id,
                course: assignment.course,
                submissionType: submissionType || "file",
                files,
                textAnswer: textAnswer || "",
                status: "submitted",
                isLate,
                submittedAt: now,
                maxMarks: assignment.maxMarks,
            });

            // Update assignment total submissions count
            assignment.totalSubmissions += 1;
            await assignment.save();
        }

        res.status(201).json({
            success: true,
            message: isLate ? "Assignment submitted late" : "Assignment submitted successfully",
            submission,
        });
    } catch (error) {
        console.error("Submit assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all submissions for an assignment (teacher view)
export const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check authorization
        if (assignment.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const submissions = await Submission.find({ assignment: assignmentId })
            .populate("student", "name email profileImage")
            .sort({ submittedAt: -1 });

        // Calculate stats
        const stats = {
            total: submissions.length,
            submitted: submissions.filter((s) => s.status === "submitted").length,
            graded: submissions.filter((s) => s.status === "graded").length,
            late: submissions.filter((s) => s.isLate).length,
        };

        res.status(200).json({
            success: true,
            submissions,
            stats,
        });
    } catch (error) {
        console.error("Get submissions error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single submission details
export const getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId)
            .populate("student", "name email profileImage")
            .populate("assignment", "title description instructions dueDate maxMarks")
            .populate("gradedBy", "name email");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Check authorization
        const isTeacher = submission.assignment.instructor?.toString() === req.user.id;
        const isStudent = submission.student._id.toString() === req.user.id;

        if (!isTeacher && !isStudent && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            success: true,
            submission,
        });
    } catch (error) {
        console.error("Get submission error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Grade a submission
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks, feedback, latePenalty } = req.body;

        const submission = await Submission.findById(submissionId).populate("assignment");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Check authorization
        if (submission.assignment.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update submission
        submission.marks = parseFloat(marks);
        submission.feedback = feedback || "";
        submission.status = "graded";
        submission.gradedBy = req.user.id;
        submission.gradedAt = new Date();

        if (latePenalty !== undefined) {
            submission.latePenalty = parseFloat(latePenalty);
        }

        await submission.save();

        // Update assignment graded submissions count
        const gradedCount = await Submission.countDocuments({
            assignment: submission.assignment._id,
            status: "graded",
        });

        const assignment = await Assignment.findById(submission.assignment._id);
        assignment.gradedSubmissions = gradedCount;

        // Calculate average score
        const gradedSubmissions = await Submission.find({
            assignment: submission.assignment._id,
            status: "graded",
        });

        const avgScore = gradedSubmissions.reduce((sum, s) => sum + (s.marks || 0), 0) / gradedSubmissions.length;
        assignment.averageScore = Math.round(avgScore * 100) / 100;

        await assignment.save();

        res.status(200).json({
            success: true,
            message: "Submission graded successfully",
            submission,
        });
    } catch (error) {
        console.error("Grade submission error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get student's own submissions
export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user.id })
            .populate("assignment", "title dueDate maxMarks")
            .populate("course", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            submissions,
        });
    } catch (error) {
        console.error("Get my submissions error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete submission (student can delete before deadline)
export const deleteSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Check authorization - only student who created it
        if (submission.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Check if can delete (before deadline)
        const assignment = await Assignment.findById(submission.assignment);
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);

        if (now > dueDate) {
            return res.status(400).json({ message: "Cannot delete submission after deadline" });
        }

        // Delete files from cloudinary
        if (submission.files && submission.files.length > 0) {
            for (const file of submission.files) {
                try {
                    await cloudinary.uploader.destroy(file.public_id);
                } catch (err) {
                    console.error("Error deleting file from cloudinary:", err);
                }
            }
        }

        // Update assignment total submissions count
        await Assignment.findByIdAndUpdate(submission.assignment, {
            $inc: { totalSubmissions: -1 },
        });

        await submission.deleteOne();

        res.status(200).json({
            success: true,
            message: "Submission deleted successfully",
        });
    } catch (error) {
        console.error("Delete submission error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get submission statistics for a course (teacher)
export const getCourseSubmissionStats = async (req, res) => {
    try {
        const { courseId } = req.params;

        const assignments = await Assignment.find({
            course: courseId,
            instructor: req.user.id,
        }).select("_id");

        const assignmentIds = assignments.map((a) => a._id);

        const stats = await Submission.aggregate([
            { $match: { assignment: { $in: assignmentIds } } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const result = {
            totalSubmissions: 0,
            graded: 0,
            submitted: 0,
            pending: 0,
            late: 0,
        };

        stats.forEach((stat) => {
            result[stat._id] = stat.count;
            result.totalSubmissions += stat.count;
        });

        // Get late count
        result.late = await Submission.countDocuments({
            assignment: { $in: assignmentIds },
            isLate: true,
        });

        // Get average marks
        const gradeStats = await Submission.aggregate([
            { $match: { assignment: { $in: assignmentIds }, status: "graded" } },
            {
                $group: {
                    _id: null,
                    avgMarks: { $avg: "$marks" },
                    highestMarks: { $max: "$marks" },
                    lowestMarks: { $min: "$marks" },
                },
            },
        ]);

        if (gradeStats.length > 0) {
            result.averageMarks = Math.round(gradeStats[0].avgMarks * 100) / 100;
            result.highestMarks = gradeStats[0].highestMarks;
            result.lowestMarks = gradeStats[0].lowestMarks;
        }

        res.status(200).json({
            success: true,
            stats: result,
        });
    } catch (error) {
        console.error("Get course stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Download submission file
export const downloadSubmissionFile = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { fileIndex } = req.query;

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const index = parseInt(fileIndex);
        if (isNaN(index) || index < 0 || index >= submission.files.length) {
            return res.status(404).json({ message: "File not found" });
        }

        const file = submission.files[index];

        res.setHeader("Content-Type", file.contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
        res.send(file.data);
    } catch (error) {
        console.error("Download submission file error:", error);
        res.status(500).json({ message: error.message });
    }
};

