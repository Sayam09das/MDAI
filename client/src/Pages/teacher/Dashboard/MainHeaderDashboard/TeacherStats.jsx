import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Video, Wallet } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

/* ================= CONFIG ================= */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ================= COMPONENT ================= */
const TeacherStats = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        liveClasses: 0,
        earnings: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    /* ================= FETCH REAL DATA ================= */
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setError(true);
                    return;
                }

                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/dashboard/stats`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok || !data.success) {
                    setError(true);
                    return;
                }

                setStats(data.stats);
            } catch (err) {
                console.error("Dashboard stats error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    /* ================= UI CONFIG (REAL DATA MAPPING) ================= */
    const statsData = [
        {
            id: "courses",
            label: "Total Courses",
            value: stats.totalCourses,
            icon: BookOpen,
            bg: "bg-sky-50",
            iconColor: "text-sky-600",
        },
        {
            id: "students",
            label: "Total Students",
            value: stats.totalStudents,
            icon: Users,
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            id: "classes",
            label: "Live Classes",
            value: stats.liveClasses,
            icon: Video,
            bg: "bg-violet-50",
            iconColor: "text-violet-600",
        },
        {
            id: "earnings",
            label: "Earnings",
            value: stats.earnings,
            prefix: "$",
            icon: Wallet,
            bg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
    ];

    /* ================= LOADING UI ================= */
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-5 bg-white shadow-sm animate-pulse"
                    >
                        <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    /* ================= ERROR UI ================= */
    if (error) {
        return (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl">
                Failed to load dashboard statistics.
            </div>
        );
    }

    /* ================= MAIN UI ================= */
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {statsData.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            ease: "easeOut",
                        }}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            {/* TEXT */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    {stat.label}
                                </p>

                                <h3 className="mt-2 text-2xl font-semibold text-gray-900 flex items-center">
                                    {stat.prefix && (
                                        <span className="mr-1">
                                            {stat.prefix}
                                        </span>
                                    )}
                                    <NumberTicker value={stat.value} />
                                </h3>
                            </div>

                            {/* ICON */}
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
                            >
                                <Icon
                                    className={`w-6 h-6 ${stat.iconColor}`}
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TeacherStats;
