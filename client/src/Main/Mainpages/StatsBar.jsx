import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Users, GraduationCap, Star, TrendingUp, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Get backend URL
const getBackendURL = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl && envUrl.trim() !== '' && envUrl !== 'undefined') {
        return envUrl.replace(/\/+$/, '');
    }
    if (import.meta.env.PROD || import.meta.env.NODE_ENV === 'production') {
        return 'https://mdai-self.vercel.app';
    }
    return 'http://localhost:5000';
};

const BACKEND_URL = getBackendURL();

const StatsBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [platformStats, setPlatformStats] = useState({
        courses: 0,
        teachers: 0,
        students: 0,
        rating: 0,
    });
    const [displayCounts, setDisplayCounts] = useState({
        courses: 0,
        teachers: 0,
        students: 0,
        rating: 0,
    });
    
    // Refs for GSAP
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const statsRef = useRef([]);
    const separatorRef = useRef(null);
    const trustRef = useRef(null);

    // Default fallback values
    const defaultStats = {
        courses: 500,
        teachers: 120,
        students: 10000,
        rating: 4.8,
    };

    // Fetch real stats from backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/courses/public-stats`);
                const data = await response.json();
                
                if (response.ok && data.stats) {
                    setPlatformStats({
                        courses: data.stats.courses || 0,
                        teachers: data.stats.teachers || 0,
                        students: data.stats.students || 0,
                        rating: data.stats.rating || 4.8,
                    });
                } else {
                    setPlatformStats(defaultStats);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setPlatformStats(defaultStats);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // GSAP Scroll Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Stats cards stagger animation
            if (statsRef.current.length > 0) {
                gsap.fromTo(statsRef.current,
                    { opacity: 0, y: 60, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: statsRef.current[0],
                            start: "top 85%",
                        }
                    }
                );
            }

            // Separator line animation
            gsap.fromTo(separatorRef.current,
                { opacity: 0, scaleX: 0 },
                {
                    opacity: 1,
                    scaleX: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: separatorRef.current,
                        start: "top 90%",
                    }
                }
            );

            // Trust badge animation
            gsap.fromTo(trustRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: trustRef.current,
                        start: "top 95%",
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [loading]);

    // Animation effect using real data (count up)
    useEffect(() => {
        if (loading) return;

        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setDisplayCounts({
                courses: Math.floor(platformStats.courses * progress),
                teachers: Math.floor(platformStats.teachers * progress),
                students: Math.floor(platformStats.students * progress),
                rating: (platformStats.rating * progress).toFixed(1),
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setDisplayCounts({
                    courses: platformStats.courses,
                    teachers: platformStats.teachers,
                    students: platformStats.students,
                    rating: platformStats.rating,
                });
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [loading, platformStats]);

    const formatNumber = (num) => {
        if (num >= 10000) {
            return `${(num / 1000).toFixed(0)}k`;
        }
        return num.toLocaleString();
    };

    const currentCounts = loading ? { courses: 0, teachers: 0, students: 0, rating: 0 } : 
                         (displayCounts.courses > 0 || displayCounts.teachers > 0 ? displayCounts : platformStats);

    const statsItems = [
        {
            icon: BookOpen,
            value: `${currentCounts.courses}+`,
            label: 'Courses',
            color: 'from-indigo-500 to-indigo-600',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            description: 'Expert-led courses',
        },
        {
            icon: Users,
            value: `${currentCounts.teachers}+`,
            label: 'Teachers',
            color: 'from-purple-500 to-purple-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            description: 'Verified instructors',
        },
        {
            icon: GraduationCap,
            value: `${formatNumber(currentCounts.students)}+`,
            label: 'Students',
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            description: 'Active learners',
        },
        {
            icon: Star,
            value: currentCounts.rating,
            label: 'Rating',
            color: 'from-yellow-500 to-yellow-600',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            description: 'Average satisfaction',
        },
    ];

    // Add ref to stats array
    const addToStatsRef = (el) => {
        if (el && !statsRef.current.includes(el)) {
            statsRef.current.push(el);
        }
    };

    return (
        <div
            ref={sectionRef}
            className="relative py-12 md:py-16 bg-white border-y border-gray-200 overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #4F46E5 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            {/* Floating Background Shapes */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Our Impact</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Trusted by Thousands
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join a thriving community of learners and educators
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {statsItems.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                ref={addToStatsRef}
                                className="group relative"
                            >
                                {/* Card */}
                                <div className="relative bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

                                    {/* Gradient Border Effect on Hover */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                    {/* Icon */}
                                    <div className="relative flex items-center justify-center mb-4">
                                        <div className={`${stat.iconBg} w-14 h-14 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                            <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                                        </div>

                                        {/* Pulsing Ring */}
                                        <div className={`absolute inset-0 ${stat.iconBg} rounded-xl animate-ping opacity-20`} />
                                    </div>

                                    {/* Value */}
                                    <div className="text-center mb-2">
                                        <div className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                                            {loading ? (
                                                <div className="h-12 w-24 bg-gray-200 animate-pulse rounded mx-auto"></div>
                                            ) : (
                                                stat.value
                                            )}
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900 mb-1">
                                            {stat.label}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {stat.description}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${stat.color}`}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>

                                {/* Decorative Corner */}
                                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${stat.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center`}>
                                    <Award className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Separator Line */}
                <div ref={separatorRef} className="mt-12 flex items-center justify-center">
                    <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                </div>

                {/* Trust Badge */}
                <div ref={trustRef} className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span>Certified by leading educational boards</span>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(20px) translateX(-10px);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
        </div>
    );
};

export default StatsBar;

