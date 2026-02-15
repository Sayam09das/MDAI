import Certificate from "../models/certificateModel.js";
import CertificateSettings from "../models/certificateSettingsModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import Submission from "../models/submissionModel.js";
import ExamSubmission from "../models/examAttemptModel.js";
import { v2 as cloudinary } from "cloudinary";
import PDFDocument from "pdfkit";

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
        
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            public_id: `certificates/${certificateId}`,
            folder: "certificates",
            resource_type: "auto",
            format: "pdf"
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
 * Generate PDF Buffer using PDFKit
 * Creates a professional certificate PDF
 */
const generatePDFBuffer = (certificateData) => {
    return new Promise((resolve, reject) => {
        try {
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
            const primaryColor = '#1a365d';
            const secondaryColor = '#2c5282';
            const accentColor = '#c53030';
            const textColor = '#1a202c';
            const lightGray = '#718096';

            const pageWidth = 842;
            const pageHeight = 595;

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

export default {
    checkAndGenerateCertificate
};

