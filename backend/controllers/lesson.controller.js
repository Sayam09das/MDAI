import Lesson from "../models/lesson.model.js";

/* ===============================
   CREATE LIVE SESSION (LESSON)
================================ */
export const createLesson = async (req, res) => {
    try {
        const { title, course, date, time, duration, meetLink } = req.body;

        if (!title || !course || !date || !time || !meetLink) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled",
            });
        }

        const lesson = await Lesson.create({
            title,
            course,
            date,
            time,
            duration,
            meetLink,
        });

        res.status(201).json({
            success: true,
            message: "Live session created successfully",
            lesson,
        });
    } catch (error) {
        console.error("Create Lesson Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ===============================
   GET ALL LIVE SESSIONS
================================ */
export const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .populate("course", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            lessons,
        });
    } catch (error) {
        console.error("Get Lessons Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ===============================
   GET SINGLE LIVE SESSION
================================ */
export const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await Lesson.findById(id).populate("course", "title");

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Live session not found",
            });
        }

        res.status(200).json({
            success: true,
            lesson,
        });
    } catch (error) {
        console.error("Get Lesson Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ===============================
   EDIT / UPDATE LIVE SESSION
================================ */
export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedLesson = await Lesson.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedLesson) {
            return res.status(404).json({
                success: false,
                message: "Live session not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Live session updated successfully",
            lesson: updatedLesson,
        });
    } catch (error) {
        console.error("Update Lesson Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ===============================
   DELETE LIVE SESSION
================================ */
export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await Lesson.findByIdAndDelete(id);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Live session not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Live session deleted successfully",
        });
    } catch (error) {
        console.error("Delete Lesson Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
