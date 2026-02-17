import React, { useState, useEffect, useRef } from 'react';
import {
    Users,
    DollarSign,
    Clock,
    TrendingUp,
    Award,
    BookOpen,
    Video,
    BarChart,
    Globe,
    Shield,
    Sparkles,
    CheckCircle,
    ArrowRight,
    Star,
    Target,
    Zap
} from 'lucide-react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const TeacherInvitation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredBenefit, setHoveredBenefit] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const benefitsRef = useRef(null);
    const stepsRef = useRef(null);
    const featureCardsRef = useRef([]);
    const float1Ref = useRef(null);
    const float2Ref = useRef(null);
    const float3Ref = useRef(null);

    // Add refs to array
    const addToFeatureCardsRef = (el) => {
        if (el && !featureCardsRef.current.includes(el)) {
            featureCardsRef.current.push(el);
        }
    };

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

    // GSAP Scroll Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation with scrub
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 85%",
                        end: "top 50%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Stats animation
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 90%",
                        end: "top 60%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Benefits animation with 3D effect
            if (benefitsRef.current) {
                gsap.fromTo(benefitsRef.current.children,
                    { opacity: 0, x: -30, rotateX: 45 },
                    {
                        opacity: 1,
                        x: 0,
                        rotateX: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: benefitsRef.current,
                            start: "top 85%",
                            end: "top 50%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }

            // Steps animation
            if (stepsRef.current) {
                gsap.fromTo(stepsRef.current,
                    { opacity: 0, x: 30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: stepsRef.current,
                            start: "top 85%",
                            end: "top 50%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }

            // Feature cards with parallax
            featureCardsRef.current.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 30, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 95%",
                            end: "top 70%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            });

            // Parallax floating blobs
            gsap.to(float1Ref.current, {
                y: -100,
                rotation: 45,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });

            gsap.to(float2Ref.current, {
                y: -80,
                rotation: -45,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5
                }
            });

            gsap.to(float3Ref.current, {
                y: -120,
                rotation: 90,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 3);
        }, 2500);

        return () => clearInterval(interval);
    }, [isVisible]);

    const benefits = [
        {
            icon: DollarSign,
            title: 'Earn While You Teach',
            description: 'Set your own pricing and earn up to 80% revenue share on every course sold.',
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            stat: 'Up to 80%',
            statLabel: 'Revenue Share',
        },
        {
            icon: Users,
            title: 'Reach Global Audience',
            description: 'Connect with thousands of eager learners from around the world.',
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            stat: '10K+',
            statLabel: 'Active Students',
        },
        {
            icon: Clock,
            title: 'Flexible Schedule',
            description: 'Teach at your convenience. Create courses and host live sessions on your terms.',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            stat: '24/7',
            statLabel: 'Your Choice',
        },
        {
            icon: Video,
            title: 'Professional Tools',
            description: 'Access state-of-the-art recording tools, analytics, and content management.',
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            stat: 'Pro Tools',
            statLabel: 'Included Free',
        },
        {
            icon: BarChart,
            title: 'Track Your Growth',
            description: 'Monitor student engagement, earnings, and course performance in real-time.',
            color: 'from-cyan-500 to-blue-600',
            bgColor: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            stat: 'Analytics',
            statLabel: 'Dashboard',
        },
        {
            icon: Award,
            title: 'Build Your Brand',
            description: 'Establish yourself as an expert with your own instructor profile and reviews.',
            color: 'from-yellow-500 to-orange-600',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            stat: 'Verified',
            statLabel: 'Profile Badge',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Apply & Get Verified',
            description: 'Submit your credentials and teaching experience. We verify all instructors.',
            icon: Shield,
        },
        {
            number: '02',
            title: 'Create Your Course',
            description: 'Use our easy-to-use platform to build engaging courses with video and resources.',
            icon: BookOpen,
        },
        {
            number: '03',
            title: 'Start Earning',
            description: 'Publish your course, teach live classes, and earn from day one.',
            icon: TrendingUp,
        },
    ];

    const stats = [
        { value: '$50K+', label: 'Avg. Annual Earnings', icon: DollarSign },
        { value: '500+', label: 'Active Teachers', icon: Users },
        { value: '4.9/5', label: 'Teacher Satisfaction', icon: Star },
    ];

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated Circles */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
                <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed" />
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow" />

                {/* Geometric Shapes */}
                <div className="absolute top-1/4 right-1/4 w-20 h-20 border-4 border-indigo-200 rounded-lg transform rotate-12 opacity-40" />
                <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border-4 border-purple-200 rounded-full opacity-40" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 shadow-md">
                        <Target className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Join Our Teaching Community</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
                        Become a <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Teacher</span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Share your expertise with thousands of learners worldwide and earn while making an impact
                    </p>
                </div>

                {/* Stats Bar */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-3">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">

                    {/* Left Side - Benefits */}
                    <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                        }`}>
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                const isHovered = hoveredBenefit === index;

                                return (
                                    <div
                                        key={index}
                                        className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 ${isHovered
                                                ? 'border-indigo-600 shadow-2xl -translate-x-2'
                                                : 'border-white shadow-lg hover:shadow-xl'
                                            }`}
                                        onMouseEnter={() => setHoveredBenefit(index)}
                                        onMouseLeave={() => setHoveredBenefit(null)}
                                        style={{ transitionDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-start space-x-4">
                                            {/* Icon */}
                                            <div className={`${benefit.bgColor} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transform transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                                                }`}>
                                                <Icon className={`w-7 h-7 ${benefit.iconColor}`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                                        {benefit.title}
                                                    </h3>
                                                    <CheckCircle className={`w-5 h-5 text-green-600 flex-shrink-0 ml-2 transition-all duration-300 ${isHovered ? 'scale-125 rotate-12' : 'scale-100'
                                                        }`} />
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                    {benefit.description}
                                                </p>

                                                {/* Stat Badge */}
                                                <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${benefit.color} rounded-full`}>
                                                    <span className="text-xs font-bold text-white">{benefit.stat}</span>
                                                    <span className="text-xs text-white/90">{benefit.statLabel}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Effect */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side - How It Works */}
                    <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                        }`}>
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white shadow-2xl">
                            <div className="flex items-center space-x-2 mb-8">
                                <Sparkles className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    How It Works
                                </h3>
                            </div>

                            {/* Steps */}
                            <div className="space-y-6 mb-8">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = activeStep === index;

                                    return (
                                        <div
                                            key={index}
                                            className={`relative transition-all duration-500 ${isActive ? 'scale-105' : 'scale-100'
                                                }`}
                                        >
                                            <div className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-500 ${isActive ? 'bg-indigo-50 shadow-lg' : 'bg-transparent'
                                                }`}>
                                                {/* Step Number */}
                                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-500 ${isActive
                                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    {step.number}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Icon className={`w-5 h-5 transition-colors duration-500 ${isActive ? 'text-indigo-600' : 'text-gray-400'
                                                            }`} />
                                                        <h4 className={`font-bold transition-colors duration-500 ${isActive ? 'text-indigo-600' : 'text-gray-900'
                                                            }`}>
                                                            {step.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Connecting Line */}
                                            {index < steps.length - 1 && (
                                                <div className="ml-6 h-8 w-0.5 bg-gradient-to-b from-indigo-200 to-transparent" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Progress Indicators */}
                            <div className="flex justify-center space-x-2 mb-8">
                                {steps.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-2 rounded-full transition-all duration-500 ${activeStep === index
                                                ? 'w-12 bg-gradient-to-r from-indigo-600 to-purple-600'
                                                : 'w-2 bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button className="group relative w-full px-8 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center space-x-3">
                                    <span>Start Teaching Today</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Animated Sparkles */}
                                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Sparkles className="w-5 h-5 text-white absolute top-2 right-2 animate-ping" />
                                    <Sparkles className="w-4 h-4 text-white absolute top-4 right-8 animate-pulse" />
                                </div>
                            </button>

                            {/* Trust Badge */}
                            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span>Verified & Secure Application Process</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Feature Cards */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {[
                        { icon: Globe, text: 'Global Reach', color: 'from-blue-500 to-indigo-600' },
                        { icon: Zap, text: 'Quick Setup', color: 'from-purple-500 to-pink-600' },
                        { icon: Shield, text: 'Secure Platform', color: 'from-green-500 to-emerald-600' },
                        { icon: TrendingUp, text: 'Grow Your Income', color: 'from-orange-500 to-red-600' },
                    ].map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                    {feature.text}
                                </div>
                            </div>
                        );
                    })}
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
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) translateX(15px) rotate(5deg);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
        </div>
    );
};

export default TeacherInvitation;