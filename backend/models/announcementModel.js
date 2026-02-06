import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["all", "students", "teachers"],
            default: "all",
        },
        priority: {
            type: String,
            enum: ["normal", "high"],
            default: "normal",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Index for efficient querying
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ type: 1, isActive: 1 });

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;

