import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        /* ================= UPLOADED BY TYPE ================= */
        uploadedBy: {
            type: String,
            enum: ["teacher", "admin"],
            required: true,
        },

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

        /* ================= TEACHER INFO ================= */
        teacherName: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },

        teacherEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },

        teacherProfileImage: {
            public_id: String,
            url: String,
        },

        /* ================= ADMIN INFO ================= */
        adminName: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },

        adminEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },

        /* ================= FILE UPLOAD ================= */
        file: {
            public_id: {
                type: String,
                required: function() { return !this.driveLink; }
            },
            url: {
                type: String,
                required: function() { return !this.driveLink; }
            },
            format: String,
            size: Number,
        },

        /* ================= FILE TYPE ================= */
        fileType: {
            type: String,
            enum: ["pdf", "video", "zip", "image", "document", "other"],
            default: "other",
        },

        /* ================= DRIVE LINK (OPTIONAL) ================= */
        driveLink: {
            type: String,
            trim: true,
            match: [
                /^(https?:\/\/)(www\.)?.+/,
                "Please provide a valid URL",
            ],
        },

        /* ================= THUMBNAIL IMAGE ================= */
        // ✅ Cloudinary image data
        thumbnail: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
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
