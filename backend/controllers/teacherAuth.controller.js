import Teacher from "../models/teacherModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import Lesson from "../models/lessonModel.js";
import Attendance from "../models/attendanceModel.js";
import cloudinary from "../config/cloudinary.js";
import { z } from "zod";

/* ======================================================
   CLOUDINARY HELPER
====================================================== */
const uploadToCloudinary = async (file, folder, oldPublicId = null) => {
  if (!file) return null;

  // delete old file if exists
  if (oldPublicId) {
    await cloudinary.uploader.destroy(oldPublicId, {
      resource_type: "auto", // 🔥 supports image + pdf
    });
  }

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder,
      resource_type: "auto", // 🔥 IMPORTANT
    }
  );

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

/* ======================================================
   REGISTER TEACHER
====================================================== */
export const registerTeacher = async (req, res) => {
  try {
    const schema = z.object({
      fullName: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
      phone: z.string().min(10),
      address: z.string().min(5),
      gender: z.enum(["male", "female", "other"]),
      about: z.string().max(500).optional(),
      skills: z.array(z.string()).max(10).optional(),
      experience: z.number().min(0).optional(),
      joinWhatsappGroup: z.boolean().optional(),
    });

    const data = schema.parse(req.body);

    const exists = await Teacher.findOne({ email: data.email });
    if (exists) {
      return res.status(409).json({ message: "Teacher already registered" });
    }

    const teacher = await Teacher.create({
      ...data,

      profileImage: await uploadToCloudinary(
        req.files?.profileImage?.[0],
        "teachers/profile"
      ),

      class10Certificate: await uploadToCloudinary(
        req.files?.class10Certificate?.[0],
        "teachers/certificates"
      ),

      class12Certificate: await uploadToCloudinary(
        req.files?.class12Certificate?.[0],
        "teachers/certificates"
      ),

      collegeCertificate: await uploadToCloudinary(
        req.files?.collegeCertificate?.[0],
        "teachers/certificates"
      ),

      phdOrOtherCertificate: await uploadToCloudinary(
        req.files?.phdOrOtherCertificate?.[0],
        "teachers/certificates"
      ),

      isVerified: true,
      isSuspended: false,
    });

    res.status(201).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("Register Teacher Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   UPDATE TEACHER PROFILE
====================================================== */
export const updateTeacherProfile = async (req, res) => {
  try {
    let { teacherId } = req.params;
    if (teacherId === "me") teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // ===== Upload helper =====
    const uploadToCloudinary = async (file, folder, oldPublicId) => {
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

    // ===== Handle uploads (ONLY way to touch certificates) =====
    if (req.files?.profileImage) {
      teacher.profileImage = await uploadToCloudinary(
        req.files.profileImage[0],
        "teachers/profile",
        teacher.profileImage?.public_id
      );
    }

    if (req.files?.class10Certificate) {
      teacher.class10Certificate = await uploadToCloudinary(
        req.files.class10Certificate[0],
        "teachers/certificates",
        teacher.class10Certificate?.public_id
      );
    }

    if (req.files?.class12Certificate) {
      teacher.class12Certificate = await uploadToCloudinary(
        req.files.class12Certificate[0],
        "teachers/certificates",
        teacher.class12Certificate?.public_id
      );
    }

    if (req.files?.collegeCertificate) {
      teacher.collegeCertificate = await uploadToCloudinary(
        req.files.collegeCertificate[0],
        "teachers/certificates",
        teacher.collegeCertificate?.public_id
      );
    }

    if (req.files?.phdOrOtherCertificate) {
      teacher.phdOrOtherCertificate = await uploadToCloudinary(
        req.files.phdOrOtherCertificate[0],
        "teachers/certificates",
        teacher.phdOrOtherCertificate?.public_id
      );
    }

    // ===== SAFE BODY UPDATE (NO CERTIFICATE FIELDS) =====
    const {
      class10Certificate,
      class12Certificate,
      collegeCertificate,
      phdOrOtherCertificate,
      profileImage,
      ...safeBody
    } = req.body || {};
    // Normalize incoming values when request is multipart/form-data
    if (safeBody.skills && typeof safeBody.skills === "string") {
      try {
        safeBody.skills = JSON.parse(safeBody.skills);
      } catch (err) {
        // fallback: comma separated
        safeBody.skills = safeBody.skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    if (safeBody.experience !== undefined) {
      const num = Number(safeBody.experience);
      safeBody.experience = Number.isFinite(num) ? num : teacher.experience;
    }

    if (safeBody.joinWhatsappGroup !== undefined) {
      if (typeof safeBody.joinWhatsappGroup === "string") {
        safeBody.joinWhatsappGroup = safeBody.joinWhatsappGroup === "true";
      } else {
        safeBody.joinWhatsappGroup = Boolean(safeBody.joinWhatsappGroup);
      }
    }

    Object.assign(teacher, safeBody);
    await teacher.save();

    res.json({
      success: true,
      message: "Teacher profile updated successfully",
      teacher,
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);
    res.status(500).json({ message: error.message });
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

/* ======================================================
   GET TEACHER DASHBOARD STATS (Real-time)
====================================================== */
export const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1. Get all courses created by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id price");
    const courseIds = courses.map((course) => course._id);

    // 2. Calculate Total Courses
    const totalCourses = courses.length;

    // 3. Calculate Total Students (unique students with PAID enrollments)
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      paymentStatus: "PAID",
    }).populate("student", "_id");

    const uniqueStudentIds = new Set(
      enrollments.map((e) => e.student._id.toString())
    );
    const totalStudents = uniqueStudentIds.size;

    // 4. Calculate Earnings (sum of course prices from PAID enrollments)
    const earnings = enrollments.reduce((sum, enrollment) => {
      const course = courses.find(
        (c) => c._id.toString() === enrollment.course.toString()
      );
      return sum + (course?.price || 0);
    }, 0);

    // 5. Calculate Live Classes (lessons scheduled for teacher's courses)
    const liveClasses = await Lesson.countDocuments({
      course: { $in: courseIds },
    });

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        liveClasses,
        earnings,
      },
    });
  } catch (error) {
    console.error("Get Teacher Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
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
          from: "courses", // MongoDB collection name
          let: { teacherId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$instructor", "$$teacherId"] },
              },
            },
            {
              $project: { title: 1 },
            },
          ],
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
          phone: 1,
          address: 1,
          gender: 1,
          class10Certificate: 1,
          class12Certificate: 1,
          collegeCertificate: 1,
          phdOrOtherCertificate: 1,
          profileImage: 1,
          isSuspended: 1,
          createdAt: 1,
          courseCount: 1,
          courses: 1,
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

/* ======================================================
   GET MY STUDENTS (Students enrolled in teacher's courses)
====================================================== */
export const getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1. Find all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        message: "No courses found for this teacher",
        students: [],
        totalStudents: 0,
      });
    }

    // 2. Find all enrollments for these courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "fullName email phone profileImage")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    // 3. Extract unique students from enrollments
    const studentMap = new Map();
    enrollments.forEach((enrollment) => {
      if (enrollment.student && !studentMap.has(enrollment.student._id.toString())) {
        studentMap.set(enrollment.student._id.toString(), {
          ...enrollment.student.toObject(),
          enrolledCourses: [],
        });
      }
    });

    // 4. Add course information to each student
    enrollments.forEach((enrollment) => {
      const studentId = enrollment.student._id.toString();
      if (studentMap.has(studentId) && enrollment.course) {
        studentMap.get(studentId).enrolledCourses.push({
          courseId: enrollment.course._id,
          courseTitle: enrollment.course.title,
          enrolledAt: enrollment.createdAt,
          paymentStatus: enrollment.paymentStatus,
        });
      }
    });

    // 5. Convert Map to array
    const students = Array.from(studentMap.values());

    res.json({
      success: true,
      students,
      totalStudents: students.length,
    });
  } catch (error) {
    console.error("Get My Students Error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* ======================================================
   MARK ATTENDANCE (For a course on a specific date)
====================================================== */
export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId } = req.params;

    // Validate request body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const { date, records } = req.body;

    // Validate required fields
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Records array is required and must not be empty",
      });
    }

    // Validate courseId is a valid ObjectId
    if (!courseId || courseId === "undefined" || !/^[0-9a-fA-F]{24}$/.test(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Validate course belongs to this teacher
    const course = await Course.findOne({
      _id: courseId,
      instructor: teacherId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    // Parse date (default to today)
    const attendanceDate = date ? new Date(date) : new Date();
    // Set time to start of day for consistent matching
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    let attendance = await Attendance.findOne({
      course: courseId,
      teacher: teacherId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (attendance) {
      // Update existing attendance
      attendance.records = records.map((record) => ({
        student: record.studentId,
        status: record.status || "PRESENT",
        remarks: record.remarks || "",
        markedAt: new Date(),
      }));
      await attendance.save();

      return res.json({
        success: true,
        message: "Attendance updated successfully",
        attendance,
      });
    }

    // Create new attendance record
    attendance = await Attendance.create({
      course: courseId,
      teacher: teacherId,
      date: attendanceDate,
      records: records.map((record) => ({
        student: record.studentId,
        status: record.status || "PRESENT",
        remarks: record.remarks || "",
        markedAt: new Date(),
      })),
    });

    // Populate for response
    await attendance.populate([
      { path: "course", select: "title" },
      { path: "records.student", select: "fullName email phone" },
    ]);

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

/* ======================================================
   GET ATTENDANCE (For a course)
====================================================== */
export const getAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate courseId is a valid ObjectId
    if (!courseId || courseId === "undefined" || !/^[0-9a-fA-F]{24}$/.test(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Validate course belongs to this teacher
    const course = await Course.findOne({
      _id: courseId,
      instructor: teacherId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    // Build query
    const query = {
      course: courseId,
      teacher: teacherId,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .populate("records.student", "fullName email phone profileImage")
      .populate("course", "title")
      .sort({ date: -1 });

    // Calculate statistics
    const stats = {
      totalDays: attendanceRecords.length,
      present: 0,
      absent: 0,
      late: 0,
    };

    attendanceRecords.forEach((record) => {
      record.records.forEach((r) => {
        if (r.status === "PRESENT") stats.present++;
        else if (r.status === "ABSENT") stats.absent++;
        else if (r.status === "LATE") stats.late++;
      });
    });

    res.json({
      success: true,
      course: {
        _id: course._id,
        title: course.title,
      },
      attendanceRecords,
      stats,
      totalRecords: attendanceRecords.length,
    });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

/* ======================================================
   GET STUDENT ATTENDANCE (For a specific student in a course)
====================================================== */
export const getStudentAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId, studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate courseId is a valid ObjectId
    if (!courseId || courseId === "undefined" || !/^[0-9a-fA-F]{24}$/.test(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Validate studentId is a valid ObjectId
    if (!studentId || studentId === "undefined" || !/^[0-9a-fA-F]{24}$/.test(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Validate course belongs to this teacher
    const course = await Course.findOne({
      _id: courseId,
      instructor: teacherId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    // Build query
    const query = {
      course: courseId,
      teacher: teacherId,
      "records.student": studentId,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get attendance records for this student
    const attendanceRecords = await Attendance.find(query)
      .populate("records.student", "fullName email phone profileImage")
      .populate("course", "title")
      .sort({ date: -1 });

    // Extract only this student's records
    const studentRecords = attendanceRecords.map((record) => {
      const studentRecord = record.records.find(
        (r) => r.student._id.toString() === studentId
      );
      return {
        date: record.date,
        status: studentRecord?.status,
        remarks: studentRecord?.remarks,
        markedAt: studentRecord?.markedAt,
      };
    });

    // Calculate stats
    const stats = {
      totalDays: studentRecords.length,
      present: studentRecords.filter((r) => r.status === "PRESENT").length,
      absent: studentRecords.filter((r) => r.status === "ABSENT").length,
      late: studentRecords.filter((r) => r.status === "LATE").length,
      attendancePercentage:
        studentRecords.length > 0
          ? Math.round(
              (studentRecords.filter((r) => r.status === "PRESENT").length /
                studentRecords.length) *
                100
            )
          : 0,
    };

    res.json({
      success: true,
      student: attendanceRecords[0]?.records.find(
        (r) => r.student._id.toString() === studentId
      )?.student,
      course: {
        _id: course._id,
        title: course.title,
      },
      attendanceRecords: studentRecords,
      stats,
    });
  } catch (error) {
    console.error("Get Student Attendance Error:", error);
    res.status(500).json({ message: "Failed to fetch student attendance" });
  }
};
