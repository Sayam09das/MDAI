import Teacher from "../models/teacherModel.js";
import { z } from "zod";

/* ================= TEACHER REGISTER ================= */
export const registerTeacher = async (req, res) => {
  try {
    const schema = z.object({
      fullName: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
      phone: z.string().min(10),
      address: z.string().min(5),
      gender: z.enum(["male", "female", "other"]),
      class10Certificate: z.string(),
      class12Certificate: z.string(),
      collegeCertificate: z.string(),
      phdOrOtherCertificate: z.string().optional(),
      profileImage: z.string().optional(),
      joinWhatsappGroup: z.boolean().optional(),
    });

    const data = schema.parse(req.body);

    const exists = await Teacher.findOne({ email: data.email });
    if (exists) {
      return res.status(409).json({ message: "Teacher already registered" });
    }

    const teacher = await Teacher.create({
      ...data,
      isVerified: true, // ✅ auto-verified (no OTP)
    });

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
    });
  } catch (error) {
    console.error("Teacher Register Error:", error);
    res.status(500).json({
      message: "Teacher registration failed",
    });
  }
};

/* ================= TEACHER LOGOUT ================= */
export const teacherLogout = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      success: true,
      message: "Teacher logged out successfully",
    });
  } catch (error) {
    console.error("Teacher Logout Error:", error);
    res.status(500).json({
      message: "Logout failed",
    });
  }
};
