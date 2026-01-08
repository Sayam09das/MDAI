import User from "../models/userModel.js";
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
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  generateToken(res, user._id);

  res.json({ message: "Account verified successfully" });
};

/* ================= RESEND OTP ================= */
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  // 📧 SEND OTP EMAIL
  await sendEmail({
    to: user.email,
    subject: "Resent OTP Code",
    html: `
      <h2>Your New OTP</h2>
      <h3>${otp}</h3>
      <p>Valid for 10 minutes.</p>
    `,
  });

  res.json({ message: "OTP resent to email" });
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "Verify your account" });
  }

  generateToken(res, user._id);

  res.json({ message: "Login successful" });
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
};


/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  // 📧 SEND OTP EMAIL
  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset Request</h2>
      <h3>${otp}</h3>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });

  res.json({ message: "OTP sent to email for password reset" });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = newPassword;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });
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