import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
}, { _id: true });

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["multiple_choice", "true_false", "short_answer", "essay", "file_upload"],
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [optionSchema],
    correctAnswer: {
        type: String, // For short answer
        default: ""
    },
    marks: {
        type: Number,
        required: true,
        min: 0
    },
    explanation: {
        type: String,
        default: ""
    },
    order: {
        type: Number,
        default: 0
    },
    // For file_upload questions
    allowedFileTypes: {
        type: [String],
        default: ["application/pdf"]
    },
    maxFileSize: {
        type: Number, // in MB
        default: 10
    }
}, { _id: true });

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

        // Exam Configuration
        duration: {
            type: Number, // in minutes
            required: true
        },

        totalMarks: {
            type: Number,
            required: true
        },

        passingMarks: {
            type: Number,
            default: 0
        },

        // Questions
        questions: [questionSchema],

        // Settings
        shuffleQuestions: {
            type: Boolean,
            default: false
        },

        shuffleOptions: {
            type: Boolean,
            default: false
        },

        showResults: {
            type: Boolean,
            default: false
        },

        allowReview: {
            type: Boolean,
            default: true
        },

        // Availability
        startDate: {
            type: Date,
            default: null
        },

        endDate: {
            type: Date,
            default: null
        },

        isPublished: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date
        },

        status: {
            type: String,
            enum: ["draft", "scheduled", "active", "closed", "archived"],
            default: "draft"
        },

        // Attempt Settings
        maxAttempts: {
            type: Number,
            default: 1
        },

        // Security Settings
        security: {
            preventTabSwitch: { type: Boolean, default: true },
            preventCopyPaste: { type: Boolean, default: true },
            requireFullscreen: { type: Boolean, default: true },
            maxTimeOutside: { type: Number, default: 5 }, // in minutes
            autoSubmitOnViolation: { type: Boolean, default: false }
        },

        // Statistics
        totalAttempts: {
            type: Number,
            default: 0
        },

        averageScore: {
            type: Number,
            default: 0
        },

        highestScore: {
            type: Number,
            default: 0
        },

        lowestScore: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Indexes
examSchema.index({ course: 1, instructor: 1 });
examSchema.index({ course: 1, status: 1 });
examSchema.index({ isPublished: 1, status: 1 });

// Virtual for question count
examSchema.virtual("questionCount").get(function () {
    return this.questions.length;
});

// Pre-save hook to calculate total marks
examSchema.pre("save", function () {
    if (this.isModified("questions")) {
        this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    }
    if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

// Static method to get published exams for a course
examSchema.statics.getPublishedExams = async function (courseId) {
    return this.find({
        course: courseId,
        isPublished: true,
        status: { $in: ["scheduled", "active"] }
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

export default mongoose.model("Exam", examSchema);
