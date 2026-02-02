import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["PRESENT", "ABSENT", "LATE"],
          default: "PRESENT",
        },
        markedAt: {
          type: Date,
          default: Date.now,
        },
        remarks: {
          type: String,
          maxlength: 200,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient queries
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ teacher: 1, date: 1 });

export default mongoose.model("Attendance", attendanceSchema);

