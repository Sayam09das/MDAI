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

/* ===== DATA ===== */
const weeklyData = [
    { name: "Week 1", students: 6000, revenue: 9000 },
    { name: "Week 2", students: 12000, revenue: 15000 },
    { name: "Week 3", students: 10000, revenue: 12000 },
    { name: "Week 4", students: 18000, revenue: 22000 },
    { name: "Week 5", students: 14000, revenue: 10000 },
];

const monthlyData = [
    { name: "Jan", students: 12000, revenue: 18000 },
    { name: "Feb", students: 16000, revenue: 22000 },
    { name: "Mar", students: 14000, revenue: 20000 },
    { name: "Apr", students: 22000, revenue: 28000 },
    { name: "May", students: 26000, revenue: 30000 },
];

const yearlyData = [
    { name: "2022", students: 120000, revenue: 180000 },
    { name: "2023", students: 180000, revenue: 240000 },
    { name: "2024", students: 220000, revenue: 300000 },
    { name: "2025", students: 280000, revenue: 360000 },
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

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const chartData =
        range === "weekly"
            ? weeklyData
            : range === "monthly"
                ? monthlyData
                : yearlyData;

    // Calculate summary stats
    const totalStudents = chartData.reduce((sum, item) => sum + item.students, 0);
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const avgStudents = Math.round(totalStudents / chartData.length);
    const avgRevenue = Math.round(totalRevenue / chartData.length);

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
                        data={chartData}
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