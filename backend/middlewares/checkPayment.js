import Enrollment from "../models/enrollmentModel.js";

const checkPaymentStatus = async (req, res, next) => {
    try {
        const userId = req.user.id; // ✅ FIXED
        const { courseId } = req.params;

        const enrollment = await Enrollment.findOne({
            student: userId,
            course: courseId,
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "Not enrolled in this course",
            });
        }

        if (enrollment.paymentStatus !== "PAID") {
            return res.status(403).json({
                success: false,
                paymentStatus: enrollment.paymentStatus,
                message: "Payment not completed",
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default checkPaymentStatus;
