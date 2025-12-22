import React, { useState, useEffect } from "react";
import { BookOpen, Play, CheckCircle, X } from "lucide-react";

const Viedopage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const videoId = "dQw4w9WgXcQ"; // change this

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // ESC key close
    useEffect(() => {
        const escHandler = (e) => {
            if (e.key === "Escape") setShowVideo(false);
        };
        window.addEventListener("keydown", escHandler);
        return () => window.removeEventListener("keydown", escHandler);
    }, []);

    // Disable scroll when modal open
    useEffect(() => {
        document.body.style.overflow = showVideo ? "hidden" : "auto";
    }, [showVideo]);

    return (
        <>
            {/* ================= VIDEO POPUP ================= */}
            {showVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setShowVideo(false)}
                    />

                    {/* Video Box */}
                    <div className="relative w-full max-w-5xl mx-4 aspect-video bg-black rounded-2xl overflow-hidden animate-[scaleIn_0.25s_ease-out]">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        {/* Video */}
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            title="Course Video"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* ================= MAIN CONTENT ================= */}
            <div className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">

                    {/* ================= VIDEO PREVIEW ================= */}
                    <div
                        onClick={() => setShowVideo(true)}
                        className="relative aspect-video rounded-2xl overflow-hidden mb-6 cursor-pointer group"
                    >
                        {/* Thumbnail */}
                        <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt="Video Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl
                                group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" />
                            </div>
                        </div>

                        {/* LIVE Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                            LIVE
                        </div>

                        {/* Info Bar */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Advanced React Patterns</span>
                                <span className="text-xs">245 watching</span>
                            </div>
                        </div>
                    </div>

                    {/* ================= COURSE CARDS ================= */}
                    <div className="space-y-3">
                        {[
                            { title: "Web Development Bootcamp", students: "1.2K", rating: "4.9" },
                            { title: "Data Science Masterclass", students: "890", rating: "4.8" },
                        ].map((course, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">{course.title}</div>
                                        <div className="text-xs text-gray-600">{course.students} students</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-semibold text-sm">{course.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= FLOATING BADGE ================= */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                            <div className="text-xs font-semibold">Verified Teachers</div>
                            <div className="text-xs text-gray-600">100% Certified</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline animation (JSX only) */}
            <style>
                {`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                `}
            </style>
        </>
    );
};

export default Viedopage;
