import mongoose from "mongoose";

const financeTransactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["PAYMENT", "WITHDRAWAL", "ADJUSTMENT", "REFUND"],
            required: true,
        },
        
        // Reference to related documents
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
        },
        
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        
        // Amount breakdown
        grossAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        
        adminPercentage: {
            type: Number,
            default: 10, // 10% admin cut
            min: 0,
            max: 100,
        },
        
        adminAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        
        teacherAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        
        // Status
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
            default: "PENDING",
        },
        
        // Payment details
        paymentMethod: {
            type: String,
            enum: ["CASH", "ONLINE", "BANK_TRANSFER", "OTHER"],
            default: "ONLINE",
        },
        
        transactionId: {
            type: String,
        },
        
        // Notes
        description: {
            type: String,
        },
        
        adminNote: {
            type: String,
        },
        
        // Timestamps
        processedAt: {
            type: Date,
        },
        
        completedAt: {
            type: Date,
        },
        
        // Soft delete
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Index for efficient queries
financeTransactionSchema.index({ teacher: 1, createdAt: -1 });
financeTransactionSchema.index({ enrollment: 1 });
financeTransactionSchema.index({ course: 1 });
financeTransactionSchema.index({ type: 1, status: 1 });

// Calculate amounts before saving
financeTransactionSchema.pre("save", function (next) {
    if (this.grossAmount && !this.adminAmount) {
        this.adminAmount = Math.round((this.grossAmount * this.adminPercentage) / 100 * 100) / 100;
        this.teacherAmount = Math.round((this.grossAmount * (100 - this.adminPercentage)) / 100 * 100) / 100;
    }
    next();
});

export default mongoose.model("FinanceTransaction", financeTransactionSchema);

