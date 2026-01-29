import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Motivation = () => {
    const navigate = useNavigate();

    const [quote, setQuote] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

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
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    /* ================= DAILY MOTIVATION ================= */
    useEffect(() => {
        let mounted = true;

        const fetchQuote = async () => {
            const today = new Date().toISOString().split("T")[0]; // safer date
            const saved = JSON.parse(localStorage.getItem("dailyMotivation"));

            if (saved && saved.date === today) {
                if (mounted) setQuote(saved.quote);
                return;
            }

            // Try primary source (direct). Avoid unreliable public proxies.
            try {
                const res = await fetch(`https://zenquotes.io/api/random`);
                if (res.ok) {
                    const data = await res.json();
                    const newQuote = { text: data[0].q, author: data[0].a };
                    localStorage.setItem(
                        "dailyMotivation",
                        JSON.stringify({ date: today, quote: newQuote })
                    );
                    if (mounted) setQuote(newQuote);
                    return;
                }
            } catch (err) {
                // fall through to secondary source
            }

            // Secondary source: quotable (CORS-friendly)
            try {
                const res2 = await fetch("https://api.quotable.io/random");
                if (res2.ok) {
                    const d = await res2.json();
                    const newQuote = { text: d.content, author: d.author };
                    localStorage.setItem(
                        "dailyMotivation",
                        JSON.stringify({ date: today, quote: newQuote })
                    );
                    if (mounted) setQuote(newQuote);
                    return;
                }
            } catch (err) {
                // fall through to local fallback
            }

            // Local fallback
            const fallback = {
                text: "Consistency beats motivation when motivation fades.",
                author: "Daily Wisdom",
            };
            if (mounted) setQuote(fallback);
        };

        fetchQuote();

        return () => {
            mounted = false;
        };
    }, []);

    if (!quote || !currentUser) return null;

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
                    Hello {currentUser.fullName || currentUser.name} 👋
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

export default Motivation;
