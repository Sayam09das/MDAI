import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
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
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                <p className="font-semibold">{label}</p>
                <p>Students: {payload[0].value}</p>
                <p>Revenue: ₹{payload[1].value}</p>
            </div>
        );
    }
    return null;
};

const TeacherStatistics = () => {
    const [range, setRange] = useState("weekly");

    const chartData =
        range === "weekly"
            ? weeklyData
            : range === "monthly"
                ? monthlyData
                : yearlyData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm w-full"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Statistics
                </h3>

                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white outline-none"
                >
                    <option value="weekly">Last 7 Days</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* CHART */}
            <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="students" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>

                            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="students"
                            stroke="#6366f1"
                            fill="url(#students)"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 7 }}
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f59e0b"
                            fill="url(#revenue)"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 7 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default TeacherStatistics;
