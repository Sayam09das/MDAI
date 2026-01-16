import Lesson from "../models/lessonModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import mongoose from "mongoose";

/* ===============================
   HELPER: NORMALIZE MEET LINK
================================ */
const normalizeMeetLink = (link) => {
    if (!link) return link;
    return link.startsWith("http") ? link : `https://${link}`;
};

/* ===============================
   CREATE LIVE SESSION (LESSON)
================================ */
export const createLesson = async (req, res) => {
    try {
        let { title, course, date, time, duration, meetLink } = req.body;

        if (!title || !course || !date || !time || !meetLink) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled",
            });
        }

        // ✅ VALIDATE COURSE ID
        if (!mongoose.Types.ObjectId.isValid(course)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // ✅ CHECK COURSE EXISTS
        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // ✅ FIX MEET LINK
        meetLink = normalizeMeetLink(meetLink);

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lesson ID",
            });
        }

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
   UPDATE LIVE SESSION
================================ */
export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lesson ID",
            });
        }

        // ✅ FIX MEET LINK IF PRESENT
        if (req.body.meetLink) {
            req.body.meetLink = normalizeMeetLink(req.body.meetLink);
        }

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lesson ID",
            });
        }

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

/* ===============================
   GET LIVE SESSIONS BY COURSE (STUDENT)
================================ */
export const getLessonsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // ✅ CHECK ENROLLMENT
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        if (enrollment.paymentStatus !== "PAID") {
            return res.status(403).json({
                success: false,
                message: "Payment required to access live sessions",
            });
        }

        // ✅ FETCH LESSONS
        const lessons = await Lesson.find({ course: courseId })
            .sort({ date: 1, time: 1 });

        res.status(200).json({
            success: true,
            lessons,
        });
    } catch (error) {
        console.error("Get Lessons By Course Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
