import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Video, FileText, Sparkles, Play, CheckCircle } from 'lucide-react';

const MainHeader = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        { icon: Video, text: 'Live Classes', color: 'text-indigo-600' },
        { icon: BookOpen, text: 'Expert Courses', color: 'text-blue-600' },
        { icon: FileText, text: 'Study Materials', color: 'text-purple-600' },
    ];

    const stats = [
        { number: '10K+', label: 'Students' },
        { number: '500+', label: 'Courses' },
        { number: '100+', label: 'Teachers' },
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Orbs */}
                <div
                    className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-transform duration-1000 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    }}
                />
                <div
                    className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-transform duration-1000 ease-out"
                    style={{
                        transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                    }}
                />
                <div
                    className="absolute -bottom-20 left-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-transform duration-1000 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                    }}
                />

                {/* Geometric Shapes */}
                <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-indigo-300 rounded-lg opacity-20 transform rotate-12" />
                <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-2 border-purple-300 rounded-full opacity-20" />
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Column - Text Content */}
                    <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm border border-indigo-100">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">AI-Powered Learning</span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                Learn from{' '}
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Expert Teachers
                                </span>
                                , Live & Anytime
                            </h1>

                            {/* Subheading */}
                            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                                Courses, live classes, PDFs, and real-time learning — all in one platform. Start your journey today.
                            </p>
                        </div>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-3">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-105"
                                        style={{
                                            transitionDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <Icon className={`w-4 h-4 ${feature.color}`} />
                                        <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="group relative px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40 hover:-translate-y-0.5">
                                <span className="relative z-10">Browse Courses</span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <button className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:-translate-y-0.5 hover:shadow-lg">
                                Become a Teacher
                            </button>
                        </div>

                        {/* Social Proof / Stats */}
                        <div className="pt-4 flex items-center space-x-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.number}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Illustration */}
                    <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="relative">

                            {/* Main Illustration Card */}
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">

                                {/* Video Preview Mockup */}
                                <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl overflow-hidden mb-6 group cursor-pointer">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                            <Play className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Fake Video Elements */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                                        LIVE
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Advanced React Patterns</span>
                                            <span className="text-xs">245 watching</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Cards Stack */}
                                <div className="space-y-3">
                                    {[
                                        { title: 'Web Development Bootcamp', students: '1.2K', rating: '4.9' },
                                        { title: 'Data Science Masterclass', students: '890', rating: '4.8' },
                                    ].map((course, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                                            style={{
                                                transform: `translateX(${index * -10}px)`,
                                            }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                    <BookOpen className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">{course.title}</div>
                                                    <div className="text-xs text-gray-600">{course.students} students</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span className="text-yellow-500 text-lg">★</span>
                                                <span className="font-semibold text-gray-900 text-sm">{course.rating}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce-slow">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <div>
                                        <div className="text-xs font-semibold text-gray-900">Verified Teachers</div>
                                        <div className="text-xs text-gray-600">100% Certified</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                            >
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-gray-900">2.5K+ Students</div>
                                        <div className="text-xs text-gray-600">Learning Now</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

            {/* Custom Animation Styles */}
            <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default MainHeader;