import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Search,
    RefreshCw,
    Mail,
    Phone,
    BookOpen,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Calendar,
    Home,
    ChevronRight,
    User,
    UserCheck,
    UserX,
    Timer,
    TrendingUp,
    BarChart3
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const EnrolledStudents = () => {
    const [students, setStudents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submittingKey, setSubmittingKey] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/teacher/students`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch students");

            setStudents(data.students || []);
            toast.success("Students loaded successfully");
        } catch (err) {
            setError(err.message);
            toast.error(err.message || "Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async (courseId, student, status) => {
        const key = `${courseId}_${student._id}`;
        setSubmittingKey(key);

        const remarks =
            status === "PRESENT"
                ? "On time"
                : status === "LATE"
                    ? "Late entry"
                    : "Absent";

        try {
            const res = await fetch(
                `${BACKEND_URL}/api/teacher/attendance/${courseId}/mark`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        date: new Date().toISOString(),
                        records: [
                            {
                                studentId: student._id,
                                status,
                                remarks,
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            const record = data.attendance.records[0];

            setAttendanceMap((prev) => ({
                ...prev,
                [key]: {
                    status: record.status,
                    markedAt: record.markedAt,
                    remarks: record.remarks,
                },
            }));

            toast.success(`Marked ${student.fullName} as ${status}`);
        } catch (err) {
            toast.error(err.message || "Failed to mark attendance");
        } finally {
            setSubmittingKey(null);
        }
    };

    const handleViewDetails = (courseId, studentId) => {
        window.location.href = `/teacher-dashboard/attendance?courseId=${courseId}&studentId=${studentId}`;
    };

    // Filter students
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterStatus === "all") return matchesSearch;

        // Check if any course has the matching attendance status
        const hasStatus = student.enrolledCourses.some((course) => {
            const key = `${course.courseId}_${student._id}`;
            const attendance = attendanceMap[key];
            if (filterStatus === "marked") return !!attendance;
            if (filterStatus === "unmarked") return !attendance;
            return attendance?.status === filterStatus;
        });

        return matchesSearch && hasStatus;
    });

    // Calculate stats
    const totalStudents = students.length;
    const totalMarked = Object.keys(attendanceMap).length;
    const presentCount = Object.values(attendanceMap).filter(
        (a) => a.status === "PRESENT"
    ).length;
    const absentCount = Object.values(attendanceMap).filter(
        (a) => a.status === "ABSENT"
    ).length;

    return (
        <div className="min-h-screen bg-slate-50">
            <ToastContainer />

            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                        <Home className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                        <span>Dashboard</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900 font-medium">
                            Student Attendance
                        </span>
                    </nav>

                    {/* Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Student Attendance
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Mark and manage student attendance for your courses
                            </p>
                        </div>
                        <button
                            onClick={fetchStudents}
                            disabled={loading}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw
                                className={`w-5 h-5 text-slate-600 ${loading ? "animate-spin" : ""
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-indigo-50">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-slate-600">Total Students</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalStudents}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-emerald-50">
                                <UserCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-slate-600">Present Today</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {presentCount}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-red-50">
                                <UserX className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-slate-600">Absent Today</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {absentCount}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-blue-50">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-slate-600">Marked Records</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalMarked}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Students</option>
                            <option value="marked">Marked</option>
                            <option value="unmarked">Unmarked</option>
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                        </select>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12">
                        <div className="flex flex-col items-center justify-center">
                            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                            <p className="text-slate-600">Loading students...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-sm border border-red-200 p-12"
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                Error Loading Students
                            </h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchStudents}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredStudents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 p-12"
                    >
                        <div className="text-center">
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                {searchQuery ? "No students found" : "No students enrolled"}
                            </h3>
                            <p className="text-slate-600">
                                {searchQuery
                                    ? "Try adjusting your search or filters"
                                    : "Students will appear here once they enroll"}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Students Grid */}
                {!loading && !error && filteredStudents.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Profile Image */}
                                    <div className="flex-shrink-0">
                                        {student.profileImage?.url ? (
                                            <img
                                                src={student.profileImage.url}
                                                alt={student.fullName}
                                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-indigo-100"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                                                <User className="w-10 h-10 text-indigo-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Student Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                            {student.fullName}
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center space-x-2 text-slate-600">
                                                <Mail className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-sm truncate">{student.email}</span>
                                            </div>
                                            {student.phone && (
                                                <div className="flex items-center space-x-2 text-slate-600">
                                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                                    <span className="text-sm">{student.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Enrolled Courses */}
                                        <div className="space-y-4">
                                            {student.enrolledCourses.map((course) => {
                                                const key = `${course.courseId}_${student._id}`;
                                                const attendance = attendanceMap[key];
                                                const isSubmitting = submittingKey === key;

                                                return (
                                                    <motion.div
                                                        key={course.courseId}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                                                    >
                                                        <div className="flex items-center mb-3">
                                                            <BookOpen className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {course.courseTitle}
                                                            </span>
                                                        </div>

                                                        {/* Already Marked */}
                                                        {attendance ? (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="space-y-3"
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <span
                                                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${attendance.status === "PRESENT"
                                                                                ? "bg-emerald-100 text-emerald-800"
                                                                                : attendance.status === "ABSENT"
                                                                                    ? "bg-red-100 text-red-800"
                                                                                    : "bg-amber-100 text-amber-800"
                                                                            }`}
                                                                    >
                                                                        {attendance.status === "PRESENT" && (
                                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                                        )}
                                                                        {attendance.status === "ABSENT" && (
                                                                            <UserX className="w-4 h-4 mr-1" />
                                                                        )}
                                                                        {attendance.status === "LATE" && (
                                                                            <Timer className="w-4 h-4 mr-1" />
                                                                        )}
                                                                        {attendance.status}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                                    <div className="text-xs text-slate-600">
                                                                        <p>
                                                                            {attendance.remarks} •{" "}
                                                                            {new Date(
                                                                                attendance.markedAt
                                                                            ).toLocaleTimeString()}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleViewDetails(
                                                                                course.courseId,
                                                                                student._id
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-1" />
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        ) : (
                                                            /* Unmarked - Show Buttons */
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    disabled={isSubmitting}
                                                                    onClick={() =>
                                                                        markAttendance(
                                                                            course.courseId,
                                                                            student,
                                                                            "PRESENT"
                                                                        )
                                                                    }
                                                                    className="flex-1 min-w-[100px] px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {isSubmitting ? (
                                                                        <RefreshCw className="w-4 h-4 mx-auto animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle className="w-4 h-4 inline mr-1" />
                                                                            Present
                                                                        </>
                                                                    )}
                                                                </button>

                                                                <button
                                                                    disabled={isSubmitting}
                                                                    onClick={() =>
                                                                        markAttendance(
                                                                            course.courseId,
                                                                            student,
                                                                            "ABSENT"
                                                                        )
                                                                    }
                                                                    className="flex-1 min-w-[100px] px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {isSubmitting ? (
                                                                        <RefreshCw className="w-4 h-4 mx-auto animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <UserX className="w-4 h-4 inline mr-1" />
                                                                            Absent
                                                                        </>
                                                                    )}
                                                                </button>

                                                                <button
                                                                    disabled={isSubmitting}
                                                                    onClick={() =>
                                                                        markAttendance(
                                                                            course.courseId,
                                                                            student,
                                                                            "LATE"
                                                                        )
                                                                    }
                                                                    className="flex-1 min-w-[100px] px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {isSubmitting ? (
                                                                        <RefreshCw className="w-4 h-4 mx-auto animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <Timer className="w-4 h-4 inline mr-1" />
                                                                            Late
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledStudents;