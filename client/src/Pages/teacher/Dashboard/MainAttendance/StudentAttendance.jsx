import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Calendar,
    Mail,
    Phone,
    User,
    BookOpen,
    AlertCircle,
    Loader2,
    Download,
    Info,
    Award,
    MapPin
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
    return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
};

const StudentAttendance = ({ courseId, studentId }) => {
    const [student, setStudent] = useState(null);
    const [course, setCourse] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Validate props before making API call
        if (!courseId || !studentId) {
            setError("Course ID and Student ID are required");
            setLoading(false);
            return;
        }

        if (!isValidObjectId(courseId) || !isValidObjectId(studentId)) {
            setError("Invalid Course ID or Student ID format");
            setLoading(false);
            return;
        }

        const fetchAttendance = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/attendance/${courseId}/student/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                setStudent(data.student);
                setCourse(data.course);
                setAttendance(data.attendanceRecords);
                setStats(data.stats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [courseId, studentId]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
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

    const getStatusConfig = (status) => {
        const configs = {
            PRESENT: {
                bg: 'bg-green-50',
                text: 'text-green-700',
                border: 'border-green-200',
                icon: CheckCircle,
                label: 'Present'
            },
            ABSENT: {
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                icon: XCircle,
                label: 'Absent'
            },
            LATE: {
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                border: 'border-amber-200',
                icon: Clock,
                label: 'Late'
            }
        };
        return configs[status] || configs.PRESENT;
    };

    // Loading State
    if (loading) {
        return (
            <div className="space-y-4 py-8">
                <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
            >
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Attendance</h3>
                <p className="text-sm text-red-700">{error}</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            className="space-y-6"
        >
            {/* Course & Student Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-indigo-600 mb-1">Course</div>
                            <h3 className="text-lg font-semibold text-slate-900">{course?.title}</h3>
                            {course?.description && (
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2">{course.description}</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Student Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >
                    <div className="flex items-start space-x-4">
                        {student?.profileImage?.url ? (
                            <img
                                src={student.profileImage.url}
                                alt={student.fullName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                {student?.fullName?.charAt(0) || 'S'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{student?.fullName}</h3>
                            <div className="space-y-1">
                                {student?.email && (
                                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                                        <Mail className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{student.email}</span>
                                    </div>
                                )}
                                {student?.phone && (
                                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                                        <Phone className="w-4 h-4 flex-shrink-0" />
                                        <span>{student.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-5 h-5 text-slate-600" />
                        <span className="text-2xl font-bold text-slate-900">{stats?.totalDays || 0}</span>
                    </div>
                    <div className="text-xs text-slate-600">Total Days</div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{stats?.present || 0}</span>
                    </div>
                    <div className="text-xs text-slate-600">Present</div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-2xl font-bold text-red-600">{stats?.absent || 0}</span>
                    </div>
                    <div className="text-xs text-slate-600">Absent</div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="text-2xl font-bold text-amber-600">{stats?.late || 0}</span>
                    </div>
                    <div className="text-xs text-slate-600">Late</div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl p-4 shadow-md text-white col-span-2 sm:col-span-3 lg:col-span-1"
                >
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-2xl font-bold">{stats?.attendancePercentage || 0}%</span>
                    </div>
                    <div className="text-xs opacity-90">Attendance Rate</div>
                </motion.div>
            </div>

            {/* Attendance Records */}
            <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-slate-200"
            >
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Attendance Records</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            {attendance?.length || 0} {attendance?.length === 1 ? 'record' : 'records'} found
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center space-x-2 text-sm font-medium">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>

                {/* Mobile Cards View */}
                <div className="block sm:hidden p-4 space-y-3">
                    {attendance && attendance.length > 0 ? (
                        attendance.map((record, index) => {
                            const config = getStatusConfig(record.status);
                            const Icon = config.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border border-slate-200 rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-sm font-medium text-slate-900">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span>{new Date(record.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{config.label}</span>
                                        </span>
                                    </div>
                                    {record.remarks && (
                                        <div className="flex items-start space-x-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                            <span>{record.remarks}</span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-600">No attendance records found</p>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Day
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {attendance && attendance.length > 0 ? (
                                attendance.map((record, index) => {
                                    const config = getStatusConfig(record.status);
                                    const Icon = config.icon;
                                    const recordDate = new Date(record.date);

                                    return (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {recordDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {recordDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                    <span>{config.label}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {record.remarks ? (
                                                    <div className="flex items-center space-x-2">
                                                        <Info className="w-4 h-4 text-slate-400" />
                                                        <span>{record.remarks}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-600">No attendance records found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Performance Indicator */}
            {stats && stats.attendancePercentage !== undefined && (
                <motion.div
                    variants={itemVariants}
                    className={`rounded-xl p-6 border ${stats.attendancePercentage >= 90
                            ? 'bg-green-50 border-green-200'
                            : stats.attendancePercentage >= 75
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-red-50 border-red-200'
                        }`}
                >
                    <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${stats.attendancePercentage >= 90
                                ? 'bg-green-100'
                                : stats.attendancePercentage >= 75
                                    ? 'bg-amber-100'
                                    : 'bg-red-100'
                            }`}>
                            {stats.attendancePercentage >= 90 ? (
                                <Award className="w-6 h-6 text-green-600" />
                            ) : stats.attendancePercentage >= 75 ? (
                                <TrendingUp className="w-6 h-6 text-amber-600" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            )}
                        </div>
                        <div>
                            <h4 className={`font-semibold mb-1 ${stats.attendancePercentage >= 90
                                    ? 'text-green-900'
                                    : stats.attendancePercentage >= 75
                                        ? 'text-amber-900'
                                        : 'text-red-900'
                                }`}>
                                {stats.attendancePercentage >= 90
                                    ? 'Excellent Attendance!'
                                    : stats.attendancePercentage >= 75
                                        ? 'Good Attendance'
                                        : 'Attendance Needs Improvement'}
                            </h4>
                            <p className={`text-sm ${stats.attendancePercentage >= 90
                                    ? 'text-green-700'
                                    : stats.attendancePercentage >= 75
                                        ? 'text-amber-700'
                                        : 'text-red-700'
                                }`}>
                                {stats.attendancePercentage >= 90
                                    ? 'This student maintains excellent attendance with a ' + stats.attendancePercentage + '% attendance rate.'
                                    : stats.attendancePercentage >= 75
                                        ? 'This student has good attendance. Encourage continued regular participation.'
                                        : 'This student\'s attendance is below recommended levels. Consider reaching out to discuss any challenges.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default StudentAttendance;