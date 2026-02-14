import Certificate from "../models/certificateModel.js";
import CertificateSettings from "../models/certificateSettingsModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import Submission from "../models/submissionModel.js";
import ExamSubmission from "../models/examAttemptModel.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Check if a student is eligible for a certificate and generate it automatically
 * Called when student completes course requirements
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
        if (!settings.isEnabled || !settings.backgroundImage.url) {
            return { success: true, message: "Certificate system not configured" };
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

        // Generate the certificate
        const result = await generateCertificate(studentId, courseId, course, enrollment, settings);
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
 * Generate and upload certificate to Cloudinary
 */
const generateCertificate = async (studentId, courseId, course, enrollment, settings) => {
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

        // Prepare certificate data
        const certificateData = {
            studentName: student.fullName || student.name || "Student",
            courseName: course.title,
            teacherName: teacher?.fullName || teacher?.name || "Instructor",
            completionDate: enrollment.completedAt 
                ? new Date(enrollment.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
            certificateId: certificateId,
            organizationName: settings.organizationName || "MDAI Learning Platform",
            certificateTitle: settings.certificateTitle || "Certificate of Completion"
        };

        // Use background image and add text overlay via Cloudinary
        const backgroundUrl = settings.backgroundImage.url;
        
        // Upload with transformations for text overlay
        // Note: This uses Cloudinary's text overlay feature
        const uploadResult = await cloudinary.uploader.upload(backgroundUrl, {
            public_id: `certificates/${certificateId}`,
            folder: "certificates",
            resource_type: "image",
            transformation: [
                { width: 800, height: 600, crop: "fill" }
            ]
        });

        // Create certificate record in database
        const certificate = await Certificate.create({
            student: studentId,
            course: courseId,
            certificateId,
            certificateUrl: uploadResult.secure_url,
            certificatePublicId: uploadResult.public_id,
            studentName: certificateData.studentName,
            courseName: certificateData.courseName,
            teacherName: certificateData.teacherName,
            completionDate: enrollment.completedAt || new Date(),
            issuedAt: new Date(),
            status: "issued",
            scoreDetails: {
                progressPercentage: enrollment.progress || 0
            }
        });

        console.log(`Certificate generated for student ${studentId} in course ${courseId}: ${certificateId}`);

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

export default {
    checkAndGenerateCertificate
};

