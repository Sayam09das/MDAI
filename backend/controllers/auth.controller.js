import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import Enrollment from "../models/enrollmentModel.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

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

    // Build user object based on role
    const userObj = {
      id: account._id,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      address: account.address,
      isVerified: account.isVerified,
    };

    // Add teacher-specific fields if role is teacher
    if (role === "teacher") {
      userObj.gender = account.gender || "male";
      userObj.class10Certificate = account.class10Certificate || "";
      userObj.class12Certificate = account.class12Certificate || "";
      userObj.collegeCertificate = account.collegeCertificate || "";
      userObj.phdOrOtherCertificate = account.phdOrOtherCertificate || null;
      userObj.profileImage = account.profileImage || "";
      userObj.joinWhatsappGroup = account.joinWhatsappGroup || false;
      userObj.about = account.about || "";
      userObj.skills = account.skills || [];
      userObj.experience = account.experience || 0;
      userObj.isSuspended = account.isSuspended || false;
    }

    res.json({
      role,
      user: userObj,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



/* ================= UPDATE USER PROFILE ================= */
export const updateUserProfile = async (req, res) => {
  try {
    const schema = z.object({
      fullName: z.string().min(3).optional(),
      phone: z.string().min(10).optional(),
      address: z.string().min(10).optional(),
      about: z.string().max(500).optional(),
      skills: z.array(z.string()).optional(),
    });

    const data = schema.parse(req.body);
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle profile image upload
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (user.profileImage && user.profileImage.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "user_profiles",
        resource_type: "image",
      });

      data.profileImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Update user fields
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        user[key] = data[key];
      }
    });

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        about: user.about,
        skills: user.skills,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllStudents = async (req, res) => {
  try {
    // First get students with basic info
    const students = await User.find()
      .select("fullName email isSuspended createdAt")
      .sort({ createdAt: -1 });

    // Then get enrollments with course details for each student
    const studentsWithCourses = await Promise.all(
      students.map(async (student) => {
        const enrollments = await Enrollment.find({ student: student._id })
          .populate('course', 'title')
          .select('course');

        const courseNames = enrollments
          .filter(enrollment => enrollment.course)
          .map(enrollment => enrollment.course.title);

        return {
          _id: student._id,
          fullName: student.fullName,
          email: student.email,
          isSuspended: student.isSuspended,
          createdAt: student.createdAt,
          courseCount: courseNames.length,
          courseNames: courseNames
        };
      })
    );

    console.log('Students with course data:', JSON.stringify(studentsWithCourses.slice(0, 2), null, 2));

    res.json({
      count: studentsWithCourses.length,
      students: studentsWithCourses
    });
  } catch (error) {
    console.error('Error fetching students:', error);
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
