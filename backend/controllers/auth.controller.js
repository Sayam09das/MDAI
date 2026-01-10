import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import { generateToken } from "../utils/generateToken.js";
import admin from "../config/firebase.js";
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

    // 🔐 Create user in Firebase
    await admin.auth().createUser({
      email: data.email,
      password: data.password,
    });

    // 📧 Send verification email via Firebase
    await admin.auth().generateEmailVerificationLink(data.email);

    // 💾 Save user in MongoDB
    await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
      isVerified: false,
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= VERIFY EMAIL ================= */
export const verifyEmailStatus = async (req, res) => {
  try {
    const { email } = req.body;

    const firebaseUser = await admin.auth().getUserByEmail(email);

    if (!firebaseUser.emailVerified) {
      return res.status(400).json({ message: "Email not verified yet" });
    }

    await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UNIFIED LOGIN ================= */
export const unifiedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    if (!account.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
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
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await admin.auth().generatePasswordResetLink(email);

    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  res.json(req.user);
};
