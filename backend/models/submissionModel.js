import mongoose from "mongoose";

const fileAttachmentSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    format: {
        type: String,
    },
    size: {
        type: Number, // in bytes
    },
    originalName: {
        type: String,
        required: true,
    },
}, { _id: false });

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },

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

        // Submission content
        submissionType: {
            type: String,
            enum: ["file", "text", "both"],
            default: "file",
        },

        files: [fileAttachmentSchema],

        textAnswer: {
            type: String,
            default: "",
        },

        // Status tracking
        status: {
            type: String,
            enum: ["submitted", "pending", "graded", "returned"],
            default: "submitted",
        },

        isLate: {
            type: Boolean,
            default: false,
        },

        submittedAt: {
            type: Date,
            default: Date.now,
        },

        // Grading
        marks: {
            type: Number,
            min: 0,
            default: null,
        },

        maxMarks: {
            type: Number,
            required: true,
        },

        feedback: {
            type: String,
            default: "",
        },

        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },

        gradedAt: {
            type: Date,
        },

        // For re-submission tracking
        submissionNumber: {
            type: Number,
            default: 1,
        },

        previousSubmissions: [{
            submittedAt: Date,
            files: [fileAttachmentSchema],
            textAnswer: String,
        }],

        // Late penalty (optional)
        latePenalty: {
            type: Number, // percentage
            default: 0,
        },

        finalMarks: {
            type: Number,
            default: null,
        },
    },
    { timestamps: true }
);

// Indexes for efficient queries
submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ assignment: 1, status: 1 });
submissionSchema.index({ student: 1, course: 1 });
submissionSchema.index({ course: 1, assignment: 1 });

// Virtual to check if submission can be edited
submissionSchema.virtual("canEdit").get(function () {
    // Student can edit only before deadline and if assignment is still active
    return this.status === "submitted" || this.status === "pending";
});

// Pre-save hook to calculate late penalty and final marks
submissionSchema.pre("save", function (next) {
    if (this.isLate && this.latePenalty > 0 && this.marks !== null) {
        this.finalMarks = this.marks - (this.marks * this.latePenalty / 100);
        if (this.finalMarks < 0) this.finalMarks = 0;
    } else {
        this.finalMarks = this.marks;
    }
    next();
});

// Static method to get submission with student details
submissionSchema.statics.getWithStudent = async function (assignmentId) {
    return this.find({ assignment: assignmentId })
        .populate("student", "name email profileImage")
        .sort({ submittedAt: -1 });
};

// Static method to check if student has already submitted
submissionSchema.statics.hasSubmitted = async function (assignmentId, studentId) {
    return this.findOne({ assignment: assignmentId, student: studentId });
};

// Static method to get student's submission for an assignment
submissionSchema.statics.getByStudentAndAssignment = async function (assignmentId, studentId) {
    return this.findOne({ assignment: assignmentId, student: studentId })
        .populate("assignment", "title description dueDate maxMarks");
};

// Static method to get submission statistics for an assignment
submissionSchema.statics.getStats = async function (assignmentId) {
    const stats = await this.aggregate([
        { $match: { assignment: new mongoose.Types.ObjectId(assignmentId) } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const result = {
        total: 0,
        submitted: 0,
        pending: 0,
        graded: 0,
        late: 0,
    };

    stats.forEach((stat) => {
        result[stat._id] = stat.count;
        result.total += stat.count;
    });

    // Count late submissions
    const lateCount = await this.countDocuments({ assignment: assignmentId, isLate: true });
    result.late = lateCount;

    return result;
};

export default mongoose.model("Submission", submissionSchema);

