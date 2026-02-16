import Certificate from "../models/certificateModel.js";
import CertificateSettings from "../models/certificateSettingsModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import Submission from "../models/submissionModel.js";
import ExamSubmission from "../models/examAttemptModel.js";
import { v2 as cloudinary } from "cloudinary";
import { createCanvas } from "canvas";

/**
 * Check if a student is eligible for a certificate and generate it automatically
 * Called when student completes course requirements
 * 
 * Uses PDFKit for certificate generation
 * Auto-populates: student name, course name, teacher name from database
 * Fixed: organization name (MDAI)
 */
export const checkAndGenerateCertificate = async (studentId, courseId) => {
    try {
        // Check if certificate already exists
        const existingCert = await Certificate.hasCertificate(studentId, courseId);
        if (existingCert) {
            return { success: true, certificate: existingCert, alreadyGenerated: true };
        }

        // Get course
        const course = await Course.findById(courseId);
        if (!course || !course.certificateEnabled) {
            return { success: true, message: "Certificate not enabled for this course" };
        }

        // Check certificate settings
        const settings = await CertificateSettings.getSettings();
        if (!settings.isEnabled) {
            return { success: true, message: "Certificate system not enabled" };
        }

        // Get enrollment
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId
        });

        if (!enrollment) {
            return { success: false, error: "Enrollment not found" };
        }

        // Check completion criteria
        const isEligible = await checkEligibilityCriteria(studentId, courseId, course);
        
        if (!isEligible) {
            return { success: true, message: "Not eligible for certificate yet" };
        }

        // Generate the certificate using PDFKit
        const result = await generateCertificatePDF(studentId, courseId, course, enrollment, settings);
        return result;

    } catch (error) {
        console.error("Check and generate certificate error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Check if student meets all certificate eligibility criteria
 */
const checkEligibilityCriteria = async (studentId, courseId, course) => {
    // Check 1: Progress percentage
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment || (enrollment.progress || 0) < course.certificateMinProgress) {
        return false;
    }

    // Check 2: Assignments (if required)
    if (course.certificateRequireAssignments) {
        const assignments = await import("../models/assignmentModel.js").then(m => 
            m.default.find({ course: courseId, isPublished: true })
        );
        
        if (assignments.length > 0) {
            const submittedCount = await Submission.countDocuments({
                student: studentId,
                course: courseId,
                status: { $in: ["graded", "submitted"] }
            });
            
            if (submittedCount < assignments.length) {
                return false;
            }
        }
    }

    // Check 3: Exam (if required)
    if (course.certificateRequireExam) {
        const examSubmission = await ExamSubmission.findOne({
            student: studentId,
            course: courseId,
            gradingStatus: "published",
            passed: true
        });

        if (!examSubmission || (examSubmission.percentage || 0) < course.certificatePassingMarks) {
            return false;
        }
    }

    return true;
};

/**
 * Generate PDF certificate and upload to Cloudinary using PDFKit
 */
const generateCertificatePDF = async (studentId, courseId, course, enrollment, settings) => {
    try {
        // Get student info
        const User = (await import("../models/userModel.js")).default;
        const student = await User.findById(studentId);

        if (!student) {
            return { success: false, error: "Student not found" };
        }

        // Get teacher info
        const Teacher = (await import("../models/teacherModel.js")).default;
        const teacher = await Teacher.findById(course.instructor);

        // Generate certificate ID
        const certificateId = await Certificate.generateCertificateId();

        // Auto-populate certificate data from database
        const studentName = student.fullName || student.name || "Student";
        const courseName = course.title || "Course";
        const teacherName = teacher?.fullName || teacher?.name || "Instructor";
        
        const completionDate = enrollment.completedAt 
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

        // Generate PNG image using canvas
        const imageBuffer = await generateImageBuffer({
            studentName,
            courseName,
            teacherName,
            completionDate,
            certificateId,
            organizationName,
            certificateTitle
        });

        // Upload to Cloudinary as PNG image for better browser viewing
        const b64 = imageBuffer.toString('base64');
        const dataURI = `data:image/png;base64,${b64}`;

        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            public_id: `certificates/${certificateId}`,
            folder: "certificates",
            resource_type: "image",
            format: "png"
        });

        // Create certificate record in database
        const certificate = await Certificate.create({
            student: studentId,
            course: courseId,
            certificateId,
            certificateUrl: uploadResult.secure_url,
            certificatePublicId: uploadResult.public_id,
            studentName,
            courseName,
            teacherName,
            completionDate: enrollment.completedAt || new Date(),
            issuedAt: new Date(),
            status: "issued",
            scoreDetails: {
                progressPercentage: enrollment.progress || 0
            }
        });

        console.log(`Certificate generated for student ${studentName} in course ${courseName}: ${certificateId}`);

        return { 
            success: true, 
            certificate,
            alreadyGenerated: false 
        };
    } catch (error) {
        console.error("Generate certificate error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Generate Image Buffer using canvas
 * Creates a professional certificate PNG image
 */
const generateImageBuffer = (certificateData) => {
    return new Promise((resolve, reject) => {
        try {
            // Create canvas - Landscape A4 equivalent at 150 DPI
            const width = 1754;
            const height = 1240;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // Colors
            const primaryColor = '#1a365d';
            const secondaryColor = '#2c5282';
            const accentColor = '#c53030';
            const textColor = '#1a202c';
            const lightGray = '#718096';
            const white = '#ffffff';

            // Fill background
            ctx.fillStyle = white;
            ctx.fillRect(0, 0, width, height);

            // Draw border - outer
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 10;
            ctx.strokeRect(30, 30, width - 60, height - 60);

            // Draw border - inner
            ctx.strokeStyle = secondaryColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(50, 50, width - 100, height - 100);

            // Decorative corners
            const cornerSize = 80;
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 4;
            
            // Top left corner
            ctx.beginPath();
            ctx.moveTo(60, 60 + cornerSize);
            ctx.lineTo(60, 60);
            ctx.lineTo(60 + cornerSize, 60);
            ctx.stroke();

            // Top right corner
            ctx.beginPath();
            ctx.moveTo(width - 60 - cornerSize, 60);
            ctx.lineTo(width - 60, 60);
            ctx.lineTo(width - 60, 60 + cornerSize);
            ctx.stroke();

            // Bottom left corner
            ctx.beginPath();
            ctx.moveTo(60, height - 60 - cornerSize);
            ctx.lineTo(60, height - 60);
            ctx.lineTo(60 + cornerSize, height - 60);
            ctx.stroke();

            // Bottom right corner
            ctx.beginPath();
            ctx.moveTo(width - 60 - cornerSize, height - 60);
            ctx.lineTo(width - 60, height - 60);
            ctx.lineTo(width - 60, height - 60 - cornerSize);
            ctx.stroke();

            // Organization name at top
            ctx.fillStyle = lightGray;
            ctx.font = 'bold 28px Helvetica';
            ctx.textAlign = 'center';
            ctx.fillText(certificateData.organizationName.toUpperCase(), width / 2, 120);

            // Certificate title
            ctx.fillStyle = primaryColor;
            ctx.font = 'bold 72px Helvetica';
            ctx.fillText(certificateData.certificateTitle, width / 2, 200);

            // Decorative line under title
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(width / 2 - 250, 240);
            ctx.lineTo(width / 2 + 250, 240);
            ctx.stroke();

            // "This is to certify that"
            ctx.fillStyle = textColor;
            ctx.font = '28px Helvetica';
            ctx.fillText('This is to certify that', width / 2, 320);

            // Student name (prominent)
            ctx.fillStyle = secondaryColor;
            ctx.font = 'bold 64px Helvetica';
            ctx.fillText(certificateData.studentName, width / 2, 400);

            // Decorative underline for name
            const nameWidth = ctx.measureText(certificateData.studentName).width;
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(width / 2 - nameWidth / 2 - 20, 420);
            ctx.lineTo(width / 2 + nameWidth / 2 + 20, 420);
            ctx.stroke();

            // "has successfully completed the course"
            ctx.fillStyle = textColor;
            ctx.font = '28px Helvetica';
            ctx.fillText('has successfully completed the course', width / 2, 480);

            // Course name (prominent)
            ctx.fillStyle = primaryColor;
            ctx.font = 'bold 52px Helvetica';
            ctx.fillText(certificateData.courseName, width / 2, 550);

            // Completion date
            ctx.fillStyle = lightGray;
            ctx.font = '24px Helvetica';
            ctx.fillText(`Completed on ${certificateData.completionDate}`, width / 2, 620);

            // Signature line
            ctx.strokeStyle = lightGray;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width / 2 - 150, 750);
            ctx.lineTo(width / 2 + 150, 750);
            ctx.stroke();

            // Instructor/Teacher name
            ctx.fillStyle = textColor;
            ctx.font = 'bold 32px Helvetica';
            ctx.fillText(certificateData.teacherName, width / 2, 720);

            ctx.fillStyle = lightGray;
            ctx.font = '20px Helvetica';
            ctx.fillText('Course Instructor', width / 2, 780);

            // Certificate ID at bottom
            ctx.fillStyle = lightGray;
            ctx.font = '18px Courier';
            ctx.fillText(`Certificate ID: ${certificateData.certificateId}`, width / 2, height - 80);

            // MDAI branding
            ctx.font = '16px Helvetica';
            ctx.fillText('MDAI Learning Platform', width / 2, height - 50);

            // Convert to buffer
            const buffer = canvas.toBuffer('image/png');
            resolve(buffer);
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    checkAndGenerateCertificate
};

