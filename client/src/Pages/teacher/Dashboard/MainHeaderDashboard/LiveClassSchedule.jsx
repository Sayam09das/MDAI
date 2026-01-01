import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    Video,
    Calendar,
    Clock,
    PlusCircle,
    Play,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const liveClasses = [
    {
        id: 1,
        title: "React Mastery – Live Q&A",
        date: "Today",
        time: "6:00 PM - 7:00 PM",
        status: "live",
    },
    {
        id: 2,
        title: "Node.js Backend – API Design",
        date: "Tomorrow",
        time: "4:00 PM - 5:30 PM",
        status: "upcoming",
    },
    {
        id: 3,
        title: "Full Stack MERN – Deployment",
        date: "12 Jan 2026",
        time: "7:00 PM - 8:30 PM",
        status: "upcoming",
    },
];

const LiveClassSchedule = () => {
    const handleStart = (title) => {
        toast.success(`Starting class: ${title}`, {
            autoClose: 2500,
            position: "top-right",
        });
    };

    const handleCreate = () => {
        toast.info("Redirecting to Create Live Class...", {
            autoClose: 2000,
        });
    };

    return (
        <div className="w-full px-4 md:px-8 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Live Classes & Schedule
                    </h2>
                    <p className="text-sm text-gray-500">
                        Manage your upcoming and live sessions
                    </p>
                </div>

                {/* Create CTA */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreate}
                    className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700"
                >
                    <PlusCircle size={18} />
                    Create Live Class
                </motion.button>
            </motion.div>

            {/* Live Classes List */}
            <div className="space-y-4">
                {liveClasses.map((cls, index) => (
                    <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-md border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        {/* Left Info */}
                        <div className="flex items-start gap-4">
                            <div
                                className={`p-3 rounded-full ${cls.status === "live"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-indigo-100 text-indigo-600"
                                    }`}
                            >
                                <Video />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {cls.title}
                                </h3>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {cls.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {cls.time}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {cls.status === "live" ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStart(cls.title)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                                >
                                    <Play size={16} />
                                    Join Live
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStart(cls.title)}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                                >
                                    Start Class
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default LiveClassSchedule;
