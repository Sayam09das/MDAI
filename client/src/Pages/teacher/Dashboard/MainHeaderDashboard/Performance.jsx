import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

/* ===== CONFIG ===== */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const Performance = () => {
    const [data, setData] = useState([
        { name: "Lagging", value: 20, color: "#f97316" },
        { name: "On Track", value: 20, color: "#3b82f6" },
        { name: "Completed", value: 60, color: "#22c55e" },
        { name: "Ahead", value: 20, color: "#a855f7" },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [highest, setHighest] = useState({ name: "Completed", value: 60 });

    /* ===== FETCH DATA FROM BACKEND ===== */
    useEffect(() => {
        const fetchPerformanceMetrics = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) {
                    setError(true);
                    return;
                }

                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/dashboard/performance-metrics`,
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
                    setData(responseData.data);
                }
                if (responseData.highest) {
                    setHighest(responseData.highest);
                }
            } catch (err) {
                console.error("Performance metrics fetch error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceMetrics();
    }, []);

    /* 🔥 Find highest performance (fallback if not from backend) */
    const displayHighest = useMemo(() => {
        return data.reduce((max, item) =>
            item.value > max.value ? item : max
        , { name: "None", value: 0 });
    }, [data]);

    /* 🎯 Convert % → angle for needle */
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const percentage = displayHighest.value;
    const angle = (percentage / total) * 180 - 90;

    /* ===== LOADING STATE ===== */
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* GAUGE LOADING */}
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="relative w-full lg:w-1/2 h-52">
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY LOADING */}
                    <div className="w-full lg:w-1/2 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            </div>
                        ))}
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
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Teacher Performance
                    </h3>
                </div>
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                    Failed to load performance data. Please try again later.
                </div>
            </motion.div>
        );
    }

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
                                data={data}
                                startAngle={180}
                                endAngle={0}
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>


                    {/* CENTER VALUE */}
                    <div className="absolute top-19 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                            {displayHighest.value}%
                        </p>
                        <p className="text-xs text-gray-500">
                            {displayHighest.name}
                        </p>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="w-full lg:w-1/2 space-y-3">
                    {data.map((item) => (
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
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </motion.div>
    );
};

export default Performance;
