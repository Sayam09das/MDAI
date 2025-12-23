import React, { useState, useEffect, useRef } from 'react';
import { Video, Clock, Users, Calendar, Play, Lock, TrendingUp, Bell } from 'lucide-react';

const LiveClassesSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'live', 'upcoming'
    const sectionRef = useRef(null);

    // Simulate user login status - Change to true to test logged-in state
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Sample live classes data
    const liveClasses = [
        {
            id: 1,
            courseName: "Deep Learning Fundamentals",
            teacherName: "Dr. Sarah Johnson",
            teacherAvatar: "https://i.pravatar.cc/150?img=5",
            startTime: new Date(Date.now() - 20 * 60000), // Started 20 mins ago
            duration: 90,
            status: "live",
            viewers: 234,
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
            category: "AI/ML",
            isPaid: true
        },
        {
            id: 2,
            courseName: "Neural Networks Masterclass",
            teacherName: "Prof. Michael Chen",
            teacherAvatar: "https://i.pravatar.cc/150?img=12",
            startTime: new Date(Date.now() - 5 * 60000), // Started 5 mins ago
            duration: 120,
            status: "live",
            viewers: 189,
            thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop",
            category: "Advanced",
            isPaid: true
        },
        {
            id: 3,
            courseName: "Python for Data Science",
            teacherName: "Emma Williams",
            teacherAvatar: "https://i.pravatar.cc/150?img=9",
            startTime: new Date(Date.now() + 30 * 60000), // Starts in 30 mins
            duration: 60,
            status: "upcoming",
            viewers: 0,
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
            category: "Beginner",
            isPaid: true
        },
        {
            id: 4,
            courseName: "Computer Vision with OpenCV",
            teacherName: "Dr. James Rodriguez",
            teacherAvatar: "https://i.pravatar.cc/150?img=14",
            startTime: new Date(Date.now() + 90 * 60000), // Starts in 1.5 hours
            duration: 75,
            status: "upcoming",
            viewers: 0,
            thumbnail: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=500&fit=crop",
            category: "Intermediate",
            isPaid: true
        },
        {
            id: 5,
            courseName: "Natural Language Processing",
            teacherName: "Dr. Lisa Anderson",
            teacherAvatar: "https://i.pravatar.cc/150?img=20",
            startTime: new Date(Date.now() + 180 * 60000), // Starts in 3 hours
            duration: 90,
            status: "upcoming",
            viewers: 0,
            thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop",
            category: "Advanced",
            isPaid: true
        },
        {
            id: 6,
            courseName: "Machine Learning Algorithms",
            teacherName: "Prof. David Kim",
            teacherAvatar: "https://i.pravatar.cc/150?img=33",
            startTime: new Date(Date.now() + 240 * 60000), // Starts in 4 hours
            duration: 60,
            status: "upcoming",
            viewers: 0,
            thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=500&fit=crop",
            category: "Intermediate",
            isPaid: true
        }
    ];

    // Filter classes based on active tab
    const filteredClasses = liveClasses.filter(cls => {
        if (activeTab === 'live') return cls.status === 'live';
        if (activeTab === 'upcoming') return cls.status === 'upcoming';
        return true;
    });

    // Format time display
    const getTimeDisplay = (startTime, status) => {
        if (status === 'live') {
            const elapsed = Math.floor((currentTime - startTime) / 60000);
            return `Started ${elapsed} min ago`;
        } else {
            const minutesUntil = Math.floor((startTime - currentTime) / 60000);
            if (minutesUntil < 60) {
                return `Starts in ${minutesUntil} min`;
            } else {
                const hoursUntil = Math.floor(minutesUntil / 60);
                return `Starts in ${hoursUntil}h ${minutesUntil % 60}m`;
            }
        }
    };

    const handleJoinClass = (classItem) => {
        if (!isLoggedIn) {
            window.location.href = '#login';
        } else if (!classItem.isPaid) {
            alert('Please purchase this course to join the class');
        } else {
            // Join the live class
            alert(`Joining ${classItem.courseName}...`);
        }
    };

    const LiveClassCard = ({ classItem, index }) => {
        const isLive = classItem.status === 'live';

        return (
            <div
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${isLive ? 'border-red-500' : 'border-gray-100'
                    } ${isVisible ? 'animate-slideUp' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                {/* Live Badge */}
                {isLive && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                        <span>LIVE</span>
                    </div>
                )}

                {/* Upcoming Badge */}
                {!isLive && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-indigo-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        <Clock className="w-3 h-3" />
                        <span>UPCOMING</span>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {classItem.category}
                </div>

                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={classItem.thumbnail}
                        alt={classItem.courseName}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Play Icon Overlay */}
                    {isLive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                    {/* Course Name */}
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {classItem.courseName}
                    </h3>

                    {/* Teacher Info */}
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={classItem.teacherAvatar}
                            alt={classItem.teacherName}
                            className="w-10 h-10 rounded-full border-2 border-indigo-100"
                            loading="lazy"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{classItem.teacherName}</p>
                            <p className="text-xs text-gray-500">Instructor</p>
                        </div>
                    </div>

                    {/* Class Info */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{classItem.duration} min</span>
                            </div>
                            {isLive && (
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>{classItem.viewers} watching</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Time Display */}
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">
                            {getTimeDisplay(classItem.startTime, classItem.status)}
                        </span>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => handleJoinClass(classItem)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${isLive
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                            } ${!isLoggedIn || !classItem.isPaid ? 'relative' : ''}`}
                    >
                        {!isLoggedIn ? (
                            <>
                                <Lock className="w-4 h-4" />
                                Login to Join
                            </>
                        ) : !classItem.isPaid ? (
                            <>
                                <Lock className="w-4 h-4" />
                                Purchase Required
                            </>
                        ) : isLive ? (
                            <>
                                <Play className="w-4 h-4 fill-white" />
                                Join Live Now
                            </>
                        ) : (
                            <>
                                <Bell className="w-4 h-4" />
                                Set Reminder
                            </>
                        )}
                    </button>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
            </div>
        );
    };

    const liveCount = liveClasses.filter(c => c.status === 'live').length;
    const upcomingCount = liveClasses.filter(c => c.status === 'upcoming').length;

    return (
        <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
          background-size: 1000px 100%;
        }
      `}</style>

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className={`text-center mb-10 md:mb-16 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-red-600 tracking-wide uppercase">
                            Live Classes
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">Live Sessions</span>
                    </h2>

                    <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                        Learn in real-time with expert instructors. Ask questions, collaborate with peers, and get instant feedback.
                    </p>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-8">
                        <div className="flex items-center gap-2 bg-white px-4 md:px-6 py-3 rounded-xl shadow-md">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm md:text-base font-bold text-gray-900">{liveCount} Live Now</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 md:px-6 py-3 rounded-xl shadow-md">
                            <Clock className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                            <span className="text-sm md:text-base font-bold text-gray-900">{upcomingCount} Upcoming</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 md:px-6 py-3 rounded-xl shadow-md">
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                            <span className="text-sm md:text-base font-bold text-gray-900">423 Students Online</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className={`flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    {[
                        { key: 'all', label: 'All Classes', count: liveClasses.length },
                        { key: 'live', label: 'Live Now', count: liveCount },
                        { key: 'upcoming', label: 'Upcoming', count: upcomingCount }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 cursor-pointer ${activeTab === tab.key
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            {tab.label} <span className="ml-1 md:ml-2 text-xs md:text-sm opacity-75">({tab.count})</span>
                        </button>
                    ))}
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredClasses.map((classItem, index) => (
                        <LiveClassCard key={classItem.id} classItem={classItem} index={index} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredClasses.length === 0 && (
                    <div className="text-center py-16">
                        <Video className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No {activeTab} classes</h3>
                        <p className="text-gray-600">Check back later for more sessions</p>
                    </div>
                )}

                {/* Login Demo Toggle (Remove in production) */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setIsLoggedIn(!isLoggedIn)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                        Demo: Toggle Login ({isLoggedIn ? 'Logged In' : 'Not Logged In'})
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LiveClassesSection;