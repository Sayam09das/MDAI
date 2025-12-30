import React, { useState, useEffect, useRef } from 'react';
import {
    Video, Play, FileText, CreditCard, ShieldCheck,
    Zap, CheckCircle, Sparkles, TrendingUp, Award,
    Users, Clock, Download, Lock, Star, ArrowRight
} from 'lucide-react';

const WhatWeOffer = () => {
    const [isVisible, setIsVisible] = useState(false);
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

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            id: 1,
            icon: Video,
            title: 'Live Classes',
            description: 'Interactive real-time sessions with expert instructors. Ask questions, participate in discussions, and learn together.',
            color: 'from-red-500 to-pink-600',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
            stats: [
                { icon: Users, value: '50+', label: 'Live Sessions/Week' },
                { icon: Clock, value: '2-3h', label: 'Average Duration' }
            ],
            highlights: ['HD Video Quality', 'Screen Sharing', 'Interactive Q&A', 'Record & Replay']
        },
        {
            id: 2,
            icon: Play,
            title: 'Recorded Lessons',
            description: 'Access our library of high-quality recorded lectures anytime, anywhere. Learn at your own pace with lifetime access.',
            color: 'from-purple-500 to-indigo-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            stats: [
                { icon: Video, value: '500+', label: 'Video Lessons' },
                { icon: Download, value: 'Unlimited', label: 'Downloads' }
            ],
            highlights: ['HD 1080p Videos', 'Subtitles Available', 'Playback Speed Control', '24/7 Access']
        },
        {
            id: 3,
            icon: FileText,
            title: 'PDFs & Resources',
            description: 'Comprehensive study materials, cheat sheets, code samples, and assignments to reinforce your learning.',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            stats: [
                { icon: FileText, value: '1000+', label: 'Documents' },
                { icon: Download, value: '5GB', label: 'Resources' }
            ],
            highlights: ['PDF Notes', 'Code Examples', 'Practice Assignments', 'Cheat Sheets']
        },
        {
            id: 4,
            icon: CreditCard,
            title: 'Secure Payments',
            description: 'Safe and encrypted payment processing with multiple payment options. Your financial data is always protected.',
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            stats: [
                { icon: ShieldCheck, value: '256-bit', label: 'SSL Encryption' },
                { icon: CheckCircle, value: '100%', label: 'Secure' }
            ],
            highlights: ['Credit/Debit Cards', 'Net Banking', 'UPI Payments', 'Refund Protection']
        },
        {
            id: 5,
            icon: ShieldCheck,
            title: 'Admin-verified Teachers',
            description: 'Learn from industry experts and certified professionals. Every instructor is thoroughly vetted for quality assurance.',
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            stats: [
                { icon: Users, value: '100+', label: 'Expert Teachers' },
                { icon: Star, value: '4.8/5', label: 'Avg Rating' }
            ],
            highlights: ['Background Verified', 'Industry Experience', 'Teaching Certified', 'Student Rated']
        },
        {
            id: 6,
            icon: Zap,
            title: 'Real-time Access Control',
            description: 'Instant course access upon enrollment. Advanced permissions system ensures secure content delivery.',
            color: 'from-indigo-500 to-purple-600',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            stats: [
                { icon: Zap, value: 'Instant', label: 'Activation' },
                { icon: Lock, value: 'Secure', label: 'DRM Protected' }
            ],
            highlights: ['Instant Enrollment', 'Content Protection', 'Progress Tracking', 'Certificate Generation']
        }
    ];

    const FeatureCard = ({ feature, index }) => {
        const Icon = feature.icon;
        const isHovered = hoveredCard === feature.id;

        return (
            <div
                className={`group relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-500 transform ${isHovered ? 'scale-105 shadow-2xl border-transparent' : 'border-gray-100 hover:border-gray-200'
                    } ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
            >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative p-6 md:p-8">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} transform transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                            } shadow-lg`}>
                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                        {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                        {feature.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {feature.stats.map((stat, idx) => {
                            const StatIcon = stat.icon;
                            return (
                                <div key={idx} className={`${feature.bgColor} rounded-xl p-3 text-center transition-all duration-300 group-hover:shadow-md`}>
                                    <StatIcon className={`w-5 h-5 ${feature.iconColor} mx-auto mb-1`} />
                                    <div className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-xs text-gray-600">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mb-6">
                        {feature.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 group">
                                <CheckCircle className={`w-4 h-4 ${feature.iconColor} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                                <span>{highlight}</span>
                            </div>
                        ))}
                    </div>

                    {/* Learn More Button */}
                    <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isHovered
                            ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                        Learn More
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </button>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
                </div>
            </div>
        );
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

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

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className={`text-center mb-12 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            What We Offer
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Everything You Need for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                            Success
                        </span>
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        A comprehensive learning platform designed to empower students and educators with cutting-edge features
                    </p>
                </div>

                {/* Stats Bar */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    {[
                        { icon: Users, value: '50,000+', label: 'Active Students' },
                        { icon: Video, value: '10,000+', label: 'Video Lessons' },
                        { icon: Award, value: '100+', label: 'Expert Teachers' },
                        { icon: TrendingUp, value: '98%', label: 'Success Rate' }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1 text-center"
                            >
                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 mx-auto mb-3" />
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>

                {/* CTA Section */}
                <div className={`mt-16 md:mt-24 text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-pulse-ring">
                                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
                            </div>

                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
                                Ready to Transform Your Learning?
                            </h3>

                            <p className="text-base md:text-lg lg:text-xl text-indigo-100 mb-8 md:mb-10 max-w-2xl mx-auto">
                                Join thousands of students already learning with our platform. Start your journey today with a free trial!
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                </button>

                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer w-full sm:w-auto">
                                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                                    Watch Demo
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-8 md:mt-10">
                                <div className="flex items-center gap-2 text-white/90">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">No Credit Card Required</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Cancel Anytime</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Money-back Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatWeOffer;