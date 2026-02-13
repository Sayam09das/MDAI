import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    selectedOption: {
        type: String,
        default: ""
    },
    textAnswer: {
        type: String,
        default: ""
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    marksObtained: {
        type: Number,
        default: 0
    },
    answeredAt: {
        type: Date,
        default: Date.now
    },
    // File upload support for exam answers
    uploadedFile: {
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
            default: "application/pdf"
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
    // Manual grading status for file upload questions
    isGraded: {
        type: Boolean,
        default: false
    },
    gradingNotes: {
        type: String,
        default: ""
    }
}, { _id: false });

const violationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            "TAB_SWITCH",
            "WINDOW_BLUR",
            "FULLSCREEN_EXIT",
            "COPY_ATTEMPT",
            "PASTE_ATTEMPT",
            "RIGHT_CLICK",
            "TEXT_SELECTION",
            "KEYBOARD_SHORTCUT",
            "DEV_TOOLS_OPEN",
            "PAGE_REFRESH",
            "BACK_BUTTON",
            "TIME_OUTSIDE_EXCEEDED",
            "HEARTBEAT_MISSED",
            "MULTIPLE_TAB",
            "BROWSER_MINIMIZED"
        ],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String,
        default: ""
    },
    duration: {
        type: Number, // milliseconds
        default: 0
    }
}, { _id: false });

const examAttemptSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
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

        // Timing
        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        },

        submittedAt: {
            type: Date
        },

        timeTaken: {
            type: Number, // in seconds
            default: 0
        },

        // Status
        status: {
            type: String,
            enum: ["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "AUTO_SUBMITTED", "DISQUALIFIED", "EXPIRED", "ABANDONED"],
            default: "NOT_STARTED"
        },

        // Answers
        answers: [answerSchema],

        // Score
        totalMarks: {
            type: Number,
            default: 0
        },

        obtainedMarks: {
            type: Number,
            default: 0
        },

        percentage: {
            type: Number,
            default: 0
        },

        passed: {
            type: Boolean,
            default: false
        },

        // Security Tracking
        violations: [violationSchema],

        totalViolations: {
            type: Number,
            default: 0
        },

        tabSwitchCount: {
            type: Number,
            default: 0
        },

        timeOutside: {
            type: Number, // total milliseconds outside exam
            default: 0
        },

        fullscreenExits: {
            type: Number,
            default: 0
        },

        // Heartbeat tracking
        lastHeartbeat: {
            type: Date
        },

        heartbeatMissed: {
            type: Number,
            default: 0
        },

        // Auto-submit reason
        autoSubmitReason: {
            type: String,
            enum: ["TIME_EXPIRED", "DISQUALIFIED", "HEARTBEAT_TIMEOUT", "SYSTEM_ERROR", "VIOLATION_LIMIT"],
            default: null
        },

        // Disqualification
        disqualifiedAt: {
            type: Date
        },

        disqualifiedReason: {
            type: String,
            default: ""
        },

        // Results visibility
        resultPublished: {
            type: Boolean,
            default: false
        },

        resultPublishedAt: {
            type: Date
        },

        // Metadata
        ipAddress: {
            type: String
        },

        userAgent: {
            type: String
        },

        deviceInfo: {
            type: String,
            default: ""
        },

        // Attempt number (for max attempts feature)
        attemptNumber: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

// Indexes
examAttemptSchema.index({ exam: 1, student: 1 });
examAttemptSchema.index({ student: 1, status: 1 });
examAttemptSchema.index({ exam: 1, status: 1 });
examAttemptSchema.index({ exam: 1, student: 1, attemptNumber: 1 });

// Virtual for remaining time
examAttemptSchema.virtual("remainingTime").get(function () {
    if (this.status !== "IN_PROGRESS") return 0;
    const now = new Date();
    const remaining = this.endTime - now;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
});

// Pre-save hook
examAttemptSchema.pre("save", function () {
    if (this.isModified("violations")) {
        this.totalViolations = this.violations.length;
    }
    if (this.isModified("answers")) {
        this.obtainedMarks = this.answers.reduce((sum, a) => sum + (a.marksObtained || 0), 0);
        if (this.totalMarks > 0) {
            this.percentage = Math.round((this.obtainedMarks / this.totalMarks) * 100 * 100) / 100;
        }
    }
});

// Method to add violation
examAttemptSchema.methods.addViolation = function (type, details = "", duration = 0) {
    this.violations.push({
        type,
        timestamp: new Date(),
        details,
        duration
    });
    this.totalViolations = this.violations.length;

    if (type === "TAB_SWITCH" || type === "WINDOW_BLUR") {
        this.tabSwitchCount += 1;
    } else if (type === "FULLSCREEN_EXIT") {
        this.fullscreenExits += 1;
    } else if (type === "TIME_OUTSIDE_EXCEEDED") {
        this.timeOutside += duration;
    } else if (type === "HEARTBEAT_MISSED") {
        this.heartbeatMissed += 1;
    }
};

// Method to check if should be disqualified
examAttemptSchema.methods.shouldDisqualify = function (maxTimeOutside = 300000) {
    return this.timeOutside > maxTimeOutside;
};

// Method to calculate score
examAttemptSchema.methods.calculateScore = function (correctAnswers = {}) {
    let obtained = 0;
    let total = 0;

    this.answers.forEach(answer => {
        total += answer.marksObtained || 0;
        if (answer.isCorrect) {
            obtained += answer.marksObtained || 0;
        }
    });

    this.obtainedMarks = obtained;
    this.totalMarks = total;
    this.percentage = total > 0 ? Math.round((obtained / total) * 100 * 100) / 100 : 0;
    this.passed = this.percentage >= (this.exam?.passingMarks || 0);

    return { obtained, total, percentage: this.percentage, passed: this.passed };
};

// Static method to check if student can attempt exam
examAttemptSchema.statics.canAttempt = async function (examId, studentId, maxAttempts = 1) {
    const attempts = await this.countDocuments({
        exam: examId,
        student: studentId,
        status: { $in: ["SUBMITTED", "AUTO_SUBMITTED", "DISQUALIFIED"] }
    });
    return attempts < maxAttempts;
};

// Static method to get active attempt
examAttemptSchema.statics.getActiveAttempt = async function (examId, studentId) {
    return this.findOne({
        exam: examId,
        student: studentId,
        status: { $in: ["NOT_STARTED", "IN_PROGRESS"] }
    });
};

// Static method to get student's attempts
examAttemptSchema.statics.getStudentAttempts = async function (examId, studentId) {
    return this.find({ exam: examId, student: studentId })
        .sort({ attemptNumber: 1 });
};

// Static method to get exam statistics
examAttemptSchema.statics.getExamStats = async function (examId) {
    const stats = await this.aggregate([
        { $match: { exam: new mongoose.Types.ObjectId(examId), status: "SUBMITTED" } },
        {
            $group: {
                _id: null,
                totalAttempts: { $sum: 1 },
                avgPercentage: { $avg: "$percentage" },
                highestPercentage: { $max: "$percentage" },
                lowestPercentage: { $min: "$percentage" },
                avgTimeTaken: { $avg: "$timeTaken" },
                passedCount: { $sum: { $cond: ["$passed", 1, 0] } },
                totalViolations: { $sum: "$totalViolations" },
                avgViolations: { $avg: "$totalViolations" }
            }
        }
    ]);

    return stats[0] || {
        totalAttempts: 0,
        avgPercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        avgTimeTaken: 0,
        passedCount: 0,
        totalViolations: 0,
        avgViolations: 0
    };
};

export default mongoose.model("ExamAttempt", examAttemptSchema);
