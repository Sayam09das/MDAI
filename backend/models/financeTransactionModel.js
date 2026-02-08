import mongoose from "mongoose";

const financeTransactionSchema = new mongoose.Schema({
    // Transaction type: PAYMENT, REFUND, WITHDRAWAL, DEPOSIT
    type: {
        type: String,
        enum: ["PAYMENT", "REFUND", "WITHDRAWAL", "DEPOSIT", "ADMIN_CUT", "TEACHER_PAYOUT"],
        required: true,
    },
    
    // Related documents
    enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enrollment",
        default: null,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: null,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        default: null,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    
    // Amount fields
    grossAmount: {
        type: Number,
        default: 0,
    },
    adminPercentage: {
        type: Number,
        default: 0,
    },
    adminAmount: {
        type: Number,
        default: 0,
    },
    teacherAmount: {
        type: Number,
        default: 0,
    },
    netAmount: {
        type: Number,
        default: 0,
    },
    
    // Transaction status
    status: {
        type: String,
        enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"],
        default: "PENDING",
    },
    
    // Payment details
    paymentMethod: {
        type: String,
        enum: ["ONLINE", "CASH", "BANK_TRANSFER", "WALLET", "OTHER"],
        default: "ONLINE",
    },
    paymentGateway: {
        type: String,
        default: null,
    },
    transactionId: {
        type: String,
        default: null,
    },
    
    // Description and notes
    description: {
        type: String,
        default: "",
    },
    notes: {
        type: String,
        default: "",
    },
    
    // Timestamps
    processedAt: {
        type: Date,
        default: null,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    failedAt: {
        type: Date,
        default: null,
    },
    
    // Audit fields
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null,
    },
}, {
    timestamps: true,
});

// Index for faster queries
financeTransactionSchema.index({ createdAt: -1 });
financeTransactionSchema.index({ status: 1 });
financeTransactionSchema.index({ type: 1 });
financeTransactionSchema.index({ student: 1 });
financeTransactionSchema.index({ teacher: 1 });
financeTransactionSchema.index({ course: 1 });

// Pre-save middleware to calculate netAmount (Mongoose 7+ compatible - no next parameter)
financeTransactionSchema.pre('save', async function() {
    if (this.grossAmount && this.adminAmount) {
        this.netAmount = this.grossAmount - this.adminAmount;
    } else if (this.grossAmount && this.adminPercentage) {
        this.adminAmount = (this.grossAmount * this.adminPercentage) / 100;
        this.netAmount = this.grossAmount - this.adminAmount;
    }
});

const FinanceTransaction = mongoose.model("FinanceTransaction", financeTransactionSchema);

export default FinanceTransaction;

