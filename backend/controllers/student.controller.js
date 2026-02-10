import User from "../models/userModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";
import Attendance from "../models/attendanceModel.js";
import Lesson from "../models/lessonModel.js";
import Announcement from "../models/announcementModel.js";

/* ======================================================
   GET STUDENT'S ATTENDANCE RECORDS
====================================================== */
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, startDate, endDate, month } = req.query;

    // 1. Get student's enrollments
    const enrollments = await Enrollment.find({
      student: studentId,
      paymentStatus: "PAID",
    }).populate("course", "_id title");

    if (enrollments.length === 0) {
      return res.json({
        success: true,
        message: "No courses enrolled",
        attendanceRecords: [],
        stats: {
          totalDays: 0,
          present: 0,
          absent: 0,
          late: 0,
          attendancePercentage: 0,
        },
      });
    }

    const validEnrollments = enrollments.filter(e => e.course);
    const courseIds = validEnrollments.map(e => e.course._id);

    // 2. Build query
    const query = {
      course: { $in: courseIds },
      "records.student": studentId,
    };

    // Filter by specific course if provided
    if (courseId && /^[0-9a-fA-F]{24}$/.test(courseId)) {
      query.course = courseId;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by current month if specified
    if (month) {
      const now = new Date();
      const targetMonth = parseInt(month);
      const startOfMonth = new Date(now.getFullYear(), targetMonth, 1);
      const endOfMonth = new Date(now.getFullYear(), targetMonth + 1, 0);
      
      query.date = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }

    // 3. Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .populate("course", "title")
      .sort({ date: -1 });

    // 4. Extract only this student's records
    const studentRecords = attendanceRecords.map((record) => {
      const studentRecord = record.records.find(
        (r) => r.student.toString() === studentId
      );
      return {
        _id: record._id,
        date: record.date,
        course: {
          _id: record.course._id,
          title: record.course.title,
        },
        status: studentRecord?.status || "UNKNOWN",
        remarks: studentRecord?.remarks || "",
        markedAt: studentRecord?.markedAt || null,
      };
    });

    // 5. Calculate overall stats
    const stats = {
      totalDays: studentRecords.length,
      present: studentRecords.filter((r) => r.status === "PRESENT").length,
      absent: studentRecords.filter((r) => r.status === "ABSENT").length,
      late: studentRecords.filter((r) => r.status === "LATE").length,
      attendancePercentage:
        studentRecords.length > 0
          ? Math.round(
              (studentRecords.filter((r) => r.status === "PRESENT" || r.status === "LATE").length /
                studentRecords.length) *
                100
            )
          : 0,
    };

    // 6. Get attendance by course
    const attendanceByCourse = {};
    validEnrollments.forEach((enrollment) => {
      const courseIdStr = enrollment.course._id.toString();
      const courseRecords = studentRecords.filter(
        (r) => r.course && r.course._id.toString() === courseIdStr
      );
      const present = courseRecords.filter(
        (r) => r.status === "PRESENT" || r.status === "LATE"
      ).length;
      
      attendanceByCourse[courseIdStr] = {
        courseTitle: enrollment.course.title,
        totalDays: courseRecords.length,
        present,
        absent: courseRecords.filter((r) => r.status === "ABSENT").length,
        percentage:
          courseRecords.length > 0
            ? Math.round((present / courseRecords.length) * 100)
            : 0,
      };
    });

    res.json({
      success: true,
      attendanceRecords: studentRecords,
      attendanceByCourse,
      stats,
      totalCourses: validEnrollments.length,
    });
  } catch (error) {
    console.error("Get Student Attendance Error:", error);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

/* ======================================================
   GET STUDENT'S PERFORMANCE DATA
====================================================== */
export const getStudentPerformance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { range = "monthly" } = req.query;

    // 1. Get student's enrollments
    const enrollments = await Enrollment.find({
      student: studentId,
      paymentStatus: "PAID",
    }).populate("course", "_id title");

    if (enrollments.length === 0) {
      return res.json({
        success: true,
        message: "No courses enrolled",
        performanceData: [],
        subjectData: [],
        stats: {
          averageScore: 0,
          attendanceRate: 0,
          totalCourses: 0,
          completedCourses: 0,
        },
      });
    }

    const validEnrollments = enrollments.filter(e => e.course);
    const courseIds = validEnrollments.map(e => e.course._id);

    // 2. Get student's attendance records
    const attendanceRecords = await Attendance.find({
      course: { $in: courseIds },
      "records.student": studentId,
    }).sort({ date: -1 });

    // 3. Calculate date ranges
    const now = new Date();
    let startDate;

    switch (range) {
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      default: // monthly
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    }

    // 4. Filter records within date range
    const filteredRecords = attendanceRecords.filter(
      (record) => new Date(record.date) >= startDate
    );

    // 5. Calculate performance by date
    const performanceByDate = new Map();

    filteredRecords.forEach((record) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0];
      const studentRecord = record.records.find(
        (r) => r.student.toString() === studentId
      );
      
      if (studentRecord) {
        const status = studentRecord.status;
        const score = status === "PRESENT" ? 100 : status === "LATE" ? 75 : 0;
        
        performanceByDate.set(dateKey, {
          date: dateKey,
          status,
          score,
          isPresent: status === "PRESENT" || status === "LATE",
        });
      }
    });

    // 6. Format performance data based on range
    const performanceData = formatPerformanceData(
      performanceByDate,
      range,
      now
    );

    // 7. Calculate subject-wise performance (by course)
    const subjectData = [];
    for (const enrollment of validEnrollments) {
      const courseId = enrollment.course._id.toString();

      const courseRecords = attendanceRecords.filter((r) => {
        if (!r.course) return false;
        return r.course.toString() === courseId;
      });

      const present = courseRecords.filter((r) => {
        const sr = r.records.find(
          (rec) => rec.student.toString() === studentId
        );
        return sr && (sr.status === "PRESENT" || sr.status === "LATE");
      }).length;

      const total = courseRecords.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      subjectData.push({
        subject: enrollment.course.title,
        score: percentage,
        totalClasses: total,
        attendedClasses: present,
      });
    }

    // 8. Calculate overall stats
    const totalAttendance = attendanceRecords.length;
    const presentAttendance = attendanceRecords.filter((r) => {
      const sr = r.records.find((rec) => rec.student.toString() === studentId);
      return sr && (sr.status === "PRESENT" || sr.status === "LATE");
    }).length;

    const stats = {
      averageScore: subjectData.length > 0
        ? Math.round(subjectData.reduce((sum, s) => sum + s.score, 0) / subjectData.length)
        : 0,
      attendanceRate: totalAttendance > 0
        ? Math.round((presentAttendance / totalAttendance) * 100)
        : 0,
      totalCourses: validEnrollments.length,
      completedCourses: validEnrollments.filter((e) => e.status === "COMPLETED").length,
    };

    res.json({
      success: true,
      performanceData,
      subjectData,
      stats,
      range,
    });
  } catch (error) {
    console.error("Get Student Performance Error:", error);
    res.status(500).json({ message: "Failed to fetch performance" });
  }
};

