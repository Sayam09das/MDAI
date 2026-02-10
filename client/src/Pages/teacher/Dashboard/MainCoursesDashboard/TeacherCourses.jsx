import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle,
    AlertCircle,
    Menu,
    Users,
    BarChart3,
    Edit,
    Eye,
    TrendingUp,
    BookMarked,
    X,
    Loader2,
    FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // grid or list

    /* ================= FETCH COURSES ================= */
    const fetchTeacherCourses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/courses/teacher`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setCourses(data.courses);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= PUBLISH ================= */
    const publishCourse = async (id) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/courses/${id}/publish`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("🎉 Course published successfully!");

            setCourses((prev) =>
                prev.map((c) =>
                    c._id === id ? { ...c, isPublished: true } : c
                )
            );
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchTeacherCourses();
    }, []);

    /* ================= FILTER ================= */
    const filteredCourses = courses.filter((course) => {
        const matchSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchFilter =
            filterStatus === "all" ||
            (filterStatus === "published" && course.isPublished) ||
            (filterStatus === "draft" && !course.isPublished);

        return matchSearch && matchFilter;
    });

    // Stats calculation
    const stats = {
        total: courses.length,
        published: courses.filter(c => c.isPublished).length,
        draft: courses.filter(c => !c.isPublished).length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <ToastContainer position="top-right" />

            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h1 className="font-bold text-lg">My Courses</h1>
                </div>
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                    <BookOpen className="w-7 h-7 text-white" />
                                </div>
                                My Courses
                            </h1>
                            <p className="text-gray-600 mt-2">Manage and track all your courses in one place</p>
                        </div>
                        <Link
                            to="/teacher-dashboard/create-course"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create New Course</span>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookMarked className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Published</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Draft</p>
                                    <p className="text-3xl font-bold text-orange-600">{stats.draft}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses by title or category..."
                                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { value: "all", label: "All Courses", icon: BookOpen },
                                { value: "published", label: "Published", icon: CheckCircle },
                                { value: "draft", label: "Draft", icon: FileText }
                            ].map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => setFilterStatus(value)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${filterStatus === value
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{label}</span>
                                    <span className="sm:hidden">{value === "all" ? "All" : label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Loading your courses...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCourses.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery
                                    ? "Try adjusting your search criteria"
                                    : "Get started by creating your first course"}
                            </p>
                            {!searchQuery && (
                                <Link
                                    to="/teacher-dashboard/create-course"
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Your First Course
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Courses Grid */}
                <AnimatePresence mode="wait">
                    {!loading && filteredCourses.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredCourses.map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                                >
                                    {/* Course Image */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                                        <img
                                            src={course.thumbnail?.url || "https://via.placeholder.com/400x300?text=No+Image"}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${course.isPublished
                                                        ? "bg-green-500 text-white"
                                                        : "bg-orange-500 text-white"
                                                    }`}
                                            >
                                                {course.isPublished ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3" />
                                                        Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileText className="w-3 h-3" />
                                                        Draft
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-5">
                                        {/* Category Badge */}
                                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full mb-3">
                                            {course.category}
                                        </span>

                                        {/* Title */}
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {course.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {course.description}
                                        </p>

                                        {/* Course Meta */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration || "Not set"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4" />
                                                <span>{course.enrolledStudents?.length || 0} students</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            {!course.isPublished ? (
                                                <button
                                                    onClick={() => publishCourse(course._id)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 active:scale-95 transition-all shadow-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Publish
                                                </button>
                                            ) : (
                                            <Link
                                                to={`/teacher-dashboard/course/${course._id}`}
                                                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Link>
                                            )}
                                            <Link
                                                to={`/teacher-dashboard/edit-course/${course._id}`}
                                                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Info */}
                {!loading && filteredCourses.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of{" "}
                        <span className="font-semibold text-gray-900">{courses.length}</span> courses
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherCourses;