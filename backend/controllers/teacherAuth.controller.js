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

/* ======================================================
   GET STUDENT PERFORMANCE ANALYTICS (Weekly/Monthly/Yearly)
====================================================== */
export const getStudentPerformanceAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { range = "weekly" } = req.query;

    // 1. Get all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      // Return empty data if no courses
      return res.json({
        success: true,
        data: getEmptyDataByRange(range),
      });
    }

    // 2. Calculate date ranges
    const now = new Date();
    let startDate;
    
    switch (range) {
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1); // Last 3 months (12 weeks)
        break;
      default: // weekly
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    // 3. Get attendance records for teacher's courses within the date range
    const attendanceRecords = await Attendance.find({
      course: { $in: courseIds },
      teacher: teacherId,
      date: { $gte: startDate, $lte: now },
    })
      .populate("course", "title")
      .sort({ date: 1 });

    // 4. Get enrollment statistics
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      paymentStatus: "PAID",
    }).populate("student", "_id");

    const totalEnrollments = enrollments.length;
    const uniqueStudents = new Set(
      enrollments.map((e) => e.student._id.toString())
    ).size;

    // 5. Calculate performance data based on range
    const performanceData = calculatePerformanceData(
      attendanceRecords,
      uniqueStudents,
      range,
      now
    );

    res.json({
      success: true,
      data: performanceData,
      summary: {
        totalStudents: uniqueStudents,
        totalEnrollments,
        averageAttendance: calculateAverageAttendance(attendanceRecords),
      },
    });
  } catch (error) {
    console.error("Get Student Performance Analytics Error:", error);
    res.status(500).json({ message: "Failed to fetch student performance analytics" });
  }
};

/* ======================================================
   HELPER FUNCTIONS FOR PERFORMANCE ANALYTICS
====================================================== */
function getEmptyDataByRange(range) {
  switch (range) {
    case "yearly":
      return [
        { name: "Jan", students: 0 },
        { name: "Mar", students: 0 },
        { name: "May", students: 0 },
        { name: "Jul", students: 0 },
        { name: "Sep", students: 0 },
        { name: "Nov", students: 0 },
      ];
    case "monthly":
      return [
        { name: "Week 1", students: 0 },
        { name: "Week 2", students: 0 },
        { name: "Week 3", students: 0 },
        { name: "Week 4", students: 0 },
      ];
    default:
      return [
        { name: "Mon", students: 0 },
        { name: "Tue", students: 0 },
        { name: "Wed", students: 0 },
        { name: "Thu", students: 0 },
        { name: "Fri", students: 0 },
        { name: "Sat", students: 0 },
      ];
  }
}

function calculatePerformanceData(attendanceRecords, totalStudents, range, now) {
  // Group attendance by date and calculate average attendance rate per day
  const attendanceByDate = new Map();

  attendanceRecords.forEach((record) => {
    const dateKey = new Date(record.date).toISOString().split("T")[0];
    const totalPresent = record.records.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;
    const attendanceRate = totalStudents > 0 
      ? Math.round((totalPresent / totalStudents) * 100) 
      : 0;

    if (!attendanceByDate.has(dateKey)) {
      attendanceByDate.set(dateKey, {
        date: dateKey,
        present: totalPresent,
        total: totalStudents,
        rate: attendanceRate,
      });
    }
  });

  // Convert to array and format based on range
  const data = Array.from(attendanceByDate.values());

  switch (range) {
    case "yearly": {
      // Aggregate by month (every 2 months for display)
      const monthlyData = new Map();
      const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
      
      months.forEach((month, index) => {
        const monthStart = index * 2;
        const monthEnd = monthStart + 2;
        monthlyData.set(month, {
          name: month,
          students: 0,
          count: 0,
        });
      });

      data.forEach((item) => {
        const date = new Date(item.date);
        const monthIndex = Math.floor(date.getMonth() / 2);
        const monthName = months[monthIndex];
        if (monthlyData.has(monthName)) {
          const entry = monthlyData.get(monthName);
          entry.students += item.rate;
          entry.count += 1;
        }
      });

      return months.map((month) => {
        const entry = monthlyData.get(month);
        return {
          name: month,
          students: entry.count > 0 ? Math.round(entry.students / entry.count) : 0,
        };
      });
    }

    case "monthly": {
      // Aggregate by week (last 4 weeks)
      const weekData = [
        { name: "Week 1", students: 0, count: 0 },
        { name: "Week 2", students: 0, count: 0 },
        { name: "Week 3", students: 0, count: 0 },
        { name: "Week 4", students: 0, count: 0 },
      ];

      data.forEach((item) => {
        const date = new Date(item.date);
        const weeksAgo = Math.floor(
          (now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        const weekIndex = Math.min(3, 3 - weeksAgo);
        if (weekIndex >= 0 && weekIndex < 4) {
          weekData[weekIndex].students += item.rate;
          weekData[weekIndex].count += 1;
        }
      });

      return weekData.map((week) => ({
        name: week.name,
        students: week.count > 0 ? Math.round(week.students / week.count) : 0,
      }));
    }

    default: {
      // Weekly: Return last 6 days (Mon-Sat)
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayData = new Map();
      
      // Initialize for Mon-Sat
      dayNames.slice(1, 7).forEach((day) => {
        dayData.set(day, { students: 0, count: 0 });
      });

      data.forEach((item) => {
        const date = new Date(item.date);
        const dayName = dayNames[date.getDay()];
        if (dayData.has(dayName)) {
          const entry = dayData.get(dayName);
          entry.students += item.rate;
          entry.count += 1;
        }
      });

      return dayNames.slice(1, 7).map((day) => {
        const entry = dayData.get(day);
        return {
          name: day,
          students: entry.count > 0 ? Math.round(entry.students / entry.count) : 0,
        };
      });
    }
  }
}

function calculateAverageAttendance(attendanceRecords) {
  if (attendanceRecords.length === 0) return 0;

  let totalRate = 0;
  let count = 0;

  attendanceRecords.forEach((record) => {
    const totalPresent = record.records.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;
    if (record.records.length > 0) {
      totalRate += (totalPresent / record.records.length) * 100;
      count++;
    }
  });

  return count > 0 ? Math.round(totalRate / count) : 0;
}

/* ======================================================
   GET TEACHER DASHBOARD ATTENDANCE (For MainHeaderDashboard)
====================================================== */
export const getTeacherDashboardAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { date } = req.query;

    // 1. Get all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        attendance: null,
        message: "No courses found for this teacher",
      });
    }

    // 2. Parse the date (default to today)
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000);

    // 3. Get all attendance records for all teacher's courses on this date
    const attendanceRecords = await Attendance.find({
      course: { $in: courseIds },
      teacher: teacherId,
      date: { $gte: attendanceDate, $lt: nextDay },
    }).populate("records.student", "fullName");

    if (attendanceRecords.length === 0) {
      return res.json({
        success: true,
        attendance: null,
        message: "No attendance data available for this date",
      });
    }

    // 4. Calculate total present and absent
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalStudents = 0;

    attendanceRecords.forEach((record) => {
      record.records.forEach((r) => {
        totalStudents++;
        if (r.status === "PRESENT" || r.status === "LATE") {
          totalPresent++;
        } else if (r.status === "ABSENT") {
          totalAbsent++;
        }
      });
    });

    const presentPercentage = totalStudents > 0 
      ? Math.round((totalPresent / totalStudents) * 100) 
      : 0;
    const absentPercentage = totalStudents > 0 
      ? Math.round((totalAbsent / totalStudents) * 100) 
      : 0;

    res.json({
      success: true,
      attendance: {
        date: attendanceDate,
        present: presentPercentage,
        absent: absentPercentage,
        totalStudents,
        presentCount: totalPresent,
        absentCount: totalAbsent,
      },
    });
  } catch (error) {
    console.error("Get Teacher Dashboard Attendance Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard attendance" });
  }
};

/* ======================================================
   GET STUDENT GENDER STATS (For MainHeaderDashboard)
====================================================== */
export const getStudentGenderStats = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1. Get all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        stats: {
          male: 0,
          female: 0,
          other: 0,
          total: 0,
        },
      });
    }

    // 2. Get all paid enrollments for these courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      paymentStatus: "PAID",
    }).populate("student", "gender");

    // 3. Count by gender
    let male = 0;
    let female = 0;
    let other = 0;

    enrollments.forEach((enrollment) => {
      if (enrollment.student && enrollment.student.gender) {
        if (enrollment.student.gender === "male") {
          male++;
        } else if (enrollment.student.gender === "female") {
          female++;
        } else {
          other++;
        }
      }
    });

    const total = male + female + other;

    res.json({
      success: true,
      stats: {
        male,
        female,
        other,
        total,
      },
    });
  } catch (error) {
    console.error("Get Student Gender Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch gender stats" });
  }
};

