import React from "react";
import { motion } from "framer-motion";
import {
    Award,
    Palette,
    ShieldCheck,
    Lightbulb,
} from "lucide-react";

/* ===== ACTIVITY DATA ===== */
const activities = [
    {
        id: 1,
        title: "Academic Highlight",
        description: "Richard Mathews completed a well-researched history assignment.",
        icon: Award,
        color: "bg-yellow-100 text-yellow-600",
        date: "Jan 16, 2026",
        time: "12:30 pm",
    },
    {
        id: 2,
        title: "Creative Excellence",
        description: "Sonia Paul created a stunning, mixed-media landscape artwork.",
        icon: Palette,
        color: "bg-green-100 text-green-600",
        date: "Jan 08, 2026",
        time: "12:30 pm",
    },
    {
        id: 3,
        title: "Classroom Star",
        description: "Arjun Malhotra actively participated in weekly discussions.",
        icon: ShieldCheck,
        color: "bg-blue-100 text-blue-600",
        date: "Jan 02, 2026",
        time: "12:30 pm",
    },
    {
        id: 4,
        title: "STEM Achievement",
        description: "Kaitlyn D. Steven built an innovative physics model.",
        icon: Lightbulb,
        color: "bg-purple-100 text-purple-600",
        date: "Dec 16, 2025",
        time: "12:30 pm",
    },
    {
        id: 5,
        title: "Research Success",
        description: "Daniel Chen submitted a high-quality science research paper.",
        icon: Award,
        color: "bg-orange-100 text-orange-600",
        date: "Dec 20, 2025",
        time: "12:30 pm",
    },
      {
        id: 5,
        title: "Research Success",
        description: "Daniel Chen submitted a high-quality science research paper.",
        icon: Award,
        color: "bg-orange-100 text-orange-600",
        date: "Dec 20, 2025",
        time: "12:30 pm",
    },
];

const StudentActivity = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Student Activity
                </h3>

                <button className="text-sm text-indigo-600 hover:underline">
                    View All
                </button>
            </div>

            {/* ACTIVITY LIST */}
            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 custom-scroll">
                {activities.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.id}
                            className="flex items-start justify-between gap-4"
                        >
                            {/* LEFT */}
                            <div className="flex items-start gap-3 flex-1">
                                {/* ICON */}
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* TEXT */}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="text-right text-xs text-gray-400 whitespace-nowrap">
                                <p>{item.date}</p>
                                <p>{item.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SCROLLBAR */}
            <style>{`
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 6px;
                }
            `}</style>
        </motion.div>
    );
};

export default StudentActivity;