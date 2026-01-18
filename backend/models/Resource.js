import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        courseTitle: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        resourceType: {
            type: String,
            enum: ["video", "file", "link"],
            required: true,
        },

        // 🔹 Thumbnail (NOT required for now)
        thumbnail: {
            type: String,
            default: "",
        },

        // 🔹 For video (mp3) & file (any)
        fileUrl: {
            type: String,
            required: function () {
                return this.resourceType === "video" || this.resourceType === "file";
            },
        },

        // 🔹 Only for external links
        externalLink: {
            type: String,
            required: function () {
                return this.resourceType === "link";
            },
        },

        // 🔹 Video format validation (mp3 only)
        fileFormat: {
            type: String,
            enum: ["mp3"],
            required: function () {
                return this.resourceType === "video";
            },
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
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
