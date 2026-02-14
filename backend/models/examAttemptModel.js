import mongoose from "mongoose";

/**
 * Manual Exam Submission Model
 * For exams where students upload answer files (PDF/DOC)
 * and teachers grade manually
 */

const examSubmissionSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ManualExam",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        // Answer file uploaded by student
        answerFile: {
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
            data: {
                type: Buffer,
                default: null
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

        // Submission status
        status: {
            type: String,
            enum: ["submitted", "graded", "published"],
            default: "submitted"
        },

        // Whether submission was late
        isLate: {
            type: Boolean,
            default: false
        },

        // Submitted at
        submittedAt: {
            type: Date,
            default: Date.now
        },

        // Marks awarded by teacher
        obtainedMarks: {
            type: Number,
            default: 0
        },

        // Total marks for the exam
        totalMarks: {
            type: Number,
            default: 0
        },

        // Percentage score
        percentage: {
            type: Number,
            default: 0
        },

        // Whether passed
        passed: {
            type: Boolean,
            default: false
        },

        // Grading status
        gradingStatus: {
            type: String,
            enum: ["pending", "graded", "published"],
            default: "pending"
        },

        // Graded at
        gradedAt: {
            type: Date
        },

        // Graded by (teacher)
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        },

        // Feedback/notes from teacher
        feedback: {
            type: String,
            default: ""
        },

        // Result published
        resultPublished: {
            type: Boolean,
            default: false
        },

        // Result published at
        resultPublishedAt: {
            type: Date
        },

        // Metadata
        ipAddress: {
            type: String
        },

        userAgent: {
            type: String
        }
    },
    { timestamps: true }
);

// Indexes
examSubmissionSchema.index({ exam: 1, student: 1 });
examSubmissionSchema.index({ student: 1, status: 1 });
examSubmissionSchema.index({ exam: 1, status: 1 });
examSubmissionSchema.index({ exam: 1, gradingStatus: 1 });

// Pre-save hook to calculate percentage and passed status
examSubmissionSchema.pre("save", function () {
    if (this.isModified("obtainedMarks") || this.isModified("totalMarks")) {
        if (this.totalMarks > 0) {
            this.percentage = Math.round((this.obtainedMarks / this.totalMarks) * 100 * 100) / 100;
        } else {
            this.percentage = 0;
        }
    }
});

// Method to check if submission is late
examSubmissionSchema.methods.checkLateStatus = function (dueDate) {
    if (!dueDate) return false;
    return new Date() > new Date(dueDate);
};

// Static method to get exam submissions
examSubmissionSchema.statics.getExamSubmissions = async function (examId) {
    return this.find({ exam: examId })
        .populate("student", "fullName email profileImage")
        .sort({ submittedAt: -1 });
};

// Static method to get student's submission for an exam
examSubmissionSchema.statics.getStudentSubmission = async function (examId, studentId) {
    return this.findOne({ exam: examId, student: studentId });
};

// Static method to get exam statistics
examSubmissionSchema.statics.getExamStats = async function (examId) {
    const stats = await this.aggregate([
        { $match: { exam: new mongoose.Types.ObjectId(examId) } },
        {
            $group: {
                _id: null,
                totalSubmissions: { $sum: 1 },
                submittedCount: { $sum: { $cond: [{ $eq: ["$status", "submitted"] }, 1, 0] } },
                gradedCount: { $sum: { $cond: [{ $eq: ["$gradingStatus", "graded"] }, 1, 0] } },
                publishedCount: { $sum: { $cond: [{ $eq: ["$gradingStatus", "published"] }, 1, 0] } },
                lateCount: { $sum: { $cond: ["$isLate", 1, 0] } },
                avgPercentage: { $avg: "$percentage" },
                highestPercentage: { $max: "$percentage" },
                lowestPercentage: { $min: "$percentage" },
                passedCount: { $sum: { $cond: ["$passed", 1, 0] } }
            }
        }
    ]);

    return stats[0] || {
        totalSubmissions: 0,
        submittedCount: 0,
        gradedCount: 0,
        publishedCount: 0,
        lateCount: 0,
        avgPercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        passedCount: 0
    };
};

export default mongoose.model("ExamSubmission", examSubmissionSchema);

