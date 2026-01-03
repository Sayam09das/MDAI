import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
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

/* ===== CUSTOM TOOLTIP ===== */
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-600">
                    {payload[0].payload.name}
                </p>
                <p className="text-sm font-semibold text-blue-600">
                    {payload[0].value} students
                </p>
            </div>
        );
    }
    return null;
};

const StudentPerformance = () => {
    const [range, setRange] = useState("weekly");

    const getData = () => {
        if (range === "monthly") return monthlyData;
        if (range === "yearly") return yearlyData;
        return weeklyData;
    };

    const data = getData();
    const average = Math.round(
        data.reduce((sum, item) => sum + item.students, 0) / data.length
    );
    const max = Math.max(...data.map(item => item.students));
    const min = Math.min(...data.map(item => item.students));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
        >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Student Performance
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Average: {average} students
                    </p>
                </div>

                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 
                    outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                    cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* STATS CARDS - Mobile Only */}
            <div className="grid grid-cols-3 gap-2 mb-4 sm:hidden">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Max</p>
                    <p className="text-sm font-semibold text-blue-600">{max}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Avg</p>
                    <p className="text-sm font-semibold text-green-600">{average}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Min</p>
                    <p className="text-sm font-semibold text-orange-600">{min}</p>
                </div>
            </div>

            {/* CHART */}
            <div className="h-48 sm:h-56 md:h-64 lg:h-72 w-full -ml-2 sm:-ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{
                                fontSize: window.innerWidth < 640 ? 10 : 12,
                                fill: '#6b7280'
                            }}
                            axisLine={false}
                            tickLine={false}
                            dy={5}
                        />
                        <YAxis
                            tick={{
                                fontSize: window.innerWidth < 640 ? 10 : 12,
                                fill: '#6b7280'
                            }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            dx={-5}
                            width={window.innerWidth < 640 ? 30 : 40}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                        />
                        <Bar
                            dataKey="students"
                            fill="#3b82f6"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={window.innerWidth < 640 ? 30 : 50}
                            animationDuration={800}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* STATS ROW - Desktop */}
            <div className="hidden sm:flex items-center justify-around mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Maximum</p>
                    <p className="text-lg font-semibold text-blue-600">{max}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-lg font-semibold text-green-600">{average}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Minimum</p>
                    <p className="text-lg font-semibold text-orange-600">{min}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentPerformance;