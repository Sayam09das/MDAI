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
            required: true,
        },

        resourceType: {
            type: String,
            enum: ["pdf", "video", "file", "link"],
            required: true,
        },

        // 🔒 MUST for ALL resources
        thumbnail: {
            type: String,
            required: true,
        },

        // Only for PDFs
        pages: {
            type: Number,
            min: 1,
            required: function () {
                return this.resourceType === "pdf";
            },
        },

        fileUrl: {
            type: String,
        },

        externalLink: {
            type: String,
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

/* ================= CUSTOM VALIDATION ================= */
resourceSchema.pre("validate", function (next) {
    // file-based resources must have fileUrl
    if (
        ["pdf", "video", "file"].includes(this.resourceType) &&
        !this.fileUrl
    ) {
        return next(
            new Error("fileUrl is required for pdf, video, or file resources")
        );
    }

    // link resource must have externalLink
    if (this.resourceType === "link" && !this.externalLink) {
        return next(new Error("externalLink is required for link resources"));
    }

    // prevent both being empty
    if (!this.fileUrl && !this.externalLink) {
        return next(
            new Error("Either fileUrl or externalLink must be provided")
        );
    }

    next();
});

export default mongoose.model("Resource", resourceSchema);
