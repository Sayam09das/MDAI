import React, { useState, useEffect, useRef } from 'react';
import {
    Video,
    Calendar,
    Clock,
    Users,
    Radio,
    Lock,
    CheckCircle,
    Bell,
    PlayCircle,
    TrendingUp,
    Sparkles,
    Award,
    ArrowRight,
    User,
    AlertCircle,
    Eye
} from 'lucide-react';

const LiveClassesSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('live'); // 'live' or 'upcoming'
    const [userPaymentStatus, setUserPaymentStatus] = useState('paid'); // 'paid' or 'pending'
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const liveClasses = [
        {
            id: 1,
            title: 'Advanced React Patterns & Performance',
            teacher: {
                name: 'Dr. Sarah Johnson',
                avatar: 'SJ',
                rating: 4.9,
            },
            startTime: new Date(Date.now() - 15 * 60000), // Started 15 mins ago
            duration: 90,
            currentViewers: 234,
            maxViewers: 500,
            thumbnail: 'https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fsv3gpvwpc47gbm3zkd4u.jpg',
            topic: 'React Advanced',
            isRecording: true,
        },
        {
            id: 2,
            title: 'Machine Learning Fundamentals',
            teacher: {
                name: 'Prof. Michael Chen',
                avatar: 'MC',
                rating: 4.8,
            },
            startTime: new Date(Date.now() - 30 * 60000), // Started 30 mins ago
            duration: 120,
            currentViewers: 189,
            maxViewers: 300,
            thumbnail: 'https://capabilitydevelopment.org/assets/upload/Course/0a2636de86fbddac950f96d0589d9968.jpg',
            topic: 'Data Science',
            isRecording: true,
        },
    ];

    const upcomingClasses = [
        {
            id: 3,
            title: 'UI/UX Design Principles Workshop',
            teacher: {
                name: 'Emily Rodriguez',
                avatar: 'ER',
                rating: 4.9,
            },
            scheduledTime: new Date(Date.now() + 2 * 60 * 60000), // In 2 hours
            duration: 60,
            expectedViewers: 150,
            thumbnail: 'from-orange-500 to-red-600',
            topic: 'Design',
            reminderSet: false,
        },
        {
            id: 4,
            title: 'Python for Data Analysis',
            teacher: {
                name: 'David Kim',
                avatar: 'DK',
                rating: 4.7,
            },
            scheduledTime: new Date(Date.now() + 5 * 60 * 60000), // In 5 hours
            duration: 90,
            expectedViewers: 200,
            thumbnail: 'from-emerald-500 to-teal-600',
            topic: 'Programming',
            reminderSet: false,
        },
        {
            id: 5,
            title: 'Digital Marketing Strategy 2025',
            teacher: {
                name: 'Lisa Anderson',
                avatar: 'LA',
                rating: 4.8,
            },
            scheduledTime: new Date(Date.now() + 24 * 60 * 60000), // Tomorrow
            duration: 75,
            expectedViewers: 180,
            thumbnail: 'from-cyan-500 to-blue-600',
            topic: 'Marketing',
            reminderSet: false,
        },
    ];

    const getTimeUntil = (date) => {
        const diff = date - currentTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `In ${days} day${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `In ${hours}h ${minutes}m`;
        } else {
            return `In ${minutes}m`;
        }
    };

    const getDuration = (startTime, durationMinutes) => {
        const elapsed = Math.floor((currentTime - startTime) / 60000);
        const remaining = durationMinutes - elapsed;
        return remaining > 0 ? remaining : 0;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full mb-4">
                        <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                        <span className="text-sm font-semibold text-red-600">Live Now</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Live <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Classes</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join real-time interactive sessions with expert instructors
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className={`flex justify-center mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex bg-gray-100 rounded-xl p-1 shadow-inner">
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${activeTab === 'live'
                                ? 'bg-white text-red-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Radio className={`w-4 h-4 ${activeTab === 'live' ? 'animate-pulse' : ''}`} />
                            <span>Live Now</span>
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {liveClasses.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${activeTab === 'upcoming'
                                ? 'bg-white text-indigo-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Upcoming</span>
                            <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                                {upcomingClasses.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Payment Status Demo Switcher */}
                <div className={`flex justify-center mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setUserPaymentStatus('paid')}
                            className={`px-4 py-2 rounded text-sm font-semibold transition-all duration-300 ${userPaymentStatus === 'paid'
                                ? 'bg-green-500 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            ✅ Payment Success
                        </button>
                        <button
                            onClick={() => setUserPaymentStatus('pending')}
                            className={`px-4 py-2 rounded text-sm font-semibold transition-all duration-300 ${userPaymentStatus === 'pending'
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            ⏳ Payment Pending
                        </button>
                    </div>
                </div>

                {/* Live Classes Grid */}
                {activeTab === 'live' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {liveClasses.map((liveClass, index) => {
                            const remaining = getDuration(liveClass.startTime, liveClass.duration);
                            const progress = ((liveClass.duration - remaining) / liveClass.duration) * 100;

                            return (
                                <div
                                    key={liveClass.id}
                                    className={`group transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-20'
                                        }`}
                                    style={{ transitionDelay: `${(index + 2) * 150}ms` }}
                                >
                                    <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-red-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

                                        {/* Live Badge */}
                                        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-3 py-1.5 bg-red-500 rounded-lg shadow-lg animate-pulse">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                            <span className="text-white font-bold text-sm">LIVE</span>
                                            <Eye className="w-4 h-4 text-white" />
                                        </div>

                                        {/* Recording Badge */}
                                        {liveClass.isRecording && (
                                            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-semibold flex items-center space-x-1">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                <span>REC</span>
                                            </div>
                                        )}

                                        {/* Thumbnail */}
                                        <div className="relative h-48 overflow-hidden group">

                                            {/* Image */}
                                            <img
                                                src={liveClass.thumbnail}
                                                alt={liveClass.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Dark overlay */}
                                            <div className="absolute inset-0 bg-black/40" />

                                            {/* Center Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Video className="w-20 h-20 text-white opacity-40" />
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30">
                                                <div
                                                    className="h-full bg-red-500 transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>


                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Topic Badge */}
                                            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-3">
                                                {liveClass.topic}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                                                {liveClass.title}
                                            </h3>

                                            {/* Teacher */}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className={`w-10 h-10 bg-gradient-to-br ${liveClass.thumbnail} rounded-full flex items-center justify-center text-white bg-indigo-500  font-bold text-sm`}>
                                                    {liveClass.teacher.avatar}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 flex items-center space-x-1">
                                                        <span>{liveClass.teacher.name}</span>
                                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                                                        <Award className="w-3 h-3 text-yellow-500" />
                                                        <span>{liveClass.teacher.rating} rating</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex items-center space-x-2">
                                                    <Users className="w-4 h-4 text-red-600" />
                                                    <span className="font-semibold">
                                                        {liveClass.currentViewers}/{liveClass.maxViewers}
                                                    </span>
                                                    <span>watching</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                    <span className="font-semibold">{remaining} min</span>
                                                    <span>left</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {userPaymentStatus === 'paid' ? (
                                                <button className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center space-x-2 group/btn">
                                                    <Video className="w-5 h-5" />
                                                    <span>Join Live Class</span>
                                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full px-6 py-3 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                                                >
                                                    <Lock className="w-5 h-5" />
                                                    <span>Payment Required</span>
                                                </button>
                                            )}

                                            {userPaymentStatus === 'pending' && (
                                                <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-orange-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Complete payment to join live classes</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Upcoming Classes Grid */}
                {activeTab === 'upcoming' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {upcomingClasses.map((upcomingClass, index) => (
                            <div
                                key={upcomingClass.id}
                                className={`group transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-20'
                                    }`}
                                style={{ transitionDelay: `${(index + 2) * 150}ms` }}
                            >
                                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

                                    {/* Countdown Badge */}
                                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-indigo-500 rounded-lg text-white text-sm font-bold shadow-lg">
                                        {getTimeUntil(upcomingClass.scheduledTime)}
                                    </div>

                                    {/* Thumbnail */}
                                    <div className={`relative h-40 bg-gradient-to-br ${upcomingClass.thumbnail} transition-transform duration-500 group-hover:scale-105`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Calendar className="w-16 h-16 text-white opacity-20" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Topic Badge */}
                                        <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full mb-3">
                                            {upcomingClass.topic}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                                            {upcomingClass.title}
                                        </h3>

                                        {/* Teacher */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className={`w-8 h-8 bg-gradient-to-br ${upcomingClass.thumbnail} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                                                {upcomingClass.teacher.avatar}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {upcomingClass.teacher.name}
                                            </span>
                                        </div>

                                        {/* Schedule Info */}
                                        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-indigo-600" />
                                                <span>{formatDate(upcomingClass.scheduledTime)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-indigo-600" />
                                                <span>{formatTime(upcomingClass.scheduledTime)} ({upcomingClass.duration} min)</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-indigo-600" />
                                                <span>{upcomingClass.expectedViewers}+ expected</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-2">
                                            {userPaymentStatus === 'paid' ? (
                                                <>
                                                    <button className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-not-allowed">
                                                        <Bell className="w-4 h-4" />
                                                        <span>Set Reminder</span>
                                                    </button>
                                                    <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 cursor-not-allowed">
                                                        <PlayCircle className="w-4 h-4" />
                                                        <span className='cursor-not-allowed'>View Details</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full px-4 py-2.5 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                                                >
                                                    <Lock className="w-4 h-4" />
                                                    <span>Complete Payment</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State for Demo */}
                {activeTab === 'live' && liveClasses.length === 0 && (
                    <div className="text-center py-16">
                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Live Classes Right Now</h3>
                        <p className="text-gray-600">Check upcoming schedule for next sessions</p>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
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

export default LiveClassesSection;