import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        /* ================= RESOURCE INFO ================= */
        title: {
            type: String,
            required: [true, "Resource title is required"],
            trim: true,
            minlength: 3,
            maxlength: 150,
        },

        description: {
            type: String,
            required: [true, "Resource description is required"],
            trim: true,
            minlength: 10,
        },

        /* ================= COURSE (TEXT ONLY) ================= */
        courseTitle: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            maxlength: 150,
        },

        /* ================= TEACHER (TEXT ONLY) ================= */
        teacherName: {
            type: String,
            required: [true, "Teacher name is required"],
            trim: true,
            maxlength: 100,
        },

        /* ================= THUMBNAIL IMAGE ================= */
        // ✅ Cloudinary image data
        thumbnail: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },

        /* ================= DRIVE LINK ================= */
        driveLink: {
            type: String,
            required: [true, "Google Drive link is required"],
            trim: true,
            validate: {
                validator: function (v) {
                    return /^https?:\/\/(www\.)?drive\.google\.com\/.+/.test(v);
                },
                message: "Please provide a valid Google Drive link",
            },
        },

        /* ================= RESOURCE TYPE ================= */
        resourceType: {
            type: String,
            enum: ["pdf", "video", "slides", "assignment", "notes", "other"],
            default: "other",
        },
    },
    {
        timestamps: true, // createdAt & updatedAt
    }
);

/* ================= SEARCH INDEX ================= */
resourceSchema.index({
    title: "text",
    description: "text",
    courseTitle: "text",
    teacherName: "text",
});

/* ================= EXPORT ================= */
const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
