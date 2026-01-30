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
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        receipt: {
            receiptNumber: String,
            issuedAt: Date,
            issuedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Admin",
            },
            public_id: String, // ONLY THIS
        },


        verifiedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
