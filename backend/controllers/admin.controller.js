import Admin from "../models/adminModel.js";
import Enrollment from "../models/enrollmentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { generateReceiptImage } from "../utils/generateReceiptImage.js";
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
        const { status } = req.body;

        // First, check if enrollment exists
        const existingEnrollment = await Enrollment.findById(enrollmentId);
        if (!existingEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        if (status !== "PAID") {
            return res.status(400).json({ message: "Only PAID allowed" });
        }

        const receiptNumber = `REC-${Date.now()}-${existingEnrollment._id
            .toString()
            .slice(-4)}`;

        existingEnrollment.receipt = {
            receiptNumber,
            issuedAt: new Date(),
            issuedBy: req.user.id,
        };

        existingEnrollment.paymentStatus = "PAID";
        existingEnrollment.verifiedBy = req.user.id;
        existingEnrollment.verifiedAt = new Date();
        await existingEnrollment.save();

        // Now populate for receipt generation
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("student", "fullName email")
            .populate("course", "title price");

        // 1️⃣ Generate image with populated data
        const imagePath = await generateReceiptImage(enrollment);

        // 2️⃣ Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: "receipts",
            resource_type: "image",
        });

        existingEnrollment.receipt.public_id = uploadResult.public_id;
        existingEnrollment.receipt.url = uploadResult.secure_url;

        fs.unlinkSync(imagePath);
        await existingEnrollment.save();

        res.json({
            success: true,
            message: "Payment approved & receipt image generated",
            receiptImage: uploadResult.secure_url,
        });
    } catch (error) {
        console.error("Payment approval error:", error);
        res.status(500).json({ message: error.message });
    }
};

