import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
    filename: {
        type: String,
        default: undefined,
    },
    contentType: {
        type: String,
        default: undefined,
    },
    size: {
        type: Number,
        default: undefined,
    },
    data: {
        type: Buffer, // Store file binary data directly in MongoDB
        default: undefined,
    },
    originalName: {
        type: String,
        default: undefined,
    },
    public_id: {
        type: String,
        default: undefined,
    },
    url: {
        type: String,
        default: undefined,
    },
}, { _id: false });

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        instructions: {
            type: String,
            default: "",
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        maxMarks: {
            type: Number,
            required: true,
            min: 0,
        },

        submissionType: {
            type: String,
            enum: ["file", "text", "both"],
            default: "file",
        },

        allowedFileTypes: {
            type: [String],
            default: [".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"],
        },

        maxFileSize: {
            type: Number, // in MB
            default: 10,
        },

        attachments: [attachmentSchema],

        isPublished: {
            type: Boolean,
            default: false,
        },

        publishedAt: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["draft", "active", "closed", "archived"],
            default: "draft",
        },

        totalSubmissions: {
            type: Number,
            default: 0,
        },

        gradedSubmissions: {
            type: Number,
            default: 0,
        },

        averageScore: {
            type: Number,
            default: 0,
        },

        // Optional: Set reminders
        reminderDaysBeforeDue: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

// Index for efficient queries
assignmentSchema.index({ course: 1, instructor: 1 });
assignmentSchema.index({ course: 1, status: 1 });
assignmentSchema.index({ dueDate: 1 });

// Virtual to check if assignment is overdue
assignmentSchema.virtual("isOverdue").get(function () {
    return new Date() > this.dueDate;
});

// Virtual for submission statistics
assignmentSchema.virtual("submissionStats").get(function () {
    return {
        total: this.totalSubmissions,
        graded: this.gradedSubmissions,
        pending: this.totalSubmissions - this.gradedSubmissions,
        averageScore: this.averageScore,
    };
});

// Pre-save hook to set publishedAt when first published
assignmentSchema.pre("save", function () {
    if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

// Static method to get assignments for a course
assignmentSchema.statics.getByCourse = async function (courseId) {
    return this.find({ course: courseId, isPublished: true })
        .populate("instructor", "name email profileImage")
        .sort({ dueDate: 1 });
};

// Static method to get teacher's assignments
assignmentSchema.statics.getByTeacher = async function (teacherId, filters = {}) {
    const query = { instructor: teacherId };
    
    if (filters.status) query.status = filters.status;
    if (filters.course) query.course = filters.course;
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } },
        ];
    }

    return this.find(query)
        .populate("course", "title")
        .sort({ createdAt: -1 });
};

export default mongoose.model("Assignment", assignmentSchema);

