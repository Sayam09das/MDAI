import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, CheckCircle, Calendar, User, Loader2 } from "lucide-react";
import { getStudentOverview } from "../../../../lib/api/studentApi";

const StudentOverview = () => {
  const [studentData, setStudentData] = useState(null);
  const [overview, setOverview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentOverview();
  }, []);

  const fetchStudentOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStudentOverview();

      if (response.success) {
        setStudentData(response.student);
        setOverview(response.overview);
        setCourses(response.courses || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch student overview");
      console.error("Fetch overview error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full mt-4 sm:mt-5 md:mt-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-4 sm:mt-5 md:mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-sm text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const studentName = studentData?.fullName || "Student";
  const totalCourses = overview?.totalCourses || 0;
  const completedCourses = overview?.completedCourses || 0;
  const ongoingCourses = overview?.ongoingCourses || 0;
  const attendancePercentage = overview?.attendancePercentage || 0;

  return (
    <div className="w-full mt-4 sm:mt-5 md:mt-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Student Overview
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Welcome back, {studentName} 👋
            </p>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5 md:mt-6">
        <StatCard
          title="Total Courses"
          value={totalCourses}
          icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
          gradient="from-blue-500 to-cyan-500"
          delay={0.1}
        />
        <StatCard
          title="Ongoing Courses"
          value={ongoingCourses}
          icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
          gradient="from-amber-500 to-orange-500"
          delay={0.2}
        />
        <StatCard
          title="Completed Courses"
          value={completedCourses}
          icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
          gradient="from-emerald-500 to-green-500"
          delay={0.3}
        />
      </div>

      {/* ATTENDANCE STAT */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-4 sm:mt-5 md:mt-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
            Attendance Rate
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${attendancePercentage * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {attendancePercentage}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-600">
              You've attended <span className="font-semibold text-gray-900">{attendancePercentage}%</span> of your classes
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {attendancePercentage >= 75
                ? "Great job! Keep it up!"
                : attendancePercentage >= 50
                ? "Good progress. Try to improve!"
                : "Needs improvement. Focus on attendance!"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* COURSE LIST */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-4 sm:mt-5 md:mt-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
            Enrolled Courses
          </h3>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm sm:text-base text-gray-500">No courses enrolled yet</p>
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {courses.map((course, index) => (
              <motion.li
                key={course.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex justify-between items-center gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      course.status === "COMPLETED"
                        ? "bg-green-500"
                        : course.status === "ACTIVE"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm sm:text-base text-gray-700 font-medium truncate block">
                      {course.title}
                    </span>
                    {course.progress !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold px-2.5 py-1 sm:py-1.5 rounded-full whitespace-nowrap ${
                    course.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : course.status === "ACTIVE"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {course.status === "COMPLETED"
                    ? "Completed"
                    : course.status === "ACTIVE"
                    ? "Ongoing"
                    : course.status}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon, gradient, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Icon Background */}
      <div
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center opacity-90`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="relative">
        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1 sm:mb-2">
          {title}
        </p>
        <motion.h3
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
        >
          {value}
        </motion.h3>
      </div>

      {/* Decorative Circle */}
      <div
        className={`absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${gradient} rounded-full opacity-10 blur-xl`}
      />
    </motion.div>
  );
};

export default StudentOverview;

