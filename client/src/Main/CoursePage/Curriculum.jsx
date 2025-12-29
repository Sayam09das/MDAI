import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronDown, ChevronUp, Play, FileText, Video,
    Clock, Lock, Download, ExternalLink, CheckCircle,
    BookOpen, Award, TrendingUp, Zap, Youtube
} from 'lucide-react';

const Curriculum = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [expandedModules, setExpandedModules] = useState([0]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const sectionRef = useRef(null);

    // Simulate user payment status - Change to true to test paid features
    const [isPaid, setIsPaid] = useState(false);

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

    const toggleModule = (moduleIndex) => {
        setExpandedModules(prev =>
            prev.includes(moduleIndex)
                ? prev.filter(i => i !== moduleIndex)
                : [...prev, moduleIndex]
        );
    };

    const toggleLessonComplete = (lessonId) => {
        setCompletedLessons(prev =>
            prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleYoutubeClick = (lessonId, youtubeUrl) => {
        if (!isPaid) {
            alert('Please purchase this course to access video lessons');
            window.location.href = '#enroll';
            return;
        }
        window.open(youtubeUrl, '_blank');
    };

    const handlePdfDownload = (lessonId, pdfUrl) => {
        if (!isPaid) {
            alert('Please purchase this course to download materials');
            window.location.href = '#enroll';
            return;
        }
        // Simulate download
        console.log('Downloading PDF:', pdfUrl);
        alert('PDF download started!');
    };

    const handleLiveClass = (lessonId, liveUrl) => {
        if (!isPaid) {
            alert('Please purchase this course to join live classes');
            window.location.href = '#enroll';
            return;
        }
        window.open(liveUrl, '_blank');
    };

    const curriculumData = {
        totalModules: 8,
        totalLessons: 64,
        totalDuration: "45h 30m",

        modules: [
            {
                id: 1,
                title: "Introduction to Machine Learning",
                duration: "4h 20m",
                lessons: 8,
                locked: false,
                description: "Start your journey into ML with foundational concepts",
                items: [
                    {
                        id: "1-1",
                        title: "What is Machine Learning?",
                        duration: "25 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example1",
                        locked: false
                    },
                    {
                        id: "1-2",
                        title: "Types of ML Algorithms",
                        duration: "30 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example2",
                        locked: false
                    },
                    {
                        id: "1-3",
                        title: "ML Fundamentals Cheat Sheet",
                        duration: "5 min",
                        type: "pdf",
                        pdfUrl: "https://example.com/ml-fundamentals.pdf",
                        locked: false
                    },
                    {
                        id: "1-4",
                        title: "Setting Up Python Environment",
                        duration: "35 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example3",
                        locked: false
                    },
                    {
                        id: "1-5",
                        title: "Live Q&A: Getting Started with ML",
                        duration: "60 min",
                        type: "live",
                        liveUrl: "https://meet.google.com/example",
                        locked: false,
                        liveDate: "Dec 28, 2025 - 10:00 AM EST"
                    },
                    {
                        id: "1-6",
                        title: "Introduction to NumPy",
                        duration: "40 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example4",
                        locked: false
                    },
                    {
                        id: "1-7",
                        title: "NumPy Reference Guide",
                        duration: "10 min",
                        type: "pdf",
                        pdfUrl: "https://example.com/numpy-guide.pdf",
                        locked: false
                    },
                    {
                        id: "1-8",
                        title: "Module 1 Assessment",
                        duration: "20 min",
                        type: "pdf",
                        pdfUrl: "https://example.com/assessment-1.pdf",
                        locked: false
                    }
                ]
            },
            {
                id: 2,
                title: "Supervised Learning Algorithms",
                duration: "8h 45m",
                lessons: 12,
                locked: false,
                description: "Master regression, classification, and decision trees",
                items: [
                    {
                        id: "2-1",
                        title: "Linear Regression Theory",
                        duration: "35 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example5",
                        locked: false
                    },
                    {
                        id: "2-2",
                        title: "Linear Regression Implementation",
                        duration: "45 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example6",
                        locked: false
                    },
                    {
                        id: "2-3",
                        title: "Regression Equations Workbook",
                        duration: "15 min",
                        type: "pdf",
                        pdfUrl: "https://example.com/regression.pdf",
                        locked: false
                    },
                    {
                        id: "2-4",
                        title: "Logistic Regression",
                        duration: "40 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example7",
                        locked: false
                    },
                    {
                        id: "2-5",
                        title: "Live Workshop: Building Your First Model",
                        duration: "90 min",
                        type: "live",
                        liveUrl: "https://meet.google.com/example",
                        locked: false,
                        liveDate: "Dec 30, 2025 - 2:00 PM EST"
                    },
                    {
                        id: "2-6",
                        title: "Decision Trees Explained",
                        duration: "50 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example8",
                        locked: false
                    }
                ]
            },
            {
                id: 3,
                title: "Unsupervised Learning",
                duration: "6h 15m",
                lessons: 10,
                locked: false,
                description: "Clustering, dimensionality reduction, and pattern discovery",
                items: [
                    {
                        id: "3-1",
                        title: "K-Means Clustering",
                        duration: "45 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example9",
                        locked: false
                    },
                    {
                        id: "3-2",
                        title: "Hierarchical Clustering",
                        duration: "40 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example10",
                        locked: false
                    },
                    {
                        id: "3-3",
                        title: "Clustering Algorithms Comparison",
                        duration: "10 min",
                        type: "pdf",
                        pdfUrl: "https://example.com/clustering.pdf",
                        locked: false
                    },
                    {
                        id: "3-4",
                        title: "PCA & Dimensionality Reduction",
                        duration: "55 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example11",
                        locked: false
                    }
                ]
            },
            {
                id: 4,
                title: "Deep Learning Fundamentals",
                duration: "10h 30m",
                lessons: 15,
                locked: true,
                description: "Neural networks, backpropagation, and optimization",
                items: [
                    {
                        id: "4-1",
                        title: "Introduction to Neural Networks",
                        duration: "50 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example12",
                        locked: true
                    },
                    {
                        id: "4-2",
                        title: "Activation Functions",
                        duration: "35 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example13",
                        locked: true
                    },
                    {
                        id: "4-3",
                        title: "Neural Networks Cheat Sheet",
                        duration: "8 min",
                        type: "pdf",
                        pdfUrl: "https://example.com/neural-nets.pdf",
                        locked: true
                    }
                ]
            },
            {
                id: 5,
                title: "Convolutional Neural Networks",
                duration: "7h 45m",
                lessons: 11,
                locked: true,
                description: "Computer vision and image processing with CNNs",
                items: [
                    {
                        id: "5-1",
                        title: "CNN Architecture",
                        duration: "55 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example14",
                        locked: true
                    },
                    {
                        id: "5-2",
                        title: "Image Classification Project",
                        duration: "90 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example15",
                        locked: true
                    }
                ]
            },
            {
                id: 6,
                title: "Natural Language Processing",
                duration: "5h 55m",
                lessons: 9,
                locked: true,
                description: "Text processing, sentiment analysis, and transformers",
                items: [
                    {
                        id: "6-1",
                        title: "NLP Fundamentals",
                        duration: "45 min",
                        type: "video",
                        youtubeUrl: "https://youtube.com/watch?v=example16",
                        locked: true
                    }
                ]
            }
        ]
    };

    const getLessonIcon = (type) => {
        switch (type) {
            case 'video':
                return Video;
            case 'pdf':
                return FileText;
            case 'live':
                return Play;
            default:
                return BookOpen;
        }
    };

    const getLessonTypeLabel = (type) => {
        switch (type) {
            case 'video':
                return { label: '🎥 Video', color: 'text-red-600', bg: 'bg-red-50' };
            case 'pdf':
                return { label: '📄 PDF', color: 'text-blue-600', bg: 'bg-blue-50' };
            case 'live':
                return { label: '🔴 Live', color: 'text-green-600', bg: 'bg-green-50' };
            default:
                return { label: '📚 Material', color: 'text-gray-600', bg: 'bg-gray-50' };
        }
    };

    const calculateProgress = () => {
        const totalLessons = curriculumData.modules.reduce((sum, module) =>
            sum + module.items.length, 0
        );
        return Math.round((completedLessons.length / totalLessons) * 100);
    };

    return (
        <section ref={sectionRef} className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
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

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 2000px;
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className={`text-center mb-10 md:mb-12 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            Course Curriculum
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Complete Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Roadmap</span>
                    </h2>

                    <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                        Structured modules with video lessons, downloadable resources, and live sessions
                    </p>
                </div>

                {/* Stats Overview */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-indigo-100 text-center">
                        <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{curriculumData.totalModules}</div>
                        <div className="text-xs md:text-sm text-gray-600">Modules</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-purple-100 text-center">
                        <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{curriculumData.totalLessons}</div>
                        <div className="text-xs md:text-sm text-gray-600">Lessons</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-pink-100 text-center">
                        <Clock className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{curriculumData.totalDuration}</div>
                        <div className="text-xs md:text-sm text-gray-600">Duration</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-green-100 text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{calculateProgress()}%</div>
                        <div className="text-xs md:text-sm text-gray-600">Progress</div>
                    </div>
                </div>

                {/* Progress Bar */}
                {completedLessons.length > 0 && (
                    <div className="mb-8 bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                            <span className="text-sm font-bold text-indigo-600">{calculateProgress()}% Complete</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                                style={{ width: `${calculateProgress()}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Modules List */}
                <div className="space-y-4 md:space-y-6">
                    {curriculumData.modules.map((module, moduleIndex) => {
                        const isExpanded = expandedModules.includes(moduleIndex);
                        const completedInModule = module.items.filter(item =>
                            completedLessons.includes(item.id)
                        ).length;
                        const progressPercent = Math.round((completedInModule / module.items.length) * 100);

                        return (
                            <div
                                key={module.id}
                                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${module.locked
                                        ? 'border-gray-200 opacity-75'
                                        : isExpanded
                                            ? 'border-indigo-300 shadow-xl'
                                            : 'border-gray-200 hover:border-indigo-200 hover:shadow-xl'
                                    } ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                                style={{ animationDelay: `${0.3 + moduleIndex * 0.1}s` }}
                            >
                                {/* Module Header */}
                                <button
                                    onClick={() => !module.locked && toggleModule(moduleIndex)}
                                    className={`w-full p-5 md:p-6 text-left transition-all duration-300 ${module.locked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                                        }`}
                                    disabled={module.locked}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Module Number & Lock */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-full">
                                                    Module {module.id}
                                                </span>
                                                {module.locked && (
                                                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                                        <Lock className="w-3 h-3" />
                                                        Locked
                                                    </span>
                                                )}
                                                {!module.locked && completedInModule > 0 && (
                                                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {completedInModule}/{module.items.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title & Description */}
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                                {module.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-gray-600 mb-4">
                                                {module.description}
                                            </p>

                                            {/* Meta Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1.5">
                                                    <Video className="w-4 h-4" />
                                                    {module.lessons} lessons
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    {module.duration}
                                                </span>
                                            </div>

                                            {/* Progress Bar for Module */}
                                            {!module.locked && completedInModule > 0 && (
                                                <div className="mt-4">
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                                            style={{ width: `${progressPercent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expand Icon */}
                                        <div className="flex-shrink-0">
                                            {module.locked ? (
                                                <Lock className="w-6 h-6 text-gray-400" />
                                            ) : isExpanded ? (
                                                <ChevronUp className="w-6 h-6 text-indigo-600 transition-transform duration-300" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-gray-400 transition-transform duration-300" />
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* Module Lessons */}
                                {isExpanded && !module.locked && (
                                    <div className="border-t border-gray-100 animate-slideDown">
                                        <div className="p-4 md:p-6 bg-gray-50 space-y-3">
                                            {module.items.map((lesson, lessonIndex) => {
                                                const LessonIcon = getLessonIcon(lesson.type);
                                                const typeInfo = getLessonTypeLabel(lesson.type);
                                                const isCompleted = completedLessons.includes(lesson.id);
                                                const isLocked = lesson.locked || (!isPaid && lessonIndex > 1); // First 2 lessons free

                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all duration-300 ${isCompleted
                                                                ? 'border-green-200 bg-green-50/50'
                                                                : 'border-gray-200 hover:border-indigo-200 hover:shadow-md'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            {/* Completion Checkbox */}
                                                            <button
                                                                onClick={() => !isLocked && toggleLessonComplete(lesson.id)}
                                                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isCompleted
                                                                        ? 'bg-green-500 border-green-500'
                                                                        : isLocked
                                                                            ? 'border-gray-300 cursor-not-allowed'
                                                                            : 'border-gray-300 hover:border-indigo-500 cursor-pointer'
                                                                    }`}
                                                                disabled={isLocked}
                                                            >
                                                                {isCompleted && (
                                                                    <CheckCircle className="w-5 h-5 text-white fill-green-500" />
                                                                )}
                                                            </button>

                                                            {/* Lesson Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                                    <h4 className={`text-base md:text-lg font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                                                        }`}>
                                                                        {lesson.title}
                                                                    </h4>
                                                                    {isLocked && (
                                                                        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                                    <span className={`${typeInfo.bg} ${typeInfo.color} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                                                                        {typeInfo.label}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                                                        <Clock className="w-3.5 h-3.5" />
                                                                        {lesson.duration}
                                                                    </span>
                                                                </div>

                                                                {lesson.type === 'live' && lesson.liveDate && (
                                                                    <div className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                                                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-ring"></span>
                                                                        {lesson.liveDate}
                                                                    </div>
                                                                )}

                                                                {/* Action Buttons */}
                                                                <div className="flex flex-wrap gap-2">
                                                                    {lesson.type === 'video' && (
                                                                        <button
                                                                            onClick={() => handleYoutubeClick(lesson.id, lesson.youtubeUrl)}
                                                                            disabled={isLocked}
                                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isLocked
                                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                                    : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-105'
                                                                                }`}
                                                                        >
                                                                            <Youtube className="w-4 h-4" />
                                                                            Watch Video
                                                                        </button>
                                                                    )}

                                                                    {lesson.type === 'pdf' && (
                                                                        <button
                                                                            onClick={() => handlePdfDownload(lesson.id, lesson.pdfUrl)}
                                                                            disabled={isLocked}
                                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isLocked
                                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-105'
                                                                                }`}
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                            Download PDF
                                                                        </button>
                                                                    )}

                                                                    {lesson.type === 'live' && (
                                                                        <button
                                                                            onClick={() => handleLiveClass(lesson.id, lesson.liveUrl)}
                                                                            disabled={isLocked}
                                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isLocked
                                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-105'
                                                                                }`}
                                                                        >
                                                                            <Play className="w-4 h-4 fill-white" />
                                                                            Join Live Class
                                                                        </button>
                                                                    )}

                                                                    {!isPaid && lessonIndex > 1 && (
                                                                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                                                                            <Lock className="w-3 h-3" />
                                                                            Enroll to unlock
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Locked Module Message */}
                                {isExpanded && module.locked && (
                                    <div className="border-t border-gray-100 p-6 bg-gray-50 text-center">
                                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Complete Previous Modules to Unlock</h4>
                                        <p className="text-sm text-gray-600 mb-4">Finish the earlier modules to access this content</p>
                                        <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 cursor-pointer">
                                            Continue Learning
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Demo Toggle (Remove in production) */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setIsPaid(!isPaid)}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                        Demo: Toggle Payment Status ({isPaid ? 'Paid ✓' : 'Not Paid ✗'})
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Toggle to test paid vs free access features
                    </p>
                </div>

                {/* CTA Section */}
                <div className={`mt-12 md:mt-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '30px 30px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <Award className="w-16 h-16 text-white mx-auto mb-4" />
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Ready to Master Machine Learning?
                            </h3>
                            <p className="text-base md:text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
                                Get instant access to all {curriculumData.totalLessons} lessons, downloadable resources, and live sessions
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                                    Enroll Now - $99
                                </button>
                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto">
                                    Try Free Lessons
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Curriculum;