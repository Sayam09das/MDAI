import React from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { MoreHorizontal } from "lucide-react";

/* ===== DATA ===== */
const data = [
    { month: "Jan", value: 52 },
    { month: "Feb", value: 32 },
    { month: "Mar", value: 58 },
    { month: "Apr", value: 36 },
    { month: "May", value: 34 },
    { month: "Jun", value: 29 },
    { month: "Jul", value: 43 }, // highlighted
    { month: "Aug", value: 14 },
    { month: "Sep", value: 32 },
    { month: "Oct", value: 35 },
    { month: "Nov", value: 66 },
    { month: "Dec", value: 72 },
];

/* ===== TOOLTIP ===== */
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
                <p className="font-medium">Average</p>
                <p className="text-lg font-semibold">{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

const StudentPerformanceGraph = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm w-full"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Student Performance
                </h3>

                <button className="p-1 rounded-md hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* CHART */}
            <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />

                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: "#6366f1",
                                strokeDasharray: "3 3",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="url(#lineColor)"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                stroke: "#6366f1",
                                strokeWidth: 2,
                                fill: "white",
                            }}
                            activeDot={{
                                r: 7,
                                fill: "#6366f1",
                                stroke: "white",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default StudentPerformanceGraph;
