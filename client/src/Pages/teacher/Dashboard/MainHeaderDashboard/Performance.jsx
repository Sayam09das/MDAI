import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

/* ===== DATA ===== */
const performanceData = [
    { name: "Lagging", value: 20, color: "#f97316" },   // orange
    { name: "On Track", value: 20, color: "#3b82f6" }, // blue
    { name: "Completed", value: 60, color: "#22c55e" },// green
    { name: "Ahead", value: 20, color: "#a855f7" },    // purple
];

const Performance = () => {

    /* 🔥 Find highest performance */
    const highest = useMemo(() => {
        return performanceData.reduce((max, item) =>
            item.value > max.value ? item : max
        );
    }, []);

    /* 🎯 Convert % → angle for needle */
    const total = performanceData.reduce((sum, d) => sum + d.value, 0);
    const percentage = highest.value;
    const angle = (percentage / total) * 180 - 90;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Pyana Performance
                </h3>
                <span className="text-sm text-indigo-600 cursor-pointer">
                    View Details →
                </span>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6">

                {/* GAUGE */}
                <div className="relative w-full lg:w-1/2 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={performanceData}
                                startAngle={180}
                                endAngle={0}
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {performanceData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>


                    {/* CENTER VALUE */}
                    <div className="absolute top-19 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                            {highest.value}%
                        </p>
                        <p className="text-xs text-gray-500">
                            {highest.name}
                        </p>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="w-full lg:w-1/2 space-y-3">
                    {performanceData.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: item.color }}
                                />
                                <span className="text-gray-700">
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-medium text-gray-900">
                                {item.value}%
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </motion.div>
    );
};

export default Performance;
