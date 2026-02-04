import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Lock, Play, Clock, Award, BookOpen,
  TrendingUp, Target, Calendar, ChevronDown, ChevronUp, Filter,
  Download, Share2, BarChart3, Zap, Trophy, Star, Video,
  FileText, Code, Headphones, Eye, X, Menu, ArrowLeft,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getStudentCourseProgress,
  getCourseProgress,
  markLessonComplete
} from '../../../../lib/api/studentApi.js';

const CourseProgress = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [expandedModule, setExpandedModule] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingLesson, setCompletingLesson] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Optimized animation variants for all devices
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const slideVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const scaleVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const expandVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Fetch all courses progress
  const fetchCoursesProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentCourseProgress();
      if (response.success) {
        setCourses(response.courses || []);
        if (response.courses && response.courses.length > 0 && !selectedCourse) {
          setSelectedCourse(response.courses[0]);
        }
      }
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  // Fetch specific course detail
  const fetchCourseDetail = useCallback(async (courseId) => {
    try {
      const response = await getCourseProgress(courseId);
      if (response.success) {
        const progressData = response.progress || {};
        const formattedResponse = {
          ...response,
          progress: progressData.percentage || 0,
          completedLessons: progressData.completedLessons || 0,
          totalLessons: progressData.totalLessons || 0,
          remainingLessons: progressData.remainingLessons || 0,
        };
        setCourseDetail(formattedResponse);

        setSelectedCourse(prev => ({
          ...prev,
          progress: progressData.percentage || prev?.progress || 0,
          completedLessons: progressData.completedLessons || prev?.completedLessons || 0,
          totalLessons: progressData.totalLessons || prev?.totalLessons || 0,
        }));
      }
    } catch (err) {
      console.error("Fetch course detail error:", err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCoursesProgress();

    toast.info(
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        <span>Track your learning progress</span>
      </div>,
      {
        position: window.innerWidth < 768 ? "top-center" : "top-right",
        autoClose: 3000,
      }
    );
  }, [fetchCoursesProgress]);

  useEffect(() => {
    if (selectedCourse?.courseId) {
      fetchCourseDetail(selectedCourse.courseId);
    }
  }, [selectedCourse, fetchCourseDetail]);

  // Handle lesson completion
  const handleMarkComplete = async (lessonId) => {
    if (!selectedCourse?.courseId || !lessonId) return;

    try {
      setCompletingLesson(lessonId);
      const response = await markLessonComplete(selectedCourse.courseId, lessonId);

      if (response.success) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-semibold">Lesson Completed! 🎉</div>
              <div className="text-sm opacity-90">Progress: {response.progress}%</div>
            </div>
          </div>,
          {
            position: window.innerWidth < 768 ? "top-center" : "top-right",
          }
        );

        if (response.isCompleted) {
          setTimeout(() => {
            toast.success(
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className="font-bold">Course Completed! 🏆</div>
                  <div className="text-sm">Amazing achievement!</div>
                </div>
              </div>,
              {
                position: "top-center",
                autoClose: 5000,
              }
            );
          }, 1000);
        }

        await fetchCoursesProgress();
        await fetchCourseDetail(selectedCourse.courseId);
      }
    } catch (err) {
      console.error("Mark lesson complete error:", err);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{err.message || "Failed to mark lesson as complete"}</span>
        </div>,
        {
          position: window.innerWidth < 768 ? "top-center" : "top-right",
        }
      );
    } finally {
      setCompletingLesson(null);
    }
  };

  const handleLessonClick = (lesson) => {
    if (lesson.isCompleted) {
      toast.info(
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          <span>Reviewing: {lesson.title}</span>
        </div>,
        {
          position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
          autoClose: 2000,
        }
      );
    } else {
      toast.success(
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          <div>
            <div className="font-semibold">Starting Lesson</div>
            <div className="text-sm opacity-90">{lesson.title}</div>
          </div>
        </div>,
        {
          position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
          autoClose: 2000,
        }
      );
    }
  };

  const getStatusIcon = (isCompleted, isCurrent) => {
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (isCurrent) return <Play className="w-5 h-5 text-blue-500" />;
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'reading':
        return <FileText className="w-4 h-4" />;
      case 'coding':
        return <Code className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const calculateStats = () => {
    if (!courseDetail?.lessons) return { completed: 0, pending: 0 };
    const lessons = courseDetail.lessons;
    return {
      completed: lessons.filter(l => l.isCompleted).length,
      inProgress: lessons.filter(l => l.isCurrent && !l.isCompleted).length,
      pending: lessons.filter(l => !l.isCompleted && !l.isCurrent).length,
      locked: 0
    };
  };

  const getOrganizedLessons = () => {
    if (!courseDetail?.lessons) return [];
    const lessons = courseDetail.lessons;

    const grouped = {};
    lessons.forEach(lesson => {
      const date = lesson.date || 'No Date';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(lesson);
    });

    return Object.entries(grouped).map(([date, lessons]) => ({
      id: date,
      title: date,
      lessons: lessons.sort((a, b) => {
        const timeA = a.time || '';
        const timeB = b.time || '';
        return timeA.localeCompare(timeB);
      })
    }));
  };

  const getFilteredLessons = () => {
    const modules = getOrganizedLessons();
    return modules.map(module => ({
      ...module,
      lessons: module.lessons.filter(lesson => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'completed') return lesson.isCompleted;
        if (filterStatus === 'in-progress') return lesson.isCurrent && !lesson.isCompleted;
        if (filterStatus === 'pending') return !lesson.isCompleted && !lesson.isCurrent;
        return true;
      })
    })).filter(module => module.lessons.length > 0);
  };

  const stats = calculateStats();
  const filteredModules = getFilteredLessons();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 font-medium"
          >
            Loading your progress...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          variants={scaleVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error Loading Progress</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchCoursesProgress}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          variants={scaleVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
          <p className="text-gray-600">Enroll in a course to start tracking your progress</p>
        </motion.div>
      </div>
    );
  }

  const progress = selectedCourse?.progress || 0;
  const thumbnail = courseDetail?.course?.thumbnail?.url || selectedCourse?.thumbnail?.url || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <ToastContainer
        position={window.innerWidth < 768 ? "top-center" : "top-right"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16 sm:mt-0"
      />

      {/* Mobile Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="lg:hidden bg-white shadow-lg sticky top-0 z-40 p-4"
      >
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate px-2">
            {selectedCourse?.title || 'Course Progress'}
          </h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(showSidebar || window.innerWidth >= 1024) && (
            <>
              <motion.div
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed lg:sticky top-0 left-0 w-72 sm:w-80 h-screen bg-white shadow-2xl z-50 overflow-y-auto lg:z-0"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl sm:text-2xl font-bold text-gray-900"
                    >
                      My Courses
                    </motion.h2>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowSidebar(false)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {courses.map((course, index) => (
                      <motion.button
                        key={course.enrollmentId || course.courseId}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowSidebar(false);
                        }}
                        className={`w-full text-left p-4 rounded-xl transition-all ${selectedCourse?.courseId === course.courseId
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                          }`}
                      >
                        <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs sm:text-sm opacity-90 mb-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span>{course.progress}%</span>
                          <span className="font-bold">{course.status}</span>
                        </div>
                        <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-white rounded-full"
                          />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Overlay for mobile sidebar */}
              {showSidebar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setShowSidebar(false)}
                />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block mb-4"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  Course Progress
                </h1>
                <p className="text-gray-600">Track your learning journey</p>
              </motion.div>

              {/* Course Header Card */}
              <motion.div
                variants={scaleVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-4 sm:mb-6"
              >
                {thumbnail && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ duration: 0.5 }}
                    className="relative h-28 sm:h-40 overflow-hidden"
                  >
                    <motion.img
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                      src={thumbnail}
                      alt={selectedCourse?.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4"
                    >
                      <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 line-clamp-2">
                        {selectedCourse?.title}
                      </h2>
                      <p className="text-white/90 text-xs sm:text-sm line-clamp-1">
                        {courseDetail?.course?.description}
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                <div className="p-4 sm:p-6">
                  {/* Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 sm:mb-6"
                  >
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        Overall Progress
                      </span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                        className="text-xl sm:text-2xl font-bold text-blue-600"
                      >
                        {progress}%
                      </motion.span>
                    </div>
                    <div className="relative h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>{selectedCourse?.completedLessons || 0} completed</span>
                      <span>{selectedCourse?.totalLessons || 0} total lessons</span>
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4"
                  >
                    {[
                      { icon: CheckCircle2, value: stats.completed, label: 'Completed', color: 'green', delay: 0.1 },
                      { icon: Play, value: stats.inProgress, label: 'In Progress', color: 'blue', delay: 0.2 },
                      { icon: Circle, value: stats.pending, label: 'Pending', color: 'orange', delay: 0.3 },
                      { icon: Clock, value: `${Math.round((selectedCourse?.totalTimeSpent || 0) / 60)}h`, label: 'Time Spent', color: 'gray', delay: 0.4 }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-lg sm:rounded-xl p-3 sm:p-4`}
                      >
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-2`}>
                          <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}-600`} />
                        </div>
                        <motion.p
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: stat.delay }}
                          className="text-lg sm:text-2xl font-bold text-gray-900"
                        >
                          {stat.value}
                        </motion.p>
                        <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6"
                  >
                    {progress === 100 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        <span>Certificate</span>
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchCoursesProgress}
                      className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Filter Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
              >
                {[
                  { value: 'all', label: 'All Lessons', icon: BookOpen },
                  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
                  { value: 'in-progress', label: 'In Progress', icon: Play },
                  { value: 'pending', label: 'Pending', icon: Circle }
                ].map((filter, index) => (
                  <motion.button
                    key={filter.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${filterStatus === filter.value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                      }`}
                  >
                    <filter.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Modules and Lessons */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 sm:space-y-4"
            >
              {filteredModules?.map((module, moduleIndex) => (
                <motion.div
                  key={module.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                    onClick={() => setExpandedModule(expandedModule === moduleIndex ? -1 : moduleIndex)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-xl flex-shrink-0"
                      >
                        {moduleIndex + 1}
                      </motion.div>
                      <div className="text-left min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                          {module.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedModule === moduleIndex ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedModule === moduleIndex && (
                      <motion.div
                        variants={expandVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="overflow-hidden"
                      >
                        <div className="px-3 sm:px-6 pb-4 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <motion.div
                              key={lesson.lessonId}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: lessonIndex * 0.05 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all ${lesson.isCompleted
                                  ? 'bg-green-50'
                                  : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md cursor-pointer'
                                }`}
                              onClick={() => handleLessonClick(lesson)}
                            >
                              <div className="flex items-center gap-2 sm:gap-4">
                                <motion.div
                                  whileHover={{ scale: 1.2 }}
                                  className="flex-shrink-0"
                                >
                                  {getStatusIcon(lesson.isCompleted, lesson.isCurrent)}
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                    {lesson.title}
                                  </h4>
                                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span className="truncate">{lesson.time} ({lesson.duration}min)</span>
                                    </div>
                                  </div>
                                </div>
                                {!lesson.isCompleted && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkComplete(lesson.lessonId);
                                    }}
                                    disabled={completingLesson === lesson.lessonId}
                                    className="flex-shrink-0 px-2 sm:px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    {completingLesson === lesson.lessonId ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                      />
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Complete</span>
                                      </>
                                    )}
                                  </motion.button>
                                )}
                                {lesson.isCompleted && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex-shrink-0 px-2 sm:px-3 py-1.5 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded-lg"
                                  >
                                    Done
                                  </motion.span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {filteredModules?.length === 0 && (
              <motion.div
                variants={scaleVariants}
                initial="hidden"
                animate="visible"
                className="text-center py-12 sm:py-20 bg-white rounded-xl sm:rounded-2xl shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Filter className="w-12 h-12 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-600 mb-2">
                  No lessons found
                </h3>
                <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;