import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "LATER"],
            default: "PENDING",
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        receipt: {
            receiptNumber: String,
            issuedAt: Date,
            issuedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Admin",
            },
            public_id: String,
            url: String, // ✅ REQUIRED FOR IMAGE RECEIPT
        },

        verifiedAt: {
            type: Date,
        },

        /* ================= COURSE PROGRESS FIELDS ================= */
        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED", "PAUSED"],
            default: "ACTIVE",
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        completedLessons: [{
            type: mongoose.Schema.Types.ObjectId,
            default: [],
        }],

        currentLesson: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        lastAccessedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        totalTimeSpent: {
            type: Number, // in minutes
            default: 0,
        },

        moduleProgress: [{
            moduleId: String,
            progress: Number, // 0-100
            completedLessons: [mongoose.Schema.Types.ObjectId],
        }],
    },
    { timestamps: true }
);

// Index for efficient queries
enrollmentSchema.index({ student: 1, course: 1 });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1 });

export default mongoose.model("Enrollment", enrollmentSchema);
