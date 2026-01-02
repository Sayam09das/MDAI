import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/* ===== DATA ===== */
const weeklyData = [
    { name: "Mon", students: 72 },
    { name: "Tue", students: 85 },
    { name: "Wed", students: 65 },
    { name: "Thu", students: 78 },
    { name: "Fri", students: 70 },
    { name: "Sat", students: 82 },
];

const monthlyData = [
    { name: "Week 1", students: 68 },
    { name: "Week 2", students: 75 },
    { name: "Week 3", students: 80 },
    { name: "Week 4", students: 72 },
];

const yearlyData = [
    { name: "Jan", students: 60 },
    { name: "Mar", students: 70 },
    { name: "May", students: 78 },
    { name: "Jul", students: 85 },
    { name: "Sep", students: 80 },
    { name: "Nov", students: 88 },
];

const StudentPerformance = () => {
    const [range, setRange] = useState("weekly");

    const getData = () => {
        if (range === "monthly") return monthlyData;
        if (range === "yearly") return yearlyData;
        return weeklyData;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-sm w-full"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Student Performance
                </h3>

                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="text-sm bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none"
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* CHART */}
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getData()}>
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            cursor={{ fill: "#f3f4f6" }}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "12px",
                            }}
                        />
                        <Bar
                            dataKey="students"
                            fill="#60a5fa"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default StudentPerformance;
