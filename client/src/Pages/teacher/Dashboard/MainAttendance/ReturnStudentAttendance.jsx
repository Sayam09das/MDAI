import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ChevronRight,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Download,
  RefreshCw,
  User,
  Award,
  Info,
  Loader2,
  BarChart3,
  Activity
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertCircle },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info }
  };
  const { bg, border, text, icon: Icon } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg ${bg} ${border} ${text}`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    <AnimatePresence>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </AnimatePresence>
  </div>
);

// Student Attendance Component (Mock - replace with actual)
const StudentAttendance = ({ courseId, studentId, courseName, studentName }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, percentage: 0 });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        date: new Date(2026, 0, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayOfWeek: new Date(2026, 0, i + 1).toLocaleDateString('en-US', { weekday: 'short' }),
        status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
        duration: Math.floor(Math.random() * 60) + 30,
        notes: Math.random() > 0.8 ? 'Late arrival' : ''
      }));

      const present = mockData.filter(d => d.status === 'present').length;
      const absent = mockData.filter(d => d.status === 'absent').length;
      const late = mockData.filter(d => d.status === 'late').length;
      const percentage = Math.round((present / mockData.length) * 100);

      setStats({ present, absent, late, percentage });
      setAttendanceData(mockData);
      setLoading(false);
    }, 800);
  }, [courseId, studentId]);

  const getStatusConfig = (status) => {
    const configs = {
      present: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'Present' },
      absent: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'Absent' },
      late: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Late' }
    };
    return configs[status] || configs.present;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {studentName?.charAt(0) || 'S'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{studentName || 'Student Name'}</h3>
              <p className="text-sm text-slate-600">{courseName || 'Course Name'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.present}</span>
          </div>
          <div className="text-xs text-slate-600">Present</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.absent}</span>
          </div>
          <div className="text-xs text-slate-600">Absent</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.late}</span>
          </div>
          <div className="text-xs text-slate-600">Late</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="text-2xl font-bold text-slate-900">{stats.percentage}%</span>
          </div>
          <div className="text-xs text-slate-600">Attendance Rate</div>
        </motion.div>
      </div>

      {/* Attendance Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Attendance Records</h3>
          <p className="text-sm text-slate-600 mt-1">Detailed class attendance history</p>
        </div>

        {/* Mobile Cards */}
        <div className="block sm:hidden p-4 space-y-3">
          {attendanceData.map((record, index) => {
            const config = getStatusConfig(record.status);
            const Icon = config.icon;
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{record.date}</div>
                    <div className="text-xs text-slate-500">{record.dayOfWeek}</div>
                  </div>
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                  </span>
                </div>
                {record.notes && (
                  <div className="text-xs text-slate-600 mt-2 flex items-center space-x-1">
                    <Info className="w-3 h-3" />
                    <span>{record.notes}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Day</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceData.map((record, index) => {
                const config = getStatusConfig(record.status);
                const Icon = config.icon;
                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.dayOfWeek}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{config.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.duration} min</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.notes || '-'}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// Main Component
const ReturnStudentAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setMounted(true);
    // Simulate API call
    setTimeout(() => {
      const mockCourses = [
        { _id: '1', title: 'Introduction to React' },
        { _id: '2', title: 'Advanced JavaScript' },
        { _id: '3', title: 'Web Development Fundamentals' },
        { _id: '4', title: 'Data Structures & Algorithms' }
      ];
      setCourses(mockCourses);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      setSelectedStudent('');
      return;
    }

    // Simulate fetching students
    setTimeout(() => {
      const mockStudents = [
        { _id: 's1', fullName: 'Sarah Johnson', email: 'sarah.j@example.com' },
        { _id: 's2', fullName: 'Michael Chen', email: 'michael.c@example.com' },
        { _id: 's3', fullName: 'Emily Rodriguez', email: 'emily.r@example.com' },
        { _id: 's4', fullName: 'David Kim', email: 'david.k@example.com' }
      ];
      setStudents(mockStudents);
    }, 300);
  }, [selectedCourse]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedStudent('');
    if (e.target.value) {
      addToast('Course selected successfully', 'success');
    }
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
    if (e.target.value) {
      addToast('Loading student attendance...', 'info');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const selectedCourseData = courses.find(c => c._id === selectedCourse);
  const selectedStudentData = students.find(s => s._id === selectedStudent);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">Student Attendance</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Attendance</h1>
              <p className="text-slate-600">Track and manage student attendance records</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 w-fit">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Selection */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Select Course</h3>
                <p className="text-xs text-slate-600">Choose the course to view attendance</p>
              </div>
            </div>
            <select
              value={selectedCourse}
              onChange={handleCourseChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">-- Select a Course --</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Course selected: {selectedCourseData?.title}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Student Selection */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <Users className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Select Student</h3>
                <p className="text-xs text-slate-600">Choose a student from the course</p>
              </div>
            </div>
            <select
              value={selectedStudent}
              onChange={handleStudentChange}
              disabled={!selectedCourse}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Select a Student --</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.fullName} ({student.email})
                </option>
              ))}
            </select>
            {selectedStudent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Student: {selectedStudentData?.fullName}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Empty States */}
        <AnimatePresence mode="wait">
          {!selectedCourse && (
            <motion.div
              key="no-course"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center"
            >
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Course Selected</h3>
              <p className="text-slate-600">Please select a course to view student attendance records</p>
            </motion.div>
          )}

          {selectedCourse && !selectedStudent && (
            <motion.div
              key="no-student"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center"
            >
              <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Student Selected</h3>
              <p className="text-slate-600">Please select a student to view their attendance history</p>
            </motion.div>
          )}

          {selectedCourse && selectedStudent && (
            <motion.div
              key="attendance-data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <StudentAttendance
                courseId={selectedCourse}
                studentId={selectedStudent}
                courseName={selectedCourseData?.title}
                studentName={selectedStudentData?.fullName}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReturnStudentAttendance;