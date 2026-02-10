import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  Circle
} from "lucide-react";
import { Link } from "react-router-dom";

// Get backend URL
const getBackendURL = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl && envUrl.trim() !== '' && envUrl !== 'undefined') {
    return envUrl.replace(/\/+$/, '');
  }
  if (import.meta.env.PROD || import.meta.env.NODE_ENV === 'production') {
    return 'https://mdai-self.vercel.app';
  }
  return 'http://localhost:5000';
};

const API_BASE_URL = getBackendURL();

// Get auth token
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
};

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  
  const token = getAuthToken();
  if (token) {
    headers.Authorization = token;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
};

// API functions inline
const studentApi = {
  getStudentCourseProgress: () => fetchAPI("/api/student/course-progress"),
  getCourseProgress: (courseId) => fetchAPI(`/api/student/course-progress/${courseId}`),
  markLessonComplete: (courseId, lessonId, timeSpent = 0) => 
    fetchAPI(`/api/student/course-progress/${courseId}/complete-lesson/${lessonId}`, {
      method: "PATCH",
      body: JSON.stringify({ timeSpent }),
    }),
  unmarkLessonComplete: (courseId, lessonId) => 
    fetchAPI(`/api/student/course-progress/${courseId}/uncomplete-lesson/${lessonId}`, {
      method: "PATCH",
    }),
};

