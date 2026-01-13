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
            ref: "Course", // change if your course model name is different
            required: true,
        },

        date: {
            type: String, // you can also use Date if you want
            required: true,
        },

        time: {
            type: String, // example: "10:30 AM"
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
