import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Circle, Lock, Play, Clock, Award, BookOpen, 
  TrendingUp, Target, Calendar, ChevronDown, ChevronUp, Filter,
  Download, Share2, BarChart3, Zap, Trophy, Star, Video,
  FileText, Code, Headphones, Eye, X, Menu, ArrowLeft
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseProgress = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedModule, setExpandedModule] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState('modules');

  const courses = [
    {
      id: 1,
      title: "Advanced React & Next.js Masterclass",
      instructor: "Sarah Johnson",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      totalLessons: 48,
      completedLessons: 32,
      progress: 67,
      estimatedTime: "12h 30m",
      deadline: "Mar 15, 2026",
      modules: [
        {
          id: 1,
          title: "React Fundamentals",
          lessons: [
            { id: 1, title: "Introduction to React 18", duration: "15m", type: "video", status: "completed", rating: 5 },
            { id: 2, title: "JSX and Components", duration: "20m", type: "video", status: "completed", rating: 5 },
            { id: 3, title: "Props and State", duration: "25m", type: "video", status: "completed", rating: 4 },
            { id: 4, title: "Hooks Deep Dive", duration: "30m", type: "video", status: "completed", rating: 5 }
          ]
        },
        {
          id: 2,
          title: "Advanced Patterns",
          lessons: [
            { id: 5, title: "Custom Hooks", duration: "22m", type: "video", status: "completed", rating: 5 },
            { id: 6, title: "Context API Mastery", duration: "28m", type: "video", status: "completed", rating: 4 },
            { id: 7, title: "Performance Optimization", duration: "35m", type: "video", status: "in-progress", rating: 0 },
            { id: 8, title: "Code Splitting Techniques", duration: "18m", type: "reading", status: "pending", rating: 0 }
          ]
        },
        {
          id: 3,
          title: "Next.js Framework",
          lessons: [
            { id: 9, title: "Next.js Setup", duration: "15m", type: "video", status: "pending", rating: 0 },
            { id: 10, title: "Server Components", duration: "40m", type: "video", status: "locked", rating: 0 },
            { id: 11, title: "API Routes", duration: "25m", type: "coding", status: "locked", rating: 0 },
            { id: 12, title: "Deployment Strategies", duration: "20m", type: "video", status: "locked", rating: 0 }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Machine Learning & AI Fundamentals",
      instructor: "Dr. Michael Chen",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      totalLessons: 56,
      completedLessons: 25,
      progress: 45,
      estimatedTime: "18h 45m",
      deadline: "Apr 20, 2026",
      modules: [
        {
          id: 1,
          title: "ML Basics",
          lessons: [
            { id: 1, title: "Introduction to Machine Learning", duration: "20m", type: "video", status: "completed", rating: 5 },
            { id: 2, title: "Python for Data Science", duration: "35m", type: "coding", status: "completed", rating: 4 },
            { id: 3, title: "NumPy Essentials", duration: "25m", type: "video", status: "in-progress", rating: 0 }
          ]
        }
      ]
    }
  ];

  const [courseData, setCourseData] = useState(courses);

  useEffect(() => {
    setSelectedCourse(courseData[0]);
    toast.info(
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        <span>Track your learning progress across all courses</span>
      </div>,
      {
        position: window.innerWidth < 768 ? "top-center" : "top-right",
        autoClose: 3000,
      }
    );
  }, []);

  const handleLessonClick = (lesson, moduleId) => {
    if (lesson.status === 'locked') {
      toast.warning(
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          <div>
            <div className="font-semibold">Lesson Locked</div>
            <div className="text-sm opacity-90">Complete previous lessons to unlock</div>
          </div>
        </div>,
        {
          position: window.innerWidth < 768 ? "top-center" : "top-right",
        }
      );
      return;
    }

    if (lesson.status === 'completed') {
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

  const handleMarkComplete = (lessonId, moduleIndex) => {
    const updatedCourses = courseData.map(course => {
      if (course.id === selectedCourse.id) {
        const updatedModules = course.modules.map((module, idx) => {
          if (idx === moduleIndex) {
            const updatedLessons = module.lessons.map(lesson => {
              if (lesson.id === lessonId && lesson.status !== 'completed') {
                return { ...lesson, status: 'completed', rating: 5 };
              }
              return lesson;
            });
            return { ...module, lessons: updatedLessons };
          }
          return module;
        });

        const totalCompleted = updatedModules.reduce(
          (acc, mod) => acc + mod.lessons.filter(l => l.status === 'completed').length,
          0
        );
        const newProgress = Math.round((totalCompleted / course.totalLessons) * 100);

        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-semibold">Lesson Completed! 🎉</div>
              <div className="text-sm opacity-90">Progress: {newProgress}%</div>
            </div>
          </div>,
          {
            position: window.innerWidth < 768 ? "top-center" : "top-right",
          }
        );

        if (newProgress === 100) {
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

        return {
          ...course,
          modules: updatedModules,
          completedLessons: totalCompleted,
          progress: newProgress
        };
      }
      return course;
    });

    setCourseData(updatedCourses);
    setSelectedCourse(updatedCourses.find(c => c.id === selectedCourse.id));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
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

  const filteredModules = selectedCourse?.modules.map(module => ({
    ...module,
    lessons: module.lessons.filter(lesson => {
      if (filterStatus === 'all') return true;
      return lesson.status === filterStatus;
    })
  })).filter(module => module.lessons.length > 0);

  const stats = selectedCourse ? {
    completed: selectedCourse.modules.reduce(
      (acc, mod) => acc + mod.lessons.filter(l => l.status === 'completed').length,
      0
    ),
    inProgress: selectedCourse.modules.reduce(
      (acc, mod) => acc + mod.lessons.filter(l => l.status === 'in-progress').length,
      0
    ),
    pending: selectedCourse.modules.reduce(
      (acc, mod) => acc + mod.lessons.filter(l => l.status === 'pending').length,
      0
    ),
    locked: selectedCourse.modules.reduce(
      (acc, mod) => acc + mod.lessons.filter(l => l.status === 'locked').length,
      0
    )
  } : {};

  if (!selectedCourse) return null;

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
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {selectedCourse.title}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(showSidebar || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed lg:sticky top-0 left-0 w-80 h-screen bg-white shadow-2xl z-50 overflow-y-auto lg:z-0"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  {courseData.map((course) => (
                    <motion.button
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowSidebar(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedCourse.id === course.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span className="font-bold">{course.progress}%</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <div className="hidden lg:block mb-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  Course Progress
                </h1>
                <p className="text-gray-600">Track your learning journey</p>
              </div>

              {/* Course Header Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 line-clamp-2">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-white/90 text-sm">{selectedCourse.instructor}</p>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Overall Progress
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedCourse.progress}%
                      </span>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedCourse.progress}%` }}
                        transition={{ duration: 1 }}
                        className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>{selectedCourse.completedLessons} completed</span>
                      <span>{selectedCourse.totalLessons} total lessons</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { icon: CheckCircle2, label: 'Completed', value: stats.completed, color: 'green' },
                      { icon: Play, label: 'In Progress', value: stats.inProgress, color: 'blue' },
                      { icon: Circle, label: 'Pending', value: stats.pending, color: 'orange' },
                      { icon: Lock, label: 'Locked', value: stats.locked, color: 'gray' }
                    ].map((stat, idx) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4"
                      >
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-2`}>
                          <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}-600`} />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Certificate</span>
                    </button>
                    <button className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { value: 'all', label: 'All Lessons', icon: BookOpen },
                  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
                  { value: 'in-progress', label: 'In Progress', icon: Play },
                  { value: 'pending', label: 'Pending', icon: Circle }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      filterStatus === filter.value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                    }`}
                  >
                    <filter.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Modules and Lessons */}
            <div className="space-y-4">
              {filteredModules?.map((module, moduleIndex) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moduleIndex * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedModule(expandedModule === moduleIndex ? -1 : moduleIndex)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                        {moduleIndex + 1}
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {module.lessons.filter(l => l.status === 'completed').length}/{module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    {expandedModule === moduleIndex ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedModule === moduleIndex && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-4 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: lessonIndex * 0.05 }}
                              className={`p-4 rounded-xl transition-all ${
                                lesson.status === 'locked'
                                  ? 'bg-gray-100 opacity-60'
                                  : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md cursor-pointer'
                              }`}
                              onClick={() => handleLessonClick(lesson, moduleIndex)}
                            >
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex-shrink-0">
                                  {getStatusIcon(lesson.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                      {lesson.title}
                                    </h4>
                                    {lesson.rating > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-gray-600">{lesson.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      {getTypeIcon(lesson.type)}
                                      <span className="capitalize">{lesson.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{lesson.duration}</span>
                                    </div>
                                  </div>
                                </div>
                                {lesson.status === 'in-progress' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkComplete(lesson.id, moduleIndex);
                                    }}
                                    className="flex-shrink-0 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
                                  >
                                    Complete
                                  </button>
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
            </div>

            {filteredModules?.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 sm:py-20 bg-white rounded-2xl shadow-lg"
              >
                <Filter className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
                  No lessons found
                </h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;