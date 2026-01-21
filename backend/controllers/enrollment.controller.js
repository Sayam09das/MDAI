import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/Course.js";

/* ===============================
   ENROLL COURSE
================================ */
export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // ✅ 1. VALIDATE COURSE
        const courseExists = await Course.findById(courseId);
        if (!courseExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // ✅ 2. CHECK ALREADY ENROLLED
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

        // ✅ 3. CREATE ENROLLMENT (COURSE ONLY)
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            paymentStatus: "PENDING", // optional but recommended
        });

        res.status(201).json({
            success: true,
            message: "Enrollment successful",
            enrollment,
        });
    } catch (error) {
        console.error("Enroll Course Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ===============================
   GET MY ENROLLMENTS
================================ */
export const getMyEnrollments = async (req, res) => {
    try {
        const studentId = req.user.id;

        const enrollments = await Enrollment.find({
            student: studentId,
            course: { $ne: null }, // ✅ SAFETY FILTER
        })
            .populate("course", "title thumbnail")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        console.error("Get My Enrollments Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* ===============================
   TEACHER: GET ENROLLED STUDENTS OF A COURSE
================================ */
export const getCourseEnrollmentsForTeacher = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ CRITICAL SAFETY CHECK
    if (!course.teacher) {
      return res.status(400).json({
        success: false,
        message: "Course has no teacher assigned",
      });
    }

    if (course.teacher.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this course",
      });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalStudents: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error("Get Course Enrollments Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