/* ======================================================
   GET TEACHER PERFORMANCE METRICS (For Performance.jsx)
====================================================== */
export const getTeacherPerformanceMetrics = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1. Get all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        data: [
          { name: "Lagging", value: 0, color: "#f97316" },
          { name: "On Track", value: 0, color: "#3b82f6" },
          { name: "Completed", value: 0, color: "#22c55e" },
          { name: "Ahead", value: 0, color: "#a855f7" },
        ],
        highest: { name: "None", value: 0 },
      });
    }

    // 2. Get all attendance records for teacher's courses
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const attendanceRecords = await Attendance.find({
      course: { $in: courseIds },
      teacher: teacherId,
      date: { $gte: startOfMonth, $lte: now },
    });

    // 3. Get all unique students
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      paymentStatus: "PAID",
    }).populate("student", "_id");

    const uniqueStudents = new Set(
      enrollments.map((e) => e.student._id.toString())
    );
    const totalStudents = uniqueStudents.size;

    if (totalStudents === 0) {
      return res.json({
        success: true,
        data: [
          { name: "Lagging", value: 0, color: "#f97316" },
          { name: "On Track", value: 0, color: "#3b82f6" },
          { name: "Completed", value: 0, color: "#22c55e" },
          { name: "Ahead", value: 0, color: "#a855f7" },
        ],
        highest: { name: "None", value: 0 },
      });
    }

    // 4. Calculate student performance based on attendance
    const studentAttendanceMap = new Map();

    // Initialize all students with 0 attendance
    uniqueStudents.forEach((studentId) => {
      studentAttendanceMap.set(studentId, { present: 0, total: 0 });
    });

    // Count attendance for each student
    attendanceRecords.forEach((record) => {
      record.records.forEach((r) => {
        const studentId = r.student.toString();
        if (studentAttendanceMap.has(studentId)) {
          const studentData = studentAttendanceMap.get(studentId);
          studentData.total++;
          if (r.status === "PRESENT" || r.status === "LATE") {
            studentData.present++;
          }
        }
      });
    });

    // 5. Categorize students
    let lagging = 0; // < 50%
    let onTrack = 0; // 50-74%
    let completed = 0; // 75-89%
    let ahead = 0; // 90-100%

    studentAttendanceMap.forEach((data) => {
      if (data.total === 0) {
        onTrack++; // Default to on track if no attendance yet
      } else {
        const attendanceRate = (data.present / data.total) * 100;
        if (attendanceRate < 50) {
          lagging++;
        } else if (attendanceRate < 75) {
          onTrack++;
        } else if (attendanceRate < 90) {
          completed++;
        } else {
          ahead++;
        }
      }
    });

    const performanceData = [
      { name: "Lagging", value: lagging, color: "#f97316" },
      { name: "On Track", value: onTrack, color: "#3b82f6" },
      { name: "Completed", value: completed, color: "#22c55e" },
      { name: "Ahead", value: ahead, color: "#a855f7" },
    ];

    // Find highest category
    const highest = performanceData.reduce((max, item) =>
      item.value > max.value ? item : max
    );

    res.json({
      success: true,
      data: performanceData,
      highest: { name: highest.name, value: highest.value },
      summary: {
        totalStudents,
        averageAttendance: calculateAverageAttendance(attendanceRecords),
      },
    });
  } catch (error) {
    console.error("Get Teacher Performance Metrics Error:", error);
    res.status(500).json({ message: "Failed to fetch performance metrics" });
  }
};

