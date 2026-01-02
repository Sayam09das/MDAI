import React from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Users,
    Video,
    Wallet,
} from "lucide-react";

/* ===== Stats Data (replace with API later) ===== */
const stats = [
    {
        id: 1,
        label: "Total Courses",
        value: 12,
        icon: BookOpen,
        bg: "bg-sky-50",
        iconColor: "text-sky-600",
    },
    {
        id: 2,
        label: "Total Students",
        value: "1,240",
        icon: Users,
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: 3,
        label: "Live Classes",
        value: 6,
        icon: Video,
        bg: "bg-violet-50",
        iconColor: "text-violet-600",
    },
    {
        id: 4,
        label: "Earnings",
        value: "₹42,500",
        icon: Wallet,
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
];

const TeacherStats = () => {
    return (
        <div className="w-full mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
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
                                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                                        {stat.value}
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
