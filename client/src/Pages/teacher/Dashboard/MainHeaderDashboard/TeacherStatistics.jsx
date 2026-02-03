import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

/* ===== CONFIG ===== */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ===== DEFAULT DATA ===== */
const defaultWeeklyData = [
    { name: "Mon", students: 45, revenue: 12000 },
    { name: "Tue", students: 52, revenue: 15000 },
    { name: "Wed", students: 48, revenue: 13500 },
    { name: "Thu", students: 61, revenue: 18000 },
    { name: "Fri", students: 55, revenue: 16200 },
    { name: "Sat", students: 32, revenue: 9000 },
    { name: "Sun", students: 28, revenue: 7500 },
];

const defaultMonthlyData = [
    { name: "Week 1", students: 180, revenue: 52000 },
    { name: "Week 2", students: 210, revenue: 63000 },
    { name: "Week 3", students: 195, revenue: 58000 },
    { name: "Week 4", students: 240, revenue: 72000 },
];

const defaultYearlyData = [
    { name: "Jan", students: 850, revenue: 250000 },
    { name: "Feb", students: 920, revenue: 280000 },
    { name: "Mar", students: 880, revenue: 265000 },
    { name: "Apr", students: 950, revenue: 290000 },
    { name: "May", students: 1020, revenue: 310000 },
    { name: "Jun", students: 980, revenue: 295000 },
    { name: "Jul", students: 1100, revenue: 340000 },
    { name: "Aug", students: 1150, revenue: 355000 },
    { name: "Sep", students: 1080, revenue: 330000 },
    { name: "Oct", students: 1200, revenue: 370000 },
    { name: "Nov", students: 1250, revenue: 385000 },
    { name: "Dec", students: 1300, revenue: 400000 },
];


/* ===== TOOLTIP ===== */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">{label}</p>
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <p className="text-xs text-gray-700">
                            Students: <span className="font-semibold">{payload[0]?.value.toLocaleString()}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <p className="text-xs text-gray-700">
                            Revenue: <span className="font-semibold">₹{payload[1]?.value.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

/* ===== CUSTOM LEGEND ===== */
const CustomLegend = () => (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-5">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-xs sm:text-sm text-gray-600">Students</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs sm:text-sm text-gray-600">Revenue</span>
        </div>
    </div>
);

const TeacherStatistics = () => {
    const [range, setRange] = useState("weekly");
    const [isMobile, setIsMobile] = useState(false);
    const [chartData, setChartData] = useState(defaultWeeklyData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [summary, setSummary] = useState({
        totalStudents: 0,
        totalRevenue: 0,
        avgStudents: 0,
        avgRevenue: 0,
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    /* ===== FETCH DATA FROM BACKEND ===== */
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) {
                    setError(true);
                    return;
                }

                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/dashboard/statistics-overview?range=${range}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const responseData = await res.json();

                if (!res.ok || !responseData.success) {
                    setError(true);
                    return;
                }

                if (responseData.data && responseData.data.length > 0) {
                    setChartData(responseData.data);
                }
                if (responseData.summary) {
                    setSummary(responseData.summary);
                }
            } catch (err) {
                console.error("Statistics overview fetch error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [range]);

    const getDefaultData = () => {
        switch (range) {
            case "yearly":
                return defaultYearlyData;
            case "monthly":
                return defaultMonthlyData;
            default:
                return defaultWeeklyData;
        }
    };

    const displayData = chartData.length > 0 ? chartData : getDefaultData();

    // Calculate summary stats
    const totalStudents = summary.totalStudents || displayData.reduce((sum, item) => sum + (item.students || 0), 0);
    const totalRevenue = summary.totalRevenue || displayData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const avgStudents = summary.avgStudents || Math.round(totalStudents / displayData.length);
    const avgRevenue = summary.avgRevenue || Math.round(totalRevenue / displayData.length);

    /* ===== LOADING STATE ===== */
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
            >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* SUMMARY CARDS LOADING */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-lg p-3 animate-pulse">
                            <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                            <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* CHART LOADING */}
                <div className="w-full h-52 sm:h-64 md:h-72 lg:h-80 -ml-2 sm:-ml-4">
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /* ===== ERROR STATE ===== */
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
            >
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                    Failed to load statistics. Please try again later.
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
        >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Statistics Overview
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Performance metrics and revenue tracking
                    </p>
                </div>

                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white 
                    outline-none focus:ring-2 focus:ring-indigo-300 hover:bg-indigo-700 
                    transition-colors cursor-pointer w-full sm:w-auto"
                >
                    <option value="weekly">Last 7 Days</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3">
                    <p className="text-xs text-indigo-600 font-medium">Total Students</p>
                    <p className="text-base sm:text-lg font-bold text-indigo-700 mt-1">
                        {totalStudents.toLocaleString()}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3">
                    <p className="text-xs text-amber-600 font-medium">Total Revenue</p>
                    <p className="text-base sm:text-lg font-bold text-amber-700 mt-1">
                        ₹{totalRevenue.toLocaleString()}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                    <p className="text-xs text-purple-600 font-medium">Avg Students</p>
                    <p className="text-base sm:text-lg font-bold text-purple-700 mt-1">
                        {avgStudents.toLocaleString()}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3">
                    <p className="text-xs text-emerald-600 font-medium">Avg Revenue</p>
                    <p className="text-base sm:text-lg font-bold text-emerald-700 mt-1">
                        ₹{avgRevenue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* CHART */}
            <div className="w-full h-52 sm:h-64 md:h-72 lg:h-80 -ml-2 sm:-ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={displayData}
                        margin={{
                            top: 10,
                            right: isMobile ? 5 : 10,
                            left: isMobile ? -10 : 0,
                            bottom: 5
                        }}
                    >
                        <defs>
                            <linearGradient id="students" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                            </linearGradient>

                            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />

                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={false}
                            dy={5}
                        />

                        <YAxis
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={false}
                            dx={-5}
                            width={isMobile ? 35 : 50}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="students"
                            stroke="#6366f1"
                            fill="url(#students)"
                            strokeWidth={isMobile ? 2 : 3}
                            dot={{ r: isMobile ? 3 : 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: isMobile ? 5 : 7, fill: '#6366f1', strokeWidth: 2 }}
                            animationDuration={1000}
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f59e0b"
                            fill="url(#revenue)"
                            strokeWidth={isMobile ? 2 : 3}
                            dot={{ r: isMobile ? 3 : 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: isMobile ? 5 : 7, fill: '#f59e0b', strokeWidth: 2 }}
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* CUSTOM LEGEND */}
            <CustomLegend />
        </motion.div>
    );
};

export default TeacherStatistics;