/* ======================================================
   GET TEACHER TODAY'S LECTURES (For TodayLectures.jsx)
====================================================== */
export const getTeacherTodayLectures = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { date } = req.query;

    // 1. Get all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id title");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        lectures: [],
        message: "No courses found for this teacher",
      });
    }

    // 2. Parse the date (default to today)
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    // 3. Get all lessons scheduled for today across all teacher's courses
    const lessons = await Lesson.find({
      course: { $in: courseIds },
      scheduledAt: { $gte: targetDate, $lt: nextDay },
    })
      .populate("course", "title")
      .sort({ scheduledAt: 1 });

    // 4. Format the response
    const lectures = lessons.map((lesson, index) => {
      const scheduledTime = new Date(lesson.scheduledAt);
      const endTime = new Date(scheduledTime.getTime() + (lesson.duration || 45) * 60000);

      // Assign colors based on index
      const colors = [
        "border-emerald-400",
        "border-yellow-400",
        "border-sky-400",
        "border-violet-400",
        "border-rose-400",
        "border-amber-400",
        "border-teal-400",
        "border-indigo-400",
        "border-orange-400",
        "border-pink-400",
      ];

      return {
        id: lesson._id,
        class: lesson.course?.title || "Unknown Course",
        time: `${scheduledTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })} - ${endTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}`,
        chapter: lesson.title || "Chapter",
        color: colors[index % colors.length],
        isLive: lesson.isLive || false,
        status: lesson.status || "scheduled",
      };
    });

    res.json({
      success: true,
      lectures,
      date: targetDate,
      totalLectures: lectures.length,
    });
  } catch (error) {
    console.error("Get Teacher Today Lectures Error:", error);
    res.status(500).json({ message: "Failed to fetch today's lectures" });
  }
};

/* ======================================================
   GET TEACHER STATISTICS OVERVIEW (For TeacherStatistics.jsx)
====================================================== */
export const getTeacherStatisticsOverview = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { range = "weekly" } = req.query;

    // 1. Get all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id price");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        data: getEmptyStatsData(range),
        summary: {
          totalStudents: 0,
          totalRevenue: 0,
          avgStudents: 0,
          avgRevenue: 0,
        },
      });
    }

    // 2. Calculate date ranges
    const now = new Date();
    let startDate;
    let groupBy;

    switch (range) {
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = "month";
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1); // Last 3 months
        groupBy = "week";
        break;
      default: // weekly
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        groupBy = "day";
    }

    // 3. Get enrollments within date range
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      paymentStatus: "PAID",
      createdAt: { $gte: startDate, $lte: now },
    });

    // 4. Group data by time period
    const dataByPeriod = new Map();

    enrollments.forEach((enrollment) => {
      const date = new Date(enrollment.createdAt);
      let key;

      switch (groupBy) {
        case "month":
          key = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
            date.getMonth()
          ];
          break;
        case "week":
          const weeksAgo = Math.floor(
            (now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)
          );
          const weekNum = Math.max(1, 4 - weeksAgo);
          key = `Week ${weekNum}`;
          break;
        default:
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          key = days[date.getDay()];
      }

      if (!dataByPeriod.has(key)) {
        dataByPeriod.set(key, { students: 0, revenue: 0 });
      }

      const course = courses.find((c) => c._id.toString() === enrollment.course.toString());
      const entry = dataByPeriod.get(key);
      entry.students++;
      entry.revenue += course?.price || 0;
    });

    // 5. Get all-time students (for summary)
    const allTimeEnrollments = await Enrollment.find({
      course: { $in: courseIds },
      paymentStatus: "PAID",
    });
    const uniqueStudents = new Set(
      allTimeEnrollments.map((e) => e.student.toString())
    );

    // 6. Calculate total revenue
    const totalRevenue = allTimeEnrollments.reduce((sum, enrollment) => {
      const course = courses.find((c) => c._id.toString() === enrollment.course.toString());
      return sum + (course?.price || 0);
    }, 0);

    // 7. Format response data
    const data = formatStatsData(range, dataByPeriod);

    // 8. Calculate summary stats
    const totalStudents = uniqueStudents.size;
    const avgStudents = data.length > 0
      ? Math.round(data.reduce((sum, item) => sum + item.students, 0) / data.length)
      : 0;
    const avgRevenue = data.length > 0
      ? Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length)
      : 0;

    res.json({
      success: true,
      data,
      summary: {
        totalStudents,
        totalRevenue,
        avgStudents,
        avgRevenue,
      },
    });
  } catch (error) {
    console.error("Get Teacher Statistics Overview Error:", error);
    res.status(500).json({ message: "Failed to fetch statistics overview" });
  }
};

