import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ===== LECTURE DATA ===== */
const lecturesData = [
    {
        id: 1,
        class: "5B - Mathematics",
        time: "8:30 am - 9:10 am",
        chapter: "Shapes and Angles",
        color: "border-emerald-400",
    },
    {
        id: 2,
        class: "6A - Civics",
        time: "9:10 am - 9:50 am",
        chapter: "Understanding Diversity",
        color: "border-yellow-400",
    },
    {
        id: 3,
        class: "7C - Mathematics",
        time: "11:10 am - 11:50 am",
        chapter: "Integers",
        color: "border-sky-400",
    },
    {
        id: 4,
        class: "8A - Science",
        time: "12:00 pm - 12:40 pm",
        chapter: "Chemical Reactions",
        color: "border-violet-400",
    },
    {
        id: 5,
        class: "9B - Physics",
        time: "1:00 pm - 1:40 pm",
        chapter: "Motion",
        color: "border-rose-400",
    },
    {
        id: 6,
        class: "10A - Biology",
        time: "2:00 pm - 2:40 pm",
        chapter: "Life Processes",
        color: "border-amber-400",
    },
    {
        id: 7,
        class: "6C - Geography",
        time: "3:00 pm - 3:40 pm",
        chapter: "Resources",
        color: "border-teal-400",
    },
    {
        id: 8,
        class: "7A - English",
        time: "4:00 pm - 4:40 pm",
        chapter: "Poetry",
        color: "border-indigo-400",
    },
    {
        id: 9,
        class: "8C - History",
        time: "5:00 pm - 5:40 pm",
        chapter: "Colonial Rule",
        color: "border-orange-400",
    },
    {
        id: 10,
        class: "9A - Chemistry",
        time: "6:00 pm - 6:40 pm",
        chapter: "Acids & Bases",
        color: "border-pink-400",
    },
];

const TodayLectures = () => {
    const navigate = useNavigate();
    const [completed, setCompleted] = useState([]);

    const toggleComplete = (id) => {
        setCompleted((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

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
                    Today’s Lectures
                </h3>

                <button
                    onClick={() => navigate("/lectures")}
                    className="p-1 rounded-md hover:bg-gray-100"
                >
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* SCROLLABLE FRAME */}
            <div className="max-h-[450px] overflow-y-auto pr-2 custom-scroll">
                {lecturesData.map((lecture) => {
                    const isDone = completed.includes(lecture.id);

                    return (
                        <motion.div
                            key={lecture.id}
                            layout
                            whileHover={{ scale: 1.01 }}
                            className={`flex items-center gap-4 mb-3 p-4 rounded-xl bg-gray-50 border-l-4 ${lecture.color}`}
                        >
                            {/* CHECK */}
                            <button
                                onClick={() => toggleComplete(lecture.id)}
                                className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center"
                            >
                                <AnimatePresence>
                                    {isDone && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* CONTENT */}
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {lecture.class}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {lecture.time}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Chapter – {lecture.chapter}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* FOOTER */}
            <button
                onClick={() => navigate("/lectures")}
                className="mt-4 w-full text-sm text-indigo-600 font-medium hover:underline"
            >
                View all lectures
            </button>

            {/* SCROLLBAR STYLE */}
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

export default TodayLectures;
