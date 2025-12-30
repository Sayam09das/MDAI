import React, { useState, useEffect, useRef } from 'react';
import {
    Star,
    Users,
    Clock,
    TrendingUp,
    Award,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    PlayCircle,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Target
} from 'lucide-react';

const RelatedCourses = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('similar');
    const [currentSlide, setCurrentSlide] = useState(0);
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

    const similarCourses = [
        {
            id: 1,
            title: 'Advanced React & State Management',
            teacher: 'Dr. Sarah Johnson',
            teacherAvatar: 'SJ',
            rating: 4.9,
            students: 12430,
            price: 54.99,
            originalPrice: 199.99,
            duration: '42 hours',
            lessons: 285,
            level: 'Advanced',
            thumbnail: 'from-purple-500 to-pink-600',
            bestseller: true,
            category: 'Web Development',
        },
        {
            id: 2,
            title: 'Full Stack JavaScript Bootcamp',
            teacher: 'Michael Chen',
            teacherAvatar: 'MC',
            rating: 4.8,
            students: 9856,
            price: 49.99,
            originalPrice: 189.99,
            duration: '38 hours',
            lessons: 256,
            level: 'Intermediate',
            thumbnail: 'from-blue-500 to-indigo-600',
            bestseller: false,
            category: 'Web Development',
        },
        {
            id: 3,
            title: 'Modern CSS & Responsive Design',
            teacher: 'Emily Rodriguez',
            teacherAvatar: 'ER',
            rating: 4.7,
            students: 8234,
            price: 39.99,
            originalPrice: 149.99,
            duration: '28 hours',
            lessons: 198,
            level: 'Beginner',
            thumbnail: 'from-emerald-500 to-teal-600',
            bestseller: false,
            category: 'Web Development',
        },
        {
            id: 4,
            title: 'Node.js & Express Backend Mastery',
            teacher: 'David Kim',
            teacherAvatar: 'DK',
            rating: 4.8,
            students: 11200,
            price: 59.99,
            originalPrice: 209.99,
            duration: '45 hours',
            lessons: 312,
            level: 'Advanced',
            thumbnail: 'from-orange-500 to-red-600',
            bestseller: true,
            category: 'Web Development',
        },
    ];

    const sameTeacherCourses = [
        {
            id: 5,
            title: 'Python Programming: Zero to Hero',
            teacher: 'Dr. Sarah Johnson',
            teacherAvatar: 'SJ',
            rating: 4.9,
            students: 15600,
            price: 44.99,
            originalPrice: 169.99,
            duration: '35 hours',
            lessons: 245,
            level: 'Beginner',
            thumbnail: 'from-cyan-500 to-blue-600',
            bestseller: true,
            category: 'Programming',
        },
        {
            id: 6,
            title: 'Data Structures & Algorithms',
            teacher: 'Dr. Sarah Johnson',
            teacherAvatar: 'SJ',
            rating: 4.8,
            students: 10450,
            price: 64.99,
            originalPrice: 229.99,
            duration: '52 hours',
            lessons: 356,
            level: 'Advanced',
            thumbnail: 'from-indigo-500 to-purple-600',
            bestseller: false,
            category: 'Computer Science',
        },
        {
            id: 7,
            title: 'Machine Learning Fundamentals',
            teacher: 'Dr. Sarah Johnson',
            teacherAvatar: 'SJ',
            rating: 4.9,
            students: 13280,
            price: 69.99,
            originalPrice: 249.99,
            duration: '48 hours',
            lessons: 298,
            level: 'Intermediate',
            thumbnail: 'from-pink-500 to-rose-600',
            bestseller: true,
            category: 'Data Science',
        },
    ];

    const sameCategoryCourses = [
        {
            id: 8,
            title: 'Vue.js Complete Guide',
            teacher: 'James Wilson',
            teacherAvatar: 'JW',
            rating: 4.7,
            students: 7890,
            price: 49.99,
            originalPrice: 179.99,
            duration: '32 hours',
            lessons: 218,
            level: 'Intermediate',
            thumbnail: 'from-green-500 to-emerald-600',
            bestseller: false,
            category: 'Web Development',
        },
        {
            id: 9,
            title: 'Angular Enterprise Applications',
            teacher: 'Lisa Anderson',
            teacherAvatar: 'LA',
            rating: 4.8,
            students: 9450,
            price: 59.99,
            originalPrice: 219.99,
            duration: '46 hours',
            lessons: 324,
            level: 'Advanced',
            thumbnail: 'from-red-500 to-orange-600',
            bestseller: true,
            category: 'Web Development',
        },
        {
            id: 10,
            title: 'Web Performance Optimization',
            teacher: 'Alex Thompson',
            teacherAvatar: 'AT',
            rating: 4.6,
            students: 6720,
            price: 44.99,
            originalPrice: 159.99,
            duration: '26 hours',
            lessons: 187,
            level: 'Intermediate',
            thumbnail: 'from-yellow-500 to-orange-600',
            bestseller: false,
            category: 'Web Development',
        },
    ];

    const tabs = [
        { id: 'similar', label: 'Similar Courses', courses: similarCourses },
        { id: 'teacher', label: 'By Same Teacher', courses: sameTeacherCourses },
        { id: 'category', label: 'Same Category', courses: sameCategoryCourses },
    ];

    const activeCourses = tabs.find(tab => tab.id === activeTab)?.courses || [];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % activeCourses.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? activeCourses.length - 1 : prev - 1));
    };

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">You May Also Like</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Related <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Courses</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Continue your learning journey with these handpicked courses
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className={`flex justify-center mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex flex-wrap justify-center bg-white rounded-2xl p-1.5 shadow-lg border border-gray-200 gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setCurrentSlide(0);
                                }}
                                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="relative">

                    {/* Desktop Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white rounded-full items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white rounded-full items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-10 border border-gray-200"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Course Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeCourses.map((course, index) => (
                            <div
                                key={course.id}
                                className={`group relative transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-20'
                                    }`}
                                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                            >
                                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${course.thumbnail} transition-transform duration-500 group-hover:scale-110`}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <PlayCircle className="w-16 h-16 text-white opacity-20" />
                                            </div>
                                        </div>

                                        {/* Bestseller Badge */}
                                        {course.bestseller && (
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center space-x-1 shadow-lg">
                                                <Award className="w-3 h-3" />
                                                <span>Bestseller</span>
                                            </div>
                                        )}

                                        {/* Level Badge */}
                                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full shadow-md">
                                            {course.level}
                                        </div>

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                                                <PlayCircle className="w-7 h-7 text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">

                                        {/* Category */}
                                        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-3">
                                            {course.category}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                                            {course.title}
                                        </h3>

                                        {/* Teacher */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className={`w-8 h-8 bg-gradient-to-br ${course.thumbnail} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                                                {course.teacherAvatar}
                                            </div>
                                            <span className="text-sm text-gray-600">{course.teacher}</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>{course.lessons} lessons</span>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(course.rating)
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {course.rating}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({course.students.toLocaleString()})
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 mb-4" />

                                        {/* Price & CTA */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="text-xl font-bold text-gray-900">
                                                        ${course.price}
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ${course.originalPrice}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-green-600 font-semibold">
                                                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                                </span>
                                            </div>

                                            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-1">
                                                <span>View</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Dots Indicator */}
                    <div className="flex lg:hidden justify-center space-x-2 mt-8">
                        {activeCourses.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`transition-all duration-300 rounded-full ${currentSlide === index
                                        ? 'w-8 h-2 bg-gradient-to-r from-indigo-600 to-purple-600'
                                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Browse All Button */}
                <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <button className="group px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex items-center space-x-2 mx-auto">
                        <span>Browse All Courses</span>
                        <Target className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Trust Indicators */}
                <div className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {[
                        { icon: Users, value: '45K+', label: 'Active Students' },
                        { icon: BookOpen, value: '500+', label: 'Total Courses' },
                        { icon: Award, value: '4.9', label: 'Avg Rating' },
                        { icon: CheckCircle, value: '98%', label: 'Satisfaction' },
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <Icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default RelatedCourses;