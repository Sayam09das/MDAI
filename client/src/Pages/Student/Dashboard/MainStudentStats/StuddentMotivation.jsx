import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StudentMotivation = () => {
    const navigate = useNavigate();

    const [quote, setQuote] = useState(null);
    const [student, setStudent] = useState(null);

    /* ================= FETCH STUDENT ================= */
    useEffect(() => {
        const fetchStudent = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Unauthorized");

                const data = await res.json();
                setStudent(data.user);
            } catch (error) {
                localStorage.clear();
                navigate("/login");
            }
        };

        fetchStudent();
    }, [navigate]);

    /* ================= DAILY STUDENT MOTIVATION ================= */
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const saved = JSON.parse(localStorage.getItem("dailyStudentMotivation"));

        if (saved && saved.date === today) {
            setQuote(saved.quote);
            return;
        }

        fetch("https://api.quotable.io/random?tags=education|inspirational")
            .then((res) => res.json())
            .then((data) => {
                const newQuote = {
                    text: data.content,
                    author: data.author,
                };

                localStorage.setItem(
                    "dailyStudentMotivation",
                    JSON.stringify({ date: today, quote: newQuote })
                );

                setQuote(newQuote);
            })
            .catch(() => {
                setQuote({
                    text: "Small steps every day lead to big academic success.",
                    author: "Student Wisdom",
                });
            });
    }, []);

    if (!quote || !student) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mt-4 sm:mt-5"
        >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 shadow-sm">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1">
                        Daily Motivation
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Hello, {student.fullName || student.name} 👋
                    </p>
                </motion.div>

                {/* QUOTE */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-4 sm:mt-5"
                >
                    <div className="relative">
                        {/* Quote Icon */}
                        <svg
                            className="absolute -left-1 -top-1 w-6 h-6 sm:w-8 sm:h-8 text-indigo-300 opacity-50"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed pl-6 sm:pl-8 pr-2 sm:pr-4">
                            {quote.text}
                        </p>
                    </div>
                </motion.div>

                {/* AUTHOR */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-700 font-medium text-right pr-2 sm:pr-4"
                >
                    — {quote.author}
                </motion.p>

                {/* DECORATION - Simple Circle Pattern */}
                <div className="absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-6 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-indigo-200 rounded-full opacity-20 blur-2xl" />
                <div className="absolute -right-2 -bottom-2 sm:-right-3 sm:-bottom-3 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-200 rounded-full opacity-30 blur-xl" />
            </div>
        </motion.div>
    );
};

export default StudentMotivation;