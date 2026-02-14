import ManualExam from "../models/examModel.js";
import ExamSubmission from "../models/examAttemptModel.js";
import Course from "../models/Course.js";

// ==================== TEACHER EXAM MANAGEMENT ====================

/**
 * Create a new manual exam
 * POST /api/exams
 */
export const createExam = async (req, res) => {
    try {
        const {
            title,
            description,
            course,
            totalMarks,
            passingMarks,
            dueDate,
            instructions,
            allowedAnswerFileTypes,
            maxAnswerFileSize,
            allowLateSubmission,
            latePenaltyPercentage
        } = req.body;

        // Verify course belongs to teacher
        const courseDoc = await Course.findOne({
            _id: course,
            instructor: req.user.id
        });

        if (!courseDoc) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        const exam = await ManualExam.create({
            title,
            description,
            course,
            instructor: req.user.id,
            totalMarks: totalMarks || 100,
            passingMarks: passingMarks || 0,
            dueDate: dueDate || null,
            instructions: instructions || "",
            allowedAnswerFileTypes: allowedAnswerFileTypes || ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
            maxAnswerFileSize: maxAnswerFileSize || 10,
            allowLateSubmission: allowLateSubmission || false,
            latePenaltyPercentage: latePenaltyPercentage || 0,
            isPublished: req.body.isPublished || false,
            status: req.body.isPublished ? "published" : "draft"
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
 * Upload question paper for exam
 * POST /api/exams/:id/question-paper
 */
export const uploadQuestionPaper = async (req, res) => {
    try {
        const exam = await ManualExam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Import cloudinary dynamically
        const cloudinary = (await import("../config/cloudinary.js")).default;
        
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: `exams/${exam._id}`,
                resource_type: "raw",
                public_id: `question_paper`
            }
        );

        // Store the Cloudinary URL and metadata in the database
        exam.questionPaper = {
            filename: uploadResult.public_id,
            originalName: req.file.originalname,
            contentType: req.file.mimetype,
            size: req.file.size,
            url: uploadResult.secure_url,
            uploadedAt: new Date()
        };

        await exam.save();

        res.status(200).json({
            success: true,
            message: "Question paper uploaded successfully",
            questionPaper: {
                filename: exam.questionPaper.filename,
                originalName: exam.questionPaper.originalName,
                contentType: exam.questionPaper.contentType,
                size: exam.questionPaper.size,
                url: exam.questionPaper.url,
                uploadedAt: exam.questionPaper.uploadedAt
            }
        });
    } catch (error) {
        console.error("Upload question paper error:", error);
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

        const exams = await ManualExam.find(query)
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
        const exam = await ManualExam.findById(req.params.id)
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

            // For students, don't send sensitive info
            const examForStudent = exam.toObject();
            // Remove questionPaper from student view (or keep it based on requirement)
            // Keep question paper so students can download it

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
        const exam = await ManualExam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const allowedUpdates = [
            "title", "description", "totalMarks", "passingMarks",
            "dueDate", "instructions", "allowedAnswerFileTypes",
            "maxAnswerFileSize", "allowLateSubmission", "latePenaltyPercentage"
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                exam[field] = req.body[field];
            }
        });

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
        const exam = await ManualExam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Delete all submissions
        await ExamSubmission.deleteMany({ exam: exam._id });

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
        const exam = await ManualExam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        exam.isPublished = !exam.isPublished;
        
        if (exam.isPublished) {
            exam.publishedAt = new Date();
            exam.status = "published";
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
 * Get exam submissions (for teachers)
 * GET /api/exams/:id/submissions
 */
export const getExamSubmissions = async (req, res) => {
    try {
        const exam = await ManualExam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { status, search } = req.query;

        const query = { exam: exam._id };
        if (status && status !== "all") {
            query.gradingStatus = status;
        }

        const submissions = await ExamSubmission.find(query)
            .populate("student", "fullName email profileImage")
            .sort({ submittedAt: -1 });

        // Filter by search if provided
        let filteredSubmissions = submissions;
        if (search) {
            filteredSubmissions = submissions.filter(s => 
                s.student.fullName.toLowerCase().includes(search.toLowerCase()) ||
                s.student.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Calculate statistics
        const stats = {
            totalSubmissions: filteredSubmissions.length,
            pending: filteredSubmissions.filter(s => s.gradingStatus === "pending").length,
            graded: filteredSubmissions.filter(s => s.gradingStatus === "graded").length,
            published: filteredSubmissions.filter(s => s.gradingStatus === "published").length,
            late: filteredSubmissions.filter(s => s.isLate).length
        };

        res.status(200).json({
            success: true,
            exam: {
                id: exam._id,
                title: exam.title,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
                dueDate: exam.dueDate
            },
            stats,
            submissions: filteredSubmissions.map(s => ({
                id: s._id,
                student: s.student,
                status: s.status,
                isLate: s.isLate,
                submittedAt: s.submittedAt,
                obtainedMarks: s.obtainedMarks,
                totalMarks: s.totalMarks,
                percentage: s.percentage,
                passed: s.passed,
                gradingStatus: s.gradingStatus,
                feedback: s.feedback,
                resultPublished: s.resultPublished
            }))
        });
    } catch (error) {
        console.error("Get exam submissions error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get exam statistics
 * GET /api/exams/:id/stats
 */
export const getExamStats = async (req, res) => {
    try {
        const exam = await ManualExam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const dbStats = await ExamSubmission.getExamStats(exam._id);

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

/**
 * Download question paper
 * GET /api/exams/:id/question-paper
 */
export const downloadQuestionPaper = async (req, res) => {
    try {
        const exam = await ManualExam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Check enrollment for students
        if (req.user.role === "student") {
            if (!exam.isPublished) {
                return res.status(403).json({ message: "Exam not available" });
            }

            const Enrollment = (await import("../models/enrollmentModel.js")).default;
            const enrollment = await Enrollment.findOne({
                student: req.user.id,
                course: exam.course,
                $or: [{ status: "ACTIVE" }, { paymentStatus: { $in: ["PAID", "LATER"] } }]
            });

            if (!enrollment) {
                return res.status(403).json({ message: "You are not enrolled in this course" });
            }
        }

        // Check if question paper exists
        if (!exam.questionPaper) {
            return res.status(404).json({ message: "Question paper not found" });
        }

        // Priority 1: If there's a URL (Cloudinary or external storage), redirect to it
        if (exam.questionPaper.url && exam.questionPaper.url.trim() !== "") {
            return res.redirect(exam.questionPaper.url);
        }

        // Priority 2: Check if there's a filename with binary data in the model (legacy storage)
        if (exam.questionPaper.filename && exam.questionPaper.filename.trim() !== "") {
            // If there's data in the model (binary stored in DB)
            if (exam.questionPaper.data) {
                const file = exam.questionPaper;
                res.set({
                    "Content-Type": file.contentType || "application/pdf",
                    "Content-Disposition": `attachment; filename="${file.originalName || "question_paper.pdf"}"`,
                    "Content-Length": file.size
                });
                return res.send(file.data);
            }
            
            // If filename exists but no URL and no data, the file needs to be re-uploaded
            return res.status(404).json({ 
                message: "Question paper file is missing. Please contact your teacher to re-upload the question paper." 
            });
        }

        // No question paper uploaded
        return res.status(404).json({ message: "Question paper not found" });
    } catch (error) {
        console.error("Download question paper error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==================== STUDENT EXAM SUBMISSIONS ====================

/**
 * Get available exams for student
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
            status: "published"
        };

        if (courseId) {
            query.course = courseId;
        }

        const exams = await ManualExam.find(query)
            .populate("course", "title")
            .populate("instructor", "name")
            .sort({ dueDate: 1 });

        // Get student's submissions for each exam
        const examsWithSubmissions = await Promise.all(exams.map(async (exam) => {
            const submission = await ExamSubmission.findOne({
                exam: exam._id,
                student: req.user.id
            });

            // Check if exam is past due
            const now = new Date();
            const isPastDue = exam.dueDate && now > new Date(exam.dueDate);
            const isLate = exam.allowLateSubmission && isPastDue;

            return {
                id: exam._id,
                title: exam.title,
                description: exam.description,
                course: exam.course,
                instructor: exam.instructor,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
                dueDate: exam.dueDate,
                instructions: exam.instructions,
                hasQuestionPaper: !!exam.questionPaper?.filename,
                // Submission status
                hasSubmitted: !!submission,
                submissionStatus: submission ? submission.status : null,
                gradingStatus: submission ? submission.gradingStatus : null,
                obtainedMarks: submission?.obtainedMarks,
                percentage: submission?.percentage,
                passed: submission?.passed,
                feedback: submission?.feedback,
                resultPublished: submission?.resultPublished,
                // Can still submit if allowed
                canSubmit: !submission && (isLate ? exam.allowLateSubmission : !isPastDue)
            };
        }));

        res.status(200).json({
            success: true,
            exams: examsWithSubmissions
        });
    } catch (error) {
        console.error("Get student exams error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get student's submission for an exam
 * GET /api/exams/:examId/my-submission
 */
export const getMySubmission = async (req, res) => {
    try {
        const { examId } = req.params;

        const exam = await ManualExam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (!exam.isPublished) {
            return res.status(403).json({ message: "Exam not available" });
        }

        // Check enrollment
        const Enrollment = (await import("../models/enrollmentModel.js")).default;
        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: exam.course,
            $or: [{ status: "ACTIVE" }, { paymentStatus: { $in: ["PAID", "LATER"] } }]
        });

        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        const submission = await ExamSubmission.findOne({
            exam: examId,
            student: req.user.id
        });

        res.status(200).json({
            success: true,
            exam: {
                id: exam._id,
                title: exam.title,
                description: exam.description,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
                dueDate: exam.dueDate,
                instructions: exam.instructions,
                hasQuestionPaper: !!exam.questionPaper?.filename,
                allowLateSubmission: exam.allowLateSubmission
            },
            submission: submission ? {
                id: submission._id,
                status: submission.status,
                isLate: submission.isLate,
                submittedAt: submission.submittedAt,
                answerFile: submission.answerFile ? {
                    originalName: submission.answerFile.originalName,
                    uploadedAt: submission.answerFile.uploadedAt
                } : null,
                obtainedMarks: submission.obtainedMarks,
                totalMarks: submission.totalMarks,
                percentage: submission.percentage,
                passed: submission.passed,
                gradingStatus: submission.gradingStatus,
                feedback: submission.feedback,
                resultPublished: submission.resultPublished
            } : null
        });
    } catch (error) {
        console.error("Get my submission error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Submit exam (upload answer file)
 * POST /api/exams/:examId/submit
 */
export const submitExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const exam = await ManualExam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (!exam.isPublished) {
            return res.status(403).json({ message: "Exam is not available" });
        }

        // Check enrollment
        const Enrollment = (await import("../models/enrollmentModel.js")).default;
        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: exam.course,
            $or: [{ status: "ACTIVE" }, { paymentStatus: { $in: ["PAID", "LATER"] } }]
        });

        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        // Check if already submitted
        const existingSubmission = await ExamSubmission.findOne({
            exam: examId,
            student: req.user.id
        });

        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this exam" });
        }

        // Check due date
        const now = new Date();
        const isLate = exam.dueDate && now > new Date(exam.dueDate);
        
        if (isLate && !exam.allowLateSubmission) {
            return res.status(400).json({ message: "Submission deadline has passed" });
        }

        // Validate file
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Validate file type
        const allowedTypes = exam.allowedAnswerFileTypes || ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Invalid file type. Allowed: PDF, DOC, DOCX" });
        }

        // Validate file size
        const maxSize = (exam.maxAnswerFileSize || 10) * 1024 * 1024;
        if (req.file.size > maxSize) {
            return res.status(400).json({ message: `File size must be less than ${exam.maxAnswerFileSize || 10}MB` });
        }

        // Create submission
        const submission = await ExamSubmission.create({
            exam: examId,
            student: req.user.id,
            course: exam.course,
            answerFile: {
                filename: req.file.filename || `answer_${examId}_${req.user.id}`,
                originalName: req.file.originalname,
                contentType: req.file.mimetype,
                size: req.file.size,
                data: req.file.buffer,
                url: req.file.path || "",
                uploadedAt: new Date()
            },
            status: "submitted",
            isLate: isLate || false,
            submittedAt: new Date(),
            totalMarks: exam.totalMarks,
            gradingStatus: "pending",
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        // Update exam submission count
        exam.totalSubmissions += 1;
        await exam.save();

        res.status(201).json({
            success: true,
            message: isLate ? "Exam submitted late" : "Exam submitted successfully",
            submission: {
                id: submission._id,
                status: submission.status,
                isLate: submission.isLate,
                submittedAt: submission.submittedAt,
                answerFile: {
                    originalName: submission.answerFile.originalName,
                    size: submission.answerFile.size
                }
            }
        });
    } catch (error) {
        console.error("Submit exam error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Download student's submitted answer file (for teachers)
 * GET /api/exams/submission/:submissionId/download
 */
export const downloadAnswerFile = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await ExamSubmission.findById(submissionId)
            .populate("exam");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Verify teacher owns the exam
        const exam = submission.exam;
        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!submission.answerFile || !submission.answerFile.data) {
            return res.status(404).json({ message: "Answer file not found" });
        }

        const file = submission.answerFile;

        res.set({
            "Content-Type": file.contentType || "application/pdf",
            "Content-Disposition": `attachment; filename="${file.originalName || "answer_file.pdf"}"`,
            "Content-Length": file.size
        });

        res.send(file.data);
    } catch (error) {
        console.error("Download answer file error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Grade submission (manual evaluation)
 * POST /api/exams/submission/:submissionId/grade
 */
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { obtainedMarks, feedback } = req.body;

        if (obtainedMarks === undefined || obtainedMarks === null) {
            return res.status(400).json({ message: "Marks are required" });
        }

        const submission = await ExamSubmission.findById(submissionId)
            .populate("exam");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Verify teacher owns the exam
        const exam = submission.exam;
        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Validate marks
        if (obtainedMarks < 0 || obtainedMarks > exam.totalMarks) {
            return res.status(400).json({
                message: `Marks must be between 0 and ${exam.totalMarks}`
            });
        }

        // Apply late penalty if applicable
        let finalMarks = obtainedMarks;
        if (submission.isLate && exam.latePenaltyPercentage > 0) {
            finalMarks = obtainedMarks - (obtainedMarks * exam.latePenaltyPercentage / 100);
            finalMarks = Math.max(0, finalMarks); // Don't go below 0
        }

        // Update submission
        submission.obtainedMarks = finalMarks;
        submission.totalMarks = exam.totalMarks;
        submission.percentage = exam.totalMarks > 0 ? Math.round((finalMarks / exam.totalMarks) * 100 * 100) / 100 : 0;
        submission.passed = submission.percentage >= exam.passingMarks;
        submission.gradingStatus = "graded";
        submission.gradedAt = new Date();
        submission.gradedBy = req.user.id;
        submission.feedback = feedback || "";
        submission.status = "graded";

        await submission.save();

        // Update exam graded count
        await ManualExam.findByIdAndUpdate(exam._id, {
            $inc: { gradedCount: 1 }
        });

        res.status(200).json({
            success: true,
            message: "Submission graded successfully",
            grade: {
                obtainedMarks: submission.obtainedMarks,
                totalMarks: submission.totalMarks,
                percentage: submission.percentage,
                passed: submission.passed,
                isLate: submission.isLate,
                latePenalty: submission.isLate ? exam.latePenaltyPercentage : 0,
                feedback: submission.feedback,
                gradingStatus: submission.gradingStatus
            }
        });
    } catch (error) {
        console.error("Grade submission error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Publish result for a submission
 * POST /api/exams/submission/:submissionId/publish
 */
export const publishResult = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await ExamSubmission.findById(submissionId)
            .populate("exam");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Verify teacher owns the exam
        const exam = submission.exam;
        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Check if graded
        if (submission.gradingStatus !== "graded") {
            return res.status(400).json({ 
                message: "Cannot publish results. The submission has not been graded yet." 
            });
        }

        // Publish results
        submission.resultPublished = true;
        submission.resultPublishedAt = new Date();
        submission.gradingStatus = "published";
        submission.status = "published";

        await submission.save();

        res.status(200).json({
            success: true,
            message: "Result published successfully",
            result: {
                id: submission._id,
                obtainedMarks: submission.obtainedMarks,
                totalMarks: submission.totalMarks,
                percentage: submission.percentage,
                passed: submission.passed,
                gradingStatus: submission.gradingStatus,
                resultPublished: submission.resultPublished,
                resultPublishedAt: submission.resultPublishedAt
            }
        });
    } catch (error) {
        console.error("Publish result error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Publish all results for an exam
 * POST /api/exams/:examId/publish-all
 */
export const publishAllResults = async (req, res) => {
    try {
        const { examId } = req.params;

        const exam = await ManualExam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Find all graded submissions
        const gradedSubmissions = await ExamSubmission.find({
            exam: examId,
            gradingStatus: "graded"
        });

        if (gradedSubmissions.length === 0) {
            return res.status(400).json({ 
                message: "No graded submissions found to publish" 
            });
        }

        // Publish all graded results
        const now = new Date();
        let publishedCount = 0;

        for (const submission of gradedSubmissions) {
            submission.resultPublished = true;
            submission.resultPublishedAt = now;
            submission.gradingStatus = "published";
            submission.status = "published";
            await submission.save();
            publishedCount++;
        }

        res.status(200).json({
            success: true,
            message: `Successfully published ${publishedCount} results`,
            publishedCount
        });
    } catch (error) {
        console.error("Publish all results error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get submission details (for teachers)
 * GET /api/exams/submission/:submissionId/details
 */
export const getSubmissionDetails = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await ExamSubmission.findById(submissionId)
            .populate("exam", "title totalMarks passingMarks dueDate instructions")
            .populate("student", "fullName email profileImage")
            .populate("gradedBy", "name");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Verify teacher owns the exam
        const exam = submission.exam;
        if (exam.instructor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            success: true,
            submission: {
                id: submission._id,
                student: {
                    _id: submission.student._id,
                    fullName: submission.student.fullName,
                    email: submission.student.email,
                    profileImage: submission.student.profileImage
                },
                status: submission.status,
                isLate: submission.isLate,
                submittedAt: submission.submittedAt,
                answerFile: submission.answerFile ? {
                    originalName: submission.answerFile.originalName,
                    filename: submission.answerFile.filename,
                    size: submission.answerFile.size,
                    contentType: submission.answerFile.contentType,
                    uploadedAt: submission.answerFile.uploadedAt
                } : null,
                obtainedMarks: submission.obtainedMarks,
                totalMarks: submission.totalMarks,
                percentage: submission.percentage,
                passed: submission.passed,
                gradingStatus: submission.gradingStatus,
                feedback: submission.feedback,
                gradedAt: submission.gradedAt,
                gradedBy: submission.gradedBy,
                resultPublished: submission.resultPublished,
                resultPublishedAt: submission.resultPublishedAt
            },
            exam: {
                id: exam._id,
                title: exam.title,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
                dueDate: exam.dueDate,
                instructions: exam.instructions
            }
        });
    } catch (error) {
        console.error("Get submission details error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get student's all exam submissions
 * GET /api/exams/my-submissions
 */
export const getMySubmissions = async (req, res) => {
    try {
        const { courseId } = req.query;

        const query = { student: req.user.id };
        if (courseId) query.course = courseId;

        const submissions = await ExamSubmission.find(query)
            .populate("exam", "title totalMarks passingMarks dueDate")
            .populate("course", "title")
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            submissions: submissions.map(s => ({
                id: s._id,
                exam: s.exam,
                course: s.course,
                status: s.status,
                isLate: s.isLate,
                submittedAt: s.submittedAt,
                obtainedMarks: s.obtainedMarks,
                totalMarks: s.totalMarks,
                percentage: s.percentage,
                passed: s.passed,
                gradingStatus: s.gradingStatus,
                feedback: s.feedback,
                resultPublished: s.resultPublished
            }))
        });
    } catch (error) {
        console.error("Get my submissions error:", error);
        res.status(500).json({ message: error.message });
    }
};

