import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import { generateToken } from "../utils/generateToken.js";
import { z } from "zod";
import jwt from "jsonwebtoken";

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

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
      isVerified: true, // no OTP, auto verified
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN (USER + TEACHER) ================= */
export const unifiedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let account = await User.findOne({ email }).select("+password");
    let role = "user";

    if (!account) {
      account = await Teacher.findOne({ email }).select("+password");
      role = "teacher";
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
};

/* ================= FORGOT PASSWORD (NO OTP) ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    let account = await User.findOne({ email });
    let role = "user";

    if (!account) {
      account = await Teacher.findOne({ email });
      role = "teacher";
    }

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.password = newPassword;
    await account.save();

    res.json({
      success: true,
      message: `Password reset successful for ${role}`,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Forgot password failed" });
  }
};

/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  res.json(req.user);
};

/* ================= REFRESH TOKEN ================= */
export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    generateToken(res, decoded.id);

    res.json({ message: "Token refreshed" });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