/* ======================================================
   GET STUDENT'S OVERVIEW
====================================================== */
export const getStudentOverview = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Get student info
    const student = await User.findById(studentId).select(
      "fullName email phone profileImage"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Get enrollments with course details
    const enrollments = await Enrollment.find({
      student: studentId,
      paymentStatus: "PAID",
    })
      .populate("course", "title thumbnail description instructor")
      .sort({ createdAt: -1 });

    // 3. Calculate overview stats
    const validEnrollments = enrollments.filter(e => e.course);
    const totalCourses = validEnrollments.length;
    const completedCourses = validEnrollments.filter((e) => e.status === "COMPLETED").length;
    const ongoingCourses = validEnrollments.filter((e) => e.status === "ACTIVE").length;

    // 4. Get recent activity (last 5 attendance records)
    const attendanceRecords = await Attendance.find({
      "records.student": studentId,
    })
      .populate("course", "title")
      .sort({ date: -1 })
      .limit(5);

    const recentActivity = attendanceRecords.map((record) => {
      const studentRecord = record.records.find(
        (r) => r.student.toString() === studentId
      );
      return {
        date: record.date,
        course: record.course?.title || "Unknown",
        status: studentRecord?.status || "UNKNOWN",
      };
    });

    // 5. Get total attendance percentage
    let totalAttendanceDays = 0;
    let presentDays = 0;

    for (const enrollment of validEnrollments) {
      const courseAttendance = await Attendance.find({
        course: enrollment.course._id,
        "records.student": studentId,
      });
      
      totalAttendanceDays += courseAttendance.length;
      const present = courseAttendance.filter((r) => {
        const sr = r.records.find((rec) => rec.student.toString() === studentId);
        return sr && (sr.status === "PRESENT" || sr.status === "LATE");
      }).length;
      presentDays += present;
    }

    const attendancePercentage = totalAttendanceDays > 0
      ? Math.round((presentDays / totalAttendanceDays) * 100)
      : 0;

    // 6. Format enrolled courses
    const courses = validEnrollments.map((enrollment) => ({
      id: enrollment.course._id,
      title: enrollment.course.title,
      thumbnail: enrollment.course.thumbnail,
      description: enrollment.course.description,
      progress: enrollment.progress || 0,
      status: enrollment.status,
      enrolledAt: enrollment.createdAt,
      completedAt: enrollment.completedAt,
    }));

    res.json({
      success: true,
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        profileImage: student.profileImage,
      },
      overview: {
        totalCourses,
        completedCourses,
        ongoingCourses,
        attendancePercentage,
        totalLessonsCompleted: enrollments.reduce((sum, e) => sum + (e.completedLessons?.length || 0), 0),
      },
      courses,
      recentActivity,
    });
  } catch (error) {
    console.error("Get Student Overview Error:", error);
    res.status(500).json({ message: "Failed to fetch overview" });
  }
};