/* ======================================================
   GET STUDENT PERFORMANCE TRENDS (For StudentPerformanceGraph.jsx)
====================================================== */
export const getStudentPerformanceTrends = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { range = "yearly" } = req.query;

    // 1. Get all courses taught by this teacher
    const courses = await Course.find({ instructor: teacherId }).select("_id");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        data: getEmptyPerformanceTrends(range),
        summary: {
          average: 0,
          highest: 0,
          lowest: 0,
          trend: 0,
          trendDirection: "up",
        },
      });
    }

    // 2. Calculate date ranges
    const now = new Date();
    let startDate;
    let groupBy;

    switch (range) {
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // Last 12 months
        groupBy = "month";
        break;
      default: // yearly (default)
        startDate = new Date(now.getFullYear() - 1, 0, 1); // Last 2 years
        groupBy = "month";
    }

    // 3. Get attendance records within date range
    const attendanceRecords = await Attendance.find({
      course: { $in: courseIds },
      teacher: teacherId,
      date: { $gte: startDate, $lte: now },
    }).sort({ date: 1 });

    // 4. Calculate average attendance percentage per month
    const monthlyData = new Map();

    // Get unique students count
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      paymentStatus: "PAID",
    });
    const totalStudents = enrollments.length;

    // Initialize monthly data
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const totalMonths = range === "monthly" ? 12 : 24;

    for (let i = 0; i < totalMonths; i++) {
      const monthIndex = (startMonth + i) % 12;
      const year = startYear + Math.floor((startMonth + i) / 12);
      const key = `${months[monthIndex]} ${year}`;
      monthlyData.set(key, { totalPresent: 0, totalDays: 0, count: 0 });
    }

    // Calculate attendance for each record
    attendanceRecords.forEach((record) => {
      const recordDate = new Date(record.date);
      const monthIndex = recordDate.getMonth();
      const year = recordDate.getFullYear();
      const key = `${months[monthIndex]} ${year}`;

      if (monthlyData.has(key)) {
        const present = record.records.filter(
          (r) => r.status === "PRESENT" || r.status === "LATE"
        ).length;
        const entry = monthlyData.get(key);
        entry.totalPresent += present;
        entry.totalDays += record.records.length;
        entry.count++;
      }
    });

    // 5. Format data and calculate percentages
    const data = Array.from(monthlyData.entries()).map(([key, value]) => {
      const avgRate = value.totalDays > 0
        ? Math.round((value.totalPresent / value.totalDays) * 100)
        : 0;
      return {
        month: key.split(" ")[0], // Just the month name for display
        year: key.split(" ")[1], // The year
        value: avgRate,
      };
    });

    // Filter to only include months up to now
    const filteredData = data.filter((item) => {
      const itemDate = new Date(`${item.month} 1, ${item.year}`);
      return itemDate <= now;
    });

    // 6. Calculate summary stats
    const validValues = filteredData.map((d) => d.value).filter((v) => v > 0);
    const average = validValues.length > 0
      ? Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length)
      : 0;
    const highest = validValues.length > 0 ? Math.max(...validValues) : 0;
    const lowest = validValues.length > 0 ? Math.min(...validValues) : 0;

    // Calculate trend (last month vs previous month)
    const lastMonth = filteredData.length > 0 ? filteredData[filteredData.length - 1]?.value || 0 : 0;
    const prevMonth = filteredData.length > 1 ? filteredData[filteredData.length - 2]?.value || 0 : 0;
    const trend = lastMonth - prevMonth;
    const trendDirection = trend >= 0 ? "up" : "down";

    res.json({
      success: true,
      data: filteredData.map((d) => ({ month: d.month, value: d.value })),
      summary: {
        average,
        highest,
        lowest,
        trend: Math.abs(trend),
        trendDirection,
      },
    });
  } catch (error) {
    console.error("Get Student Performance Trends Error:", error);
    res.status(500).json({ message: "Failed to fetch performance trends" });
  }
};

