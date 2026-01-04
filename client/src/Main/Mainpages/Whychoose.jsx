import React, { useState, useEffect, useRef } from 'react';
import {
    Video,
    PlayCircle,
    FileText,
    Shield,
    CheckCircle,
    Sparkles,
    Clock,
    Lock,
    Award,
    Users,
    Zap,
    TrendingUp
} from 'lucide-react';

const Whychoose = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
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

        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 5);
        }, 3000);

        return () => clearInterval(interval);
    }, [isVisible]);

    const features = [
        {
            icon: Video,
            title: 'Live Classes with Teachers',
            description: 'Interact with expert teachers in real-time. Ask questions, get instant feedback, and learn collaboratively.',
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            stats: '500+ Live Sessions Daily',
        },
        {
            icon: PlayCircle,
            title: 'Recorded Lessons Anytime',
            description: 'Access course content 24/7 at your own pace. Pause, rewind, and rewatch as many times as you need.',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            stats: '10,000+ Hours of Content',
        },
        {
            icon: FileText,
            title: 'PDF Notes & Resources',
            description: 'Download comprehensive study materials, worksheets, and reference guides for offline learning.',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            stats: '5,000+ Downloadable Resources',
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Bank-grade encryption ensures your transactions are safe. Multiple payment options available.',
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            stats: 'SSL Encrypted & PCI Compliant',
        },
        {
            icon: CheckCircle,
            title: 'Admin-Verified Teachers',
            description: 'Every teacher undergoes rigorous verification. Only certified professionals with proven expertise.',
            color: 'from-cyan-500 to-blue-600',
            bgColor: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            stats: '100% Certified Instructors',
        },
    ];

    const additionalBenefits = [
        { icon: Clock, text: 'Learn at Your Own Pace' },
        { icon: Award, text: 'Get Certified' },
        { icon: Users, text: 'Join Community' },
        { icon: Zap, text: 'Instant Access' },
    ];

    return (
        <div ref={sectionRef} className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }

                .feature-card {
                    opacity: 0;
                }
            `}</style>

            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className={`text-center mb-10 sm:mb-12 md:mb-16 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-4 sm:mb-6">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                        <span className="text-xs sm:text-sm font-semibold text-indigo-600">Our Advantages</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 px-4">
                        Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MDAI</span>?
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Experience the perfect blend of technology and education with our comprehensive learning platform
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isActive = activeFeature === index;

                        return (
                            <div
                                key={index}
                                className={`feature-card ${isVisible ? 'fade-in-up' : ''}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 transition-all duration-300 ${
                                    isActive
                                        ? 'border-indigo-500 shadow-lg'
                                        : 'border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300'
                                }`}>

                                    {/* Active Badge */}
                                    {isActive && (
                                        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`${feature.bgColor} w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 hover:scale-105`}>
                                        <Icon className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 ${feature.iconColor}`} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 hover:text-indigo-600 transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                                        {feature.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600">
                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{feature.stats}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-xl sm:rounded-b-2xl overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${feature.color} transition-all duration-1000 ease-out`}
                                            style={{
                                                width: isActive ? '100%' : '0%',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Benefits Bar */}
                <div className={`mb-8 sm:mb-12 ${isVisible ? 'fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-indigo-100">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                            {additionalBenefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                                        </div>
                                        <span className="text-xs sm:text-sm md:text-base text-gray-900 font-semibold group-hover:text-indigo-600 transition-colors duration-300 text-center sm:text-left">
                                            {benefit.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className={`text-center mb-6 sm:mb-8 ${isVisible ? 'fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                        <button className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <span>Start Learning Today</span>
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-indigo-600 text-indigo-600 text-sm sm:text-base font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                            <span className="flex items-center justify-center gap-2">
                                <span>Learn More</span>
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className={`text-center ${isVisible ? 'fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 px-4">
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        <span>Trusted by 10,000+ students worldwide</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Whychoose;