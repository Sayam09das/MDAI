import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Users, GraduationCap, Star, TrendingUp, Award } from 'lucide-react';

const StatsBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({
        courses: 0,
        teachers: 0,
        students: 0,
        rating: 0,
    });
    const sectionRef = useRef(null);

    const finalStats = {
        courses: 500,
        teachers: 120,
        students: 10000,
        rating: 4.8,
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounts({
                courses: Math.floor(finalStats.courses * progress),
                teachers: Math.floor(finalStats.teachers * progress),
                students: Math.floor(finalStats.students * progress),
                rating: (finalStats.rating * progress).toFixed(1),
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setCounts({
                    courses: finalStats.courses,
                    teachers: finalStats.teachers,
                    students: finalStats.students,
                    rating: finalStats.rating,
                });
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [isVisible]);

    const formatNumber = (num) => {
        if (num >= 10000) {
            return `${(num / 1000).toFixed(0)}k`;
        }
        return num.toLocaleString();
    };

    const stats = [
        {
            icon: BookOpen,
            value: `${counts.courses}+`,
            label: 'Courses',
            color: 'from-indigo-500 to-indigo-600',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            description: 'Expert-led courses',
        },
        {
            icon: Users,
            value: `${counts.teachers}+`,
            label: 'Teachers',
            color: 'from-purple-500 to-purple-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            description: 'Verified instructors',
        },
        {
            icon: GraduationCap,
            value: `${formatNumber(counts.students)}+`,
            label: 'Students',
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            description: 'Active learners',
        },
        {
            icon: Star,
            value: counts.rating,
            label: 'Rating',
            color: 'from-yellow-500 to-yellow-600',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            description: 'Average satisfaction',
        },
    ];

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
                <div className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
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
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
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
                                        {isVisible && (
                                            <div className={`absolute inset-0 ${stat.iconBg} rounded-xl animate-ping opacity-20`} />
                                        )}
                                    </div>

                                    {/* Value */}
                                    <div className="text-center mb-2">
                                        <div className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                                            {stat.value}
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
                                            className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                                            style={{
                                                width: isVisible ? '100%' : '0%',
                                                transitionDelay: `${index * 150 + 500}ms`
                                            }}
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
                <div className={`mt-12 flex items-center justify-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}>
                    <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                </div>

                {/* Trust Badge */}
                <div className={`mt-8 text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
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