
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Clock, AlertCircle, Play, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch enrollments
  const fetchEnrollments = async () => {
    if (!token) {
      setError("Please login to view your courses");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/enroll/my-courses`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unauthorized or session expired");
      }

      const validEnrollments = (data.enrollments || []).filter(
        (e) => e.course !== null
      );

      setEnrollments(validEnrollments);
      
      // Fetch progress for each enrollment
      if (validEnrollments.length > 0) {
        await fetchProgressForCourses(validEnrollments);
      }
      
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch progress for all courses
  const fetchProgressForCourses = async (enrollments) => {
    try {
      const progressPromises = enrollments.map(async (enrollment) => {
        if (!enrollment.course?._id) return null;
        
        try {
          const res = await fetch(
            `${BACKEND_URL}/api/student/course-progress/${enrollment.course._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            return { courseId: enrollment.course._id, progress: data.progress };
          }
        } catch (err) {
          console.error("Error fetching progress:", err);
        }
        return null;
      });

      const results = await Promise.all(progressPromises);
      const progressMap = {};
      
      results.forEach((result) => {
        if (result) {
          // Extract only the percentage value from the progress object
          progressMap[result.courseId] = result.progress?.percentage || 0;
        }
      });

      setProgressData(progressMap);
    } catch (err) {
      console.error("Error fetching progress data:", err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [token]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-orange-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-gray-700 font-medium">Loading your courses...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Track your learning progress</p>
        </motion.div>

        {/* Empty State */}
        {enrollments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600">Start learning by enrolling in a course</p>
          </motion.div>
        )}

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {enrollments.map((e) => {
            const courseId = e.course?._id;
            const progress = progressData[courseId] || e.progress || 0;
            const isCompleted = progress >= 100;
            
            return (
              <motion.div
                key={e._id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={e.course.thumbnail?.url}
                    alt={e.course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        e.paymentStatus === "PAID"
                          ? "bg-green-600"
                          : e.paymentStatus === "LATER"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                      }`}
                    >
                      {e.paymentStatus === "PAID" && <CheckCircle className="w-3 h-3" />}
                      {e.paymentStatus === "LATER" && <Clock className="w-3 h-3" />}
                      {e.paymentStatus}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                        <Trophy className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2">
                    {e.course.title}
                  </h2>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold text-gray-900">{progress}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`absolute h-full rounded-full ${getProgressColor(progress)}`}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{e.course.duration || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {e.paymentStatus === "PAID" ? (
                    <div className="flex gap-2">
                      <Link
                        to={`/student-dashboard/course/${e.course._id}`}
                        className="flex-1"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {isCompleted ? "Review" : "Continue"}
                        </motion.button>
                      </Link>
                      <Link
                        to={`/student-dashboard/course-progress`}
                        className="flex-none"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                          title="View Progress"
                        >
                          <Trophy className="w-5 h-5" />
                        </motion.button>
                      </Link>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 font-semibold py-2.5 rounded-lg cursor-not-allowed"
                    >
                      Payment Required
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

