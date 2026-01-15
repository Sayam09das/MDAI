import Enrollment from "../models/enrollmentModel.js";

/* =========================================
   STUDENT: CREATE ENROLLMENT (DEFAULT PENDING)
   ========================================= */
export const createEnrollment = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIX HERE
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================
   STUDENT: GET MY ENROLLMENTS
   ========================================= */
export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            user: req.user._id,
        }).populate("course");

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch enrollments",
        });
    }
};

/* =========================================
   ADMIN: GET ALL ENROLLMENTS
   ========================================= */
export const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("user", "name email")
            .populate("course", "title price");

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch enrollments",
        });
    }
};

/* =========================================
   ADMIN: UPDATE PAYMENT STATUS
   ========================================= */
export const updateEnrollmentPaymentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { paymentStatus, adminNote } = req.body;

        if (!["paid", "pay_later"].includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status",
            });
        }

        const enrollment = await Enrollment.findById(enrollmentId);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        enrollment.paymentStatus = paymentStatus;
        enrollment.verifiedBy = req.user._id; // admin
        enrollment.verifiedAt = new Date();

        if (adminNote) {
            enrollment.adminNote = adminNote;
        }

        await enrollment.save();

        res.json({
            success: true,
            message: "Payment status updated successfully",
            enrollment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update payment status",
        });
    }
};
