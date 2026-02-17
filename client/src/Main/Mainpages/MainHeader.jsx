import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Video, FileText, Sparkles } from "lucide-react";
import Viedopage from "./Viedopage";
import { WordRotate } from "@/components/ui/word-rotate";
import { NumberTicker } from "@/components/ui/number-ticker";
import AnnouncementMarquee from "../AnnouncementMarquee/AnnouncementMarquee";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const MainHeader = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const [counts, setCounts] = useState({
        students: 10000,
        courses: 500,
        teachers: 100,
    });

    // Refs for GSAP animations
    const containerRef = useRef(null);
    const badgeRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);
    const videoRef = useRef(null);
    const blob1Ref = useRef(null);
    const blob2Ref = useRef(null);
    const leftContentRef = useRef(null);

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

    // GSAP Entrance Animations on Load
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Badge animation
            gsap.fromTo(badgeRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
            );

            // Title animation
            gsap.fromTo(titleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 }
            );

            // Subtitle animation
            gsap.fromTo(subtitleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.6 }
            );

            // Features animation (stagger)
            gsap.fromTo(featuresRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.8 }
            );

            // Stats animation (stagger)
            gsap.fromTo(statsRef.current.children,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)", delay: 1 }
            );

            // Video animation
            gsap.fromTo(videoRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Scroll-triggered Parallax Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax for blob 1 - moves at different speed
            gsap.to(blob1Ref.current, {
                y: -150,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });

            // Parallax for blob 2 - opposite direction
            gsap.to(blob2Ref.current, {
                y: -100,
                x: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5
                }
            });

            // Left content reveal on scroll
            gsap.fromTo(leftContentRef.current,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        end: "top 30%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Video parallax - moves slightly on scroll
            gsap.fromTo(videoRef.current,
                { opacity: 0.5, scale: 0.9, y: 50 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        end: "top 20%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Stats counter animation on scroll
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 85%",
                        end: "top 50%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const features = [
        { icon: Video, text: "Live Classes", color: "text-indigo-600" },
        { icon: BookOpen, text: "Expert Courses", color: "text-blue-600" },
        { icon: FileText, text: "Study Materials", color: "text-purple-600" },
    ];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-3" style={{ perspective: "1000px" }}>
            <div className="mt-20">
                <AnnouncementMarquee />
            </div>
            {/* Background blobs with parallax */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    ref={blob1Ref}
                    className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-40"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                />
                <div
                    ref={blob2Ref}
                    className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-40"
                    style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
                />
                {/* Additional decorative blobs */}
                <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* LEFT */}
                <div
                    ref={leftContentRef}
                    className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    {/* Badge */}
                    <div ref={badgeRef} className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow border hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">
                            AI-Powered Learning
                        </span>
                    </div>

                    {/* HEADLINE */}
                    <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 flex flex-wrap items-center gap-x-3 leading-tight">
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
                    <p ref={subtitleRef} className="text-lg sm:text-xl text-gray-600 max-w-xl">
                        Courses, live classes, PDFs, and real-time learning — all in one
                        platform. Start your journey today.
                    </p>

                    {/* Features */}
                    <div ref={featuresRef} className="flex flex-wrap gap-3">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
                    <div ref={statsRef} className="flex gap-8 pt-4">
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
                <div ref={videoRef} className="transform-style-3d">
                    <Viedopage />
                </div>
            </div>
        </div>
    );
};

export default MainHeader;