/* ======================================================
   HELPER FUNCTIONS
====================================================== */
function getEmptyStatsData(range) {
  switch (range) {
    case "yearly":
      return [
        { name: "Jan", students: 0, revenue: 0 },
        { name: "Feb", students: 0, revenue: 0 },
        { name: "Mar", students: 0, revenue: 0 },
        { name: "Apr", students: 0, revenue: 0 },
        { name: "May", students: 0, revenue: 0 },
        { name: "Jun", students: 0, revenue: 0 },
      ];
    case "monthly":
      return [
        { name: "Week 1", students: 0, revenue: 0 },
        { name: "Week 2", students: 0, revenue: 0 },
        { name: "Week 3", students: 0, revenue: 0 },
        { name: "Week 4", students: 0, revenue: 0 },
      ];
    default:
      return [
        { name: "Mon", students: 0, revenue: 0 },
        { name: "Tue", students: 0, revenue: 0 },
        { name: "Wed", students: 0, revenue: 0 },
        { name: "Thu", students: 0, revenue: 0 },
        { name: "Fri", students: 0, revenue: 0 },
        { name: "Sat", students: 0, revenue: 0 },
      ];
  }
}

function formatStatsData(range, dataByPeriod) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  switch (range) {
    case "yearly":
      return months.slice(0, 6).map((month) => ({
        name: month,
        students: dataByPeriod.get(month)?.students || 0,
        revenue: dataByPeriod.get(month)?.revenue || 0,
      }));
    case "monthly":
      return ["Week 1", "Week 2", "Week 3", "Week 4"].map((week) => ({
        name: week,
        students: dataByPeriod.get(week)?.students || 0,
        revenue: dataByPeriod.get(week)?.revenue || 0,
      }));
    default:
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => ({
        name: day,
        students: dataByPeriod.get(day)?.students || 0,
        revenue: dataByPeriod.get(day)?.revenue || 0,
      }));
  }
}

function getEmptyPerformanceTrends(range) {
  if (range === "monthly") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month) => ({ month, value: 0 }));
  }
  return [
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
    { month: "Jul", value: 0 },
    { month: "Aug", value: 0 },
    { month: "Sep", value: 0 },
    { month: "Oct", value: 0 },
    { month: "Nov", value: 0 },
    { month: "Dec", value: 0 },
  ];
}

/* ======================================================
   GET TEACHER SETTINGS
====================================================== */
export const getTeacherSettings = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId).select("settings");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      success: true,
      settings: teacher.settings || {
        theme: "system",
        language: "en",
        notifications: {
          email: true,
          push: true,
          sms: false,
          newStudent: true,
          classReminder: true,
          newMessage: true,
          weeklyReport: false,
        },
        privacy: {
          profileVisible: true,
          showEmail: false,
          showPhone: false,
          allowMessages: true,
        },
      },
    });
  } catch (error) {
    console.error("Get Teacher Settings Error:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

/* ======================================================
   UPDATE TEACHER SETTINGS
====================================================== */
export const updateTeacherSettings = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { theme, language, notifications, privacy } = req.body;

    // Build update object dynamically
    const updateData = {};
    
    if (theme) updateData["settings.theme"] = theme;
    if (language) updateData["settings.language"] = language;
    
    if (notifications) {
      // Merge notification settings
      updateData["settings.notifications"] = {
        email: notifications.email ?? true,
        push: notifications.push ?? true,
        sms: notifications.sms ?? false,
        newStudent: notifications.newStudent ?? true,
        classReminder: notifications.classReminder ?? true,
        newMessage: notifications.newMessage ?? true,
        weeklyReport: notifications.weeklyReport ?? false,
      };
    }
    
    if (privacy) {
      // Merge privacy settings
      updateData["settings.privacy"] = {
        profileVisible: privacy.profileVisible ?? true,
        showEmail: privacy.showEmail ?? false,
        showPhone: privacy.showPhone ?? false,
        allowMessages: privacy.allowMessages ?? true,
      };
    }

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: updateData },
      { new: true, upsert: true }
    ).select("settings");

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings: teacher.settings,
    });
  } catch (error) {
    console.error("Update Teacher Settings Error:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
};

/* ======================================================
   CHANGE TEACHER PASSWORD
====================================================== */
export const changeTeacherPassword = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords don't match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Get teacher with password
    const teacher = await Teacher.findById(teacherId).select("+password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Verify current password
    const isMatch = await teacher.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    teacher.password = newPassword;
    await teacher.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Teacher Password Error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

/* ======================================================
   GET TEACHER PROFILE (For Settings Page)
====================================================== */
export const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId).select(
      "-password -class10Certificate -class12Certificate -collegeCertificate -phdOrOtherCertificate"
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("Get Teacher Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
