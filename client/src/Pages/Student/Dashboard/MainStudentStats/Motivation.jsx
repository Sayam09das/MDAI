import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FALLBACK_QUOTE = {
    text: "Consistency beats motivation when motivation fades.",
    author: "Daily Wisdom",
};

const Motivation = () => {
    const navigate = useNavigate();

    const [quote, setQuote] = useState(FALLBACK_QUOTE);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH USER ================= */
    useEffect(() => {
        const fetchCurrentUser = async () => {
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
                setCurrentUser(data.user);
            } catch (error) {
                localStorage.clear();
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    /* ================= DAILY MOTIVATION (STUDENT ONLY) ================= */
    useEffect(() => {
        if (!currentUser || currentUser.role !== "student") return;

        const today = new Date().toISOString().split("T")[0];
        const saved = JSON.parse(localStorage.getItem("dailyMotivation"));

        if (saved && saved.date === today) {
            setQuote(saved.quote);
            return;
        }

        fetch("https://zenquotes.io/api/random")
            .then((res) => res.json())
            .then((data) => {
                const newQuote = {
                    text: data?.[0]?.q || FALLBACK_QUOTE.text,
                    author: data?.[0]?.a || FALLBACK_QUOTE.author,
                };

                localStorage.setItem(
                    "dailyMotivation",
                    JSON.stringify({ date: today, quote: newQuote })
                );

                setQuote(newQuote);
            })
            .catch(() => {
                // API failed → fallback (NO WHITE PAGE)
                setQuote(FALLBACK_QUOTE);
            });
    }, [currentUser]);

    /* ================= SAFE RENDER ================= */
    if (loading) return <div className="h-24" />;
    if (!currentUser || currentUser.role !== "student") return <div className="h-24" />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full mt-5"
        >
            <div className="relative overflow-hidden rounded-2xl p-7 bg-gradient-to-r from-sky-50 via-emerald-50 to-lime-50">

                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Hello {currentUser.fullName || currentUser.name} 👋
                </h3>

                <p className="mt-4 text-lg md:text-xl text-gray-800 italic leading-relaxed">
                    “{quote.text}”
                </p>

                <p className="mt-3 text-base md:text-lg text-gray-700 font-medium">
                    — {quote.author}
                </p>

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

export default Motivation;
