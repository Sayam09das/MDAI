import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ===== CONFIG ===== */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");



const TodayLectures = () => {
    const navigate = useNavigate();
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [completed, setCompleted] = useState([]);

    /* ===== FETCH DATA FROM BACKEND ===== */
    useEffect(() => {
        const fetchTodayLectures = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) {
                    setError(true);
                    return;
                }

                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/dashboard/today-lectures`,
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

                if (responseData.lectures && responseData.lectures.length > 0) {
                    setLectures(responseData.lectures);
                }
            } catch (err) {
                console.error("Today's lectures fetch error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayLectures();
    }, []);

    const toggleComplete = (id) => {
        setCompleted((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    /* ===== LOADING STATE ===== */
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* LIST LOADING */}
                <div className="max-h-[450px] overflow-y-auto pr-2 custom-scroll space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border-l-4 border-gray-200"
                        >
                            <div className="w-6 h-6 rounded-full border border-gray-300 bg-gray-200"></div>
                            <div className="flex-1">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
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
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Today's Lectures
                    </h3>
                </div>
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                    Failed to load lectures. Please try again later.
                </div>
            </motion.div>
        );
    }

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
                    Today's Lectures
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
                {lectures.map((lecture) => {
                    const isDone = completed.includes(lecture.id);

                    return (
                        <motion.div
                            key={lecture.id}
                            layout
                            whileHover={{ scale: 1.01 }}
                            className={`flex items-center gap-4 mb-3 p-4 rounded-xl bg-gray-50 border-l-4 ${lecture.color || "border-gray-400"}`}
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

