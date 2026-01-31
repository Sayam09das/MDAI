import Admin from "../models/adminModel.js";
import Enrollment from "../models/enrollmentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { generateReceiptPdf } from "../utils/generateReceiptPdf.js";
import fs from "fs";

/* =========================================
   HELPER: GENERATE JWT
   ========================================= */
const generateToken = (admin) => {
    return jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

/* =========================================
   ADMIN: REGISTER
   ========================================= */
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(admin);

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: LOGIN
   ========================================= */
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const admin = await Admin.findOne({ email }).select("+password");

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(admin);

        res.json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: LOGOUT
   ========================================= */
export const logoutAdmin = async (req, res) => {
    try {
        // JWT logout handled on frontend by deleting token
        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET PROFILE
   ========================================= */
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            success: true,
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= ADMIN: GET ALL ENROLLMENTS ================= */
export const getAllEnrollmentsForAdmin = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "name email")
            .populate("course", "title");

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





/* ================= UPDATE PAYMENT + RECEIPT ================= */
export const updatePaymentStatusByAdmin = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { status } = req.body;

        if (!["PAID", "LATER"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        // Prevent duplicate receipt
        if (enrollment.paymentStatus === "PAID" && enrollment.receipt?.public_id) {
            return res
                .status(400)
                .json({ message: "Receipt already generated" });
        }

        enrollment.paymentStatus = status;
        enrollment.verifiedBy = req.user.id;
        enrollment.verifiedAt = new Date();

        if (status === "PAID") {
            const receiptNumber = `REC-${Date.now()}-${enrollment._id
                .toString()
                .slice(-4)}`;

            // Save receipt meta
            enrollment.receipt = {
                receiptNumber,
                issuedAt: new Date(),
                issuedBy: req.user.id,
            };

            await enrollment.save();

            // Populate for PDF
            const populatedEnrollment = await Enrollment.findById(enrollment._id)
                .populate("student", "fullName email")
                .populate("course", "title");

            // Generate PDF
            const pdfPath = await generateReceiptPdf(populatedEnrollment);

            // IMPORTANT: NO .pdf here
            const publicId = `receipts/${receiptNumber}`;

            const uploadResult = await cloudinary.uploader.upload(pdfPath, {
                resource_type: "raw",
                public_id: publicId,
                format: "pdf",          // ✅ THIS STOPS `.pdf` APPENDING
                access_mode: "public",
                overwrite: true,
            });

            // Save clean public_id
            enrollment.receipt.public_id = uploadResult.public_id;

            fs.unlinkSync(pdfPath);
            await enrollment.save();
        }

        res.json({
            success: true,
            message: "Payment approved & receipt generated",
            enrollment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
