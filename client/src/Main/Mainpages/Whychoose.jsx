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
    const [hoveredCard, setHoveredCard] = useState(null);
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
            illustration: 'bg-gradient-to-br from-blue-100 to-indigo-100',
        },
        {
            icon: PlayCircle,
            title: 'Recorded Lessons Anytime',
            description: 'Access course content 24/7 at your own pace. Pause, rewind, and rewatch as many times as you need.',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            stats: '10,000+ Hours of Content',
            illustration: 'bg-gradient-to-br from-purple-100 to-pink-100',
        },
        {
            icon: FileText,
            title: 'PDF Notes & Resources',
            description: 'Download comprehensive study materials, worksheets, and reference guides for offline learning.',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            stats: '5,000+ Downloadable Resources',
            illustration: 'bg-gradient-to-br from-emerald-100 to-teal-100',
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Bank-grade encryption ensures your transactions are safe. Multiple payment options available.',
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            stats: 'SSL Encrypted & PCI Compliant',
            illustration: 'bg-gradient-to-br from-orange-100 to-red-100',
        },
        {
            icon: CheckCircle,
            title: 'Admin-Verified Teachers',
            description: 'Every teacher undergoes rigorous verification. Only certified professionals with proven expertise.',
            color: 'from-cyan-500 to-blue-600',
            bgColor: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            stats: '100% Certified Instructors',
            illustration: 'bg-gradient-to-br from-cyan-100 to-blue-100',
        },
    ];

    const additionalBenefits = [
        { icon: Clock, text: 'Learn at Your Own Pace' },
        { icon: Award, text: 'Get Certified' },
        { icon: Users, text: 'Join Community' },
        { icon: Zap, text: 'Instant Access' },
    ];

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-white overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }} />
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Our Advantages</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MDAI</span>?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience the perfect blend of technology and education with our comprehensive learning platform
                    </p>
                </div>

                {/* Main Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isActive = activeFeature === index;
                        const isHovered = hoveredCard === index;

                        return (
                            <div
                                key={index}
                                className={`group relative transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-20'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className={`relative bg-white rounded-2xl p-6 md:p-8 border-2 transition-all duration-500 ${isActive || isHovered
                                        ? 'border-indigo-600 shadow-2xl -translate-y-2'
                                        : 'border-gray-200 shadow-lg hover:shadow-xl'
                                    }`}>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute -top-3 -right-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                                    <Zap className="w-6 h-6 text-white fill-white" />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-ping opacity-20" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Icon Container */}
                                    <div className={`${feature.bgColor} w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                                        }`}>
                                        <Icon className={`w-8 h-8 md:w-10 md:h-10 ${feature.iconColor}`} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {feature.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center space-x-2 text-sm font-semibold text-indigo-600">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{feature.stats}</span>
                                    </div>

                                    {/* Hover Border Effect */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                    {/* Progress Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
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

                {/* Additional Benefits Bar */}
                <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-indigo-100">
                        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
                            {additionalBenefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 group cursor-pointer"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                                            <Icon className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <span className="text-gray-900 font-semibold group-hover:text-indigo-600 transition-colors duration-300">
                                            {benefit.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex flex-col sm:flex-row gap-4">
                        <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10 flex items-center space-x-2">
                                <span>Start Learning Today</span>
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg">
                            <span className="flex items-center space-x-2">
                                <span>Learn More</span>
                                <TrendingUp className="w-5 h-5" />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className={`text-center mt-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span>Trusted by 10,000+ students worldwide</span>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

export default Whychoose;