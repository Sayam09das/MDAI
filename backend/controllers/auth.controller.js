import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

/* ================= REGISTER USER ONLY ================= */
export const registerUser = async (req, res) => {
  try {
    const schema = z.object({
      fullName: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
      phone: z.string().min(10),
      address: z.string().min(10),
    });

    const data = schema.parse(req.body);

    // check both collections
    const exists =
      (await User.findOne({ email: data.email })) ||
      (await Teacher.findOne({ email: data.email }));

    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create(data);

    const token = generateToken({
      id: user._id,
      role: "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      role: "user",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN (USER + TEACHER) ================= */
export const login = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = schema.parse(req.body);

    let account = await User.findOne({ email }).select("+password");
    let role = "user";

    if (!account) {
      account = await Teacher.findOne({ email }).select("+password");
      role = "teacher";
    }

    if (!account) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: account._id,
      role,
    });

    res.json({
      message: "Login successful",
      token,
      role,
      user: {
        id: account._id,
        fullName: account.fullName,
        email: account.email,
        isVerified: account.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Server error" });
  }
};



/* ================= LOGOUT (USER + TEACHER) ================= */
export const logout = async (req, res) => {
  try {
    // JWT-based logout = frontend deletes token
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};



/* ================= GET CURRENT USER ================= */
export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id, role } = decoded;

    const account =
      role === "teacher"
        ? await Teacher.findById(id)
        : await User.findById(id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      role,
      user: {
        id: account._id,
        fullName: account.fullName,
        email: account.email,
        phone: account.phone,
        address: account.address,
        isVerified: account.isVerified,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



/* ================= GET ALL STUDENTS ================= */
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'student',
          as: 'enrollments'
        }
      },
      {
        $addFields: {
          courseCount: { $size: '$enrollments' }
        }
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          isSuspended: 1,
          createdAt: 1,
          courseCount: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json({
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* ================= SUSPEND STUDENT ================= */
export const suspendStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findByIdAndUpdate(
      studentId,
      { isSuspended: true },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student suspended successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to suspend student" });
  }
};


/* ================= RESUME STUDENT ================= */
export const resumeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findByIdAndUpdate(
      studentId,
      { isSuspended: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student activated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to activate student" });
  }
};
