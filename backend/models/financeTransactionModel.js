import mongoose from "mongoose";

const financeTransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["PAYMENT", "WITHDRAWAL", "REFUND", "DEPOSIT"],
        required: true
    },
    enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enrollment",
        default: null
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: null
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        default: null
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    grossAmount: {
        type: Number,
        default: 0
    },
    adminPercentage: {
        type: Number,
        default: 10
    },
    adminAmount: {
        type: Number,
        default: 0
    },
    teacherAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
        default: "PENDING"
    },
    paymentMethod: {
        type: String,
        enum: ["ONLINE", "CASH", "BANK_TRANSFER", "OTHER"],
        default: "ONLINE"
    },
    description: {
        type: String,
        default: ""
    },
    processedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const FinanceTransaction = mongoose.model("FinanceTransaction", financeTransactionSchema);

export default FinanceTransaction;

