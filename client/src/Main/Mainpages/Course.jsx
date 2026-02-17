import React, { useState, useEffect, useRef } from "react";
import { Clock, Users, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import coursesData from "../../../data/courses.json";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Get backend URL
const getBackendURL = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl && envUrl.trim() !== '' && envUrl !== 'undefined') {
        return envUrl.replace(/\/+$/, '');
    }
    if (import.meta.env.PROD || import.meta.env.NODE_ENV === 'production') {
        return 'https://mdai-self.vercel.app';
    }
    return 'http://localhost:5000';
};

const BACKEND_URL = getBackendURL();


const LazyImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target); 
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={`${className} relative`}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
            )}

            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
        </div>
    );
};


const CourseCard = ({ course, index, isRealCourse = false }) => {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    
    // Handle both real courses (from API) and demo courses (from JSON)
    const courseImage = isRealCourse ? course.thumbnail?.url : course.image;
    const courseTitle = course.title;
    const courseDescription = course.description;
    const courseDuration = course.duration;
    const courseStudents = course.students || 0;
    const courseLevel = course.level;
    const coursePrice = isRealCourse ? `$${course.price}` : course.price;

    const handleEnroll = (e) => {
        e.preventDefault();
        
        if (isRealCourse) {
            // Check if user is logged in
            const token = localStorage.getItem("token");
            if (token) {
                // User is logged in, navigate to All Courses page
                navigate('/student/all-courses');
            } else {
                // User is not logged in, save redirect URL and go to login
                localStorage.setItem("redirectUrl", "/student/all-courses");
                window.location.href = "/login";
            }
        } else {
            // Redirect to login for demo courses
            localStorage.setItem("redirectUrl", "/student/all-courses");
            window.location.href = "/login";
        }
    };

    return (
        <div
            ref={cardRef}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                perspective: "1000px"
            }}
        >
            {/* Image with parallax effect */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 transform group-hover:scale-110 transition-transform duration-700 ease-out">
                    <LazyImage
                        src={courseImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop"}
                        alt={courseTitle}
                        className="w-full h-full"
                    />
                </div>
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-indigo-600">
                    {courseLevel}
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {courseTitle}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {courseDescription}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{courseDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{courseStudents.toLocaleString()}</span>
                    </div>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-gray-900">
                        {coursePrice}
                    </span>

                    <button
                        onClick={handleEnroll}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        Enroll Now
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};


const CoursesSection = () => {
    const [displayedCourses, setDisplayedCourses] = useState(8);
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [useRealCourses, setUseRealCourses] = useState(false);

    // Refs for GSAP animations
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const gridRef = useRef(null);
    const cardsRef = useRef([]);
    const bgPatternRef = useRef(null);

    // Add card ref to array
    const addToCardsRef = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    // Fetch real courses from backend
    useEffect(() => {
        const fetchRealCourses = async () => {
            try {
                setLoadingCourses(true);
                const response = await fetch(`${BACKEND_URL}/api/courses`);
                const data = await response.json();
                
                if (response.ok && data.courses && data.courses.length > 0) {
                    setCourses(data.courses);
                    setUseRealCourses(true);
                } else {
                    // Fallback to demo courses if no real courses
                    setCourses(coursesData);
                    setUseRealCourses(false);
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                // Fallback to demo courses on error
                setCourses(coursesData);
                setUseRealCourses(false);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchRealCourses();
    }, []);

    // GSAP Scroll Animations with enhanced effects
    useEffect(() => {
        if (loadingCourses) return;

        const ctx = gsap.context(() => {
            // Header animation with scrub
            if (headerRef.current) {
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
            }

            // Course cards - each animates independently with 3D effect and parallax
            cardsRef.current.forEach((card, index) => {
                // Card reveal animation
                gsap.fromTo(card,
                    { opacity: 0, y: 80, scale: 0.8, rotateX: 45 },
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

                // Parallax effect on scroll
                gsap.fromTo(card,
                    { y: 0 },
                    {
                        y: -20,
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

            // Background pattern parallax
            gsap.to(bgPatternRef.current, {
                y: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [loadingCourses, courses]);

    const loadMoreCourses = () => {
        setIsLoading(true);

        setTimeout(() => {
            setDisplayedCourses((prev) =>
                Math.min(prev + 8, courses.length)
            );
            setIsLoading(false);
        }, 500);
    };

    const coursesToShow = courses.slice(0, displayedCourses);
    const hasMore = displayedCourses < courses.length;

    return (
        <section
            id="courses"
            ref={sectionRef}
            className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
        >
            {/* Background Pattern with parallax */}
            <div ref={bgPatternRef} className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #4F46E5 1px, transparent 0)`,
                    backgroundSize: '30px 30px',
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">
                            Our Courses
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Explore Our <span className="text-indigo-600">AI Courses</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Learn from industry experts and master the skills needed to excel in
                        artificial intelligence
                    </p>
                </div>

                {/* Loading State */}
                {loadingCourses && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="flex gap-4 mb-4">
                                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Grid */}
                {!loadingCourses && (
                    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12" style={{ perspective: "1000px" }}>
                        {coursesToShow.map((course, index) => (
                            <div 
                                key={course._id || course.id} 
                                ref={addToCardsRef}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <CourseCard 
                                    course={course} 
                                    index={index} 
                                    isRealCourse={useRealCourses} 
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {!loadingCourses && hasMore && (
                    <div className="flex justify-center">
                        <button
                            onClick={loadMoreCourses}
                            disabled={isLoading}
                            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 shadow-lg disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    View More Courses
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* End Message */}
                {!loadingCourses && !hasMore && courses.length > 8 && (
                    <p className="text-center text-gray-600 font-medium">
                        You've viewed all {courses.length} courses
                    </p>
                )}
            </div>
        </section>
    );
};

export default CoursesSection;
