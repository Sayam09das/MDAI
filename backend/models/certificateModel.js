import mongoose from "mongoose";

/**
 * Certificate Model
 * Stores issued certificates for students
 */

const certificateSchema = new mongoose.Schema({
    // Student who received the certificate
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Course for which certificate was issued
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    // Unique certificate ID (e.g., CERT-2024-ABC123)
    certificateId: {
        type: String,
        required: true,
        unique: true
    },

    // URL to the certificate PDF in cloud storage
    certificateUrl: {
        type: String,
        required: true
    },

    // Cloudinary public ID for the certificate
    certificatePublicId: {
        type: String,
        required: true
    },

    // When the certificate was issued
    issuedAt: {
        type: Date,
        default: Date.now
    },

    // Certificate status
    status: {
        type: String,
        enum: ["issued", "revoked", "expired"],
        default: "issued"
    },

    // Student name at the time of certificate generation
    studentName: {
        type: String,
        required: true
    },

    // Course name at the time of certificate generation
    courseName: {
        type: String,
        required: true
    },

    // Teacher name who taught the course
    teacherName: {
        type: String,
        required: true
    },

    // Completion date
    completionDate: {
        type: Date,
        required: true
    },

    // Optional: Grade achieved
    grade: {
        type: String,
        default: null
    },

    // Optional: Score details
    scoreDetails: {
        progressPercentage: Number,
        assignmentScore: Number,
        examScore: Number
    },

    // Revoked date (if applicable)
    revokedAt: {
        type: Date,
        default: null
    },

    // Reason for revocation (if applicable)
    revocationReason: {
        type: String,
        default: null
    }

}, { timestamps: true });

// Indexes for efficient queries
certificateSchema.index({ student: 1, course: 1 });
certificateSchema.index({ student: 1, status: 1 });
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ issuedAt: -1 });

// Generate unique certificate ID
certificateSchema.statics.generateCertificateId = async function() {
    const prefix = "CERT";
    const year = new Date().getFullYear();
    
    // Get count of certificates this year
    const count = await this.countDocuments({
        certificateId: new RegExp(`^${prefix}-${year}`)
    });
    
    // Generate unique ID: CERT-2024-0001
    const uniqueNum = String(count + 1).padStart(4, "0");
    return `${prefix}-${year}-${uniqueNum}`;
};

// Check if student already has a certificate for a course
certificateSchema.statics.hasCertificate = async function(studentId, courseId) {
    return this.findOne({
        student: studentId,
        course: courseId,
        status: "issued"
    });
};

// Get certificate by ID
certificateSchema.statics.getByCertificateId = async function(certificateId) {
    return this.findOne({ certificateId })
        .populate("student", "name email profileImage")
        .populate("course", "title");
};

// Get all certificates for a student
certificateSchema.statics.getByStudent = async function(studentId, status = "issued") {
    const query = { student: studentId };
    if (status) {
        query.status = status;
    }
    return this.find(query)
        .populate("course", "title thumbnail")
        .sort({ issuedAt: -1 });
};

// Get all certificates for a course
certificateSchema.statics.getByCourse = async function(courseId) {
    return this.find({ course: courseId, status: "issued" })
        .populate("student", "name email profileImage")
        .sort({ issuedAt: -1 });
};

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;

