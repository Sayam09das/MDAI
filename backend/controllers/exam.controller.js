import ExamSession from "../models/examModel.js";
import Assignment from "../models/assignmentModel.js";
import Submission from "../models/submissionModel.js";

// Configuration constants
const EXAM_CONFIG = {
    MAX_TIME_OUTSIDE: 5 * 60 * 1000, // 5 minutes in milliseconds
    HEARTBEAT_TIMEOUT: 2 * 60 * 1000, // 2 minutes timeout
    WARNING_THRESHOLDS: [1, 3, 5], // Warning at 1st, 3rd, 5th violation
    AUTO_SUBMIT_VIOLATIONS: 5 // Auto-submit after 5 violations
};

/**
 * Start an exam session
 * POST /api/exams/:assignmentId/start
 */
export const startExam = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { duration } = req.body;

        // Get assignment details
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Verify student is enrolled
        const Enrollment = (await import("../models/enrollmentModel.js")).default;
        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: assignment.course,
            $or: [{ status: "ACTIVE" }, { paymentStatus: { $in: ["PAID", "LATER"] } }]
        });

        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        // Check if assignment is published
        if (!assignment.isPublished) {
            return res.status(403).json({ message: "Assignment is not published" });
        }

        // Check if assignment is still open
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        
        if (now > dueDate) {
            return res.status(400).json({ message: "Assignment deadline has passed" });
        }

        // Check for existing active session
        const existingSession = await ExamSession.findOne({
            assignment: assignmentId,
            student: req.user.id,
            status: { $in: ["NOT_STARTED", "IN_PROGRESS"] }
        });

        if (existingSession) {
            // Return existing session
            return res.status(200).json({
                success: true,
                message: existingSession.status === "NOT_STARTED" ? 
                    "Exam session exists but not started" : 
                    "Continuing existing exam session",
                examSession: existingSession,
                resuming: existingSession.status === "IN_PROGRESS"
            });
        }

        // Calculate exam duration
        const examDuration = duration || 60; // Default 60 minutes
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + examDuration * 60 * 1000);

        // Create new exam session
        const examSession = await ExamSession.create({
            assignment: assignmentId,
            student: req.user.id,
            course: assignment.course,
            startTime,
            endTime,
            duration: examDuration,
            status: "IN_PROGRESS",
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        // Check for any existing submission
        const existingSubmission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user.id
        });

        if (existingSubmission) {
            // Delete existing submission if resubmission is allowed
            if (assignment.status === "active") {
                await Submission.findByIdAndDelete(existingSubmission._id);
            }
        }

        res.status(201).json({
            success: true,
            message: "Exam session started successfully",
            examSession: {
                id: examSession._id,
                startTime: examSession.startTime,
                endTime: examSession.endTime,
                duration: examSession.duration,
                status: examSession.status
            }
        });
    } catch (error) {
        console.error("Start exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Submit exam with answers
 * POST /api/exams/:examId/submit
 */
export const submitExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const { answers, timeSpent } = req.body;

        // Get exam session
        const examSession = await ExamSession.findById(examId);

        if (!examSession) {
            return res.status(404).json({ message: "Exam session not found" });
        }

        // Verify ownership
        if (examSession.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access to exam session" });
        }

        // Check if already submitted
        if (["SUBMITTED", "AUTO_SUBMITTED", "DISQUALIFIED"].includes(examSession.status)) {
            return res.status(400).json({ 
                message: "Exam has already been submitted or disqualified",
                status: examSession.status
            });
        }

        // Get assignment for max marks
        const assignment = await Assignment.findById(examSession.assignment);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Validate server-side time
        const now = new Date();
        const isLate = now > examSession.endTime;

        // Update exam session
        examSession.status = isLate ? "AUTO_SUBMITTED" : "SUBMITTED";
        examSession.answers = new Map(Object.entries(answers || {}));
        
        if (timeSpent) {
            examSession.endTime = new Date();
        }

        await examSession.save();

        // Create submission
        const submission = await Submission.create({
            assignment: examSession.assignment,
            student: req.user.id,
            course: examSession.course,
            submissionType: "exam",
            textAnswer: JSON.stringify(answers || {}),
            status: isLate ? "submitted" : "submitted",
            isLate,
            submittedAt: now,
            maxMarks: assignment.maxMarks
        });

        // Update exam session with submission reference
        examSession.submission = submission._id;
        await examSession.save();

        // Update assignment submission count
        assignment.totalSubmissions += 1;
        await assignment.save();

        res.status(200).json({
            success: true,
            message: isLate ? "Exam submitted late" : "Exam submitted successfully",
            submission: {
                id: submission._id,
                status: submission.status,
                isLate: submission.isLate,
                submittedAt: submission.submittedAt
            },
            examSession: {
                id: examSession._id,
                status: examSession.status,
                violations: examSession.violations.length,
                timeOutside: examSession.timeOutside
            }
        });
    } catch (error) {
        console.error("Submit exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Send heartbeat to keep exam active
 * POST /api/exams/:examId/heartbeat
 */
export const heartbeat = async (req, res) => {
    try {
        const { examId } = req.params;
        const { status, timeOutside, pageStatus } = req.body;

        const examSession = await ExamSession.findById(examId);

        if (!examSession) {
            return res.status(404).json({ message: "Exam session not found" });
        }

        if (examSession.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!["IN_PROGRESS"].includes(examSession.status)) {
            return res.status(400).json({ 
                message: "Exam is not in progress",
                status: examSession.status
            });
        }

        // Update time outside if provided
        if (timeOutside !== undefined) {
            examSession.timeOutside = timeOutside;
        }

        // Update page status if provided
        if (pageStatus) {
            examSession.violations.push({
                type: "TAB_SWITCH",
                timestamp: new Date(),
                details: `Page status: ${pageStatus}`
            });
        }

        // Update last heartbeat
        examSession.lastHeartbeat = new Date();
        examSession.heartbeatMissed = 0;

        // Check if time outside exceeds limit
        if (examSession.timeOutside > EXAM_CONFIG.MAX_TIME_OUTSIDE) {
            // Auto-disqualify
            examSession.status = "DISQUALIFIED";
            examSession.disqualifiedAt = new Date();
            examSession.disqualifiedReason = "Exceeded maximum time outside exam window";
            examSession.autoSubmitReason = "TIME_OUTSIDE_EXCEEDED";

            await examSession.save();

            return res.status(200).json({
                success: true,
                message: "Exam session ended due to time outside limit",
                disqualified: true,
                reason: "Exceeded 5 minutes outside exam window"
            });
        }

        // Check if exam has expired
        const now = new Date();
        if (now > examSession.endTime) {
            examSession.status = "EXPIRED";
            await examSession.save();

            return res.status(200).json({
                success: true,
                message: "Exam time has expired",
                expired: true
            });
        }

        await examSession.save();

        res.status(200).json({
            success: true,
            message: "Heartbeat received",
            remainingTime: Math.max(0, examSession.endTime - now),
            violations: examSession.totalViolations
        });
    } catch (error) {
        console.error("Heartbeat error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Report a violation
 * POST /api/exams/:examId/violation
 */
export const reportViolation = async (req, res) => {
    try {
        const { examId } = req.params;
        const { type, details, duration } = req.body;

        const examSession = await ExamSession.findById(examId);

        if (!examSession) {
            return res.status(404).json({ message: "Exam session not found" });
        }

        if (examSession.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!["IN_PROGRESS"].includes(examSession.status)) {
            return res.status(400).json({ 
                message: "Exam is not in progress",
                status: examSession.status
            });
        }

        // Add violation
        examSession.violations.push({
            type,
            timestamp: new Date(),
            details: details || "",
            duration: duration || 0
        });

        // Update specific counters
        if (type === "TAB_SWITCH" || type === "WINDOW_BLUR") {
            examSession.tabSwitchCount += 1;
        } else if (type === "TIME_OUTSIDE_EXCEEDED") {
            examSession.timeOutside += (duration || 0);
        } else if (type === "FULLSCREEN_EXIT") {
            examSession.fullscreenExits += 1;
        }

        const totalViolations = examSession.violations.length;

        // Check for disqualification thresholds
        let warningLevel = null;
        if (EXAM_CONFIG.WARNING_THRESHOLDS.includes(totalViolations)) {
            warningLevel = totalViolations;
        }

        // Check if should auto-submit due to violations
        if (totalViolations >= EXAM_CONFIG.AUTO_SUBMIT_VIOLATIONS) {
            examSession.status = "DISQUALIFIED";
            examSession.disqualifiedAt = new Date();
            examSession.disqualifiedReason = `Exceeded maximum violations (${totalViolations})`;
            examSession.autoSubmitReason = "DISQUALIFIED";

            await examSession.save();

            return res.status(200).json({
                success: true,
                message: "Exam disqualified due to violations",
                disqualified: true,
                reason: `Too many violations (${totalViolations})`,
                violationCount: totalViolations
            });
        }

        await examSession.save();

        res.status(200).json({
            success: true,
            message: "Violation recorded",
            violationCount: totalViolations,
            warning: warningLevel ? {
                level: warningLevel,
                message: warningLevel === 1 
                    ? "First warning: Do not leave the exam window"
                    : warningLevel === 3
                    ? "Second warning: Multiple violations recorded"
                    : "Final warning: One more violation and you'll be disqualified"
            } : null,
            timeOutside: examSession.timeOutside
        });
    } catch (error) {
        console.error("Report violation error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get exam session status
 * GET /api/exams/:examId/status
 */
export const getExamStatus = async (req, res) => {
    try {
        const { examId } = req.params;

        const examSession = await ExamSession.findById(examId)
            .populate("assignment", "title description maxMarks duration")
            .populate("course", "title");

        if (!examSession) {
            return res.status(404).json({ message: "Exam session not found" });
        }

        // Check authorization
        const isStudent = examSession.student.toString() === req.user.id;
        const isTeacher = req.user.role === "teacher" || req.user.role === "admin";

        if (!isStudent && !isTeacher) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Calculate remaining time
        const now = new Date();
        const remainingTime = Math.max(0, examSession.endTime - now);

        // Format violations for response
        const violations = examSession.violations.map(v => ({
            type: v.type,
            timestamp: v.timestamp,
            details: v.details
        }));

        res.status(200).json({
            success: true,
            examSession: {
                id: examSession._id,
                status: examSession.status,
                startTime: examSession.startTime,
                endTime: examSession.endTime,
                remainingTime,
                duration: examSession.duration,
                totalViolations: examSession.totalViolations,
                tabSwitchCount: examSession.tabSwitchCount,
                timeOutside: examSession.timeOutside,
                fullscreenExits: examSession.fullscreenExits,
                violations,
                disqualifiedReason: examSession.disqualifiedReason,
                autoSubmitReason: examSession.autoSubmitReason,
                assignment: examSession.assignment ? {
                    id: examSession.assignment._id,
                    title: examSession.assignment.title,
                    maxMarks: examSession.assignment.maxMarks
                } : null,
                course: examSession.course
            }
        });
    } catch (error) {
        console.error("Get exam status error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get student's active exams
 * GET /api/exams/student/active
 */
export const getActiveExams = async (req, res) => {
    try {
        const sessions = await ExamSession.find({
            student: req.user.id,
            status: { $in: ["NOT_STARTED", "IN_PROGRESS"] }
        })
            .populate("assignment", "title dueDate duration maxMarks")
            .populate("course", "title");

        res.status(200).json({
            success: true,
            sessions: sessions.map(s => ({
                id: s._id,
                status: s.status,
                assignment: s.assignment,
                course: s.course,
                startTime: s.startTime,
                endTime: s.endTime,
                remainingTime: Math.max(0, s.endTime - new Date())
            }))
        });
    } catch (error) {
        console.error("Get active exams error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get student's exam history
 * GET /api/exams/student/history
 */
export const getExamHistory = async (req, res) => {
    try {
        const sessions = await ExamSession.find({
            student: req.user.id,
            status: { $in: ["SUBMITTED", "AUTO_SUBMITTED", "DISQUALIFIED", "EXPIRED"] }
        })
            .populate("assignment", "title maxMarks")
            .populate("course", "title")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            sessions: sessions.map(s => ({
                id: s._id,
                status: s.status,
                assignment: s.assignment,
                course: s.course,
                startTime: s.startTime,
                endTime: s.endTime,
                totalViolations: s.totalViolations,
                tabSwitchCount: s.tabSwitchCount,
                timeOutside: s.timeOutside,
                disqualifiedReason: s.disqualifiedReason,
                autoSubmitReason: s.autoSubmitReason,
                submission: s.submission
            }))
        });
    } catch (error) {
        console.error("Get exam history error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get exam analytics for teacher
 * GET /api/exams/analytics/:assignmentId
 */
export const getExamAnalytics = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        // Verify teacher owns the assignment
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (assignment.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get all exam sessions for this assignment
        const sessions = await ExamSession.find({
            assignment: assignmentId
        })
            .populate("student", "name email")
            .sort({ startTime: -1 });

        // Calculate analytics
        const analytics = {
            totalSessions: sessions.length,
            inProgress: sessions.filter(s => s.status === "IN_PROGRESS").length,
            submitted: sessions.filter(s => s.status === "SUBMITTED").length,
            autoSubmitted: sessions.filter(s => s.status === "AUTO_SUBMITTED").length,
            disqualified: sessions.filter(s => s.status === "DISQUALIFIED").length,
            expired: sessions.filter(s => s.status === "EXPIRED").length,
            
            // Violation statistics
            totalViolations: sessions.reduce((sum, s) => sum + s.totalViolations, 0),
            avgViolations: sessions.length > 0 
                ? Math.round(sessions.reduce((sum, s) => sum + s.totalViolations, 0) / sessions.length * 100) / 100 
                : 0,
            avgTimeOutside: sessions.length > 0 
                ? Math.round(sessions.reduce((sum, s) => sum + s.timeOutside, 0) / sessions.length) 
                : 0,
            
            // Session details
            sessions: sessions.map(s => ({
                id: s._id,
                student: s.student,
                status: s.status,
                startTime: s.startTime,
                endTime: s.endTime,
                totalViolations: s.totalViolations,
                tabSwitchCount: s.tabSwitchCount,
                timeOutside: s.timeOutside,
                disqualifiedReason: s.disqualifiedReason
            }))
        };

        res.status(200).json({
            success: true,
            analytics
        });
    } catch (error) {
        console.error("Get exam analytics error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Auto-submit all expired exams (cron job helper)
 * POST /api/exams/cron/expire
 */
export const autoSubmitExpired = async (req, res) => {
    try {
        const now = new Date();

        // Find all in-progress exams that have expired
        const expiredSessions = await ExamSession.find({
            status: "IN_PROGRESS",
            endTime: { $lt: now }
        });

        let submitted = 0;

        for (const session of expiredSessions) {
            // Update session status
            session.status = "AUTO_SUBMITTED";
            session.autoSubmitReason = "TIME_EXPIRED";
            await session.save();
            submitted++;
        }

        res.status(200).json({
            success: true,
            message: `Auto-submitted ${submitted} expired exams`
        });
    } catch (error) {
        console.error("Auto-submit expired error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Reset exam session (for testing/admin)
 * POST /api/exams/:examId/reset
 */
export const resetExamSession = async (req, res) => {
    try {
        const { examId } = req.params;

        const session = await ExamSession.findById(examId);

        if (!session) {
            return res.status(404).json({ message: "Exam session not found" });
        }

        // Only allow reset for non-submitted sessions
        if (["SUBMITTED", "AUTO_SUBMITTED"].includes(session.status)) {
            return res.status(400).json({ message: "Cannot reset submitted exam" });
        }

        // Delete session
        await session.deleteOne();

        res.status(200).json({
            success: true,
            message: "Exam session deleted successfully"
        });
    } catch (error) {
        console.error("Reset exam session error:", error);
        res.status(500).json({ message: error.message });
    }
};

