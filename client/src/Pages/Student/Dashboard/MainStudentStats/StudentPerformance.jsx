import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Calendar, Award, Target, Loader2 } from "lucide-react";
import { getStudentPerformance } from "../../../../lib/api/studentApi";

const StudentPerformance = () => {
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeFilter]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStudentPerformance(timeFilter);

      if (response.success) {
        setPerformanceData(response.performanceData || []);
        setSubjectData(response.subjectData || []);
        setStats(response.stats || {});
      }
    } catch (err) {
      setError(err.message || "Failed to fetch performance data");
      console.error("Fetch performance error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 min-h-screen bg-gray-50">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: "Average Score", value: `${stats.averageScore || 0}%`, icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-blue-500 to-cyan-500" },
    { label: "Attendance", value: `${stats.attendanceRate || 0}%`, icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-green-500 to-emerald-500" },
    { label: "Total Courses", value: stats.totalCourses || 0, icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-purple-500 to-pink-500" },
    { label: "Completed", value: stats.completedCourses || 0, icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 min-h-screen bg-gray-50">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-5 sm:mb-6 md:mb-8"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Performance Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Track your academic progress and achievements
        </p>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-5 sm:mb-6 md:mb-8">
        {statItems.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4`}>
              {stat.icon}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* MAIN PERFORMANCE CHART */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 mb-5 sm:mb-6 md:mb-8"
      >
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
              Performance Trend
            </h2>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {[
              { key: "weekly", label: "Week" },
              { key: "monthly", label: "Month" },
              { key: "yearly", label: "Year" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTimeFilter(filter.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  timeFilter === filter.key
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Area Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorScore)"
              name="Score"
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAttendance)"
              name="Attendance"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* SUBJECT-WISE PERFORMANCE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
            Subject-wise Performance
          </h2>
        </div>

        {subjectData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm sm:text-base text-gray-500">No performance data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="subject"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Bar
                dataKey="score"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
                name="Score"
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Subject List */}
        {subjectData.length > 0 && (
          <div className="mt-4 space-y-2">
            {subjectData.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  {subject.subject}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {subject.attendedClasses}/{subject.totalClasses} classes
                  </span>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      subject.score >= 75
                        ? "bg-green-100 text-green-700"
                        : subject.score >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {subject.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default StudentPerformance;

