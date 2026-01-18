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

        // 🔒 ONLY LINK FOR NOW
        resourceType: {
            type: String,
            enum: ["link"],
            default: "link",
        },

        externalLink: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String,
            default: "",
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
