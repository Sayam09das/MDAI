import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            ref: "Course",
            required: true,
        },

        date: {
            type: String, 
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        duration: {
            type: String,
            enum: ["30", "45", "60", "90", "120"],
            default: "90",
            required: true,
        },

        meetLink: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;