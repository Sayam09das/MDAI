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

  // Simplified animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
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

  // Loading state - simplified
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error Loading Progress</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchCoursesProgress}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
          <p className="text-gray-600">Enroll in a course to start tracking your progress</p>
        </div>
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
      <div className="lg:hidden bg-white shadow-lg sticky top-0 z-40 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate px-2">
            {selectedCourse?.title || 'Course Progress'}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - simplified animations */}
        <AnimatePresence>
          {(showSidebar || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed lg:sticky top-0 left-0 w-72 sm:w-80 h-screen bg-white shadow-2xl z-50 overflow-y-auto lg:z-0"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Courses</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  {courses.map((course) => (
                    <button
                      key={course.enrollmentId || course.courseId}
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowSidebar(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedCourse?.courseId === course.courseId
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
                        <div
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="hidden lg:block mb-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  Course Progress
                </h1>
                <p className="text-gray-600">Track your learning journey</p>
              </div>

              {/* Course Header Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-4 sm:mb-6">
                {thumbnail && (
                  <div className="relative h-28 sm:h-40 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={selectedCourse?.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 line-clamp-2">
                        {selectedCourse?.title}
                      </h2>
                      <p className="text-white/90 text-xs sm:text-sm line-clamp-1">
                        {courseDetail?.course?.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  {/* Progress Bar */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        Overall Progress
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="relative h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>{selectedCourse?.completedLessons || 0} completed</span>
                      <span>{selectedCourse?.totalLessons || 0} total lessons</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.completed}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                      <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                        <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.pending}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {Math.round((selectedCourse?.totalTimeSpent || 0) / 60)}h
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Time Spent</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {progress === 100 && (
                      <button className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>Certificate</span>
                      </button>
                    )}
                    <button className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button 
                      onClick={fetchCoursesProgress}
                      className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { value: 'all', label: 'All Lessons', icon: BookOpen },
                  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
                  { value: 'in-progress', label: 'In Progress', icon: Play },
                  { value: 'pending', label: 'Pending', icon: Circle }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      filterStatus === filter.value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                    }`}
                  >
                    <filter.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modules and Lessons */}
            <div className="space-y-3 sm:space-y-4">
              {filteredModules?.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedModule(expandedModule === moduleIndex ? -1 : moduleIndex)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-xl flex-shrink-0">
                        {moduleIndex + 1}
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                          {module.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    {expandedModule === moduleIndex ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedModule === moduleIndex && (
                    <div className="px-3 sm:px-6 pb-4 space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.lessonId}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all ${
                            lesson.isCompleted
                              ? 'bg-green-50'
                              : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md cursor-pointer'
                          }`}
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex-shrink-0">
                              {getStatusIcon(lesson.isCompleted, lesson.isCurrent)}
                            </div>
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkComplete(lesson.lessonId);
                                }}
                                disabled={completingLesson === lesson.lessonId}
                                className="flex-shrink-0 px-2 sm:px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1"
                              >
                                {completingLesson === lesson.lessonId ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Complete</span>
                                  </>
                                )}
                              </button>
                            )}
                            {lesson.isCompleted && (
                              <span className="flex-shrink-0 px-2 sm:px-3 py-1.5 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded-lg">
                                Done
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredModules?.length === 0 && (
              <div className="text-center py-12 sm:py-20 bg-white rounded-xl sm:rounded-2xl shadow-lg">
                <Filter className="w-12 h-12 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-2xl font-bold text-gray-600 mb-2">
                  No lessons found
                </h3>
                <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;