import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      default: "Development",
    },

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

    duration: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    language: {
      type: String,
      default: "English",
    },

    requirements: {
      type: [String],
      default: [],
    },

    learningOutcomes: {
      type: [String],
      default: [],
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    /* ================= CERTIFICATE COMPLETION CRITERIA ================= */
    certificateEnabled: {
      type: Boolean,
      default: false,
    },

    // Minimum progress percentage required (default 80%)
    certificateMinProgress: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    },

    // Whether all assignments must be submitted
    certificateRequireAssignments: {
      type: Boolean,
      default: true,
    },

    // Whether final exam is required
    certificateRequireExam: {
      type: Boolean,
      default: false,
    },

    // Minimum passing marks for exam (percentage)
    certificatePassingMarks: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },

    // Whether certificates have been generated for this course
    certificateGenerated: {
      type: Boolean,
      default: false,
    },

    // Course completion date
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
