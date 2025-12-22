import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Clock, Users, Star, TrendingUp, Award, PlayCircle, Heart, Share2 } from 'lucide-react';

const Course = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [likedCourses, setLikedCourses] = useState([]);
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

    const toggleLike = (courseId) => {
        setLikedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const courses = [
        {
            id: 1,
            title: 'Complete Web Development Bootcamp',
            teacher: 'Dr. Sarah Johnson',
            teacherAvatar: 'SJ',
            price: 49.99,
            originalPrice: 99.99,
            rating: 4.9,
            students: 2453,
            duration: '24 hours',
            lessons: 156,
            level: 'Beginner',
            category: 'Development',
            thumbnail: 'from-blue-500 to-indigo-600',
            icon: BookOpen,
            trending: true,
        },
        {
            id: 2,
            title: 'Advanced React & Next.js Masterclass',
            teacher: 'Prof. Michael Chen',
            teacherAvatar: 'MC',
            price: 59.99,
            originalPrice: 119.99,
            rating: 4.8,
            students: 1876,
            duration: '18 hours',
            lessons: 98,
            level: 'Advanced',
            category: 'Development',
            thumbnail: 'from-purple-500 to-pink-600',
            icon: PlayCircle,
            bestseller: true,
        },
        {
            id: 3,
            title: 'Data Science & Machine Learning A-Z',
            teacher: 'Dr. Emily Rodriguez',
            teacherAvatar: 'ER',
            price: 69.99,
            originalPrice: 139.99,
            rating: 4.9,
            students: 3201,
            duration: '32 hours',
            lessons: 210,
            level: 'Intermediate',
            category: 'Data Science',
            thumbnail: 'from-emerald-500 to-teal-600',
            icon: TrendingUp,
            trending: true,
        },
        {
            id: 4,
            title: 'UI/UX Design: Figma to Code',
            teacher: 'Alex Thompson',
            teacherAvatar: 'AT',
            price: 44.99,
            originalPrice: 89.99,
            rating: 4.7,
            students: 1543,
            duration: '16 hours',
            lessons: 89,
            level: 'Beginner',
            category: 'Design',
            thumbnail: 'from-orange-500 to-red-600',
            icon: Award,
            bestseller: false,
        },
        {
            id: 5,
            title: 'Python Programming: Zero to Hero',
            teacher: 'James Wilson',
            teacherAvatar: 'JW',
            price: 39.99,
            originalPrice: 79.99,
            rating: 4.8,
            students: 2987,
            duration: '20 hours',
            lessons: 132,
            level: 'Beginner',
            category: 'Programming',
            thumbnail: 'from-cyan-500 to-blue-600',
            icon: BookOpen,
            trending: false,
        },
        {
            id: 6,
            title: 'Digital Marketing Mastery 2025',
            teacher: 'Lisa Anderson',
            teacherAvatar: 'LA',
            price: 54.99,
            originalPrice: 109.99,
            rating: 4.6,
            students: 1234,
            duration: '14 hours',
            lessons: 76,
            level: 'Intermediate',
            category: 'Marketing',
            thumbnail: 'from-pink-500 to-rose-600',
            icon: TrendingUp,
            bestseller: true,
        },
    ];

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
                        <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600">Most Popular</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Featured Courses
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our most popular courses taught by industry experts
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {courses.map((course, index) => {
                        const Icon = course.icon;
                        const isLiked = likedCourses.includes(course.id);

                        return (
                            <div
                                key={course.id}
                                className={`group relative transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-20'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                                onMouseEnter={() => setHoveredCard(course.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden">
                                        {/* Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${course.thumbnail} transition-transform duration-500 ${hoveredCard === course.id ? 'scale-110' : 'scale-100'
                                            }`}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Icon className="w-20 h-20 text-white opacity-20" />
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            {course.trending && (
                                                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center space-x-1 shadow-lg">
                                                    <TrendingUp className="w-3 h-3" />
                                                    <span>Trending</span>
                                                </span>
                                            )}
                                            {course.bestseller && (
                                                <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center space-x-1 shadow-lg">
                                                    <Award className="w-3 h-3" />
                                                    <span>Bestseller</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${hoveredCard === course.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                            }`}>
                                            <button
                                                onClick={() => toggleLike(course.id)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isLiked
                                                        ? 'bg-red-500 text-white scale-110'
                                                        : 'bg-white text-gray-700 hover:bg-red-50'
                                                    }`}
                                            >
                                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                            </button>
                                            <button className="w-9 h-9 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors duration-300">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Category Tag */}
                                        <div className="absolute bottom-3 left-3">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full shadow">
                                                {course.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                                            {course.title}
                                        </h3>

                                        {/* Teacher */}
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {course.teacherAvatar}
                                            </div>
                                            <span className="text-sm text-gray-600">{course.teacher}</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center space-x-4 mb-4 text-xs text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>{course.lessons} lessons</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>{course.students.toLocaleString()}</span>
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
                                            <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                                            <span className="text-xs text-gray-500">({course.students} reviews)</span>
                                        </div>

                                        {/* Level Badge */}
                                        <div className="mb-4">
                                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                    course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-purple-100 text-purple-700'
                                                }`}>
                                                {course.level}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 mb-4" />

                                        {/* Price & CTA */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="text-2xl font-bold text-gray-900">
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

                                            <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-indigo-600/10 to-transparent pointer-events-none transition-opacity duration-300 ${hoveredCard === course.id ? 'opacity-100' : 'opacity-0'
                                        }`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <button className="group px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl">
                        <span className="flex items-center space-x-2">
                            <span>View All Courses</span>
                            <BookOpen className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                    </button>
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
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
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

export default Course;