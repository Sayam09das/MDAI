import Enrollment from "../models/enrollmentModel.js";

export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id; // ✅ FIXED

        const exists = await Enrollment.findOne({
            student: studentId,
            course: courseId,
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled",
            });
        }

        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
        });

        res.status(201).json({
            success: true,
            message: "Enrollment successful",
            enrollment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyEnrollments = async (req, res) => {
    try {
        const studentId = req.user.id;

        const enrollments = await Enrollment.find({ student: studentId })
            .populate("course", "title thumbnail")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
