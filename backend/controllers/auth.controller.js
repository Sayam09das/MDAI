import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import Enrollment from "../models/enrollmentModel.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";


// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file, folder, oldPublicId = null) => {
  if (!file) return null;

  if (oldPublicId) {
    await cloudinary.uploader.destroy(oldPublicId, {
      resource_type: "auto",
    });
  }

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder,
      resource_type: "auto",
    }
  );

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};



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
      return res.status(400).json({ message: error.errors?.[0]?.message || "Validation error" });
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

    // Add common profile fields for both users and teachers
    userObj.profileImage = account.profileImage || "";
    userObj.about = account.about || "";
    userObj.skills = account.skills || [];

    // Add teacher-specific fields if role is teacher
    if (role === "teacher") {
      userObj.gender = account.gender || "male";
      userObj.class10Certificate = account.class10Certificate || "";
      userObj.class12Certificate = account.class12Certificate || "";
      userObj.collegeCertificate = account.collegeCertificate || "";
      userObj.phdOrOtherCertificate = account.phdOrOtherCertificate || null;
      userObj.joinWhatsappGroup = account.joinWhatsappGroup || false;
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
  console.log("Update profile endpoint hit");

  try {
    console.log("Update profile request body:", req.body);
    console.log("Update profile file:", req.file);

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ========= PARSE SKILLS ========= */
    let skills = req.body.skills;
    if (typeof skills === "string") {
      try {
        skills = JSON.parse(skills);
      } catch {
        skills = skills
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);
      }
    }

    /* ========= SAFE BODY UPDATE ========= */
    const data = {};

    if (req.body.fullName?.trim().length >= 3) {
      data.fullName = req.body.fullName.trim();
    }

    if (req.body.phone?.trim().length >= 10) {
      data.phone = req.body.phone.trim();
    }

    if (req.body.address?.trim().length >= 10) {
      data.address = req.body.address.trim();
    }

    if (req.body.about !== undefined) {
      data.about = req.body.about.trim();
    }

    if (skills !== undefined) {
      data.skills = skills;
    }

    /* ========= PROFILE IMAGE (FIXED) ========= */
    if (req.file) {
      data.profileImage = await uploadToCloudinary(
        req.file,
        "user_profiles",
        user.profileImage?.public_id
      );
    }

    /* ========= APPLY UPDATES ========= */
    Object.assign(user, data);
    await user.save();

    res.json({
      success: true,
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
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET ALL STUDENTS ================= */
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



export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
    })
      .populate("course", "title thumbnail")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
