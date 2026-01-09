import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, Clock, Award, TrendingUp, Filter, Search, X, Check, Star, ChevronRight, Download, Share2, MoreVertical, Calendar, Users, BarChart3 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Advanced React & Next.js Masterclass",
      instructor: "Sarah Johnson",
      progress: 67,
      totalLessons: 48,
      completedLessons: 32,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      category: "Web Development",
      difficulty: "Advanced",
      duration: "12h 30m",
      lastAccessed: "2 hours ago",
      deadline: "Mar 15, 2026",
      rating: 4.8,
      enrolled: 12450,
      certificate: true,
      nextLesson: "State Management with Zustand"
    },
    {
      id: 2,
      title: "Machine Learning & AI Fundamentals",
      instructor: "Dr. Michael Chen",
      progress: 45,
      totalLessons: 56,
      completedLessons: 25,
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      category: "Data Science",
      difficulty: "Intermediate",
      duration: "18h 45m",
      lastAccessed: "1 day ago",
      deadline: "Apr 20, 2026",
      rating: 4.9,
      enrolled: 8920,
      certificate: true,
      nextLesson: "Neural Networks Basics"
    },
    {
      id: 3,
      title: "UX/UI Design Professional Certificate",
      instructor: "Emma Williams",
      progress: 82,
      totalLessons: 36,
      completedLessons: 30,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      category: "Design",
      difficulty: "Beginner",
      duration: "8h 15m",
      lastAccessed: "3 hours ago",
      deadline: "Feb 28, 2026",
      rating: 4.7,
      enrolled: 15200,
      certificate: true,
      nextLesson: "Prototyping in Figma"
    },
    {
      id: 4,
      title: "Cloud Architecture & DevOps",
      instructor: "James Rodriguez",
      progress: 23,
      totalLessons: 64,
      completedLessons: 15,
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
      category: "Cloud Computing",
      difficulty: "Advanced",
      duration: "22h 00m",
      lastAccessed: "5 days ago",
      deadline: "May 10, 2026",
      rating: 4.6,
      enrolled: 6780,
      certificate: true,
      nextLesson: "Kubernetes Deep Dive"
    }
  ]);

  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showNotifications, setShowNotifications] = useState(false);

  const categories = ['all', 'Web Development', 'Data Science', 'Design', 'Cloud Computing'];

  useEffect(() => {
    // Welcome notification
    toast.info('📚 Welcome back! You have 4 courses in progress.', {
      position: window.innerWidth < 768 ? "top-center" : "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const handleContinueLearning = (course) => {
    toast.success(
      <div className="flex items-center gap-2">
        <Play className="w-5 h-5" />
        <div>
          <div className="font-semibold">Resuming: {course.title}</div>
          <div className="text-sm opacity-90">Next: {course.nextLesson}</div>
        </div>
      </div>,
      {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 2000,
      }
    );
  };

  const handleMarkComplete = (courseId, lessonTitle) => {
    setCourses(courses.map(course => {
      if (course.id === courseId && course.completedLessons < course.totalLessons) {
        const newCompleted = course.completedLessons + 1;
        const newProgress = Math.round((newCompleted / course.totalLessons) * 100);

        toast.success(
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-semibold">Lesson Complete! 🎉</div>
              <div className="text-sm opacity-90">{newProgress}% course progress</div>
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
                <Award className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className="font-bold">Course Completed! 🏆</div>
                  <div className="text-sm">Certificate ready to download</div>
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
          completedLessons: newCompleted,
          progress: newProgress
        };
      }
      return course;
    }));
  };

  const handleShare = (course) => {
    toast.info(
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5" />
        <span>Share link copied to clipboard!</span>
      </div>,
      {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
      }
    );
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const CourseCard = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 sm:h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
            {course.difficulty}
          </span>
          {course.certificate && (
            <span className="px-3 py-1 bg-yellow-500/95 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1">
              <Award className="w-3 h-3" />
              Certificate
            </span>
          )}
        </div>
        <button
          onClick={() => handleShare(course)}
          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Share2 className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 flex-1">
            {course.title}
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <BookOpen className="w-4 h-4" />
          <span>{course.instructor}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="truncate">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating} ({course.enrolled.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="truncate">{course.deadline}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{course.totalLessons} lessons</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {course.completedLessons}/{course.totalLessons} Lessons
            </span>
            <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Next: {course.nextLesson}</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleContinueLearning(course)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Continue Learning</span>
            <span className="sm:hidden">Continue</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMarkComplete(course.id, course.nextLesson)}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Check className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 sm:p-6 lg:p-8">
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                My Courses
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Continue your learning journey
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { icon: BookOpen, label: 'Active Courses', value: '4', color: 'blue' },
              { icon: TrendingUp, label: 'Avg Progress', value: '54%', color: 'green' },
              { icon: Award, label: 'Certificates', value: '2', color: 'yellow' },
              { icon: Clock, label: 'Hours Learned', value: '127', color: 'purple' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold whitespace-nowrap transition-all ${filterCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                    }`}
                >
                  {category === 'all' ? 'All Courses' : category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div
              key="courses-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-courses"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 sm:py-20"
            >
              <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MyCourses;