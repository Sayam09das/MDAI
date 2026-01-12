import React, { useState, useEffect } from "react";
import { BookOpen, Video, FileText, Sparkles } from "lucide-react";
import Viedopage from "./Viedopage";
import { WordRotate } from "@/components/ui/word-rotate";
import { NumberTicker } from "@/components/ui/number-ticker";
import AnnouncementMarquee from "../AnnouncementMarquee/AnnouncementMarquee";

const MainHeader = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const [counts, setCounts] = useState({
        students: 10000,
        courses: 500,
        teachers: 100,
    });

    useEffect(() => {
        setIsVisible(true);

        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const features = [
        { icon: Video, text: "Live Classes", color: "text-indigo-600" },
        { icon: BookOpen, text: "Expert Courses", color: "text-blue-600" },
        { icon: FileText, text: "Study Materials", color: "text-purple-600" },
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-3">
            <AnnouncementMarquee />
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-30"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                />
                <div
                    className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"
                    style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* LEFT */}
                <div
                    className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow border">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">
                            AI-Powered Learning
                        </span>
                    </div>

                    {/* HEADLINE */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 flex flex-wrap items-center gap-x-3 leading-tight">
                        <span>Learn from</span>

                        {/* FIXED WordRotate */}
                        <span className="inline-flex items-center min-w-[200px] h-[1.2em] overflow-hidden">
                            <WordRotate
                                words={["Expert", "Industry", "Top", "Verified"]}
                                duration={2200}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                            />
                        </span>

                        <span>Teachers, Live & Anytime</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
                        Courses, live classes, PDFs, and real-time learning — all in one
                        platform. Start your journey today.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow border"
                                >
                                    <Icon className={`w-4 h-4 ${f.color}`} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {f.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats (NumberTicker) */}
                    <div className="flex gap-8 pt-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">
                                <NumberTicker value={counts.students} />
                            </div>
                            <div className="text-sm text-gray-600">Students</div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                <NumberTicker value={counts.courses} />
                            </div>
                            <div className="text-sm text-gray-600">Courses</div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                <NumberTicker value={counts.teachers} />
                            </div>
                            <div className="text-sm text-gray-600">Teachers</div>
                        </div>
                    </div>

                </div>

                {/* RIGHT */}
                <Viedopage />
            </div>
        </div>
    );
};

export default MainHeader;
