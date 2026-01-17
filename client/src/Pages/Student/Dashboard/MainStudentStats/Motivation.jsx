import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Motivation = () => {
    const navigate = useNavigate();

    const [quote, setQuote] = useState(null);
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

    /* ================= DAILY MOTIVATION ================= */
    useEffect(() => {
        if (!currentUser) return;
        if (currentUser.role !== "student") return;

        const today = new Date().toISOString().split("T")[0];
        const saved = JSON.parse(localStorage.getItem("dailyMotivation"));

        if (saved && saved.date === today) {
            setQuote(saved.quote);
            return;
        }

        fetch(`https://corsproxy.io/?https://zenquotes.io/api/random`)
            .then((res) => res.json())
            .then((data) => {
                const newQuote = {
                    text: data[0].q,
                    author: data[0].a,
                };

                localStorage.setItem(
                    "dailyMotivation",
                    JSON.stringify({ date: today, quote: newQuote })
                );

                setQuote(newQuote);
            })
            .catch(() => {
                setQuote({
                    text: "Consistency beats motivation when motivation fades.",
                    author: "Daily Wisdom",
                });
            });
    }, [currentUser]);

    /* ================= GUARDS ================= */
    if (loading) return null;
    if (!currentUser) return null;
    if (currentUser.role !== "student") return null;
    if (!quote) return null;

    /* ================= UI ================= */
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full mt-5"
        >
            <div className="rounded-2xl p-7 bg-gradient-to-r from-sky-50 via-emerald-50 to-lime-50">
                <h3 className="text-lg font-semibold text-gray-900">
                    Hello {currentUser.fullName || currentUser.name} 👋
                </h3>

                <p className="mt-4 text-xl text-gray-800 italic">
                    “{quote.text}”
                </p>

                <p className="mt-3 text-lg text-gray-700 font-medium">
                    — {quote.author}
                </p>
            </div>
        </motion.div>
    );
};

export default Motivation;
