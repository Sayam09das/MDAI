import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import { generateToken } from "../utils/generateToken.js";
import { generateOTP } from "../utils/otp.js";
import sendEmail from "../utils/sendEmail.js";
import { z } from "zod";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const schema = z.object({
      fullName: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
      confirmPassword: z.string(),
      phone: z.string().min(10),
      address: z.string().min(10),
    });

    const data = schema.parse(req.body);

    if (data.password !== data.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const exists = await User.findOne({ email: data.email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const otp = generateOTP();

    const user = await User.create({
      ...data,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    // 📧 SEND OTP EMAIL
    await sendEmail({
      to: user.email,
      subject: "Your OTP Code",
      html: `
        <h2>Verify Your Account</h2>
        <p>Your OTP is:</p>
        <h3>${otp}</h3>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully, OTP sent to email",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      String(user.otp) !== String(otp) ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    generateToken(res, user._id);

    return res.json({ message: "Account verified successfully" });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= RESEND OTP ================= */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 🔥 DO NOT AWAIT EMAIL
    sendEmail({
      to: user.email,
      subject: "Resent OTP Code",
      html: `
        <h2>Your New OTP</h2>
        <h3>${otp}</h3>
        <p>Valid for 10 minutes.</p>
      `,
    }).catch(err => console.error("Resend OTP email error:", err));

    return res.json({ message: "OTP resent to email" });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};


/* ================= UNIFIED LOGIN (USER + TEACHER) ================= */
export const unifiedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    /* ---------- CHECK USER ---------- */
    let account = await User.findOne({ email }).select("+password");
    let role = "user";

    /* ---------- IF NOT USER, CHECK TEACHER ---------- */
    if (!account) {
      account = await Teacher.findOne({ email }).select("+password");
      role = "teacher";
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ---------- PASSWORD CHECK ---------- */
    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ---------- TEACHER OTP CHECK ONLY ---------- */
    if (role === "teacher" && !account.isVerified) {
      return res.status(403).json({ message: "Verify OTP first" });
    }

    /* ---------- GENERATE TOKEN ---------- */
    generateToken(res, {
      id: account._id,
      role,
    });

    res.json({
      success: true,
      message: "Login successful",
      role,
    });
  } catch (error) {
    console.error("Unified Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
};


/* ================= FORGOT PASSWORD ================= */
/* ================= FORGOT PASSWORD (USER + TEACHER) ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 🔍 Check User first
    let account = await User.findOne({ email });
    let role = "user";

    // 🔍 If not user, check Teacher
    if (!account) {
      account = await Teacher.findOne({ email });
      role = "teacher";
    }

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // 🔐 Generate OTP (string)
    const otp = generateOTP().toString();

    account.otp = otp;
    account.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await account.save();

    // 📧 Send OTP email
    await sendEmail({
      to: account.email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset (${role.toUpperCase()})</h2>
        <h3>${otp}</h3>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent to email for password reset",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Forgot password failed" });
  }
};


/* ================= RESET PASSWORD (USER + TEACHER) ================= */
export const resetPassword = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP and new password are required" });
    }

    otp = otp.toString();

    // 🔍 Check User first
    let account = await User.findOne({ email });
    let role = "user";

    // 🔍 If not user, check Teacher
    if (!account) {
      account = await Teacher.findOne({ email });
      role = "teacher";
    }

    if (
      !account ||
      !account.otp ||
      account.otp !== otp ||
      account.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 🔐 Update password
    account.password = newPassword;
    account.otp = null;
    account.otpExpiry = null;
    await account.save();

    res.json({
      success: true,
      message: `Password reset successful for ${role}`,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Reset password failed" });
  }
};


/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  res.json(req.user);
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // generate new access + refresh tokens
    generateToken(res, decoded.id);

    res.json({ message: "Token refreshed" });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};