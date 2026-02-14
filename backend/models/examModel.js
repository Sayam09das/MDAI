import mongoose from "mongoose";

/**
 * Manual Exam Model
 * For exams where students upload answer files (PDF/DOC)
 * and teachers grade manually
 */

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },

        // Total marks for the exam (required, manually set by teacher)
        totalMarks: {
            type: Number,
            required: true,
            min: 0
        },

        // Passing marks (percentage or absolute value)
        passingMarks: {
            type: Number,
            default: 0
        },

        // Due date for submission
        dueDate: {
            type: Date,
            default: null
        },

        // Instructions for students
        instructions: {
            type: String,
            default: ""
        },

        // Question paper file (optional)
        questionPaper: {
            filename: {
                type: String,
                default: ""
            },
            originalName: {
                type: String,
                default: ""
            },
            contentType: {
                type: String,
                default: ""
            },
            size: {
                type: Number,
                default: 0
            },
            url: {
                type: String,
                default: ""
            },
            uploadedAt: {
                type: Date,
                default: null
            }
        },

        // Allowed file types for answer submission
        allowedAnswerFileTypes: {
            type: [String],
            default: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        },

        // Max file size for answer uploads (in MB)
        maxAnswerFileSize: {
            type: Number,
            default: 10 // 10MB default
        },

        // Status
        isPublished: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date
        },

        status: {
            type: String,
            enum: ["draft", "published", "closed"],
            default: "draft"
        },

        // Statistics
        totalSubmissions: {
            type: Number,
            default: 0
        },

        gradedCount: {
            type: Number,
            default: 0
        },

        // Metadata
        allowLateSubmission: {
            type: Boolean,
            default: false
        },

        latePenaltyPercentage: {
            type: Number,
            default: 0 // Percentage deduction for late submissions
        }
    },
    { timestamps: true }
);

// Indexes
examSchema.index({ course: 1, instructor: 1 });
examSchema.index({ course: 1, status: 1 });
examSchema.index({ isPublished: 1, status: 1 });
examSchema.index({ dueDate: 1 });

// Pre-save hook
examSchema.pre("save", function () {
    if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    if (this.isModified("isPublished") && this.isPublished) {
        this.status = "published";
    }
});

// Static method to get published exams for a course
examSchema.statics.getPublishedExams = async function (courseId) {
    return this.find({
        course: courseId,
        isPublished: true,
        status: "published"
    })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });
};

// Static method to get teacher's exams
examSchema.statics.getTeacherExams = async function (teacherId, filters = {}) {
    const query = { instructor: teacherId };
    
    if (filters.status) query.status = filters.status;
    if (filters.course) query.course = filters.course;
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } }
        ];
    }

    return this.find(query)
        .populate("course", "title")
        .sort({ createdAt: -1 });
};

export default mongoose.model("ManualExam", examSchema);

