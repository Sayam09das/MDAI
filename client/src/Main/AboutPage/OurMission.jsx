import React, { useState, useEffect, useRef } from 'react';
import {
    Target,
    Eye,
    Lightbulb,
    Heart,
    Users,
    Globe,
    Video,
    BookOpen,
    Award,
    Zap,
    CheckCircle,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const OurMission = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const cardsRef = useRef([]);
    const featuresRef = useRef([]);
    const ctaRef = useRef(null);

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
            // Header animation
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

            // Main cards with 3D effect
            cardsRef.current.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 60, rotateX: 45 },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            end: "top 60%",
                            scrub: 1.5,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            });

            // Features grid animation
            featuresRef.current.forEach((feature, index) => {
                gsap.fromTo(feature,
                    { opacity: 0, y: 40, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: feature,
                            start: "top 90%",
                            end: "top 60%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            });

            // CTA animation
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top 90%",
                        end: "top 70%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [isVisible]);

    const mainCards = [
        {
            id: 'mission',
            icon: Target,
            title: 'Our Mission',
            gradient: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            description: 'To democratize education and make world-class learning accessible to everyone, regardless of location or background.',
            points: [
                'Break down barriers to quality education',
                'Empower learners worldwide with cutting-edge content',
                'Create a global community of lifelong learners',
                'Foster innovation through accessible knowledge',
            ],
        },
        {
            id: 'vision',
            icon: Eye,
            title: 'Our Vision',
            gradient: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            description: 'To become the world\'s most trusted learning platform where anyone can transform their life through education.',
            points: [
                'Lead the future of online education',
                'Bridge the gap between learning and career success',
                'Create measurable impact on millions of lives',
                'Set new standards for educational excellence',
            ],
        },
        {
            id: 'why',
            icon: Lightbulb,
            title: 'Why We Exist',
            gradient: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50',
            description: 'Because education should be a right, not a privilege. We believe in the power of learning to change lives.',
            points: [
                'Traditional education is expensive and inaccessible',
                'Self-paced learning lacks accountability and support',
                'Quality instruction should reach everyone',
                'Technology can revolutionize how we learn',
            ],
        },
    ];

    const features = [
        {
            icon: Globe,
            title: 'Make Education Accessible',
            description: 'Breaking geographical and financial barriers to bring quality education to every corner of the world.',
            gradient: 'from-blue-500 to-indigo-600',
        },
        {
            icon: Video,
            title: 'Live + Recorded Learning',
            description: 'Combining the best of both worlds—real-time interaction with the flexibility of self-paced study.',
            gradient: 'from-purple-500 to-pink-600',
        },
        {
            icon: Users,
            title: 'Support Teachers & Students',
            description: 'Creating a balanced ecosystem where educators thrive and learners succeed together.',
            gradient: 'from-emerald-500 to-teal-600',
        },
        {
            icon: Award,
            title: 'Industry-Standard Certificates',
            description: 'Providing recognized credentials that open doors and validate your hard-earned skills.',
            gradient: 'from-orange-500 to-red-600',
        },
        {
            icon: Zap,
            title: 'AI-Powered Personalization',
            description: 'Leveraging technology to create customized learning paths that adapt to your pace and style.',
            gradient: 'from-cyan-500 to-blue-600',
        },
        {
            icon: Heart,
            title: 'Community-Driven Growth',
            description: 'Building a supportive network where learners help each other succeed and grow.',
            gradient: 'from-pink-500 to-rose-600',
        },
    ];

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-white overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #4F46E5 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Our Story</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        What Drives <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Us</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We're more than just a platform—we're a movement dedicated to transforming lives through education
                    </p>
                </div>

                {/* Main Mission/Vision/Why Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {mainCards.map((card, index) => {
                        const Icon = card.icon;
                        const isActive = activeCard === card.id;

                        return (
                            <div
                                key={card.id}
                                onMouseEnter={() => setActiveCard(card.id)}
                                onMouseLeave={() => setActiveCard(null)}
                                className={`group relative transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-20'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className={`relative bg-white rounded-3xl p-8 border-2 shadow-xl hover:shadow-2xl transition-all duration-500 ${isActive ? 'border-indigo-400 -translate-y-2' : 'border-gray-200'
                                    }`}>

                                    {/* Icon */}
                                    <div className={`${card.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-500 ${isActive ? 'scale-110 rotate-6' : 'scale-100'
                                        }`}>
                                        <Icon className={`w-8 h-8 bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`} style={{
                                            WebkitTextFillColor: 'transparent',
                                            WebkitBackgroundClip: 'text',
                                            backgroundImage: `linear-gradient(to bottom right, ${card.gradient.includes('blue') ? '#3B82F6' : card.gradient.includes('purple') ? '#A855F7' : '#10B981'}, ${card.gradient.includes('indigo') ? '#4F46E5' : card.gradient.includes('pink') ? '#EC4899' : '#14B8A6'})`,
                                        }} />
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-gray-900'
                                        }`}>
                                        {card.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        {card.description}
                                    </p>

                                    {/* Points */}
                                    <div className="space-y-3">
                                        {card.points.map((point, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start space-x-3"
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-700 leading-relaxed">
                                                    {point}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Gradient Border Effect */}
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className={`flex items-center justify-center mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}>
                    <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                </div>

                {/* How We Do It Section */}
                <div className={`text-center mb-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        How We Make It <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Happen</span>
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our comprehensive approach ensures every learner gets the support they need
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className={`group bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-20'
                                    }`}
                                style={{ transitionDelay: `${(index + 5) * 100}ms` }}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                                    {feature.title}
                                </h4>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className={`mt-16 text-center transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-indigo-100">
                        <TrendingUp className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Ready to Join Our Mission?
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Be part of the education revolution. Whether you're here to learn or teach, there's a place for you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                Start Learning Today
                            </button>
                            <button className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                Become a Teacher
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurMission;