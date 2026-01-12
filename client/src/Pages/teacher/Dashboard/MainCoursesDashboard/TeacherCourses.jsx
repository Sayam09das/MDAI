import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import {
    BookOpen,
    Users,
    Edit,
    Plus,
    Search,
    Filter,
    X,
    Save,
    Video,
    FileText,
    Clock,
    Star,
    CheckCircle,
    AlertCircle,
    Trash2,
    TrendingUp,
    DollarSign,
    Eye,
    Upload,
    BarChart3,
    MessageSquare,
    Settings,
    Download,
    Share2,
    Menu,
} from "lucide-react"
import { Link } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [viewMode, setViewMode] = useState("grid")
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showLessonsModal, setShowLessonsModal] = useState(false)
    const [showStudentsModal, setShowStudentsModal] = useState(false)
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)

    const [selectedCourse, setSelectedCourse] = useState(null)
    const fetchTeacherCourses = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${BACKEND_URL}/api/courses/teacher`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch courses");
            }

            setCourses(data.courses);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    /* ================= PUBLISH COURSE ================= */
    const publishCourse = async (courseId) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/courses/${courseId}/publish`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to publish course");
            }

            toast.success("🎉 Course published successfully");

            // Update UI without refetch (optional)
            setCourses((prev) =>
                prev.map((course) =>
                    course._id === courseId
                        ? { ...course, isPublished: true }
                        : course
                )
            );
        } catch (error) {
            toast.error(error.message);
        }
    };

    /* ================= LOAD ON MOUNT ================= */
    useEffect(() => {
        fetchTeacherCourses();
    }, []);

    // Calculate statistics
    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0)
    const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0)
    const avgRating = courses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / courses.filter(c => c.rating > 0).length

    // Filter and sort courses
    const filteredCourses = courses
        .filter((course) => {
            const matchSearch =
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category.toLowerCase().includes(searchQuery.toLowerCase())

            const matchFilter =
                filterStatus === "all" ||
                (filterStatus === "published" && course.status === "Published") ||
                (filterStatus === "draft" && course.status === "Draft")

            return matchSearch && matchFilter
        })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.lastUpdated) - new Date(a.lastUpdated)
            if (sortBy === "students") return b.students - a.students
            if (sortBy === "revenue") return b.revenue - a.revenue
            if (sortBy === "rating") return b.rating - a.rating
            return 0
        })


    const handlePublish = (course) => {
        setCourses(courses.map((c) =>
            c.id === course.id ? { ...c, status: "Published" } : c
        ))
        toast.success("🎉 Course published successfully!", {
            position: "top-center",
            autoClose: 4000,
        })
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen size={24} /> Courses
                </h1>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
                    <Menu size={24} />
                </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Desktop Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="hidden lg:flex justify-between items-center mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            <BookOpen className="text-indigo-600" /> My Courses
                        </h1>
                        <p className="text-gray-600 mt-2">Manage and track your course performance</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/teacher-dashboard/create-course"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <Plus size={20} /> Create Course
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    {[
                        { icon: Users, label: "Total Students", value: totalStudents.toLocaleString(), color: "from-blue-500 to-cyan-500" },
                        { icon: DollarSign, label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "from-green-500 to-emerald-500" },
                        { icon: BookOpen, label: "Active Courses", value: courses.filter(c => c.status === "Published").length, color: "from-purple-500 to-pink-500" },
                        { icon: Star, label: "Avg Rating", value: avgRating.toFixed(1), color: "from-yellow-500 to-orange-500" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                        >
                            <div className={`bg-gradient-to-r ${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                                <stat.icon className="text-white" size={20} />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-4 sm:p-6 rounded-xl lg:rounded-2xl shadow-lg mb-6 lg:mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses by title or category..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 sm:py-3 focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                            {["all", "published", "draft"].map((f) => (
                                <motion.button
                                    key={f}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterStatus(f)}
                                    className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm font-medium transition-all ${filterStatus === f
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                                        : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <Filter size={14} className="inline mr-1" />
                                    {f}
                                </motion.button>
                            ))}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="students">Most Students</option>
                            <option value="revenue">Highest Revenue</option>
                            <option value="rating">Highest Rating</option>
                        </select>
                    </div>
                </motion.div>

                {/* Courses Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="h-40 sm:h-48 w-full object-cover"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                                        ? "bg-green-500 text-white"
                                        : "bg-yellow-500 text-white"
                                        }`}>
                                        {course.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 sm:p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-base sm:text-lg line-clamp-2">{course.title}</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mb-4 text-gray-700">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} /> {course.students}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Video size={14} /> {course.lessons}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {course.duration}
                                    </span>
                                    {course.status === "Published" && (
                                        <span className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            {course.rating}
                                        </span>
                                    )}
                                </div>

                                {course.status === "Published" && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Revenue</span>
                                            <span className="font-bold text-green-600">
                                                ${course.revenue.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleEdit(course)}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg mb-3 font-medium shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <Edit size={16} className="inline mr-1" /> Edit Course
                                </motion.button>

                                <div className="grid grid-cols-3 gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSelectedCourse(course)
                                            setShowLessonsModal(true)
                                        }}
                                        className="bg-blue-100 text-blue-700 py-2 rounded-lg text-xs sm:text-sm font-medium"
                                    >
                                        <Video size={14} className="inline" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSelectedCourse(course)
                                            setShowStudentsModal(true)
                                        }}
                                        className="bg-purple-100 text-purple-700 py-2 rounded-lg text-xs sm:text-sm font-medium"
                                    >
                                        <Users size={14} className="inline" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSelectedCourse(course)
                                            setShowAnalyticsModal(true)
                                        }}
                                        className="bg-green-100 text-green-700 py-2 rounded-lg text-xs sm:text-sm font-medium"
                                    >
                                        <BarChart3 size={14} className="inline" />
                                    </motion.button>
                                </div>

                                {course.status === "Draft" && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handlePublish(course)}
                                        className="w-full bg-green-500 text-white py-2 rounded-lg mt-3 text-sm font-medium"
                                    >
                                        <CheckCircle size={14} className="inline mr-1" /> Publish
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredCourses.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600">No courses found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>

            {/* Add Later Some New things  */}

            {/* Mobile FAB for Create Course */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.info("🚀 Create new course feature coming soon!", {
                    position: "top-center",
                    autoClose: 3000,
                })}
                className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40"
            >
                <Plus size={28} />
            </motion.button>
        </div>
    )
}

export default TeacherCourses