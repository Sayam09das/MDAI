import React, { useState, useEffect, useRef } from "react";
import { Clock, Users, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import coursesData from "../../../data/courses.json";

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
            // Navigate to AllCourse page for real courses
            navigate('/student/all-courses');
        } else {
            // Redirect to login for demo courses
            window.location.href = "/login";
        }
    };

    return (
        <div
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <LazyImage
                    src={courseImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop"}
                    alt={courseTitle}
                    className="w-full h-full"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-indigo-600">
                    {courseLevel}
                </div>
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
            className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50"
        >
            {/* Animation */}
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
      `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
                        {coursesToShow.map((course, index) => (
                            <CourseCard key={course._id || course.id} course={course} index={index} isRealCourse={useRealCourses} />
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