export default function CourseProgress() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalLessonsCompleted: 0,
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingLesson, setUpdatingLesson] = useState(null);

  // Fetch all course progress
  const fetchCourseProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentApi.getStudentCourseProgress();
      
      if (data.success) {
        setCourses(data.courses || []);
        setStats(data.stats || {
          totalCourses: 0,
          completedCourses: 0,
          averageProgress: 0,
          totalLessonsCompleted: 0,
        });
      } else {
        throw new Error(data.message || "Failed to fetch progress");
      }
    } catch (err) {
      console.error("Fetch progress error:", err);
      setError(err.message);
      // Set empty state on error to prevent infinite loading
      setCourses([]);
      setStats({
        totalCourses: 0,
        completedCourses: 0,
        averageProgress: 0,
        totalLessonsCompleted: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch detailed progress for a specific course
  const fetchCourseDetails = useCallback(async (courseId) => {
    try {
      setUpdatingLesson(courseId);
      setError("");
      const data = await studentApi.getCourseProgress(courseId);
      
      if (data.success) {
        setCourseDetails(data);
        setSelectedCourse(courseId);
      } else {
        throw new Error(data.message || "Failed to fetch course details");
      }
    } catch (err) {
      console.error("Fetch course details error:", err);
      setError(err.message);
    } finally {
      setUpdatingLesson(null);
    }
  }, []);

  // Mark lesson as complete
  const handleMarkLessonComplete = async (courseId, lessonId) => {
    try {
      setUpdatingLesson(lessonId);
      const data = await studentApi.markLessonComplete(courseId, lessonId);
      
      if (data.success) {
        await fetchCourseDetails(courseId);
        await fetchCourseProgress();
      }
    } catch (err) {
      console.error("Mark lesson complete error:", err);
      setError(err.message);
    } finally {
      setUpdatingLesson(null);
    }
  };

  // Unmark lesson as complete
  const handleUnmarkLessonComplete = async (courseId, lessonId) => {
    try {
      setUpdatingLesson(lessonId);
      const data = await studentApi.unmarkLessonComplete(courseId, lessonId);
      
      if (data.success) {
        await fetchCourseDetails(courseId);
        await fetchCourseProgress();
      }
    } catch (err) {
      console.error("Unmark lesson error:", err);
      setError(err.message);
    } finally {
      setUpdatingLesson(null);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCourseProgress();
  }, [fetchCourseProgress]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getProgressStatus = (progress) => {
    if (progress >= 100) return { text: "Completed", color: "text-green-600", bg: "bg-green-100" };
    if (progress >= 50) return { text: "In Progress", color: "text-blue-600", bg: "bg-blue-100" };
    return { text: "Just Started", color: "text-orange-600", bg: "bg-orange-100" };
  };

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-gray-700 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchCourseProgress}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Progress</h1>
          <p className="text-gray-600">Track your learning journey</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lessons Done</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLessonsCompleted}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
              </div>

              {courses.length === 0 ? (
                <div className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No courses enrolled yet</p>
                  <Link
                    to="/student-dashboard/all-courses"
                    className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {courses.map((course, index) => {
                    const status = getProgressStatus(course.progress);
                    const isSelected = selectedCourse === course.courseId;

                    return (
                      <motion.button
                        key={course.enrollmentId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => fetchCourseDetails(course.courseId)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={course.thumbnail?.url || course.thumbnail}
                            alt={course.title}
                            className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                                {status.text}
                              </span>
                              <span className="text-xs text-gray-500">
                                {course.progress}%
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-gray-400 ${
                            isSelected ? "rotate-90" : ""
                          }`} />
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                              className={`absolute h-full rounded-full ${getProgressColor(course.progress)}`}
                            />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Course Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            {selectedCourse && courseDetails ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Course Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <img
                      src={courseDetails.course?.thumbnail?.url || courseDetails.course?.thumbnail}
                      alt={courseDetails.course?.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">
                        {courseDetails.course?.title}
                      </h2>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {courseDetails.course?.description}
                      </p>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-bold text-gray-900">{courseDetails.progress?.percentage}%</span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${courseDetails.progress?.percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`absolute h-full rounded-full ${getProgressColor(courseDetails.progress?.percentage)}`}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{courseDetails.progress?.completedLessons} lessons completed</span>
                      <span>{courseDetails.progress?.remainingLessons} lessons remaining</span>
                    </div>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Lessons</h3>
                  <div className="space-y-2">
                    {courseDetails.lessons?.map((lesson, index) => {
                      const isCompleted = lesson.isCompleted;
                      const isCurrent = lesson.isCurrent;
                      const isUpdating = updatingLesson === lesson.lessonId;

                      return (
                        <motion.div
                          key={lesson.lessonId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            isCompleted 
                              ? "bg-green-50 border-green-200" 
                              : isCurrent 
                                ? "bg-blue-50 border-blue-200" 
                                : "bg-white border-gray-200"
                          }`}
                        >
                          <button
                            onClick={() => isCompleted 
                              ? handleUnmarkLessonComplete(selectedCourse, lesson.lessonId)
                              : handleMarkLessonComplete(selectedCourse, lesson.lessonId)
                            }
                            disabled={isUpdating}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-green-500"
                            }`}
                          >
                            {isUpdating ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400" />
                            )}
                          </button>

                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              isCompleted ? "text-green-800" : "text-gray-900"
                            }`}>
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              {lesson.date && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(lesson.date).toLocaleDateString()}
                                </span>
                              )}
                              {lesson.time && (
                                <span>{lesson.time}</span>
                              )}
                              {lesson.duration && (
                                <span>{lesson.duration}</span>
                              )}
                              {lesson.meetLink && (
                                <a
                                  href={lesson.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Join Meeting
                                </a>
                              )}
                            </div>
                          </div>

                          {isCurrent && (
                            <span className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Current
                            </span>
                          )}
                          
                          {isCompleted && (
                            <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Done
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Lesson */}
                {courseDetails.nextLesson && (
                  <div className="p-4 bg-indigo-50 border-t border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-800">Next Lesson</p>
                        <p className="font-semibold text-indigo-900">{courseDetails.nextLesson.title}</p>
                        {courseDetails.nextLesson.date && (
                          <p className="text-sm text-indigo-600">
                            {new Date(courseDetails.nextLesson.date).toLocaleDateString()} at {courseDetails.nextLesson.time}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/student-dashboard/course/${selectedCourse}`}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Continue
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600">Choose a course from the list to view detailed progress</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

