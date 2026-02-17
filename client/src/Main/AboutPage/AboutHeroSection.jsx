import React, { useState, useEffect, useRef } from 'react';
import {
    Sparkles,
    TrendingUp,
    Users,
    BookOpen,
    Award,
    Target,
    Zap,
    Globe,
    ArrowDown
} from 'lucide-react';
import AnnouncementMarquee from '../AnnouncementMarquee/AnnouncementMarquee';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const AboutHeroSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const statsRef = useRef(null);
    const floatingRef = useRef([]);

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

    // GSAP Scroll Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header parallax
            gsap.to(headerRef.current, {
                y: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });

            // Stats cards animation with 3D effect
            if (statsRef.current) {
                gsap.fromTo(statsRef.current.children,
                    { opacity: 0, y: 50, scale: 0.9, rotateX: 45 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: "top 80%",
                            end: "top 40%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }

            // Floating icons parallax
            floatingRef.current.forEach((el, i) => {
                gsap.to(el, {
                    y: -100 - (i * 20),
                    rotation: 15 + (i * 5),
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1 + (i * 0.2)
                    }
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isVisible]);

    const stats = [
        { icon: Users, value: '50K+', label: 'Active Students', color: 'from-blue-500 to-indigo-600' },
        { icon: BookOpen, value: '500+', label: 'Courses', color: 'from-purple-500 to-pink-600' },
        { icon: Award, value: '100+', label: 'Expert Teachers', color: 'from-emerald-500 to-teal-600' },
        { icon: Globe, value: '150+', label: 'Countries', color: 'from-orange-500 to-red-600' },
    ];

    const floatingIcons = [
        { Icon: Sparkles, position: 'top-20 left-[10%]', delay: '0s', color: 'text-yellow-500' },
        { Icon: Target, position: 'top-32 right-[15%]', delay: '0.5s', color: 'text-indigo-500' },
        { Icon: Zap, position: 'bottom-40 left-[15%]', delay: '1s', color: 'text-purple-500' },
        { Icon: Award, position: 'bottom-32 right-[12%]', delay: '1.5s', color: 'text-pink-500' },
        { Icon: BookOpen, position: 'top-1/3 left-[8%]', delay: '2s', color: 'text-teal-500' },
        { Icon: TrendingUp, position: 'top-1/2 right-[10%]', delay: '2.5s', color: 'text-blue-500' },
    ];

    return (
        <div ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white" style={{ perspective: "1000px" }}>
            {/* Grid Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
                    backgroundSize: '80px 80px',
                }} />
            </div>

            {/* Gradient Overlay Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
            </div>

            {/* Floating Icons */}
            {floatingIcons.map((item, index) => {
                const Icon = item.Icon;
                return (
                    <div
                        key={index}
                        ref={el => floatingRef.current[index] = el}
                        className={`hidden lg:block absolute ${item.position} ${item.color} opacity-20 animate-float`}
                        style={{ animationDelay: item.delay }}
                    >
                        <Icon className="w-12 h-12" />
                    </div>
                );
            })}
            {/* Main Content */}
            <div ref={headerRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
                {/* Badge */}
                <div className={`inline-flex items-center space-x-2 px-6 py-3 bg-indigo-50 border border-indigo-200 rounded-full mb-8 shadow-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
                    }`}>
                    <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                    <span className="text-indigo-700 font-semibold text-sm md:text-base">
                        Trusted by 50,000+ Students Worldwide
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    About{' '}
                    <span className="relative inline-block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Us
                        <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-40 rounded-full blur-sm" />
                    </span>
                </h1>

                {/* Tagline */}
                <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 font-light mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    Empowering learning through{' '}
                    <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        technology
                    </span>
                </p>

                {/* Description */}
                <p className={`text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    We're on a mission to make quality education accessible to everyone, everywhere.
                    Join thousands of learners transforming their careers through our innovative platform.
                </p>

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center space-x-2">
                        <span>Explore Courses</span>
                        <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </button>

                    <button className="group px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center space-x-2">
                        <span>Our Story</span>
                        <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Stats Grid */}
                <div ref={statsRef} className={`grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                style={{ transitionDelay: `${index * 100}ms`, transformStyle: "preserve-3d" }}
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                <div className="flex flex-col items-center space-y-2 animate-bounce">
                    <span className="text-gray-500 text-sm font-medium">Scroll to learn more</span>
                    <ArrowDown className="w-6 h-6 text-gray-400" />
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default AboutHeroSection;
