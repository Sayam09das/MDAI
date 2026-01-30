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

export const updatePaymentStatusByAdmin = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { status } = req.body; // PAID or LATER

        // 1️⃣ Validate status
        if (!["PAID", "LATER"].includes(status)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }

        // 2️⃣ Find enrollment
        const enrollment = await Enrollment.findById(enrollmentId);

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        // 3️⃣ Block only if receipt already exists
        if (enrollment.paymentStatus === "PAID" && enrollment.receipt?.public_id) {
            return res.status(400).json({
                message: "Payment already approved and receipt generated",
            });
        }

        // 4️⃣ Update payment info
        enrollment.paymentStatus = status;
        enrollment.verifiedBy = req.user.id;
        enrollment.verifiedAt = new Date();

        /* ========= AUTO RECEIPT GENERATION ========= */
        if (status === "PAID") {
            const receiptNumber =
                enrollment.receipt?.receiptNumber ||
                `REC-${Date.now()}-${enrollment._id.toString().slice(-4)}`;

            // Save receipt meta first
            enrollment.receipt = {
                receiptNumber,
                issuedAt: new Date(),
                issuedBy: req.user.id,
            };

            await enrollment.save();

            // 5️⃣ Re-fetch with populated data (CRITICAL)
            const populatedEnrollment = await Enrollment.findById(enrollment._id)
                .populate("student", "fullName email")
                .populate("course", "title");

            // 6️⃣ Generate PDF (returns local file path)
            const pdfPath = await generateReceiptPdf(populatedEnrollment);

            // 7️⃣ Upload PDF to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(pdfPath, {
                folder: "receipts",
                resource_type: "raw",
                resource_type: "image", // PDFs handled as images
            });

            // 8️⃣ Save public_id (SIGNED URL WILL USE THIS)
            enrollment.receipt.public_id = uploadResult.public_id;

            // 9️⃣ Cleanup local file
            fs.unlinkSync(pdfPath);
        } else {
            enrollment.receipt = undefined;
        }

        // 🔟 Final save
        await enrollment.save();

        res.json({
            success: true,
            message:
                status === "PAID"
                    ? "Payment approved & receipt generated"
                    : "Payment marked as pending",
            enrollment,
        });
    } catch (error) {
        console.error("Update payment error:", error);
        res.status(500).json({ message: error.message });
    }
};

