import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, XCircle, Clock, BookOpen, Filter, Download } from "lucide-react";
import { getStudentAttendance } from "../../../../lib/api/studentApi";

const Attendence = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'list'

  useEffect(() => {
    fetchAttendance();
  }, [selectedCourse, selectedMonth]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (selectedCourse) params.courseId = selectedCourse;
      params.month = selectedMonth;

      const response = await getStudentAttendance(params);
      
      if (response.success) {
        setAttendanceData(response);
        setAttendanceRecords(response.attendanceRecords || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch attendance");
      console.error("Fetch attendance error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar days for current month
  const getCalendarDays = () => {
    const year = new Date().getFullYear();
    const firstDay = new Date(year, selectedMonth, 1);
    const lastDay = new Date(year, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, date: null, status: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, selectedMonth, day);
      const dateStr = date.toISOString().split("T")[0];
      
      // Find attendance record for this date
      const record = attendanceRecords.find(
        (r) => new Date(r.date).toISOString().split("T")[0] === dateStr
      );

      let status = "no-class";
      if (record) {
        if (record.status === "PRESENT") status = "present";
        else if (record.status === "ABSENT") status = "absent";
        else if (record.status === "LATE") status = "late";
      }

      days.push({ day, date: dateStr, status });
    }

    return days;
  };

  const stats = attendanceData?.stats || {};
  const attendanceByCourse = attendanceData?.attendanceByCourse || {};

  // Get months for filter
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 min-h-screen bg-gray-50">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-5 sm:mb-6 md:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Attendance
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Track your class attendance record
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  viewMode === "calendar"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-5 sm:mb-6 md:mb-8">
        <StatCard
          title="Present Days"
          value={stats.present || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <StatCard
          title="Absent Days"
          value={stats.absent || 0}
          icon={<XCircle className="w-5 h-5" />}
          gradient="from-red-500 to-rose-500"
          delay={0.2}
        />
        <StatCard
          title="Late Arrivals"
          value={stats.late || 0}
          icon={<Clock className="w-5 h-5" />}
          gradient="from-amber-500 to-orange-500"
          delay={0.3}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendancePercentage || 0}%`}
          icon={<BookOpen className="w-5 h-5" />}
          gradient="from-blue-500 to-cyan-500"
          delay={0.4}
        />
      </div>

      {/* ERROR STATE */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 sm:mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* CALENDAR VIEW */}
          {viewMode === "calendar" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                  Attendance Calendar - {months[selectedMonth]}
                </h2>
              </div>

              {/* Calendar Grid */}
              <div className="mb-4">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs sm:text-sm font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {getCalendarDays().map((item, index) => (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${
                        item.day === null
                          ? ""
                          : item.status === "present"
                          ? "bg-green-100 text-green-700"
                          : item.status === "absent"
                          ? "bg-red-100 text-red-700"
                          : item.status === "late"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {item.day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span className="text-xs sm:text-sm text-gray-600">No Class</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                  Attendance Records
                </h2>
              </div>

              {attendanceRecords.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm sm:text-base text-gray-500">No attendance records found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendanceRecords.map((record, index) => (
                    <motion.div
                      key={record._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                            record.status === "PRESENT"
                              ? "bg-green-100"
                              : record.status === "ABSENT"
                              ? "bg-red-100"
                              : "bg-amber-100"
                          }`}
                        >
                          {record.status === "PRESENT" ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          ) : record.status === "ABSENT" ? (
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                          ) : (
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900">
                            {record.course?.title || "Unknown Course"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full ${
                          record.status === "PRESENT"
                            ? "bg-green-100 text-green-700"
                            : record.status === "ABSENT"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* COURSE-WISE ATTENDANCE */}
          {Object.keys(attendanceByCourse).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-5 sm:mt-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                  Attendance by Course
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(attendanceByCourse).map(([courseId, data], index) => (
                  <motion.div
                    key={courseId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mb-2 truncate">
                      {data.courseTitle}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-gray-600">Attendance</span>
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          data.percentage >= 75
                            ? "text-green-600"
                            : data.percentage >= 50
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {data.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          data.percentage >= 75
                            ? "bg-green-500"
                            : data.percentage >= 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {data.present}/{data.totalDays} days
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
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
      className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className={`absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center opacity-90`}>
        {icon}
      </div>
      <div className="relative">
        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">{title}</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${gradient} rounded-full opacity-10 blur-xl`} />
    </motion.div>
  );
};

export default Attendence;

