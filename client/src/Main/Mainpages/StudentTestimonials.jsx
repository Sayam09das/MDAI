import React, { useState, useEffect, useRef } from 'react';
import {
    Star,
    Quote,
    ChevronLeft,
    ChevronRight,
    Award,
    TrendingUp,
    Heart,
    CheckCircle,
    Sparkles
} from 'lucide-react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const StudentTestimonials = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const carouselRef = useRef(null);
    const statsRef = useRef(null);
    const cardsRef = useRef([]);
    const quote1Ref = useRef(null);
    const quote2Ref = useRef(null);

    // Add refs to array
    const addToCardsRef = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
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

            // Testimonial cards with 3D effect
            cardsRef.current.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 60, scale: 0.8, rotateX: 45 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
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

                // Parallax effect
                gsap.fromTo(card,
                    { y: 0 },
                    {
                        y: -15,
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1
                        }
                    }
                );
            });

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
                        end: "top 70%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Quote decorations parallax
            gsap.to(quote1Ref.current, {
                y: -50,
                rotation: -15,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });

            gsap.to(quote2Ref.current, {
                y: -30,
                rotation: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible || isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / getVisibleCards()));
        }, 5000);

        return () => clearInterval(interval);
    }, [isVisible, isPaused]);

    const getVisibleCards = () => {
        if (typeof window === 'undefined') return 3;
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Full Stack Developer',
            course: 'Complete Web Development Bootcamp',
            review: 'This course completely transformed my career! The instructors are incredibly knowledgeable and the hands-on projects helped me build a strong portfolio. Highly recommended!',
            rating: 5,
            avatar: 'SJ',
            bgColor: 'from-blue-500 to-indigo-600',
            image: null,
            achievement: 'Landed dream job at Google',
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Data Scientist',
            course: 'Data Science & Machine Learning A-Z',
            review: 'The best investment I made in my education. The practical approach and real-world examples made complex topics easy to understand. My salary doubled after completing this course!',
            rating: 5,
            avatar: 'MC',
            bgColor: 'from-purple-500 to-pink-600',
            image: null,
            achievement: 'Career advancement',
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'UX Designer',
            course: 'UI/UX Design: Figma to Code',
            review: 'Amazing course with detailed explanations. The live sessions were interactive and the instructor was always available to help. I can now design professional interfaces with confidence.',
            rating: 5,
            avatar: 'ER',
            bgColor: 'from-orange-500 to-red-600',
            image: null,
            achievement: 'Freelancing successfully',
        },
        {
            id: 4,
            name: 'David Kim',
            role: 'Software Engineer',
            course: 'Advanced React & Next.js',
            review: 'The depth of content is incredible. I learned advanced patterns that I use daily in my work. The community support and resources are excellent. Worth every penny!',
            rating: 5,
            avatar: 'DK',
            bgColor: 'from-emerald-500 to-teal-600',
            image: null,
            achievement: 'Built 5 production apps',
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            role: 'Digital Marketer',
            course: 'Digital Marketing Mastery',
            review: 'This course gave me the tools and confidence to start my own marketing agency. The practical strategies and templates saved me months of trial and error. Best course ever!',
            rating: 5,
            avatar: 'LA',
            bgColor: 'from-cyan-500 to-blue-600',
            image: null,
            achievement: 'Started own agency',
        },
        {
            id: 6,
            name: 'James Wilson',
            role: 'Python Developer',
            course: 'Python Programming: Zero to Hero',
            review: 'From knowing nothing to building complex applications in just 3 months! The structured curriculum and supportive community made all the difference. Thank you!',
            rating: 5,
            avatar: 'JW',
            bgColor: 'from-yellow-500 to-orange-600',
            image: null,
            achievement: 'Built 10+ projects',
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / getVisibleCards()));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? Math.ceil(testimonials.length / getVisibleCards()) - 1 : prev - 1
        );
    };

    const visibleCards = getVisibleCards();
    const startIndex = currentSlide * visibleCards;
    const visibleTestimonials = testimonials.slice(startIndex, startIndex + visibleCards);

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

                {/* Quote Decorations */}
                <Quote className="absolute top-40 left-20 w-32 h-32 text-indigo-100 opacity-30 transform -rotate-12" />
                <Quote className="absolute bottom-40 right-20 w-40 h-40 text-purple-100 opacity-30 transform rotate-12" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
                        <Heart className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Success Stories</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        What Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Students</span> Say
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of satisfied learners who transformed their careers with our courses
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >

                    {/* Navigation Buttons - Desktop */}
                    <button
                        onClick={prevSlide}
                        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white rounded-full items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white rounded-full items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
                        aria-label="Next testimonials"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden">
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-500"
                        >
                            {visibleTestimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className={`transition-all duration-700 ${isVisible
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-20'
                                        }`}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <div className="group relative bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">

                                        {/* Quote Icon */}
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            <Quote className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Verified Badge */}
                                        <div className="absolute -top-3 -right-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                </div>
                                                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                                                />
                                            ))}
                                        </div>

                                        {/* Review Text */}
                                        <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
                                            "{testimonial.review}"
                                        </p>

                                        {/* Achievement Badge */}
                                        <div className="mb-6">
                                            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                                                <Award className="w-4 h-4 text-green-600" />
                                                <span className="text-xs font-semibold text-green-700">
                                                    {testimonial.achievement}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 mb-6" />

                                        {/* Student Info */}
                                        <div className="flex items-center space-x-4">
                                            {/* Avatar */}
                                            <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300`}>
                                                {testimonial.avatar}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {testimonial.role}
                                                </p>
                                                <p className="text-xs text-indigo-600 font-medium truncate">
                                                    {testimonial.course}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Hover Gradient Overlay */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${testimonial.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex lg:hidden justify-center items-center space-x-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex space-x-2">
                            {[...Array(Math.ceil(testimonials.length / visibleCards))].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`transition-all duration-300 rounded-full ${currentSlide === index
                                            ? 'w-8 h-2 bg-gradient-to-r from-indigo-600 to-purple-600'
                                            : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Desktop Dots Indicator */}
                <div className="hidden lg:flex justify-center space-x-2 mt-12">
                    {[...Array(Math.ceil(testimonials.length / visibleCards))].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`transition-all duration-300 rounded-full ${currentSlide === index
                                    ? 'w-12 h-3 bg-gradient-to-r from-indigo-600 to-purple-600'
                                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Stats Bar */}
                <div className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {[
                        { icon: Star, value: '4.9/5', label: 'Average Rating', color: 'from-yellow-500 to-orange-600' },
                        { icon: TrendingUp, value: '95%', label: 'Success Rate', color: 'from-green-500 to-emerald-600' },
                        { icon: Award, value: '10K+', label: 'Happy Students', color: 'from-indigo-500 to-purple-600' },
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl mb-3`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentTestimonials;