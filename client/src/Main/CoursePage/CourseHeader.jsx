import React, { useState, useEffect, useRef } from 'react';
import {
    Star,
    Users,
    Clock,
    Globe,
    BarChart,
    Award,
    BookOpen,
    Play,
    CheckCircle,
    TrendingUp,
    Calendar,
    Target,
    Sparkles,
    Share2,
    Heart,
    Download
} from 'lucide-react';
import CoursePreview from './CoursePreview';
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


const CourseHeader = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [enrollCount, setEnrollCount] = useState(0);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const badgesRef = useRef(null);
    const contentRef = useRef(null);
    const featuresRef = useRef(null);
    const previewRef = useRef(null);

    const courseData = {
        title: 'Complete Web Development Bootcamp 2025',
        description: 'Master modern web development from scratch. Build real-world projects with HTML, CSS, JavaScript, React, Node.js, and deploy production-ready applications.',
        teacher: {
            name: 'Dr. Sarah Johnson',
            avatar: 'SJ',
            title: 'Senior Full Stack Developer',
            credentials: '15+ years experience',
            rating: 4.9,
            students: 45230,
        },
        rating: 4.9,
        totalRatings: 12543,
        studentsEnrolled: 45230,
        duration: '48 hours',
        totalLessons: 325,
        language: 'English',
        level: 'Beginner to Advanced',
        lastUpdated: 'December 2024',
        certificate: true,
        price: 49.99,
        originalPrice: 199.99,
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

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = courseData.studentsEnrolled / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= courseData.studentsEnrolled) {
                setEnrollCount(courseData.studentsEnrolled);
                clearInterval(timer);
            } else {
                setEnrollCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible]);

    // GSAP Scroll Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header parallax
            gsap.to(headerRef.current, {
                y: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });

            // Badges animation with stagger
            if (badgesRef.current) {
                gsap.fromTo(badgesRef.current.children,
                    { opacity: 0, y: -20, scale: 0.8 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: badgesRef.current,
                            start: "top 85%",
                            end: "top 50%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }

            // Content animation with 3D effect
            if (contentRef.current) {
                gsap.fromTo(contentRef.current,
                    { opacity: 0, x: -50, rotateX: 15 },
                    {
                        opacity: 1,
                        x: 0,
                        rotateX: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: contentRef.current,
                            start: "top 80%",
                            end: "top 30%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }

            // Features grid animation
            if (featuresRef.current) {
                gsap.fromTo(featuresRef.current.children,
                    { opacity: 0, y: 30, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featuresRef.current,
                            start: "top 85%",
                            end: "top 50%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }

            // Preview section animation
            if (previewRef.current) {
                gsap.fromTo(previewRef.current,
                    { opacity: 0, x: 50, scale: 0.9 },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: previewRef.current,
                            start: "top 80%",
                            end: "top 30%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isVisible]);

    const badges = [
        { icon: Award, label: 'Bestseller', color: 'bg-yellow-500' },
        { icon: TrendingUp, label: 'Trending', color: 'bg-red-500' },
        { icon: Sparkles, label: 'Highest Rated', color: 'bg-purple-500' },
    ];

    const features = [
        { icon: Clock, value: courseData.duration, label: 'Total Duration' },
        { icon: BookOpen, value: `${courseData.totalLessons} Lessons`, label: 'Video Content' },
        { icon: Globe, value: courseData.language, label: 'Language' },
        { icon: BarChart, value: courseData.level, label: 'Level' },
        { icon: Calendar, value: courseData.lastUpdated, label: 'Last Updated' },
        { icon: Award, value: 'Certificate', label: 'Upon Completion' },
    ];

    return (
        <div ref={sectionRef} className="relative py-12 md:py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-5">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }} />
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Badges Row */}
                <div className={`flex flex-wrap gap-3 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={index}
                                className={`${badge.color} text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all duration-300`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-bold">{badge.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Left Side - Content */}
                    <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                        }`}>

                        {/* Course Title */}
                        <div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                                {courseData.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Rating & Stats Row */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6">
                            {/* Rating */}
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(courseData.rating)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-bold text-gray-900">
                                    {courseData.rating}
                                </span>
                                <span className="text-sm text-gray-600">
                                    ({courseData.totalRatings.toLocaleString()} ratings)
                                </span>
                            </div>

                            <div className="h-6 w-px bg-gray-300" />

                            {/* Students Enrolled */}
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                <span className="text-lg font-bold text-gray-900">
                                    {enrollCount.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-600">students</span>
                            </div>
                        </div>

                        {/* Teacher Info */}
                        <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                                {courseData.teacher.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-bold text-gray-900">
                                        {courseData.teacher.name}
                                    </h3>
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    {courseData.teacher.title}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                        <span>{courseData.teacher.rating} rating</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{courseData.teacher.students.toLocaleString()} students</span>
                                    </span>
                                    <span>{courseData.teacher.credentials}</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <Icon className="w-6 h-6 text-indigo-600 mb-2" />
                                        <div className="font-bold text-gray-900 text-sm mb-1">
                                            {feature.value}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {feature.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* Enroll Now Button */}
                            <Link
                                to="/login"
                                className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden text-center"
                            >
                                <span className="relative z-10 flex items-center justify-center space-x-2">
                                    <span>Enroll Now - ${courseData.price}</span>
                                    <Target className="w-5 h-5" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>

                            {/* Preview Course Button */}
                            <Link
                                to="/preview-course"
                                className="px-6 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg text-center"
                            >
                                Preview This Course
                            </Link>

                        </div>

                        {/* Price & Discount */}
                        <div className="flex items-center space-x-4">
                            <div>
                                <span className="text-3xl font-bold text-gray-900">
                                    ${courseData.price}
                                </span>
                                <span className="text-lg text-gray-500 line-through ml-3">
                                    ${courseData.originalPrice}
                                </span>
                            </div>
                            <div className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                                {Math.round((1 - courseData.price / courseData.originalPrice) * 100)}% OFF
                            </div>
                            <div className="text-sm text-red-600 font-semibold">
                                ⏰ Limited time offer!
                            </div>
                        </div>
                    </div>
                    <CoursePreview />
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

export default CourseHeader;