import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Users,
    Video,
    Wallet,
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

/* ===== Stats Component with Real-time Data ===== */
const TeacherStats = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        liveClasses: 0,
        earnings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/teacher/dashboard/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch teacher stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statsData = [
        {
            id: 1,
            label: "Total Courses",
            value: stats.totalCourses,
            icon: BookOpen,
            bg: "bg-sky-50",
            iconColor: "text-sky-600",
        },
        {
            id: 2,
            label: "Total Students",
            value: stats.totalStudents,
            icon: Users,
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            id: 3,
            label: "Live Classes",
            value: stats.liveClasses,
            icon: Video,
            bg: "bg-violet-50",
            iconColor: "text-violet-600",
        },
        {
            id: 4,
            label: "Earnings",
            value: stats.earnings,
            prefix: "₹",
            icon: Wallet,
            bg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
    ];

    if (loading) {
        return (
            <div className="w-full mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="rounded-2xl p-5 bg-white shadow-sm animate-pulse"
                        >
                            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            className={`
                                rounded-2xl
                                p-5
                                bg-white
                                shadow-sm
                                hover:shadow-md
                                transition
                            `}
                        >
                            <div className="flex items-center justify-between">
                                {/* TEXT */}
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {stat.label}
                                    </p>

                                    <h3 className="mt-2 text-2xl font-semibold text-gray-900 flex items-center">
                                        {stat.prefix && <span className="mr-1">{stat.prefix}</span>}

                                        <NumberTicker
                                            value={stat.value}
                                            className="tracking-tight"
                                        />
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
        </div>
    );
};

export default TeacherStats;
