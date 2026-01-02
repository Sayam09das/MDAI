import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Motivation = ({ teacherName = "Pyana" }) => {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const today = new Date().toDateString();
        const saved = JSON.parse(localStorage.getItem("dailyMotivation"));

        if (saved && saved.date === today) {
            setQuote(saved.quote);
            return;
        }

        fetch("https://corsproxy.io/?https://zenquotes.io/api/random")
            .then(res => res.json())
            .then(data => {
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
                    text: "Every teacher has the power to inspire greatness.",
                    author: "Education Wisdom",
                });
            });
    }, []);

    if (!quote) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full mt-5"
        >

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    p-7
                    bg-gradient-to-r
                    from-sky-50
                    via-emerald-50
                    to-lime-50
                "
            >
                {/* HEADER */}
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Hello {teacherName} 👋
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
