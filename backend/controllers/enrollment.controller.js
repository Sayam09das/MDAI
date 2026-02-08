import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/Course.js";
import { generateReceiptImage } from "../utils/generateReceiptImage.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

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

        // ✅ 3. CREATE ENROLLMENT WITH COURSE PRICE
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            paymentStatus: "PENDING",
            amount: courseExists.price || 0, // Save course price at enrollment time
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

export const getReceipt = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const studentId = req.user.id;

        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            student: studentId,
            paymentStatus: "PAID",
        })
            .populate("student", "fullName email")
            .populate("course", "title");

        if (!enrollment?.receipt?.url) {
            return res.status(404).json({
                success: false,
                message: "Receipt not available",
            });
        }

        // 🔥 Direct redirect to the Cloudinary URL
        res.redirect(enrollment.receipt.url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
