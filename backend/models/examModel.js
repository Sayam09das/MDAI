import mongoose from "mongoose";

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
            "HEARTBEAT_MISSED"
        ],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    details: {
        type: String,
        default: ""
    },
    duration: {
        type: Number, // in milliseconds
        default: 0
    }
}, { _id: false });

const examSessionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
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

        duration: {
            type: Number, // in minutes
            required: true
        },

        // Status
        status: {
            type: String,
            enum: ["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "AUTO_SUBMITTED", "DISQUALIFIED", "EXPIRED"],
            default: "NOT_STARTED"
        },

        // Security tracking
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
            type: Number, // total milliseconds spent outside exam tab
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

        // Answers (for auto-submit)
        answers: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: new Map()
        },

        // Submission reference (after submit)
        submission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission"
        },

        // Auto-submit reason
        autoSubmitReason: {
            type: String,
            enum: ["TIME_EXPIRED", "DISQUALIFIED", "HEARTBEAT_TIMEOUT", "SYSTEM_ERROR"],
            default: null
        },

        // Disqualification details
        disqualifiedAt: {
            type: Date
        },

        disqualifiedReason: {
            type: String,
            default: ""
        },

        // Metadata
        ipAddress: {
            type: String
        },

        userAgent: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Indexes for efficient queries
examSessionSchema.index({ assignment: 1, student: 1 });
examSessionSchema.index({ student: 1, status: 1 });
examSessionSchema.index({ assignment: 1, status: 1 });
examSessionSchema.index({ startTime: 1 });
examSessionSchema.index({ lastHeartbeat: 1 });

// Virtual to check if exam is expired
examSessionSchema.virtual("isExpired").get(function () {
    return new Date() > this.endTime;
});

// Virtual to get remaining time in minutes
examSessionSchema.virtual("remainingTime").get(function () {
    if (this.status !== "IN_PROGRESS") return 0;
    const now = new Date();
    const remaining = this.endTime - now;
    return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
});

// Virtual to check if student is currently outside exam
examSessionSchema.virtual("isOutside").get(function () {
    // This would be calculated based on last activity
    return false;
});

// Pre-save hook to update total violations
examSessionSchema.pre("save", function () {
    if (this.isModified("violations")) {
        this.totalViolations = this.violations.length;
    }
});

// Method to add violation
examSessionSchema.methods.addViolation = function (type, details = "", duration = 0) {
    this.violations.push({
        type,
        timestamp: new Date(),
        details,
        duration
    });
    this.totalViolations = this.violations.length;

    // Auto-update specific counters
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
examSessionSchema.methods.shouldDisqualify = function (maxTimeOutside = 300000) {
    return this.timeOutside > maxTimeOutside;
};

// Method to calculate score from answers (for objective questions)
examSessionSchema.methods.calculateScore = function (questionAnswers = {}) {
    let correct = 0;
    let total = 0;

    this.answers.forEach((answer, questionId) => {
        if (questionAnswers[questionId]) {
            total += 1;
            if (answer === questionAnswers[questionId]) {
                correct += 1;
            }
        }
    });

    return {
        correct,
        total,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0
    };
};

// Static method to get active session
examSessionSchema.statics.getActiveSession = async function (assignmentId, studentId) {
    return this.findOne({
        assignment: assignmentId,
        student: studentId,
        status: { $in: ["NOT_STARTED", "IN_PROGRESS"] }
    });
};

// Static method to get student's exam sessions
examSessionSchema.statics.getStudentSessions = async function (studentId, status = null) {
    const query = { student: studentId };
    if (status) query.status = status;

    return this.find(query)
        .populate("assignment", "title maxMarks")
        .populate("course", "title")
        .sort({ createdAt: -1 });
};

// Static method to cleanup expired sessions
examSessionSchema.statics.cleanupExpired = async function (maxAge = 24 * 60 * 60 * 1000) {
    const threshold = new Date(Date.now() - maxAge);
    return this.deleteMany({
        status: "NOT_STARTED",
        createdAt: { $lt: threshold }
    });
};

export default mongoose.model("ExamSession", examSessionSchema);

