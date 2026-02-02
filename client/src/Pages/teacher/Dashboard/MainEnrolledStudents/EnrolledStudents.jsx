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
    Filter,
    GraduationCap,
    Calendar,
    Award,
    TrendingUp,
    Home,
    ChevronRight,
    User
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const EnrolledStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPayment, setFilterPayment] = useState("all");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/teacher/students`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch students");
            }

            setStudents(data.students || []);
            toast.success("Students loaded successfully");
        } catch (err) {
            console.error(err);
            setError(err.message);
            toast.error(err.message || "Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchStudents();
    };

    // Filter students
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPayment =
            filterPayment === "all" ||
            student.enrolledCourses.some(
                (course) => course.paymentStatus === filterPayment
            );

        return matchesSearch && matchesPayment;
    });

    // Calculate stats
    const totalEnrolled = students.length;
    const paidStudents = students.filter((s) =>
        s.enrolledCourses.some((c) => c.paymentStatus === "PAID")
    ).length;
    const totalCourses = students.reduce(
        (sum, s) => sum + s.enrolledCourses.length,
        0
    );

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
                        <span className="text-slate-900 font-medium">Enrolled Students</span>
                    </nav>

                    {/* Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Enrolled Students
                            </h1>
                            <p className="mt-2 text-slate-600">
                                View and manage students enrolled in your courses
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
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
                            <p className="text-sm text-slate-600">Total Enrolled</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalEnrolled}
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
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-slate-600">Paid Students</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {paidStudents}
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
                            <div className="p-3 rounded-lg bg-blue-50">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-slate-600">Total Enrollments</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalCourses}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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

                        {/* Payment Filter */}
                        <select
                            value={filterPayment}
                            onChange={(e) => setFilterPayment(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Payments</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12">
                        <div className="flex flex-col items-center justify-center">
                            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                            <p className="text-slate-600">Loading enrolled students...</p>
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
                                onClick={handleRefresh}
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
                                {searchQuery ? "No students found" : "No students enrolled yet"}
                            </h3>
                            <p className="text-slate-600">
                                {searchQuery
                                    ? "Try adjusting your search or filters"
                                    : "Students will appear here once they enroll in your courses"}
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
                                            <div className="flex items-center space-x-2 text-slate-600">
                                                <Phone className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-sm">{student.phone}</span>
                                            </div>
                                        </div>

                                        {/* Enrolled Courses */}
                                        <div className="mt-4">
                                            <div className="flex items-center mb-3">
                                                <BookOpen className="w-4 h-4 text-slate-600 mr-2" />
                                                <span className="text-sm font-semibold text-slate-700">
                                                    Enrolled Courses ({student.enrolledCourses.length})
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {student.enrolledCourses.map((course) => (
                                                    <div
                                                        key={course.courseId}
                                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                                                    >
                                                        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                                                            <GraduationCap className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                                            <span className="text-sm font-medium text-slate-900">
                                                                {course.courseTitle}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${course.paymentStatus === "PAID"
                                                                    ? "bg-emerald-100 text-emerald-800"
                                                                    : course.paymentStatus === "PENDING"
                                                                        ? "bg-amber-100 text-amber-800"
                                                                        : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {course.paymentStatus === "PAID" && (
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                            )}
                                                            {course.paymentStatus === "PENDING" && (
                                                                <Clock className="w-3 h-3 mr-1" />
                                                            )}
                                                            {course.paymentStatus === "FAILED" && (
                                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                            )}
                                                            {course.paymentStatus}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
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