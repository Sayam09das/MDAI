import Certificate from "../models/certificateModel.js";
import CertificateSettings from "../models/certificateSettingsModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import Submission from "../models/submissionModel.js";
import ExamSubmission from "../models/examAttemptModel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ======================================================
   GET CERTIFICATE SETTINGS (Admin)
====================================================== */
export const getCertificateSettings = async (req, res) => {
    try {
        const settings = await CertificateSettings.getSettings();
        res.status(200).json({
            success: true,
            settings
        });
    } catch (error) {
        console.error("Get certificate settings error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   UPDATE CERTIFICATE SETTINGS (Admin Only)
====================================================== */
export const updateCertificateSettings = async (req, res) => {
    try {
        const {
            templateName,
            canvaDesignLink,
            backgroundImage,
            pageSize,
            placeholders,
            organizationName,
            certificateTitle,
            isEnabled
        } = req.body;

        let settings = await CertificateSettings.getSettings();

        // Update fields
        if (templateName) settings.templateName = templateName;
        if (canvaDesignLink !== undefined) settings.canvaDesignLink = canvaDesignLink;
        if (pageSize) settings.pageSize = pageSize;
        if (placeholders) settings.placeholders = placeholders;
        if (organizationName) settings.organizationName = organizationName;
        if (certificateTitle) settings.certificateTitle = certificateTitle;
        if (isEnabled !== undefined) settings.isEnabled = isEnabled;

        // Handle background image upload
        if (backgroundImage) {
            // Delete old image if exists
            if (settings.backgroundImage.public_id) {
                try {
                    await cloudinary.uploader.destroy(settings.backgroundImage.public_id);
                } catch (err) {
                    console.error("Error deleting old background:", err);
                }
            }
            settings.backgroundImage = backgroundImage;
        }

        settings.updatedBy = req.user.id;
        await settings.save();

        res.status(200).json({
            success: true,
            message: "Certificate settings updated successfully",
            settings
        });
    } catch (error) {
        console.error("Update certificate settings error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   CHECK STUDENT CERTIFICATE ELIGIBILITY
====================================================== */
export const checkEligibility = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Get course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if certificate is enabled for this course
        if (!course.certificateEnabled) {
            return res.status(200).json({
                eligible: false,
                reason: "Certificate is not enabled for this course",
                criteria: null
            });
        }

        // Get enrollment
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            paymentStatus: "PAID"
        });

        if (!enrollment) {
            return res.status(200).json({
                eligible: false,
                reason: "Not enrolled in this course",
                criteria: null
            });
        }

        // Check if already has certificate
        const existingCert = await Certificate.hasCertificate(studentId, courseId);
        if (existingCert) {
            return res.status(200).json({
                eligible: true,
                status: "issued",
                certificateId: existingCert.certificateId,
                certificateUrl: existingCert.certificateUrl,
                reason: "Certificate already issued",
                criteria: course.certificateEnabled ? {
                    minProgress: course.certificateMinProgress,
                    requireAssignments: course.certificateRequireAssignments,
                    requireExam: course.certificateRequireExam,
                    passingMarks: course.certificatePassingMarks
                } : null
            });
        }

        // Check eligibility criteria
        const eligibility = await checkCompletionCriteria(studentId, courseId, course);

        res.status(200).json({
            eligible: eligibility.eligible,
            status: "not_issued",
            reason: eligibility.reason,
            details: eligibility.details,
            criteria: {
                minProgress: course.certificateMinProgress,
                requireAssignments: course.certificateRequireAssignments,
                requireExam: course.certificateRequireExam,
                passingMarks: course.certificatePassingMarks
            }
        });
    } catch (error) {
        console.error("Check eligibility error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   HELPER: Check completion criteria
====================================================== */
const checkCompletionCriteria = async (studentId, courseId, course) => {
    const details = {
        progress: { met: false, current: 0, required: course.certificateMinProgress },
        assignments: { met: false, submitted: 0, required: 0 },
        exam: { met: false, score: 0, required: course.certificatePassingMarks }
    };

    // Check 1: Progress
    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId
    });

    if (!enrollment) {
        return { eligible: false, reason: "Not enrolled", details };
    }

    details.progress.current = enrollment.progress || 0;
    details.progress.met = details.progress.current >= course.certificateMinProgress;

    // Check 2: Assignments (if required)
    if (course.certificateRequireAssignments) {
        const assignments = await import("../models/assignmentModel.js").then(m => 
            m.default.find({ course: courseId, isPublished: true })
        );
        
        const requiredCount = assignments.length;
        details.assignments.required = requiredCount;

        if (requiredCount > 0) {
            const submittedCount = await Submission.countDocuments({
                student: studentId,
                course: courseId,
                status: { $in: ["graded", "submitted"] }
            });
            details.assignments.submitted = submittedCount;
            details.assignments.met = submittedCount >= requiredCount;
        } else {
            details.assignments.met = true; // No assignments required
        }
    } else {
        details.assignments.met = true;
    }

    // Check 3: Exam (if required)
    if (course.certificateRequireExam) {
        const examSubmission = await ExamSubmission.findOne({
            student: studentId,
            course: courseId,
            gradingStatus: "published",
            passed: true
        });

        if (examSubmission) {
            details.exam.score = examSubmission.percentage || 0;
            details.exam.met = details.exam.score >= course.certificatePassingMarks;
        } else {
            details.exam.met = false;
        }
    } else {
        details.exam.met = true;
    }

    // Determine overall eligibility
    const eligible = details.progress.met && details.assignments.met && details.exam.met;
    
    let reason = "All criteria met";
    if (!eligible) {
        const unmet = [];
        if (!details.progress.met) unmet.push(`Progress: ${details.progress.current}% (need ${details.progress.required}%)`);
        if (!details.assignments.met) unmet.push(`Assignments: ${details.assignments.submitted}/${details.assignments.required} submitted`);
        if (!details.exam.met) unmet.push(`Exam: ${details.exam.score}% (need ${details.exam.required}%)`);
        reason = unmet.join(", ");
    }

    return { eligible, reason, details };
};

/* ======================================================
   GET STUDENT'S CERTIFICATES
====================================================== */
export const getMyCertificates = async (req, res) => {
    try {
        const studentId = req.user.id;
        
        // Get all certificates for the student
        const certificates = await Certificate.getByStudent(studentId, "issued");
        
        // Get certificate settings for additional info
        const settings = await CertificateSettings.getSettings();

        // For each enrollment, check eligibility status
        const enrollments = await Enrollment.find({
            student: studentId,
            paymentStatus: "PAID"
        }).populate("course", "title thumbnail certificateEnabled certificateMinProgress certificateRequireAssignments certificateRequireExam certificatePassingMarks");

        const result = await Promise.all(enrollments.map(async (enrollment) => {
            const cert = certificates.find(c => 
                c.course._id.toString() === enrollment.course._id.toString()
            );

            let status = "not_eligible";
            let reason = "";

            if (enrollment.course.certificateEnabled) {
                if (cert) {
                    status = "issued";
                    reason = "Certificate earned";
                } else {
                    // Check eligibility
                    const eligibility = await checkCompletionCriteria(
                        studentId, 
                        enrollment.course._id, 
                        enrollment.course
                    );
                    status = eligibility.eligible ? "eligible" : "not_eligible";
                    reason = eligibility.reason;
                }
            }

            return {
                courseId: enrollment.course._id,
                courseTitle: enrollment.course.title,
                thumbnail: enrollment.course.thumbnail,
                status,
                reason,
                certificateId: cert?.certificateId || null,
                certificateUrl: cert?.certificateUrl || null,
                issuedAt: cert?.issuedAt || null,
                completionDate: cert?.completionDate || null
            };
        }));

        res.status(200).json({
            success: true,
            certificates: result,
            settings: {
                isEnabled: settings.isEnabled,
                organizationName: settings.organizationName
            }
        });
    } catch (error) {
        console.error("Get my certificates error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   GET SINGLE CERTIFICATE (Student)
====================================================== */
export const getMyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const studentId = req.user.id;

        const certificate = await Certificate.findOne({
            certificateId,
            student: studentId,
            status: "issued"
        }).populate("course", "title thumbnail");

        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        res.status(200).json({
            success: true,
            certificate
        });
    } catch (error) {
        console.error("Get certificate error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   GENERATE CERTIFICATE (Automatic)
   Called when student meets completion criteria
====================================================== */
export const generateCertificate = async (studentId, courseId) => {
    try {
        // Check if certificate already exists
        const existingCert = await Certificate.hasCertificate(studentId, courseId);
        if (existingCert) {
            return { success: true, certificate: existingCert, alreadyGenerated: true };
        }

        // Get course and settings
        const course = await Course.findById(courseId).populate("instructor", "fullName");
        const settings = await CertificateSettings.getSettings();

        if (!settings.isEnabled || !settings.backgroundImage.url) {
            return { success: false, error: "Certificate system is not configured" };
        }

        // Get student info
        const User = (await import("../models/userModel.js")).default;
        const student = await User.findById(studentId);

        if (!student) {
            return { success: false, error: "Student not found" };
        }

        // Get enrollment for completion date
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        // Generate certificate ID
        const certificateId = await Certificate.generateCertificateId();

        // Prepare certificate data for image overlay
        const certificateData = {
            studentName: student.fullName || student.name,
            courseName: course.title,
            teacherName: course.instructor?.fullName || "Instructor",
            completionDate: enrollment?.completedAt ? new Date(enrollment.completedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            certificateId: certificateId,
            organizationName: settings.organizationName,
            certificateTitle: settings.certificateTitle
        };

        // Upload certificate to Cloudinary
        // We'll use the background image URL and add text overlay
        const uploadResult = await cloudinary.uploader.upload(settings.backgroundImage.url, {
            public_id: `certificates/${certificateId}`,
            folder: "certificates",
            resource_type: "image",
            transformation: [
                // Add text overlays based on placeholders
                { overlay: `text:${encodeURIComponent(certificateData.studentName)}`, 
                  font_family: "Helvetica", font_size: 36, color: "#2C3E50",
                  x: 400, y: 300 },
                { overlay: `text:${encodeURIComponent(certificateData.courseName)}`,
                  font_family: "Helvetica", font_size: 28, color: "#34495E",
                  x: 400, y: 400 },
                { overlay: `text:${encodeURIComponent(certificateData.teacherName)}`,
                  font_family: "Helvetica", font_size: 20, color: "#7F8C8D",
                  x: 400, y: 480 },
                { overlay: `text:${encodeURIComponent(certificateData.completionDate)}`,
                  font_family: "Helvetica", font_size: 18, color: "#95A5A6",
                  x: 400, y: 540 },
                { overlay: `text:${encodeURIComponent(certificateData.certificateId)}`,
                  font_family: "Courier", font_size: 14, color: "#BDC3C7",
                  x: 400, y: 600 }
            ]
        });

        // Save certificate to database
        const certificate = await Certificate.create({
            student: studentId,
            course: courseId,
            certificateId,
            certificateUrl: uploadResult.secure_url,
            certificatePublicId: uploadResult.public_id,
            studentName: certificateData.studentName,
            courseName: certificateData.courseName,
            teacherName: certificateData.teacherName,
            completionDate: enrollment?.completedAt || new Date(),
            issuedAt: new Date(),
            status: "issued",
            scoreDetails: {
                progressPercentage: enrollment?.progress || 0
            }
        });

        return { success: true, certificate, alreadyGenerated: false };
    } catch (error) {
        console.error("Generate certificate error:", error);
        return { success: false, error: error.message };
    }
};

/* ======================================================
   VERIFY CERTIFICATE (Public)
====================================================== */
export const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({
            certificateId,
            status: "issued"
        }).populate("student", "name email").populate("course", "title");

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: "Certificate not found or has been revoked"
            });
        }

        res.status(200).json({
            valid: true,
            certificate: {
                certificateId: certificate.certificateId,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                teacherName: certificate.teacherName,
                completionDate: certificate.completionDate,
                issuedAt: certificate.issuedAt
            }
        });
    } catch (error) {
        console.error("Verify certificate error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   GET COURSE CERTIFICATES (Teacher)
====================================================== */
export const getCourseCertificates = async (req, res) => {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;

        // Verify teacher owns the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.instructor.toString() !== teacherId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get all certificates for this course
        const certificates = await Certificate.getByCourse(courseId);

        res.status(200).json({
            success: true,
            certificates,
            total: certificates.length
        });
    } catch (error) {
        console.error("Get course certificates error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   GET ALL CERTIFICATES (Admin)
====================================================== */
export const getAllCertificates = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;

        const query = {};
        if (status) query.status = status;

        const certificates = await Certificate.find(query)
            .populate("student", "name email profileImage")
            .populate("course", "title")
            .sort({ issuedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Certificate.countDocuments(query);

        res.status(200).json({
            success: true,
            certificates,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get all certificates error:", error);
        res.status(500).json({ message: error.message });
    }
};

