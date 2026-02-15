import Certificate from "../models/certificateModel.js";
import CertificateSettings from "../models/certificateSettingsModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import Submission from "../models/submissionModel.js";
import ExamSubmission from "../models/examAttemptModel.js";
import { v2 as cloudinary } from "cloudinary";
import PDFDocument from "pdfkit";
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
   Removed Canva integration - using PDFKit now
====================================================== */
export const updateCertificateSettings = async (req, res) => {
    try {
        const {
            templateName,
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
        if (pageSize) settings.pageSize = pageSize;
        if (placeholders) settings.placeholders = placeholders;
        if (organizationName) settings.organizationName = organizationName;
        if (certificateTitle) settings.certificateTitle = certificateTitle;
        if (isEnabled !== undefined) settings.isEnabled = isEnabled;

        // Handle background image upload (optional - for watermark/overlay)
        if (backgroundImage && typeof backgroundImage === 'object') {
            // Only accept non-blob URLs (Cloudinary URLs or external URLs)
            if (backgroundImage.url && 
                !backgroundImage.url.startsWith('blob:') && 
                !backgroundImage.url.startsWith('http://localhost')) {
                // Delete old image if exists
                if (settings.backgroundImage.public_id && 
                    settings.backgroundImage.public_id !== backgroundImage.public_id) {
                    try {
                        await cloudinary.uploader.destroy(settings.backgroundImage.public_id);
                    } catch (err) {
                        console.error("Error deleting old background:", err);
                    }
                }
                settings.backgroundImage = backgroundImage;
            }
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
   UPLOAD BACKGROUND IMAGE (Admin Only)
   Handles direct file upload to Cloudinary
====================================================== */
export const uploadBackgroundImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                message: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." 
            });
        }

        // Convert buffer to base64 for upload
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "certificates/backgrounds",
            resource_type: "image",
            transformation: [
                { quality: "auto:best" },
                { fetch_format: "auto" }
            ]
        });

        // Get current settings to delete old image if exists
        const settings = await CertificateSettings.getSettings();
        if (settings.backgroundImage && settings.backgroundImage.public_id) {
            try {
                await cloudinary.uploader.destroy(settings.backgroundImage.public_id);
            } catch (err) {
                console.error("Error deleting old background:", err);
            }
        }

        res.status(200).json({
            success: true,
            message: "Background image uploaded successfully",
            backgroundImage: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });
    } catch (error) {
        console.error("Upload background image error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   DELETE BACKGROUND IMAGE (Admin Only)
   Clears the background image from settings
====================================================== */
export const deleteBackgroundImage = async (req, res) => {
    try {
        const settings = await CertificateSettings.getSettings();

        // Delete old image from Cloudinary if exists
        if (settings.backgroundImage && settings.backgroundImage.public_id && 
            !settings.backgroundImage.public_id.startsWith('local/')) {
            try {
                await cloudinary.uploader.destroy(settings.backgroundImage.public_id);
            } catch (err) {
                console.error("Error deleting background from Cloudinary:", err);
            }
        }

        // Clear the background image from settings
        settings.backgroundImage = {
            public_id: "",
            url: ""
        };
        await settings.save();

        res.status(200).json({
            success: true,
            message: "Background image deleted successfully"
        });
    } catch (error) {
        console.error("Delete background image error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ======================================================
   CHECK STUDENT CERTIFICATE ELIGIBILITY
   FIXED: Now checks if certificate already exists before checking course settings
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

        // FIXED: Check if already has certificate FIRST (before checking course settings)
        // This ensures certificates show even if course settings changed after certificate was issued
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

        // Check if certificate is enabled for this course (only if no certificate exists yet)
        if (!course.certificateEnabled) {
            return res.status(200).json({
                eligible: false,
                reason: "Certificate is not enabled for this course",
                criteria: null
            });
        }

        // Get enrollment - FIXED: Check all payment statuses
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            paymentStatus: { $in: ["PAID", "PENDING", "LATER"] }
        });

        if (!enrollment) {
            return res.status(200).json({
                eligible: false,
                reason: "Not enrolled in this course",
                criteria: null
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
   Modified to show certificates even if enrollment has issues
   FIXED: Now queries all payment statuses to show certificates
           for students who may have PENDING/LATER payments
====================================================== */
export const getMyCertificates = async (req, res) => {
    try {
        const studentId = req.user.id;
        
        // Get all certificates for the student (regardless of enrollment status)
        const certificates = await Certificate.getByStudent(studentId, "issued");
        
        // Get certificate settings for additional info
        const settings = await CertificateSettings.getSettings();

        // FIXED: Query enrollments with ALL payment statuses (PAID, PENDING, LATER)
        // This ensures certificates show even if payment is pending or "pay later" was selected
        const enrollments = await Enrollment.find({
            student: studentId,
            paymentStatus: { $in: ["PAID", "PENDING", "LATER"] }
        }).populate("course", "title thumbnail certificateEnabled certificateMinProgress certificateRequireAssignments certificateRequireExam certificatePassingMarks");

        // Create a map of course certificates for quick lookup
        const certMap = {};
        certificates.forEach(cert => {
            const courseIdStr = cert.course?._id?.toString() || cert.course?.toString();
            if (courseIdStr) {
                certMap[courseIdStr] = cert;
            }
        });

        // Helper function to make Cloudinary raw URLs viewable in browser
        const makeUrlViewable = (url) => {
            if (!url) return url;
            // If the URL contains /raw/, convert it to allow viewing
            if (url.includes('/raw/')) {
                return url.replace('/raw/upload/', '/upload/');
            }
            return url;
        };

        const result = await Promise.all(enrollments.map(async (enrollment) => {
            // Skip if course is null (deleted course)
            if (!enrollment.course) {
                return null;
            }

            const courseIdStr = enrollment.course._id.toString();
            const cert = certMap[courseIdStr];

            let status = "not_eligible";
            let reason = "";

            // FIXED: Show certificate as issued even if course doesn't have certificate enabled
            // as long as certificate already exists
            if (cert) {
                status = "issued";
                reason = "Certificate earned";
            } else if (enrollment.course.certificateEnabled) {
                // Check eligibility only if certificate is enabled for the course
                const eligibility = await checkCompletionCriteria(
                    studentId, 
                    enrollment.course._id, 
                    enrollment.course
                );
                status = eligibility.eligible ? "eligible" : "not_eligible";
                reason = eligibility.reason;
            }
            // If no certificate and certificate not enabled, status remains "not_eligible"

            return {
                courseId: enrollment.course._id,
                courseTitle: enrollment.course.title,
                thumbnail: enrollment.course.thumbnail,
                status,
                reason,
                certificateId: cert?.certificateId || null,
                certificateUrl: makeUrlViewable(cert?.certificateUrl) || null,
                issuedAt: cert?.issuedAt || null,
                completionDate: cert?.completionDate || null
            };
        }));

        // Filter out null entries (deleted courses)
        let filteredResult = result.filter(item => item !== null);

        // Also add any certificates that might not be in enrollments (fallback)
        // This handles cases where course was deleted but certificate exists
        // Also handles cases where enrollment exists but paymentStatus is PENDING
        certificates.forEach(cert => {
            const courseIdStr = cert.course?._id?.toString() || cert.course?.toString();
            const alreadyAdded = filteredResult.some(r => 
                r.courseId.toString() === courseIdStr
            );
            
            if (!alreadyAdded && cert.courseName) {
                filteredResult.push({
                    courseId: cert.course?._id || cert.course,
                    courseTitle: cert.courseName,
                    thumbnail: null,
                    status: "issued",
                    reason: "Certificate earned",
                    certificateId: cert.certificateId,
                    certificateUrl: makeUrlViewable(cert.certificateUrl),
                    issuedAt: cert.issuedAt,
                    completionDate: cert.completionDate
                });
            }
        });

        // Additional fallback: Check if there are any certificates that need to be shown
        // even if there's NO enrollment (direct certificate lookup)
        // This fixes the issue where certificate exists but enrollment has PENDING status
        if (filteredResult.length === 0 && certificates.length > 0) {
            // Add all certificates as fallback - user might have certificates 
            // but their enrollments have payment issues
            filteredResult = certificates.map(cert => {
                const courseIdStr = cert.course?._id?.toString() || cert.course?.toString();
                return {
                    courseId: cert.course?._id || cert.course,
                    courseTitle: cert.courseName || "Unknown Course",
                    thumbnail: null,
                    status: "issued",
                    reason: "Certificate earned",
                    certificateId: cert.certificateId,
                    certificateUrl: makeUrlViewable(cert.certificateUrl),
                    issuedAt: cert.issuedAt,
                    completionDate: cert.completionDate
                };
            });
        }

        res.status(200).json({
            success: true,
            certificates: filteredResult,
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
   Using PDFKit - generates professional PDF certificates
   Auto-populates: student name, course name, teacher name from database
   Fixed: organization name (MDAI)
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

        if (!settings.isEnabled) {
            return { success: false, error: "Certificate system is not enabled" };
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

        // Auto-populate certificate data from database
        const studentName = student.fullName || student.name || "Student";
        const courseName = course.title || "Course";
        const teacherName = course.instructor?.fullName || course.instructor?.name || "Instructor";
        
        const completionDate = enrollment?.completedAt 
            ? new Date(enrollment.completedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

        const organizationName = settings.organizationName || "MDAI";
        const certificateTitle = settings.certificateTitle || "Certificate of Completion";

        // Generate PDF using PDFKit
        const pdfBuffer = await generatePDFBuffer({
            studentName,
            courseName,
            teacherName,
            completionDate,
            certificateId,
            organizationName,
            certificateTitle
        });

        // Upload PDF to Cloudinary
        const b64 = pdfBuffer.toString('base64');
        const dataURI = `data:application/pdf;base64,${b64}`;
        
        // Use "auto" resource type to let Cloudinary detect the file type
        // This ensures PDFs are properly accessible for viewing/downloading
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            public_id: `certificates/${certificateId}`,
            folder: "certificates",
            resource_type: "auto",
            format: "pdf"
        });

        // Save certificate to database
        const certificate = await Certificate.create({
            student: studentId,
            course: courseId,
            certificateId,
            certificateUrl: uploadResult.secure_url,
            certificatePublicId: uploadResult.public_id,
            studentName,
            courseName,
            teacherName,
            completionDate: enrollment?.completedAt || new Date(),
            issuedAt: new Date(),
            status: "issued",
            scoreDetails: {
                progressPercentage: enrollment?.progress || 0
            }
        });

        console.log(`Certificate generated for student ${studentName} in course ${courseName}: ${certificateId}`);

        return { success: true, certificate, alreadyGenerated: false };
    } catch (error) {
        console.error("Generate certificate error:", error);
        return { success: false, error: error.message };
    }
};

/* ======================================================
   HELPER: Generate PDF Buffer using PDFKit
   Creates a professional certificate PDF
====================================================== */
const generatePDFBuffer = (certificateData) => {
    return new Promise((resolve, reject) => {
        try {
            // Landscape A4 dimensions in points (1pt = 1/72 inch)
            // A4: 595 x 842 points, Landscape: 842 x 595
            const pageWidth = 842;
            const pageHeight = 595;

            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Colors
            const primaryColor = '#1a365d';    // Dark blue
            const secondaryColor = '#2c5282';  // Medium blue
            const accentColor = '#c53030';      // Red accent
            const textColor = '#1a202c';        // Dark gray
            const lightGray = '#718096';        // Gray

            // Draw border
            doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
               .strokeColor(primaryColor)
               .lineWidth(3)
               .stroke();

            doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
               .strokeColor(secondaryColor)
               .lineWidth(1)
               .stroke();

            // Organization name at top (Fixed: MDAI)
            doc.fontSize(14)
               .font('Helvetica')
               .fillColor(lightGray)
               .text(certificateData.organizationName.toUpperCase(), 0, 60, {
                   align: 'center',
                   width: pageWidth
               });

            // Certificate title
            doc.fontSize(36)
               .font('Helvetica-Bold')
               .fillColor(primaryColor)
               .text(certificateData.certificateTitle, 0, 100, {
                   align: 'center',
                   width: pageWidth
               });

            // Decorative line
            const lineY = 160;
            doc.moveTo(pageWidth/2 - 150, lineY)
               .lineTo(pageWidth/2 + 150, lineY)
               .strokeColor(accentColor)
               .lineWidth(2)
               .stroke();

            // "This is to certify that"
            doc.fontSize(14)
               .font('Helvetica')
               .fillColor(textColor)
               .text('This is to certify that', 0, 190, {
                   align: 'center',
                   width: pageWidth
               });

            // Student name (prominent)
            doc.fontSize(32)
               .font('Helvetica-Bold')
               .fillColor(secondaryColor)
               .text(certificateData.studentName, 0, 220, {
                   align: 'center',
                   width: pageWidth
               });

            // Decorative underline for name
            const nameWidth = doc.widthOfString(certificateData.studentName);
            doc.moveTo(pageWidth/2 - nameWidth/2, 260)
               .lineTo(pageWidth/2 + nameWidth/2, 260)
               .strokeColor(accentColor)
               .lineWidth(1)
               .stroke();

            // "has successfully completed the course"
            doc.fontSize(14)
               .font('Helvetica')
               .fillColor(textColor)
               .text('has successfully completed the course', 0, 280, {
                   align: 'center',
                   width: pageWidth
               });

            // Course name (prominent)
            doc.fontSize(26)
               .font('Helvetica-Bold')
               .fillColor(primaryColor)
               .text(certificateData.courseName, 0, 310, {
                   align: 'center',
                   width: pageWidth
               });

            // Completion date
            doc.fontSize(12)
               .font('Helvetica')
               .fillColor(lightGray)
               .text(`Completed on ${certificateData.completionDate}`, 0, 360, {
                   align: 'center',
                   width: pageWidth
               });

            // Instructor/Teacher name
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .fillColor(textColor)
               .text(certificateData.teacherName, 0, 420, {
                   align: 'center',
                   width: pageWidth
               });

            doc.fontSize(10)
               .font('Helvetica')
               .fillColor(lightGray)
               .text('Course Instructor', 0, 438, {
                   align: 'center',
                   width: pageWidth
               });

            // Certificate ID at bottom
            doc.fontSize(10)
               .font('Courier')
               .fillColor(lightGray)
               .text(`Certificate ID: ${certificateData.certificateId}`, 0, pageHeight - 60, {
                   align: 'center',
                   width: pageWidth
               });

            // MDAI branding
            doc.fontSize(8)
               .font('Helvetica')
               .fillColor(lightGray)
               .text('MDAI Learning Platform', 0, pageHeight - 40, {
                   align: 'center',
                   width: pageWidth
               });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
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

        // Generate a signed URL that allows viewing (not just download)
        let viewableUrl = certificate.certificateUrl;
        
        // If the URL contains /raw/, convert it to allow viewing
        if (certificate.certificateUrl && certificate.certificateUrl.includes('/raw/')) {
            // Replace /raw/ with /upload/ to make it viewable in browser
            viewableUrl = certificate.certificateUrl.replace('/raw/upload/', '/upload/');
        }

        res.status(200).json({
            valid: true,
            certificate: {
                certificateId: certificate.certificateId,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                teacherName: certificate.teacherName,
                completionDate: certificate.completionDate,
                issuedAt: certificate.issuedAt,
                certificateUrl: viewableUrl
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

/* ======================================================
   GENERATE CERTIFICATES FOR COURSE (Teacher)
   Mark course as complete and generate certificates for eligible students
====================================================== */
export const generateCourseCertificates = async (req, res) => {
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

        // Get certificate settings
        const settings = await CertificateSettings.getSettings();
        
        if (!settings.isEnabled) {
            return res.status(400).json({ 
                success: false,
                message: "Certificate system is not enabled" 
            });
        }

        // Get all paid enrollments for this course
        const enrollments = await Enrollment.find({
            course: courseId,
            paymentStatus: "PAID"
        }).populate("student", "fullName email");

        if (enrollments.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No enrolled students found",
                generated: 0,
                skipped: 0
            });
        }

        // Generate certificates for eligible students
        const results = {
            generated: 0,
            skipped: 0,
            errors: []
        };

        for (const enrollment of enrollments) {
            try {
                // Check completion criteria
                const eligibility = await checkCompletionCriteria(
                    enrollment.student._id,
                    courseId,
                    course
                );

                if (eligibility.eligible) {
                    const result = await generateCertificate(
                        enrollment.student._id,
                        courseId
                    );

                    if (result.success) {
                        results.generated++;
                    } else {
                        results.errors.push({
                            student: enrollment.student.fullName,
                            error: result.error
                        });
                    }
                } else {
                    results.skipped++;
                }
            } catch (err) {
                results.errors.push({
                    student: enrollment.student.fullName,
                    error: err.message
                });
            }
        }

        // Update course completion status
        course.completedAt = new Date();
        course.certificateGenerated = true;
        await course.save();

        res.status(200).json({
            success: true,
            message: `Generated ${results.generated} certificates, skipped ${results.skipped} students`,
            results
        });
    } catch (error) {
        console.error("Generate course certificates error:", error);
        res.status(500).json({ message: error.message });
    }
};

