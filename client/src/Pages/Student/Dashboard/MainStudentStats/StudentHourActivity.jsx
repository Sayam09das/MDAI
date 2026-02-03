import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Clock, BookOpen, Coffee, Zap, Moon, Sun, Loader2 } from "lucide-react";
import { getStudentActivityHours } from "../../../../lib/api/studentApi";

const StudentHourActivity = () => {
    const [activityData, setActivityData] = useState({
        hourlyData: [],
        activityDistribution: [],
        weeklyData: [],
        stats: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActivityData();
    }, []);

    const fetchActivityData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getStudentActivityHours();

            if (response.success) {
                setActivityData({
                    hourlyData: response.hourlyData || [],
                    activityDistribution: response.activityDistribution || [],
                    weeklyData: response.weeklyData || [],
                    stats: response.stats || {}
                });
            }
        } catch (err) {
            setError(err.message || "Failed to fetch activity data");
            console.error("Fetch activity error:", err);
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

    const { hourlyData, activityDistribution, weeklyData, stats } = activityData;

    // Default hourly data if empty
    const defaultHourlyData = [
        { hour: "12 AM", study: 0, break: 0, sleep: 8 },
        { hour: "1 AM", study: 0, break: 0, sleep: 8 },
        { hour: "2 AM", study: 0, break: 0, sleep: 8 },
        { hour: "3 AM", study: 0, break: 0, sleep: 8 },
        { hour: "4 AM", study: 0, break: 0, sleep: 8 },
        { hour: "5 AM", study: 0, break: 0, sleep: 8 },
        { hour: "6 AM", study: 1, break: 0, sleep: 0 },
        { hour: "7 AM", study: 0, break: 1, sleep: 0 },
        { hour: "8 AM", study: 2, break: 0, sleep: 0 },
        { hour: "9 AM", study: 3, break: 0, sleep: 0 },
        { hour: "10 AM", study: 2, break: 1, sleep: 0 },
        { hour: "11 AM", study: 3, break: 0, sleep: 0 },
        { hour: "12 PM", study: 1, break: 2, sleep: 0 },
        { hour: "1 PM", study: 0, break: 1, sleep: 0 },
        { hour: "2 PM", study: 3, break: 0, sleep: 0 },
        { hour: "3 PM", study: 2, break: 1, sleep: 0 },
        { hour: "4 PM", study: 3, break: 0, sleep: 0 },
        { hour: "5 PM", study: 2, break: 1, sleep: 0 },
        { hour: "6 PM", study: 1, break: 2, sleep: 0 },
        { hour: "7 PM", study: 0, break: 1, sleep: 0 },
        { hour: "8 PM", study: 2, break: 0, sleep: 0 },
        { hour: "9 PM", study: 3, break: 0, sleep: 0 },
        { hour: "10 PM", study: 1, break: 1, sleep: 0 },
        { hour: "11 PM", study: 0, break: 1, sleep: 0 },
    ];

    const displayHourlyData = hourlyData.length > 0 ? hourlyData : defaultHourlyData;

    const defaultDistribution = [
        { name: "Study Time", value: 35, color: "#6366f1" },
        { name: "Break Time", value: 12, color: "#f59e0b" },
        { name: "Sleep Time", value: 48, color: "#8b5cf6" },
        { name: "Free Time", value: 5, color: "#10b981" },
    ];

    const displayDistribution = activityDistribution.length > 0 ? activityDistribution : defaultDistribution;

    const defaultWeekly = [
        { day: "Mon", hours: 8 },
        { day: "Tue", hours: 7 },
        { day: "Wed", hours: 9 },
        { day: "Thu", hours: 8.5 },
        { day: "Fri", hours: 7.5 },
        { day: "Sat", hours: 6 },
        { day: "Sun", hours: 5 },
    ];

    const displayWeekly = weeklyData.length > 0 ? weeklyData : defaultWeekly;

    const statItems = [
        {
            label: "Total Study Hours",
            value: `${stats.totalStudyHours || 0}h`,
            icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
            gradient: "from-blue-500 to-indigo-600",
            change: stats.totalStudyHours > 0 ? "+15%" : "0%"
        },
        {
            label: "Break Time",
            value: `${stats.totalBreakTime || 0}h`,
            icon: <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />,
            gradient: "from-amber-500 to-orange-600",
            change: "+5%"
        },
        {
            label: "Productivity",
            value: `${stats.productivity || 0}%`,
            icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
            gradient: "from-green-500 to-emerald-600",
            change: "+8%"
        },
        {
            label: "Sleep Hours",
            value: `${stats.sleepHours || 0}h`,
            icon: <Moon className="w-5 h-5 sm:w-6 sm:h-6" />,
            gradient: "from-purple-500 to-pink-600",
            change: "0%"
        },
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
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Hour Activity Tracker
                    </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-600 ml-0 sm:ml-15">
                    Monitor your daily study patterns and productivity
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
                        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-white`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                stat.change.startsWith('+')
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {stat.change}
                            </span>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-5 sm:mb-6">

                {/* HOURLY ACTIVITY CHART */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                            24-Hour Activity Timeline
                        </h2>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={displayHourlyData}>
                            <defs>
                                <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="breakGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="hour"
                                tick={{ fontSize: 10 }}
                                stroke="#9ca3af"
                                interval={3}
                            />
                            <YAxis
                                tick={{ fontSize: 10 }}
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
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Area
                                type="monotone"
                                dataKey="study"
                                stackId="1"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#studyGradient)"
                                name="Study"
                            />
                            <Area
                                type="monotone"
                                dataKey="break"
                                stackId="1"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fill="url(#breakGradient)"
                                name="Break"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* ACTIVITY DISTRIBUTION PIE CHART */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            Time Distribution
                        </h2>
                    </div>

                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={displayDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {displayDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                                formatter={(value) => [`${value}%`, 'Time']}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="space-y-2 mt-4">
                        {displayDistribution.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-700">{item.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* WEEKLY COMPARISON */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
            >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        Weekly Study Hours
                    </h2>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={displayWeekly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 12 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="#9ca3af"
                            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            formatter={(value) => [`${value} hours`, 'Study Time']}
                        />
                        <Bar
                            dataKey="hours"
                            fill="#10b981"
                            radius={[8, 8, 0, 0]}
                            name="Study Hours"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

        </div>
    );
};

export default StudentHourActivity;

