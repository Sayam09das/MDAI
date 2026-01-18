import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        // 🔥 THIS WAS MISSING OR WRONG
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        date: String,
        time: String,
        duration: String,
        meetLink: String,
    },
    { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
