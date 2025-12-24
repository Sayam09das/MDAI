import React, { useState, useRef, useEffect } from 'react';
import {
    BookOpen, List, Video, FileText, Star,
    Clock, Users, Award, Download, Play,
    CheckCircle, Lock, Calendar, MessageSquare
} from 'lucide-react';

const CourseNavigationTabs = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isVisible, setIsVisible] = useState(false);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabsRef = useRef([]);
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

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
        const activeTabElement = tabsRef.current[activeIndex];

        if (activeTabElement) {
            setIndicatorStyle({
                left: activeTabElement.offsetLeft,
                width: activeTabElement.offsetWidth
            });
        }
    }, [activeTab]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'curriculum', label: 'Curriculum', icon: List },
        { id: 'live-classes', label: 'Live Classes', icon: Video },
        { id: 'resources', label: 'Resources', icon: FileText },
        { id: 'reviews', label: 'Reviews', icon: Star }
    ];

    // Sample course data
    const courseData = {
        overview: {
            title: "Machine Learning Fundamentals",
            description: "Master the foundations of machine learning with hands-on projects and real-world applications. This comprehensive course covers everything from basic concepts to advanced algorithms.",
            features: [
                { icon: Clock, text: "12 weeks duration", value: "90+ hours content" },
                { icon: Users, text: "2,840 students enrolled", value: "Active community" },
                { icon: Award, text: "Certificate of completion", value: "Industry recognized" },
                { icon: Video, text: "HD video lectures", value: "Lifetime access" }
            ],
            whatYouLearn: [
                "Understand core ML algorithms and their applications",
                "Build and train neural networks from scratch",
                "Work with real-world datasets and preprocessing",
                "Deploy ML models to production environments",
                "Master Python libraries like NumPy, Pandas, Scikit-learn",
                "Apply supervised and unsupervised learning techniques"
            ],
            prerequisites: [
                "Basic Python programming knowledge",
                "Understanding of basic mathematics",
                "Familiarity with data structures"
            ]
        },
        curriculum: {
            modules: [
                {
                    title: "Introduction to Machine Learning",
                    duration: "2 weeks",
                    lessons: 8,
                    locked: false,
                    topics: [
                        { title: "What is Machine Learning?", duration: "15 min", completed: true },
                        { title: "Types of ML Algorithms", duration: "20 min", completed: true },
                        { title: "Setting up Python Environment", duration: "25 min", completed: false },
                        { title: "Introduction to NumPy", duration: "30 min", completed: false }
                    ]
                },
                {
                    title: "Supervised Learning",
                    duration: "3 weeks",
                    lessons: 12,
                    locked: false,
                    topics: [
                        { title: "Linear Regression", duration: "35 min", completed: false },
                        { title: "Logistic Regression", duration: "40 min", completed: false },
                        { title: "Decision Trees", duration: "45 min", completed: false },
                        { title: "Random Forests", duration: "50 min", completed: false }
                    ]
                },
                {
                    title: "Unsupervised Learning",
                    duration: "2 weeks",
                    lessons: 8,
                    locked: false,
                    topics: [
                        { title: "K-Means Clustering", duration: "30 min", completed: false },
                        { title: "Hierarchical Clustering", duration: "35 min", completed: false },
                        { title: "PCA & Dimensionality Reduction", duration: "40 min", completed: false }
                    ]
                },
                {
                    title: "Deep Learning Basics",
                    duration: "3 weeks",
                    lessons: 15,
                    locked: true,
                    topics: [
                        { title: "Neural Networks Introduction", duration: "45 min", completed: false },
                        { title: "Backpropagation", duration: "50 min", completed: false },
                        { title: "CNNs for Image Recognition", duration: "60 min", completed: false }
                    ]
                },
                {
                    title: "Model Deployment",
                    duration: "2 weeks",
                    lessons: 10,
                    locked: true,
                    topics: [
                        { title: "Flask API Development", duration: "40 min", completed: false },
                        { title: "Docker Containerization", duration: "45 min", completed: false },
                        { title: "Cloud Deployment (AWS)", duration: "55 min", completed: false }
                    ]
                }
            ]
        },
        liveClasses: {
            upcoming: [
                {
                    title: "Introduction to Neural Networks",
                    instructor: "Dr. Sarah Johnson",
                    date: "Dec 28, 2025",
                    time: "10:00 AM - 11:30 AM EST",
                    attendees: 234,
                    status: "upcoming"
                },
                {
                    title: "Deep Dive: Convolutional Networks",
                    instructor: "Prof. Michael Chen",
                    date: "Dec 30, 2025",
                    time: "2:00 PM - 3:30 PM EST",
                    attendees: 189,
                    status: "upcoming"
                }
            ],
            recorded: [
                {
                    title: "Python Fundamentals for ML",
                    instructor: "Emma Williams",
                    duration: "1h 45m",
                    views: 1240,
                    date: "Dec 20, 2025"
                },
                {
                    title: "Data Preprocessing Techniques",
                    instructor: "Dr. James Rodriguez",
                    duration: "2h 15m",
                    views: 980,
                    date: "Dec 18, 2025"
                }
            ]
        },
        resources: {
            materials: [
                { type: "PDF", name: "Course Handbook", size: "2.4 MB", downloads: 1240 },
                { type: "PDF", name: "Python Cheat Sheet", size: "1.1 MB", downloads: 2150 },
                { type: "ZIP", name: "Dataset Collection", size: "45.2 MB", downloads: 890 },
                { type: "PDF", name: "ML Algorithms Guide", size: "3.8 MB", downloads: 1680 }
            ],
            codeRepositories: [
                { name: "Course Code Repository", platform: "GitHub", stars: 456 },
                { name: "Project Templates", platform: "GitHub", stars: 289 }
            ]
        },
        reviews: {
            rating: 4.8,
            totalReviews: 1247,
            distribution: [
                { stars: 5, count: 890, percentage: 71 },
                { stars: 4, count: 267, percentage: 21 },
                { stars: 3, count: 62, percentage: 5 },
                { stars: 2, count: 19, percentage: 2 },
                { stars: 1, count: 9, percentage: 1 }
            ],
            recent: [
                {
                    name: "Alex Thompson",
                    avatar: "https://i.pravatar.cc/150?img=33",
                    rating: 5,
                    date: "2 days ago",
                    comment: "Excellent course! The instructor explains complex concepts in a very understandable way. The hands-on projects really helped solidify my understanding."
                },
                {
                    name: "Maria Garcia",
                    avatar: "https://i.pravatar.cc/150?img=45",
                    rating: 5,
                    date: "1 week ago",
                    comment: "Best ML course I've taken. The curriculum is well-structured and the live sessions are incredibly valuable. Highly recommended!"
                },
                {
                    name: "John Smith",
                    avatar: "https://i.pravatar.cc/150?img=12",
                    rating: 4,
                    date: "2 weeks ago",
                    comment: "Great content overall. Would love to see more advanced topics covered in future updates."
                }
            ]
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Course Description */}
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {courseData.overview.title}
                            </h3>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                {courseData.overview.description}
                            </p>
                        </div>

                        {/* Course Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {courseData.overview.features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <Icon className="w-8 h-8 text-indigo-600 mb-3" />
                                        <p className="text-sm font-semibold text-gray-900 mb-1">{feature.text}</p>
                                        <p className="text-xs text-gray-600">{feature.value}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* What You'll Learn */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.overview.whatYouLearn.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 group">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                        <p className="text-gray-700 text-sm md:text-base">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Prerequisites */}
                        <div className="bg-amber-50 rounded-2xl p-6 md:p-8 border border-amber-100">
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h4>
                            <ul className="space-y-2">
                                {courseData.overview.prerequisites.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-700">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-sm md:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'curriculum':
                return (
                    <div className="space-y-4 animate-fadeIn">
                        {courseData.curriculum.modules.map((module, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Module Header */}
                                <div className={`p-5 md:p-6 ${module.locked ? 'bg-gray-50' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-bold text-indigo-600 bg-white px-3 py-1 rounded-full">
                                                    Module {index + 1}
                                                </span>
                                                {module.locked && (
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{module.title}</h4>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {module.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Video className="w-4 h-4" />
                                                    {module.lessons} lessons
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Module Topics */}
                                <div className="p-5 md:p-6 space-y-3">
                                    {module.topics.map((topic, tIndex) => (
                                        <div
                                            key={tIndex}
                                            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${module.locked
                                                    ? 'bg-gray-50 cursor-not-allowed'
                                                    : 'bg-gray-50 hover:bg-indigo-50 cursor-pointer hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                {topic.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                ) : module.locked ? (
                                                    <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                ) : (
                                                    <Play className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                )}
                                                <span className={`text-sm md:text-base font-medium ${topic.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                                    }`}>
                                                    {topic.title}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500 flex-shrink-0">{topic.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'live-classes':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Upcoming Classes */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-indigo-600" />
                                Upcoming Live Sessions
                            </h3>
                            <div className="space-y-4">
                                {courseData.liveClasses.upcoming.map((session, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-5 md:p-6 shadow-lg border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                        UPCOMING
                                                    </span>
                                                </div>
                                                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{session.title}</h4>
                                                <p className="text-sm text-gray-600 mb-3">Instructor: {session.instructor}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {session.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {session.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {session.attendees} registered
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap">
                                                Register Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recorded Classes */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Video className="w-6 h-6 text-indigo-600" />
                                Recorded Sessions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.liveClasses.recorded.map((session, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 fill-white" />
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{session.title}</h4>
                                            <p className="text-sm text-gray-600 mb-3">By {session.instructor}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {session.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {session.views} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'resources':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Downloadable Materials */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Download className="w-6 h-6 text-indigo-600" />
                                Downloadable Materials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.resources.materials.map((material, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-1">{material.name}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span>{material.type}</span>
                                                        <span>•</span>
                                                        <span>{material.size}</span>
                                                        <span>•</span>
                                                        <span>{material.downloads} downloads</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Download className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code Repositories */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Code Repositories</h3>
                            <div className="space-y-4">
                                {courseData.resources.codeRepositories.map((repo, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg mb-2">{repo.name}</h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                                    <span>{repo.platform}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        {repo.stars} stars
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="px-5 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                                View on GitHub
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'reviews':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Rating Overview */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-indigo-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Overall Rating */}
                                <div className="text-center md:text-left">
                                    <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                                        {courseData.reviews.rating}
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-6 h-6 ${i < Math.floor(courseData.reviews.rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600">
                                        Based on {courseData.reviews.totalReviews.toLocaleString()} reviews
                                    </p>
                                </div>

                                {/* Rating Distribution */}
                                <div className="space-y-2">
                                    {courseData.reviews.distribution.map((dist, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-700 w-8">{dist.stars}★</span>
                                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                                                    style={{ width: `${dist.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-12 text-right">{dist.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Reviews */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h3>
                            <div className="space-y-6">
                                {courseData.reviews.recent.map((review, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={review.avatar}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full border-2 border-indigo-100"
                                                loading="lazy"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                                    <span className="text-sm text-gray-500">{review.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes slideIndicator {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="mb-8 md:mb-12">
                    {/* Desktop Tabs */}
                    <div className="hidden md:block relative bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
                        <div className="flex items-center relative">
                            {/* Active Indicator */}
                            <div
                                className="absolute h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transition-all duration-300 ease-out"
                                style={{
                                    left: indicatorStyle.left,
                                    width: indicatorStyle.width
                                }}
                            ></div>

                            {/* Tab Buttons */}
                            {tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        ref={el => tabsRef.current[index] = el}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 px-4 font-semibold rounded-xl transition-all duration-300 cursor-pointer ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="hidden lg:inline">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="md:hidden">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 focus:border-indigo-500 focus:outline-none cursor-pointer"
                        >
                            {tabs.map(tab => (
                                <option key={tab.id} value={tab.id}>
                                    {tab.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 border border-gray-100">
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};

export default CourseNavigationTabs;