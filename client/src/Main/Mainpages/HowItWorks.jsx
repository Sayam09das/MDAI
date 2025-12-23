import React, { useRef, useEffect, useState } from 'react';
import { Search, CreditCard, Video, ArrowRight, CheckCircle, Play } from 'lucide-react';

const HowItWorks = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
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

    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % 3);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isVisible]);

    const steps = [
        {
            icon: Search,
            number: '01',
            title: 'Choose a Course',
            description: 'Browse our extensive catalog of AI and machine learning courses. Filter by skill level, duration, and topic to find the perfect match for your learning goals.',
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            features: ['500+ Courses', 'Expert Instructors', 'All Skill Levels']
        },
        {
            icon: CreditCard,
            number: '02',
            title: 'Pay Securely',
            description: 'Complete your enrollment with our secure payment system. We accept all major payment methods and offer flexible payment plans for your convenience.',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            features: ['SSL Encrypted', 'Money-back Guarantee', 'Flexible Plans']
        },
        {
            icon: Video,
            number: '03',
            title: 'Join Live & Recorded Classes',
            description: 'Access interactive live sessions with instructors and peers. Can\'t attend live? No worries - all classes are recorded and available 24/7 for your convenience.',
            color: 'from-green-500 to-teal-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            features: ['Live Sessions', 'HD Recordings', 'Lifetime Access']
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 -right-32 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes drawLine {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-drawLine {
          animation: drawLine 2s ease-out forwards;
        }

        .step-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-card:hover {
          transform: translateY(-12px) scale(1.02);
        }

        .step-card.active {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.3);
        }

        @media (max-width: 768px) {
          .step-card:hover {
            transform: translateY(-6px) scale(1.01);
          }
          .step-card.active {
            transform: translateY(-4px) scale(1.02);
          }
        }
      `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div
                    className={`text-center mb-12 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                        }`}
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                        <Play className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            How It Works
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                        Start Learning in{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            3 Simple Steps
                        </span>
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Your journey to mastering AI starts here. Follow these easy steps and transform your career with cutting-edge skills.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="relative">
                    {/* Connection Lines - Desktop Only */}
                    <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 z-0">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <line
                                x1="16.66%"
                                y1="0"
                                x2="83.33%"
                                y2="0"
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                strokeDasharray="1000"
                                className={isVisible ? 'animate-drawLine' : ''}
                                style={{ strokeDashoffset: 1000 }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="50%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = activeStep === index;

                            return (
                                <div
                                    key={index}
                                    className={`step-card ${isActive ? 'active' : ''} ${isVisible ? 'animate-fadeInScale' : 'opacity-0'
                                        }`}
                                    style={{
                                        animationDelay: `${0.2 + index * 0.2}s`,
                                        transformOrigin: 'center'
                                    }}
                                    onMouseEnter={() => setActiveStep(index)}
                                >
                                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 md:p-8 h-full border-2 border-transparent hover:border-indigo-100 transition-all duration-300">
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-4 -right-4 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                                            <span className="text-white font-bold text-lg md:text-xl">
                                                {step.number}
                                            </span>
                                        </div>

                                        {/* Icon Container */}
                                        <div className={`${step.bgColor} w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-6`}>
                                            <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Features List */}
                                        <div className="space-y-2 md:space-y-3">
                                            {step.features.map((feature, fIndex) => (
                                                <div
                                                    key={fIndex}
                                                    className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-gray-700 group"
                                                >
                                                    <CheckCircle className={`w-4 h-4 md:w-5 md:h-5 ${step.iconColor} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                                                    <span className="group-hover:text-gray-900 transition-colors duration-200">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Arrow Indicator - Desktop Only */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                                                <ArrowRight className="w-8 h-8 text-indigo-300 animate-pulse" />
                                            </div>
                                        )}

                                        {/* Hover Glow Effect */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <div
                    className={`text-center mt-12 md:mt-16 lg:mt-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                        }`}
                    style={{ animationDelay: '0.8s' }}
                >
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            Ready to Start Your AI Journey?
                        </h3>
                        <p className="text-base md:text-lg text-indigo-100 mb-6 md:mb-8 max-w-2xl mx-auto">
                            Join thousands of students already learning with us. Start today and unlock your potential!
                        </p>
                        <button className="group px-6 md:px-8 py-3 md:py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105">
                            Browse All Courses
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;