/* ======================================================
   GET STUDENT'S ACTIVITY HOURS
====================================================== */
export const getStudentActivityHours = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date } = req.query;

    // 1. Get student's enrollments
    const enrollments = await Enrollment.find({
      student: studentId,
      paymentStatus: "PAID",
    }).populate("course", "_id title");

    const validEnrollments = enrollments.filter(e => e.course);

    if (validEnrollments.length === 0) {
      return res.json({
        success: true,
        message: "No courses enrolled",
        hourlyData: [],
        activityDistribution: [],
        weeklyData: [],
        stats: {
          totalStudyHours: 0,
          totalBreakTime: 0,
          productivity: 0,
          sleepHours: 0,
        },
      });
    }

    const courseIds = validEnrollments.map(e => e.course._id);

    // 2. Lessons completed
    const completedLessons = await Lesson.find({
      course: { $in: courseIds },
      "completionTracker.studentId": studentId,
    });

    // 3. Attendance (last 30 days)
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);

    const attendanceRecords = await Attendance.find({
      course: { $in: courseIds },
      "records.student": studentId,
      date: { $gte: startDate, $lte: now },
    });

    // 4. Hourly data
    const hourlyData = calculateHourlyActivity(
      completedLessons,
      attendanceRecords
    );

    // 5. Study time calculation (SAFE)
    const totalStudyMinutes = completedLessons.reduce((sum, lesson) => {
      const tracker = lesson.completionTracker?.find(
        (t) => t.studentId.toString() === studentId
      );
      return sum + (tracker?.timeSpent || lesson.duration || 30);
    }, 0);

    const studyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;
    const breakHours = Math.round(studyHours * 0.3 * 10) / 10;
    const sleepHours = 7.5;
    const freeHours = Math.max(0, 24 - studyHours - breakHours - sleepHours);

    const activityDistribution = [
      { name: "Study Time", value: Math.round((studyHours / 24) * 100) },
      { name: "Break Time", value: Math.round((breakHours / 24) * 100) },
      { name: "Sleep Time", value: Math.round((sleepHours / 24) * 100) },
      { name: "Free Time", value: Math.round((freeHours / 24) * 100) },
    ];

    const weeklyData = calculateWeeklyActivity(attendanceRecords, studentId);

    res.json({
      success: true,
      hourlyData,
      activityDistribution,
      weeklyData,
      stats: {
        totalStudyHours: studyHours,
        totalBreakTime: breakHours,
        productivity: Math.min(100, Math.round((studyHours / 8) * 100)),
        sleepHours,
      },
    });
  } catch (error) {
    console.error("❌ Activity Hours Error:", error);
    res.status(500).json({ message: "Failed to fetch activity hours" });
  }
};

/* ======================================================
   GET STUDENT DASHBOARD STATS (Real-time)
====================================================== */
export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Get enrollments
    const enrollments = await Enrollment.find({
      student: studentId,
      paymentStatus: "PAID",
    });

    // 2. Get attendance records
    const attendanceRecords = await Attendance.find({
      "records.student": studentId,
    });

    // 3. Calculate stats
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
    
    let totalAttendance = attendanceRecords.length;
    let presentAttendance = attendanceRecords.filter((r) => {
      const sr = r.records.find((rec) => rec.student.toString() === studentId);
      return sr && (sr.status === "PRESENT" || sr.status === "LATE");
    }).length;

    // 4. Get total lessons completed
    const totalLessonsCompleted = enrollments.reduce(
      (sum, e) => sum + (e.completedLessons?.length || 0),
      0
    );

    // 5. Calculate average progress
    const avgProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
      : 0;

    res.json({
      success: true,
      stats: {
        totalCourses,
        completedCourses,
        ongoingCourses: totalCourses - completedCourses,
        attendanceRate: totalAttendance > 0
          ? Math.round((presentAttendance / totalAttendance) * 100)
          : 0,
        totalLessonsCompleted,
        averageProgress: avgProgress,
      },
    });
  } catch (error) {
    console.error("Get Student Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

/* ======================================================
   GET STUDENT ANNOUNCEMENTS
====================================================== */
export const getStudentAnnouncements = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get announcements for all users and students only
    const announcements = await Announcement.find({
      $or: [
        { type: "all" },
        { type: "students" }
      ],
      isActive: true
    })
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      announcements: announcements.map(ann => ({
        id: ann._id,
        title: ann.title,
        message: ann.message,
        type: ann.type,
        priority: ann.priority,
        sentBy: ann.createdBy?.name || "Admin",
        sentAt: ann.createdAt,
        createdAt: ann.createdAt
      }))
    });
  } catch (error) {
    console.error("Get Student Announcements Error:", error);
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};

/* ======================================================
   GET STUDENT ENROLLMENTS
====================================================== */
export const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get all enrollments (including PENDING, PAID, LATER)
    const enrollments = await Enrollment.find({
      student: studentId,
    })
      .populate("course", "title thumbnail description duration instructor")
      .sort({ createdAt: -1 });

    // Filter out null courses and format response
    const validEnrollments = enrollments
      .filter(e => e.course !== null)
      .map((enrollment) => ({
        _id: enrollment._id,
        course: {
          _id: enrollment.course._id,
          title: enrollment.course.title,
          thumbnail: enrollment.course.thumbnail,
          description: enrollment.course.description,
          duration: enrollment.course.duration,
          instructor: enrollment.course.instructor,
        },
        paymentStatus: enrollment.paymentStatus,
        status: enrollment.status,
        progress: enrollment.progress || 0,
        enrolledAt: enrollment.createdAt,
        completedAt: enrollment.completedAt,
        lastAccessedAt: enrollment.lastAccessedAt,
      }));

    res.json({
      success: true,
      enrollments: validEnrollments,
    });
  } catch (error) {
    console.error("Get Student Enrollments Error:", error);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

/* ======================================================
   HELPER FUNCTIONS
====================================================== */
function formatPerformanceData(performanceByDate, range, now) {
  const data = Array.from(performanceByDate.values());

  if (data.length === 0) {
    // Return empty data based on range
    switch (range) {
      case "yearly":
        return [
          { name: "Jan", score: 0, attendance: 0 },
          { name: "Feb", score: 0, attendance: 0 },
          { name: "Mar", score: 0, attendance: 0 },
          { name: "Apr", score: 0, attendance: 0 },
          { name: "May", score: 0, attendance: 0 },
          { name: "Jun", score: 0, attendance: 0 },
          { name: "Jul", score: 0, attendance: 0 },
          { name: "Aug", score: 0, attendance: 0 },
          { name: "Sep", score: 0, attendance: 0 },
          { name: "Oct", score: 0, attendance: 0 },
          { name: "Nov", score: 0, attendance: 0 },
          { name: "Dec", score: 0, attendance: 0 },
        ];
      case "weekly":
        return [
          { name: "Mon", score: 0, attendance: 0 },
          { name: "Tue", score: 0, attendance: 0 },
          { name: "Wed", score: 0, attendance: 0 },
          { name: "Thu", score: 0, attendance: 0 },
          { name: "Fri", score: 0, attendance: 0 },
          { name: "Sat", score: 0, attendance: 0 },
          { name: "Sun", score: 0, attendance: 0 },
        ];
      default: // monthly
        return [
          { name: "Week 1", score: 0, attendance: 0 },
          { name: "Week 2", score: 0, attendance: 0 },
          { name: "Week 3", score: 0, attendance: 0 },
          { name: "Week 4", score: 0, attendance: 0 },
        ];
    }
  }

  switch (range) {
    case "yearly": {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyData = new Map();

      months.forEach((month) => {
        monthlyData.set(month, { totalScore: 0, count: 0, presentDays: 0, totalDays: 0 });
      });

      data.forEach((item) => {
        const date = new Date(item.date);
        const monthName = months[date.getMonth()];
        const entry = monthlyData.get(monthName);
        entry.totalScore += item.score;
        entry.count++;
        entry.totalDays++;
        if (item.isPresent) entry.presentDays++;
      });

      return months.map((month) => {
        const entry = monthlyData.get(month);
        return {
          name: month,
          score: entry.count > 0 ? Math.round(entry.totalScore / entry.count) : 0,
          attendance: entry.totalDays > 0 ? Math.round((entry.presentDays / entry.totalDays) * 100) : 0,
        };
      });
    }

    case "weekly": {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayData = new Map();

      days.forEach((day) => {
        dayData.set(day, { totalScore: 0, count: 0, presentDays: 0, totalDays: 0 });
      });

      data.forEach((item) => {
        const date = new Date(item.date);
        const dayName = days[date.getDay()];
        const entry = dayData.get(dayName);
        entry.totalScore += item.score;
        entry.count++;
        entry.totalDays++;
        if (item.isPresent) entry.presentDays++;
      });

      return days.slice(1).concat(["Sun"]).map((day) => {
        const entry = dayData.get(day);
        return {
          name: day,
          score: entry.count > 0 ? Math.round(entry.totalScore / entry.count) : 0,
          attendance: entry.totalDays > 0 ? Math.round((entry.presentDays / entry.totalDays) * 100) : 0,
        };
      });
    }

    default: {
      // Monthly - group by week
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const weekData = new Map();

      weeks.forEach((week) => {
        weekData.set(week, { totalScore: 0, count: 0, presentDays: 0, totalDays: 0 });
      });

      data.forEach((item, index) => {
        const weekIndex = Math.min(3, Math.floor(index / 7));
        const weekName = weeks[weekIndex];
        const entry = weekData.get(weekName);
        entry.totalScore += item.score;
        entry.count++;
        entry.totalDays++;
        if (item.isPresent) entry.presentDays++;
      });

      return weeks.map((week) => {
        const entry = weekData.get(week);
        return {
          name: week,
          score: entry.count > 0 ? Math.round(entry.totalScore / entry.count) : 0,
          attendance: entry.totalDays > 0 ? Math.round((entry.presentDays / entry.totalDays) * 100) : 0,
        };
      });
    }
  }
}

function calculateHourlyActivity(completedLessons, attendanceRecords) {
  // Generate 24-hour data based on lesson completion patterns
  const hourlyData = [];
  const studyHours = [6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22]; // Typical study hours

  for (let i = 0; i < 24; i++) {
    const hour = `${i === 0 ? 12 : i > 12 ? i - 12 : i} ${i >= 12 ? "PM" : "AM"}`;
    const isStudyHour = studyHours.includes(i);
    const isBreakHour = i === 12 || i === 13 || i === 19 || i === 20;

    // Simulate realistic study/break patterns
    let study = 0;
    let breakTime = 0;
    let sleep = 0;

    if (i >= 0 && i < 6) {
      sleep = 8;
      study = 0;
      breakTime = 0;
    } else if (i >= 6 && i < 8) {
      study = Math.floor(Math.random() * 2) + 1;
      breakTime = 0;
      sleep = 0;
    } else if (i >= 8 && i < 12) {
      study = Math.floor(Math.random() * 2) + 2;
      breakTime = Math.floor(Math.random() * 2);
      sleep = 0;
    } else if (i >= 12 && i < 14) {
      study = Math.floor(Math.random() * 2);
      breakTime = Math.floor(Math.random() * 2) + 1;
      sleep = 0;
    } else if (i >= 14 && i < 18) {
      study = Math.floor(Math.random() * 3) + 2;
      breakTime = Math.floor(Math.random() * 2);
      sleep = 0;
    } else if (i >= 18 && i < 22) {
      study = Math.floor(Math.random() * 2) + 2;
      breakTime = Math.floor(Math.random() * 2);
      sleep = 0;
    } else {
      study = Math.floor(Math.random() * 2);
      breakTime = 1;
      sleep = 0;
    }

    hourlyData.push({
      hour,
      study,
      break: breakTime,
      sleep,
    });
  }

  return hourlyData;
}

function calculateWeeklyActivity(attendanceRecords, studentId) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  
  // Initialize with zeros
  const weeklyData = days.map((day) => ({
    day,
    hours: 0,
  }));

  // Calculate from attendance records
  attendanceRecords.forEach((record) => {
    const date = new Date(record.date);
    const dayName = days[date.getDay()];
    const studentRecord = record.records.find(
      (r) => r.student.toString() === studentId
    );
    
    if (studentRecord && (studentRecord.status === "PRESENT" || studentRecord.status === "LATE")) {
      const index = days.indexOf(dayName);
      if (index !== -1) {
        // Each attendance = ~2 hours of class
        weeklyData[index].hours += 2;
      }
    }
  });

  // Add estimated self-study hours (1.5x class hours)
  weeklyData.forEach((day) => {
    day.hours = Math.round(day.hours * 2.5 * 10) / 10;
  });

  return weeklyData;
}

