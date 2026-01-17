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

        fetch("https://type.fit/api/quotes")
            .then((res) => res.json())
            .then((data) => {
                // filter for short & meaningful student quotes
                const filtered = data.filter(
                    (q) => q.text && q.text.length < 120
                );

                const randomQuote =
                    filtered[Math.floor(Math.random() * filtered.length)];

                const newQuote = {
                    text: randomQuote.text,
                    author: randomQuote.author || "Unknown Mentor",
                };

                localStorage.setItem(
                    "dailyStudentMotivation",
                    JSON.stringify({ date: today, quote: newQuote })
                );

                setQuote(newQuote);
            })
            .catch(() => {
                setQuote({
                    text: "Study a little every day, and big dreams will follow.",
                    author: "Student Wisdom",
                });
            });
    }, []);


    if (!quote || !student) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full mt-5"
        >
            <div className="relative overflow-hidden rounded-2xl p-7 bg-gradient-to-r from-sky-50 via-emerald-50 to-lime-50">

                {/* HEADER */}
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Hello {student.fullName || student.name} 👋
                </h3>

                {/* QUOTE */}
                <p className="mt-4 text-lg md:text-xl text-gray-800 leading-relaxed italic">
                    “{quote.text}”
                </p>

                {/* AUTHOR */}
                <p className="mt-3 text-base md:text-lg text-gray-700 font-medium">
                    — {quote.author}
                </p>

                {/* DECORATION */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 hidden sm:block">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
                            fill="#22c55e"
                        />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentMotivation;
