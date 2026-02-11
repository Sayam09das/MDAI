import Exam from "../models/examModel.js";
import ExamAttempt from "../models/examAttemptModel.js";
import Course from "../models/Course.js";

// ==================== TEACHER EXAM MANAGEMENT ====================

/**
 * Create a new exam
 * POST /api/exams
 */
export const createExam = async (req, res) => {
    try {
        const {
            title,
            description,
            course,
            duration,
            questions,
            passingMarks,
            shuffleQuestions,
            shuffleOptions,
            showResults,
            allowReview,
            startDate,
            endDate,
            maxAttempts,
            security
        } = req.body;

        // Verify course belongs to teacher
        const courseDoc = await Course.findOne({
            _id: course,
            instructor: req.user.id
        });

        if (!courseDoc) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        // Calculate total marks from questions
        const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

        const exam = await Exam.create({
            title,
            description,
            course,
            instructor: req.user.id,
            duration,
            totalMarks,
            passingMarks: passingMarks || 0,
            questions,
            shuffleQuestions: shuffleQuestions || false,
            shuffleOptions: shuffleOptions || false,
            showResults: showResults || false,
            allowReview: allowReview !== false,
            startDate: startDate || null,
            endDate: endDate || null,
            maxAttempts: maxAttempts || 1,
            security: security || {
                preventTabSwitch: true,
                preventCopyPaste: true,
                requireFullscreen: true,
                maxTimeOutside: 5,
                autoSubmitOnViolation: false
            }
        });

        res.status(201).json({
            success: true,
            message: "Exam created successfully",
            exam
        });
    } catch (error) {
        console.error("Create exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all exams for teacher
 * GET /api/exams/teacher
 */
export const getTeacherExams = async (req, res) => {
    try {
        const { status, course, search } = req.query;

        const query = { instructor: req.user.id };

        if (status && status !== "all") query.status = status;
        if (course && course !== "all") query.course = course;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const exams = await Exam.find(query)
            .populate("course", "title")
            .sort({ createdAt: -1 });

        // Transform exams to include id field for frontend compatibility
        const transformedExams = exams.map(exam => ({
            ...exam.toObject(),
            id: exam._id
        }));

        res.status(200).json({ success: true, exams: transformedExams });
    } catch (error) {
        console.error("Get teacher exams error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get single exam by ID
 * GET /api/exams/:id
 */
export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate("course", "title description")
            .populate("instructor", "name email");

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Check authorization
        const isTeacher = exam.instructor._id.toString() === req.user.id || req.user.role === "admin";
        
        if (req.user.role === "student") {
            // Students can only see published exams
            if (!exam.isPublished) {
                return res.status(403).json({ message: "Exam not available" });
            }

            // Check enrollment
            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            const enrollment = await Enrollment.findOne({
                student: req.user.id,
                course: exam.course._id,
                $or: [{ status: "ACTIVE" }, { paymentStatus: { $in: ["PAID", "LATER"] } }]
            });

            if (!enrollment) {
                return res.status(403).json({ message: "You are not enrolled in this course" });
            }

            // For students, don't send correct answers
            const examForStudent = exam.toObject();
            if (!isTeacher) {
                examForStudent.questions = examForStudent.questions.map(q => ({
                    _id: q._id,
                    type: q.type,
                    question: q.question,
                    options: q.options.map(o => ({ _id: o._id, text: o.text })),
                    marks: q.marks,
                    order: q.order
                }));
            }

            return res.status(200).json({ success: true, exam: examForStudent });
        }

        // Transform exam to include id field for frontend compatibility
        const examWithId = {
            ...exam.toObject(),
            id: exam._id
        };

        res.status(200).json({ success: true, exam: examWithId });
    } catch (error) {
        console.error("Get exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update exam
 * PUT /api/exams/:id
 */
export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const allowedUpdates = [
            "title", "description", "duration", "passingMarks",
            "shuffleQuestions", "shuffleOptions", "showResults",
            "allowReview", "startDate", "endDate", "maxAttempts", "security"
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                exam[field] = req.body[field];
            }
        });

        // Handle questions update
        if (req.body.questions) {
            exam.questions = req.body.questions;
            exam.totalMarks = req.body.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
        }

        await exam.save();

        res.status(200).json({
            success: true,
            message: "Exam updated successfully",
            exam
        });
    } catch (error) {
        console.error("Update exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete exam
 * DELETE /api/exams/:id
 */
export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Delete all attempts
        await ExamAttempt.deleteMany({ exam: exam._id });

        await exam.deleteOne();

        res.status(200).json({
            success: true,
            message: "Exam deleted successfully"
        });
    } catch (error) {
        console.error("Delete exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Publish/Unpublish exam
 * PATCH /api/exams/:id/publish
 */
export const togglePublishExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        exam.isPublished = !exam.isPublished;
        
        if (exam.isPublished) {
            exam.publishedAt = new Date();
            exam.status = exam.startDate && new Date(exam.startDate) > new Date() ? "scheduled" : "active";
        } else {
            exam.status = "draft";
        }

        await exam.save();

        res.status(200).json({
            success: true,
            message: exam.isPublished ? "Exam published" : "Exam unpublished",
            exam
        });
    } catch (error) {
        console.error("Toggle publish exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get exam results/attempts
 * GET /api/exams/:id/results
 */
export const getExamResults = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate("course", "title");

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const attempts = await ExamAttempt.find({ exam: exam._id })
            .populate("student", "name email profileImage")
            .sort({ submittedAt: -1 });

        // Calculate statistics
        const stats = {
            totalAttempts: attempts.length,
            submitted: attempts.filter(a => a.status === "SUBMITTED").length,
            disqualified: attempts.filter(a => a.status === "DISQUALIFIED").length,
            autoSubmitted: attempts.filter(a => a.status === "AUTO_SUBMITTED").length,
            avgScore: 0,
            highestScore: 0,
            lowestScore: 0,
            passRate: 0
        };

        const submittedAttempts = attempts.filter(a => a.status === "SUBMITTED");
        if (submittedAttempts.length > 0) {
            const scores = submittedAttempts.map(a => a.percentage);
            stats.avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            stats.highestScore = Math.max(...scores);
            stats.lowestScore = Math.min(...scores);
            stats.passRate = Math.round((submittedAttempts.filter(a => a.passed).length / submittedAttempts.length) * 100);
        }

        res.status(200).json({
            success: true,
            exam: {
                id: exam._id,
                title: exam.title,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks
            },
            stats,
            attempts: attempts.map(a => ({
                id: a._id,
                student: a.student,
                status: a.status,
                marks: a.obtainedMarks,
                totalMarks: a.totalMarks,
                percentage: a.percentage,
                passed: a.passed,
                timeTaken: a.timeTaken,
                totalViolations: a.totalViolations,
                tabSwitchCount: a.tabSwitchCount,
                timeOutside: a.timeOutside,
                submittedAt: a.submittedAt,
                attemptNumber: a.attemptNumber
            }))
        });
    } catch (error) {
        console.error("Get exam results error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get exam statistics
 * GET /api/exams/:id/stats
 */
export const getExamStats = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const dbStats = await ExamAttempt.getExamStats(exam._id);

        res.status(200).json({
            success: true,
            stats: dbStats,
            exam: {
                id: exam._id,
                title: exam.title,
                totalMarks: exam.totalMarks,
                status: exam.status,
                isPublished: exam.isPublished
            }
        });
    } catch (error) {
        console.error("Get exam stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==================== STUDENT EXAM ATTEMPTS ====================

/**
 * Start exam attempt
 * POST /api/exams/:examId/start
 * 
 * IMPORTANT: Timer starts from server time when student clicks start
 * Timer continues even after page refresh, internet disconnect, or re-login
 * Server calculates remaining time from stored startTime and endTime
 */
export const startExamAttempt = async (req, res) => {
    try {
        const { examId } = req.params;

        const exam = await Exam.findById(examId)
            .populate("course", "title");

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Check if exam is published
        if (!exam.isPublished) {
            return res.status(403).json({ message: "Exam is not available" });
        }

        // Check dates
        const now = new Date();
        if (exam.startDate && now < new Date(exam.startDate)) {
            return res.status(400).json({ 
                message: "Exam has not started yet",
                startsAt: exam.startDate
            });
        }
        if (exam.endDate && now > new Date(exam.endDate)) {
            return res.status(400).json({ message: "Exam has ended" });
        }

        // Check enrollment
        const Enrollment = (await import("../models/enrollmentModel.js")).default;
        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: exam.course._id,
            $or: [{ status: "ACTIVE" }, { paymentStatus: { $in: ["PAID", "LATER"] } }]
        });

        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        // Check for existing active attempt
        const existingAttempt = await ExamAttempt.findOne({
            exam: examId,
            student: req.user.id,
            status: "IN_PROGRESS"
        });

        if (existingAttempt) {
            // Calculate remaining time from server
            const remainingMs = new Date(existingAttempt.endTime) - new Date();
            const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

            // Return existing attempt with server-calculated remaining time
            return res.status(200).json({
                success: true,
                message: "Resuming existing attempt",
                attempt: {
                    id: existingAttempt._id,
                    startTime: existingAttempt.startTime,
                    endTime: existingAttempt.endTime,
                    duration: exam.duration,
                    remainingTime: remainingSeconds,
                    remainingMs: remainingMs
                },
                resuming: true
            });
        }

        // Check max attempts
        const attemptCount = await ExamAttempt.countDocuments({
            exam: examId,
            student: req.user.id,
            status: { $in: ["SUBMITTED", "AUTO_SUBMITTED", "DISQUALIFIED"] }
        });

        if (attemptCount >= exam.maxAttempts) {
            return res.status(403).json({ message: "Maximum attempts reached" });
        }

        // Calculate server-side timer
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);

        // Create new attempt with server timestamps
        const attempt = await ExamAttempt.create({
            exam: examId,
            student: req.user.id,
            course: exam.course._id,
            startTime,
            endTime,
            status: "IN_PROGRESS",
            attemptNumber: attemptCount + 1,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        // Update exam statistics
        exam.totalAttempts += 1;
        await exam.save();

        // Return exam with server-calculated timer
        const questionsForStudent = exam.questions.map((q, index) => ({
            _id: q._id,
            type: q.type,
            question: q.question,
            options: q.options.map(o => ({ _id: o._id, text: o.text })),
            marks: q.marks,
            order: q.order
        }));

        res.status(200).json({
            success: true,
            message: "Exam started successfully. Timer has started.",
            attempt: {
                id: attempt._id,
                startTime: attempt.startTime,
                endTime: attempt.endTime,
                duration: exam.duration,
                remainingTime: exam.duration * 60, // in seconds
                remainingMs: exam.duration * 60 * 1000
            },
            exam: {
                id: exam._id,
                title: exam.title,
                description: exam.description,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
                questions: questionsForStudent,
                shuffleQuestions: exam.shuffleQuestions,
                showResults: exam.showResults,
                security: exam.security
            },
            timer: {
                startTime: attempt.startTime,
                endTime: attempt.endTime,
                duration: exam.duration,
                serverTime: now
            }
        });
    } catch (error) {
        console.error("Start exam attempt error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Submit exam
 * POST /api/exams/attempt/:attemptId/submit
 */
export const submitExamAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { answers } = req.body;

        const attempt = await ExamAttempt.findById(attemptId)
            .populate("exam");

        if (!attempt) {
            return res.status(404).json({ message: "Exam attempt not found" });
        }

        if (attempt.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!["IN_PROGRESS", "NOT_STARTED"].includes(attempt.status)) {
            return res.status(400).json({ message: "Exam already submitted" });
        }

        // Get exam for correct answers
        const exam = await Exam.findById(attempt.exam._id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Calculate score
        let obtainedMarks = 0;
        const processedAnswers = answers.map(answer => {
            const question = exam.questions.find(q => q._id.toString() === answer.questionId);
            let isCorrect = false;
            let marksObtained = 0;

            if (question) {
                if (question.type === "multiple_choice" || question.type === "true_false") {
                    const selectedOption = question.options.find(o => o._id.toString() === answer.selectedOption);
                    isCorrect = selectedOption?.isCorrect || false;
                    marksObtained = isCorrect ? question.marks : 0;
                } else if (question.type === "short_answer") {
                    isCorrect = answer.textAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
                    marksObtained = isCorrect ? question.marks : 0;
                } else {
                    // Essay/short answer - needs manual grading
                    marksObtained = 0;
                }
            }

            if (isCorrect) {
                obtainedMarks += marksObtained;
            }

            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption || "",
                textAnswer: answer.textAnswer || "",
                isCorrect,
                marksObtained,
                answeredAt: new Date()
            };
        });

        // Update attempt
        attempt.answers = processedAnswers;
        attempt.obtainedMarks = obtainedMarks;
        attempt.totalMarks = exam.totalMarks;
        attempt.percentage = Math.round((obtainedMarks / exam.totalMarks) * 100 * 100) / 100;
        attempt.passed = attempt.percentage >= exam.passingMarks;
        attempt.status = "SUBMITTED";
        attempt.submittedAt = new Date();
        attempt.timeTaken = Math.round((attempt.submittedAt - attempt.startTime) / 1000);

        await attempt.save();

        // Update exam statistics
        if (exam.averageScore === 0) {
            exam.averageScore = attempt.percentage;
            exam.highestScore = attempt.percentage;
            exam.lowestScore = attempt.percentage;
        } else {
            const totalScore = exam.averageScore * (exam.totalAttempts - 1) + attempt.percentage;
            exam.averageScore = Math.round(totalScore / exam.totalAttempts * 100) / 100;
            if (attempt.percentage > exam.highestScore) exam.highestScore = attempt.percentage;
            if (attempt.percentage < exam.lowestScore || exam.lowestScore === 0) exam.lowestScore = attempt.percentage;
        }
        await exam.save();

        res.status(200).json({
            success: true,
            message: "Exam submitted successfully",
            result: {
                marks: obtainedMarks,
                totalMarks: exam.totalMarks,
                percentage: attempt.percentage,
                passed: attempt.passed,
                timeTaken: attempt.timeTaken,
                showResults: exam.showResults
            }
        });
    } catch (error) {
        console.error("Submit exam attempt error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Send heartbeat - Server calculates remaining time
 * POST /api/exams/attempt/:attemptId/heartbeat
 * 
 * IMPORTANT: Timer is calculated from server, not client
 * This prevents timer manipulation and ensures strict timing
 */
export const sendHeartbeat = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { timeOutside, status } = req.body;

        const attempt = await ExamAttempt.findById(attemptId);

        if (!attempt) {
            return res.status(404).json({ message: "Exam attempt not found" });
        }

        if (attempt.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!["IN_PROGRESS"].includes(attempt.status)) {
            return res.status(400).json({ message: "Exam not in progress" });
        }

        // Update time outside
        if (timeOutside !== undefined) {
            attempt.timeOutside = timeOutside;
        }

        // Get exam for security settings
        const exam = await Exam.findById(attempt.exam);
        const maxTimeOutside = exam?.security?.maxTimeOutside || 5;
        const maxTimeMs = maxTimeOutside * 60 * 1000;

        // Calculate remaining time from SERVER (not client)
        const now = new Date();
        const remainingMs = new Date(attempt.endTime) - now;
        const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

        // Check for disqualification due to time outside
        if (attempt.timeOutside > maxTimeMs) {
            attempt.status = "DISQUALIFIED";
            attempt.disqualifiedAt = new Date();
            attempt.disqualifiedReason = "Exceeded maximum time outside exam window";
            attempt.autoSubmitReason = "TIME_OUTSIDE_EXCEEDED";
            await attempt.save();

            return res.status(200).json({
                success: true,
                disqualified: true,
                message: "Disqualified for exceeding time outside limit",
                remainingTime: 0,
                timerExpired: true
            });
        }

        // Check if timer expired (server-side check)
        if (remainingMs <= 0) {
            // Auto-submit expired exam
            attempt.status = "AUTO_SUBMITTED";
            attempt.autoSubmitReason = "TIME_EXPIRED";
            attempt.submittedAt = now;
            attempt.timeTaken = Math.round((now - new Date(attempt.startTime)) / 1000);
            await attempt.save();

            return res.status(200).json({
                success: true,
                expired: true,
                message: "Exam time expired",
                remainingTime: 0,
                timerExpired: true
            });
        }

        // Update heartbeat
        attempt.lastHeartbeat = now;
        await attempt.save();

        // Return server-calculated remaining time
        res.status(200).json({
            success: true,
            remainingTime: remainingSeconds,
            remainingMs: remainingMs,
            serverTime: now,
            timer: {
                startTime: attempt.startTime,
                endTime: attempt.endTime,
                elapsed: Math.round((now - new Date(attempt.startTime)) / 1000),
                remaining: remainingSeconds
            },
            violations: attempt.totalViolations
        });
    } catch (error) {
        console.error("Heartbeat error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Report violation
 * POST /api/exams/attempt/:attemptId/violation
 */
export const reportViolation = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { type, details, duration } = req.body;

        const attempt = await ExamAttempt.findById(attemptId)
            .populate("exam");

        if (!attempt) {
            return res.status(404).json({ message: "Exam attempt not found" });
        }

        if (attempt.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!["IN_PROGRESS"].includes(attempt.status)) {
            return res.status(400).json({ message: "Exam not in progress" });
        }

        // Add violation
        attempt.addViolation(type, details, duration);
        await attempt.save();

        // Check for auto-submit on violation
        const exam = attempt.exam;
        if (exam.security?.autoSubmitOnViolation && attempt.totalViolations >= 5) {
            attempt.status = "DISQUALIFIED";
            attempt.disqualifiedAt = new Date();
            attempt.disqualifiedReason = "Too many violations";
            attempt.autoSubmitReason = "VIOLATION_LIMIT";
            await attempt.save();

            return res.status(200).json({
                success: true,
                disqualified: true,
                message: "Disqualified due to violations",
                violationCount: attempt.totalViolations
            });
        }

        // Determine warning message
        let warningMessage = null;
        if (attempt.totalViolations === 1) {
            warningMessage = "First warning: Do not leave the exam window";
        } else if (attempt.totalViolations === 3) {
            warningMessage = "Second warning: Multiple violations recorded";
        } else if (attempt.totalViolations === 5) {
            warningMessage = "Final warning: One more violation and you'll be disqualified";
        }

        res.status(200).json({
            success: true,
            message: "Violation recorded",
            violationCount: attempt.totalViolations,
            warning: warningMessage,
            timeOutside: attempt.timeOutside
        });
    } catch (error) {
        console.error("Report violation error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get student's exam attempts
 * GET /api/exams/my-attempts
 */
export const getMyAttempts = async (req, res) => {
    try {
        const { courseId } = req.query;

        const query = { student: req.user.id };
        if (courseId) query.course = courseId;

        const attempts = await ExamAttempt.find(query)
            .populate("exam", "title totalMarks passingMarks")
            .populate("course", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            attempts: attempts.map(a => ({
                id: a._id,
                exam: a.exam,
                course: a.course,
                status: a.status,
                marks: a.obtainedMarks,
                totalMarks: a.totalMarks,
                percentage: a.percentage,
                passed: a.passed,
                timeTaken: a.timeTaken,
                totalViolations: a.totalViolations,
                submittedAt: a.submittedAt,
                attemptNumber: a.attemptNumber
            }))
        });
    } catch (error) {
        console.error("Get my attempts error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get student's attempts for specific exam
 * GET /api/exams/:examId/my-attempts
 */
export const getMyExamAttempts = async (req, res) => {
    try {
        const { examId } = req.params;

        const attempts = await ExamAttempt.find({
            exam: examId,
            student: req.user.id
        })
            .populate("exam", "title totalMarks passingMarks")
            .sort({ attemptNumber: 1 });

        res.status(200).json({
            success: true,
            attempts: attempts.map(a => ({
                id: a._id,
                status: a.status,
                marks: a.obtainedMarks,
                totalMarks: a.totalMarks,
                percentage: a.percentage,
                passed: a.passed,
                timeTaken: a.timeTaken,
                totalViolations: a.tabSwitchCount,
                submittedAt: a.submittedAt,
                attemptNumber: a.attemptNumber
            }))
        });
    } catch (error) {
        console.error("Get my exam attempts error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get student's available exams
 * GET /api/exams/student/available
 */
export const getStudentExams = async (req, res) => {
    try {
        const { courseId } = req.query;

        // Get student's enrollments
        const Enrollment = (await import("../models/enrollmentModel.js")).default;
        const enrollments = await Enrollment.find({
            student: req.user.id,
            $or: [{ status: "ACTIVE" }, { paymentStatus: { $in: ["PAID", "LATER"] } }]
        }).select("course");

        const courseIds = enrollments.map(e => e.course);

        if (courseIds.length === 0) {
            return res.status(200).json({
                success: true,
                exams: [],
                message: "No enrollments found"
            });
        }

        const query = {
            course: { $in: courseIds },
            isPublished: true,
            status: { $in: ["active", "scheduled"] }
        };

        if (courseId) {
            query.course = courseId;
        }

        const exams = await Exam.find(query)
            .populate("course", "title")
            .populate("instructor", "name")
            .sort({ createdAt: -1 });

        // Get student's attempts for each exam
        const examsWithAttempts = await Promise.all(exams.map(async (exam) => {
            const attemptCount = await ExamAttempt.countDocuments({
                exam: exam._id,
                student: req.user.id,
                status: { $in: ["SUBMITTED", "AUTO_SUBMITTED", "DISQUALIFIED"] }
            });

            const activeAttempt = await ExamAttempt.findOne({
                exam: exam._id,
                student: req.user.id,
                status: "IN_PROGRESS"
            });

            return {
                id: exam._id,
                title: exam.title,
                description: exam.description,
                course: exam.course,
                instructor: exam.instructor,
                duration: exam.duration,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
                questionCount: exam.questions.length,
                startDate: exam.startDate,
                endDate: exam.endDate,
                maxAttempts: exam.maxAttempts,
                attemptsUsed: attemptCount,
                hasActiveAttempt: !!activeAttempt,
                activeAttemptId: activeAttempt?._id,
                canAttempt: attemptCount < exam.maxAttempts,
                status: exam.status
            };
        }));

        res.status(200).json({
            success: true,
            exams: examsWithAttempts
        });
    } catch (error) {
        console.error("Get student exams error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Auto-submit expired exams (cron job)
 * POST /api/exams/cron/expire
 */
export const autoSubmitExpired = async (req, res) => {
    try {
        const now = new Date();

        const expiredAttempts = await ExamAttempt.find({
            status: "IN_PROGRESS",
            endTime: { $lt: now }
        });

        let submitted = 0;

        for (const attempt of expiredAttempts) {
            attempt.status = "AUTO_SUBMITTED";
            attempt.autoSubmitReason = "TIME_EXPIRED";
            attempt.submittedAt = now;
            attempt.timeTaken = Math.round((now - attempt.startTime) / 1000);
            await attempt.save();
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
