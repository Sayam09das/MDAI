import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "LATER"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
