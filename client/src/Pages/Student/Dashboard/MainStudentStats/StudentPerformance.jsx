import React, { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Calendar, Award, Target } from "lucide-react";

const StudentPerformance = () => {
    const [timeFilter, setTimeFilter] = useState("month");

    // Sample data for different time periods
    const performanceData = {
        day: [
            { name: "Mon", score: 75, attendance: 90 },
            { name: "Tue", score: 82, attendance: 95 },
            { name: "Wed", score: 78, attendance: 88 },
            { name: "Thu", score: 85, attendance: 92 },
            { name: "Fri", score: 88, attendance: 96 },
            { name: "Sat", score: 80, attendance: 85 },
            { name: "Sun", score: 83, attendance: 90 },
        ],
        month: [
            { name: "Week 1", score: 75, attendance: 88 },
            { name: "Week 2", score: 78, attendance: 90 },
            { name: "Week 3", score: 82, attendance: 92 },
            { name: "Week 4", score: 85, attendance: 95 },
        ],
        year: [
            { name: "Jan", score: 72, attendance: 85 },
            { name: "Feb", score: 75, attendance: 87 },
            { name: "Mar", score: 78, attendance: 89 },
            { name: "Apr", score: 80, attendance: 91 },
            { name: "May", score: 82, attendance: 93 },
            { name: "Jun", score: 85, attendance: 95 },
            { name: "Jul", score: 83, attendance: 92 },
            { name: "Aug", score: 86, attendance: 94 },
            { name: "Sep", score: 88, attendance: 96 },
            { name: "Oct", score: 87, attendance: 95 },
            { name: "Nov", score: 89, attendance: 97 },
            { name: "Dec", score: 91, attendance: 98 },
        ],
    };

    const subjectData = [
        { subject: "Math", score: 85 },
        { subject: "Physics", score: 78 },
        { subject: "Chemistry", score: 82 },
        { subject: "CS", score: 92 },
        { subject: "English", score: 75 },
    ];

    const stats = [
        { label: "Average Score", value: "85%", icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-blue-500 to-cyan-500" },
        { label: "Attendance", value: "94%", icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-green-500 to-emerald-500" },
        { label: "Rank", value: "#12", icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-purple-500 to-pink-500" },
        { label: "Target", value: "90%", icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />, gradient: "from-orange-500 to-red-500" },
    ];

    const currentData = performanceData[timeFilter];

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
                {stats.map((stat, index) => (
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
                        {["day", "month", "year"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${timeFilter === filter
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Area Chart */}
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={currentData}>
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
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <Bar
                            dataKey="score"
                            fill="#f59e0b"
                            radius={[8, 8, 0, 0]}
                            name="Score"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

        </div>
    );
};

export default StudentPerformance;