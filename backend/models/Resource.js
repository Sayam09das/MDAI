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

        thumbnail: {
            type: String,
            default: "",
        },

        fileUrl: {
            type: String,
            required: function () {
                return this.resourceType === "file" || this.resourceType === "video";
            },
        },

        externalLink: {
            type: String,
            required: function () {
                return this.resourceType === "link";
            },
        },

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
    { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
