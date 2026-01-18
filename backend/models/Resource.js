import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        date: {
            type: Date,
            default: Date.now,
        },

        tags: {
            type: [String],
            required: true,
        },

        thumbnail: {
            type: String,
            required: function () {
                return this.resourceType !== "link";
            },
        },
        resourceType: {
            type: String,
            enum: ["pdf", "video", "file", "link", "other"],
            required: true,
        },

        pages: {
            type: Number,
            min: 1,
            required: function () {
                return this.resourceType === "pdf" || this.resourceType === "file";
            },
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },

        fileUrl: {
            type: String,
        },

        externalLink: {
            type: String,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Resource", resourceSchema);
