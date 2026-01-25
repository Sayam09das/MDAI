import Teacher from "../models/teacherModel.js";
import Course from "../models/Course.js";
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

    await Teacher.create({
      ...data,
      isVerified: true,
      isSuspended: false, // ✅ active by default
    });

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Teacher registration failed" });
  }
};


export const getTeacherStats = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({ isSuspended: false });
    const suspendedTeachers = await Teacher.countDocuments({ isSuspended: true });

    res.json({
      totalTeachers,
      activeTeachers,
      suspendedTeachers,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teacher stats" });
  }
};


export const suspendTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    await Teacher.findByIdAndUpdate(teacherId, {
      isSuspended: true,
    });

    res.json({ message: "Teacher suspended successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to suspend teacher" });
  }
};


export const resumeTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    await Teacher.findByIdAndUpdate(teacherId, {
      isSuspended: false,
    });

    res.json({ message: "Teacher activated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to activate teacher" });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.aggregate([
      {
        $lookup: {
          from: "courses",          // collection name
          localField: "_id",        // Teacher _id
          foreignField: "teacher",  // Course.teacher
          as: "courses",
        },
      },
      {
        $addFields: {
          courseCount: { $size: "$courses" },
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          isSuspended: 1,
          createdAt: 1,
          courseCount: 1,
          // ❌ DO NOT mention "courses" at all
        },
      },
    ]);

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Get Teachers Error:", error);
    res.status(500).json({
      message: "Failed to fetch teachers",
    });
  }
};



export const teacherOnboardingAnalytics = async (req, res) => {
  try {
    const data = await Teacher.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
};


export const courseCreationAnalytics = async (req, res) => {
  try {
    const data = await Course.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(
      data.map(d => ({
        month: `Month ${d._id}`,
        value: d.count
      }))
    );
  } catch {
    res.status(500).json({ message: "Failed course analytics" });
  }
};


export const feedbackAnalytics = async (req, res) => {
  try {
    // Placeholder: Assuming Review model exists, but for now return dummy data
    res.json([
      { month: "Month 1", value: 4.5 },
      { month: "Month 2", value: 4.7 },
      { month: "Month 3", value: 4.3 },
    ]);
  } catch {
    res.status(500).json({ message: "Failed feedback analytics" });
  }
};
