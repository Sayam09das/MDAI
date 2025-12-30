import React, { useState, useEffect, useRef } from 'react';
import {
    BookOpen, Users, GraduationCap, Video,
    TrendingUp, Award, Globe, Clock,
    CheckCircle, Star, Zap, Target
} from 'lucide-react';

const Stats = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({
        courses: 0,
        teachers: 0,
        students: 0,
        sessions: 0
    });
    const sectionRef = useRef(null);

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

        return () => observer.disconnect();
    }, []);

    // Animated counter
    useEffect(() => {
        if (isVisible) {
            const targets = {
                courses: 1500,
                teachers: 250,
                students: 50000,
                sessions: 10000
            };

            const duration = 2000;
            const steps = 60;
            const stepDuration = duration / steps;

            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setCounts({
                    courses: Math.floor(targets.courses * progress),
                    teachers: Math.floor(targets.teachers * progress),
                    students: Math.floor(targets.students * progress),
                    sessions: Math.floor(targets.sessions * progress)
                });

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setCounts(targets);
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }
    }, [isVisible]);

    const mainStats = [
        {
            id: 1,
            icon: BookOpen,
            value: counts.courses,
            suffix: '+',
            label: 'Courses Available',
            description: 'Comprehensive courses across multiple domains',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            id: 2,
            icon: Users,
            value: counts.teachers,
            suffix: '+',
            label: 'Expert Teachers',
            description: 'Industry professionals & certified educators',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            id: 3,
            icon: GraduationCap,
            value: counts.students,
            suffix: '+',
            label: 'Students Enrolled',
            description: 'Learners from around the globe',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            id: 4,
            icon: Video,
            value: counts.sessions,
            suffix: '+',
            label: 'Live Sessions',
            description: 'Interactive classes conducted successfully',
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        }
    ];

    const achievements = [
        {
            icon: Award,
            title: 'Best EdTech Platform 2024',
            organization: 'Education Innovation Awards',
            year: '2024'
        },
        {
            icon: Star,
            title: '4.9/5 Average Rating',
            organization: 'Based on 10,000+ Reviews',
            year: '2024'
        },
        {
            icon: Globe,
            title: 'Global Reach',
            organization: 'Students in 150+ Countries',
            year: '2024'
        },
        {
            icon: TrendingUp,
            title: '300% Year-over-Year Growth',
            organization: 'Fastest Growing Platform',
            year: '2024'
        }
    ];

    const milestones = [
        { year: '2020', event: 'Platform Launch', value: '1K Students' },
        { year: '2021', event: 'Expanded Catalog', value: '10K Students' },
        { year: '2022', event: 'Global Expansion', value: '25K Students' },
        { year: '2023', event: 'AI Integration', value: '40K Students' },
        { year: '2024', event: 'Market Leader', value: '50K+ Students' }
    ];

    const StatCard = ({ stat, index }) => {
        const Icon = stat.icon;

        return (
            <div
                className={`group relative transition-all duration-700 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'
                    }`}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <div className="relative bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-transparent">
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    <div className="relative p-8 md:p-10">
                        {/* Icon */}
                        <div className="mb-6">
                            <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${stat.color} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl`}>
                                <Icon className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Value */}
                        <div className="mb-4">
                            <div className="flex items-end gap-1">
                                <span className="text-5xl md:text-6xl font-bold text-gray-900 tabular-nums">
                                    {stat.value.toLocaleString()}
                                </span>
                                <span className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
                                    {stat.suffix}
                                </span>
                            </div>
                        </div>

                        {/* Label */}
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                            {stat.label}
                        </h3>

                        {/* Description */}
                        <p className="text-base text-gray-600 leading-relaxed">
                            {stat.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: isVisible ? '100%' : '0%' }}
                            ></div>
                        </div>
                    </div>

                    {/* Corner Glow */}
                    <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${stat.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                </div>
            </div>
        );
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className={`text-center mb-16 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            Our Achievements
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Growing Stronger{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                            Every Day
                        </span>
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Numbers that tell our story of impact, innovation, and commitment to education excellence
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {mainStats.map((stat, index) => (
                        <StatCard key={stat.id} stat={stat} index={index} />
                    ))}
                </div>

                {/* Achievements Grid */}
                <div className={`mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                        Recent Achievements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {achievements.map((achievement, index) => {
                            const Icon = achievement.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <Icon className="w-10 h-10 text-indigo-600 mb-4" />
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        {achievement.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {achievement.organization}
                                    </p>
                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
                                        {achievement.year}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline */}
                <div className={`mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                        Our Journey
                    </h3>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2"></div>

                        <div className="space-y-8 md:space-y-12">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Content */}
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'
                                            }`} style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                                            <div className="text-sm font-bold text-indigo-600 mb-2">
                                                {milestone.year}
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                {milestone.event}
                                            </h4>
                                            <p className="text-gray-600">{milestone.value}</p>
                                        </div>
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="hidden md:flex items-center justify-center flex-shrink-0">
                                        <div className="w-6 h-6 bg-white border-4 border-indigo-600 rounded-full shadow-lg animate-pulse-glow"></div>
                                    </div>

                                    {/* Spacer */}
                                    <div className="flex-1 hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className={`text-center ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '30px 30px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <Target className="w-16 h-16 md:w-20 md:h-20 text-white mx-auto mb-6 animate-float" />

                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                                Be Part of Our Success Story
                            </h3>

                            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Join thousands of learners and educators who are already part of this incredible journey
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                                    Start Learning Today
                                    <CheckCircle className="w-6 h-6" />
                                </button>

                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto">
                                    View All Courses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;