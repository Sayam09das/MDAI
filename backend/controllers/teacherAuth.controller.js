import Teacher from "../models/teacherModel.js";
import { generateOTP } from "../utils/otp.js";
import sendEmail from "../utils/sendEmail.js";
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

    const otp = generateOTP();

    const teacher = await Teacher.create({
      ...data,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await sendEmail({
      to: teacher.email,
      subject: "Teacher Verification OTP",
      html: `
        <h2>Verify Your Teacher Account</h2>
        <h3>${otp}</h3>
        <p>OTP valid for 10 minutes</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully. OTP sent to email",
    });
  } catch (error) {
    console.error("Teacher Register Error:", error);
    res.status(500).json({
      message: "Teacher registration failed",
    });
  }
};

/* ================= TEACHER OTP VERIFY ================= */
export const verifyTeacherOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (!teacher.otp || teacher.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (teacher.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    teacher.isVerified = true;
    teacher.otp = null;
    teacher.otpExpiry = null;

    await teacher.save();

    res.json({
      success: true,
      message: "Teacher account verified successfully",
    });
  } catch (error) {
    console.error("Teacher OTP Verify Error:", error);
    res.status(500).json({
      message: "OTP verification failed",
    });
  }
};
