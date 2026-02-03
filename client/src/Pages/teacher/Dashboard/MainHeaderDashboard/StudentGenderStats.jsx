import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentGenderStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch gender stats from backend
    const fetchGenderStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${BACKEND_URL}/api/teacher/dashboard/gender-stats`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch gender stats");
            }

            setStats(data.stats);
        } catch (err) {
            console.error("Fetch Gender Stats Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenderStats();
    }, []);

    // Calculate chart data from backend stats
    const { dataOuter, dataInner, total, male, female } = useMemo(() => {
        if (!stats) {
            return {
                dataOuter: [
                    { name: "Male", value: 0 },
                    { name: "Remaining", value: 1 },
                ],
                dataInner: [
                    { name: "Female", value: 0 },
                    { name: "Remaining", value: 1 },
                ],
                total: 0,
                male: 0,
                female: 0,
            };
        }

        const maleCount = stats.male || 0;
        const femaleCount = stats.female || 0;
        const totalCount = stats.total || 0;

        return {
            male: maleCount,
            female: femaleCount,
            total: totalCount,
            dataOuter: [
                { name: "Male", value: maleCount },
                { name: "Remaining", value: totalCount - maleCount },
            ],
            dataInner: [
                { name: "Female", value: femaleCount },
                { name: "Remaining", value: totalCount - femaleCount },
            ],
        };
    }, [stats]);

    // Show loading state
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-56 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            </motion.div>
        );
    }

    // Show error state
    if (error && !stats) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Student
                    </h3>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                        <span className="text-gray-500 text-lg">⋯</span>
                    </button>
                </div>
                <div className="h-56 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-semibold text-gray-400">
                        Unable to load stats
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                        {error}
                    </span>
                </div>
            </motion.div>
        );
    }

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
                    <span className="text-gray-600">Male ({male})</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Female ({female})</span>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentGenderStats;

