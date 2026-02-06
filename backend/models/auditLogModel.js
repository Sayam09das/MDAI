import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        action: {
            type: String,
            required: true,
            trim: true,
        },
        details: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["success", "warning", "error"],
            default: "success",
        },
        ipAddress: {
            type: String,
            trim: true,
        },
        userAgent: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// Index for efficient querying
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, status: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;

