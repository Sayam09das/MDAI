import React from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

/* ===== DATA ===== */
const male = 10500;
const female = 7500;
const total = male + female;

const dataOuter = [
    { name: "Male", value: male },
    { name: "Remaining", value: total - male },
];

const dataInner = [
    { name: "Female", value: female },
    { name: "Remaining", value: total - female },
];

const StudentGenderStats = () => {
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
                    Student
                </h3>

                <button className="p-1 rounded-md hover:bg-gray-100">
                    <span className="text-gray-500 text-lg">⋯</span>
                </button>
            </div>

            {/* CHART */}
            <div className="relative h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* OUTER RING – MALE */}
                        <Pie
                            data={dataOuter}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            innerRadius={80}
                            outerRadius={95}
                            stroke="none"
                            paddingAngle={2}
                        >
                            <Cell fill="#f97316" /> {/* Male */}
                            <Cell fill="#fde7db" /> {/* Background */}
                        </Pie>

                        {/* INNER RING – FEMALE */}
                        <Pie
                            data={dataInner}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            innerRadius={60}
                            outerRadius={75}
                            stroke="none"
                            paddingAngle={2}
                        >
                            <Cell fill="#22c55e" /> {/* Female */}
                            <Cell fill="#dcfce7" /> {/* Background */}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* CENTER TEXT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {total.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* LEGEND */}
            <div className="flex items-center justify-center gap-6 mt-2 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-gray-600">Male</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Female</span>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentGenderStats;
