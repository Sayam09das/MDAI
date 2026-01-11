import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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

const TeacherCourses = () => {
    const [courses, setCourses] = useState([
        {
            id: 1,
            title: "Full Stack MERN Development",
            description: "Complete guide to modern web apps with MongoDB, Express, React & Node",
            students: 2100,
            lessons: 45,
            status: "Published",
            rating: 4.9,
            reviews: 856,
            category: "Development",
            duration: "60 hours",
            price: 89.99,
            revenue: 186990,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
            lastUpdated: "2024-12-15",
            completionRate: 78,
        },
        {
            id: 2,
            title: "Python for Data Science",
            description: "Master data analysis, visualization & machine learning with Python",
            students: 1580,
            lessons: 38,
            status: "Published",
            rating: 4.7,
            reviews: 642,
            category: "Data Science",
            duration: "45 hours",
            price: 79.99,
            revenue: 126342,
            thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
            lastUpdated: "2024-12-10",
            completionRate: 82,
        },
        {
            id: 3,
            title: "React Advanced Patterns",
            description: "Deep dive into React Hooks, patterns & best practices for scalable apps",
            students: 0,
            lessons: 0,
            status: "Draft",
            rating: 0,
            reviews: 0,
            category: "Development",
            duration: "30 hours",
            price: 69.99,
            revenue: 0,
            thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
            lastUpdated: "2025-01-02",
            completionRate: 0,
        },
        {
            id: 4,
            title: "UI/UX Design Masterclass",
            description: "Learn modern design principles, Figma, prototyping & user research",
            students: 890,
            lessons: 32,
            status: "Published",
            rating: 4.8,
            reviews: 324,
            category: "Design",
            duration: "35 hours",
            price: 74.99,
            revenue: 66741,
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
            lastUpdated: "2024-12-20",
            completionRate: 71,
        },
    ])

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

    const [lessons, setLessons] = useState([
        { id: 1, title: "Introduction to MERN Stack", duration: "15 min", type: "video", order: 1, completed: 245 },
        { id: 2, title: "MongoDB Setup & Configuration", duration: "20 min", type: "video", order: 2, completed: 198 },
        { id: 3, title: "Express.js Fundamentals", duration: "25 min", type: "video", order: 3, completed: 176 },
    ])

    const [newLesson, setNewLesson] = useState({
        title: "",
        duration: "",
        type: "video",
    })

    const studentsList = [
        { id: 1, name: "John Smith", email: "john@mail.com", progress: 85, enrolled: "2024-11-15", lastActive: "2 hours ago" },
        { id: 2, name: "Sarah Johnson", email: "sarah@mail.com", progress: 92, enrolled: "2024-11-20", lastActive: "1 day ago" },
        { id: 3, name: "Alex Brown", email: "alex@mail.com", progress: 76, enrolled: "2024-12-01", lastActive: "3 days ago" },
        { id: 4, name: "Emma Wilson", email: "emma@mail.com", progress: 64, enrolled: "2024-12-05", lastActive: "5 hours ago" },
    ]

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

    const handleEdit = (course) => {
        setSelectedCourse({ ...course })
        setShowEditModal(true)
    }

    const handleSaveEdit = () => {
        setCourses(courses.map((c) => c.id === selectedCourse.id ? selectedCourse : c))
        setShowEditModal(false)
        toast.success("✅ Course updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        })
    }

    const handleAddLesson = () => {
        if (!newLesson.title || !newLesson.duration) {
            toast.error("⚠️ Please fill all lesson fields", {
                position: "top-center",
                autoClose: 3000,
            })
            return
        }
        setLessons([
            ...lessons,
            { ...newLesson, id: Date.now(), order: lessons.length + 1, completed: 0 },
        ])
        setNewLesson({ title: "", duration: "", type: "video" })
        toast.success("✅ Lesson added successfully!", {
            position: "bottom-right",
            autoClose: 2000,
        })
    }

    const handleDeleteLesson = (id) => {
        setLessons(lessons.filter((l) => l.id !== id))
        toast.info("🗑️ Lesson deleted", {
            position: "bottom-left",
            autoClose: 2000,
        })
    }

    const handleDeleteCourse = (id) => {
        setCourses(courses.filter((c) => c.id !== id))
        toast.warning("⚠️ Course deleted", {
            position: "top-center",
            autoClose: 3000,
        })
    }

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

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && selectedCourse && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-2xl my-8 shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Edit Course</h2>
                                    <button onClick={() => setShowEditModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Course Title</label>
                                        <input
                                            value={selectedCourse.title}
                                            onChange={(e) =>
                                                setSelectedCourse({
                                                    ...selectedCourse,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Description</label>
                                        <textarea
                                            value={selectedCourse.description}
                                            onChange={(e) =>
                                                setSelectedCourse({
                                                    ...selectedCourse,
                                                    description: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Category</label>
                                            <select
                                                value={selectedCourse.category}
                                                onChange={(e) =>
                                                    setSelectedCourse({
                                                        ...selectedCourse,
                                                        category: e.target.value,
                                                    })
                                                }
                                                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none"
                                            >
                                                <option>Development</option>
                                                <option>Data Science</option>
                                                <option>Design</option>
                                                <option>Business</option>
                                                <option>Marketing</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Price ($)</label>
                                            <input
                                                type="number"
                                                value={selectedCourse.price}
                                                onChange={(e) =>
                                                    setSelectedCourse({
                                                        ...selectedCourse,
                                                        price: parseFloat(e.target.value),
                                                    })
                                                }
                                                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSaveEdit}
                                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                                        >
                                            <Save size={18} className="inline mr-2" /> Save Changes
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                handleDeleteCourse(selectedCourse.id)
                                                setShowEditModal(false)
                                            }}
                                            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium"
                                        >
                                            <Trash2 size={18} className="inline mr-2" /> Delete
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Lessons Modal */}
            <AnimatePresence>
                {showLessonsModal && selectedCourse && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLessonsModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex justify-center items-center p-4 z-50 overflow-y-auto">
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white p-6 sm:p-8 rounded-2xl max-w-4xl w-full my-8 shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Course Lessons</h2>
                                    <button onClick={() => setShowLessonsModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                                    <h3 className="font-semibold mb-4">Add New Lesson</h3>
                                    <div className="grid sm:grid-cols-3 gap-3 mb-3">
                                        <input
                                            placeholder="Lesson Title"
                                            value={newLesson.title}
                                            onChange={(e) =>
                                                setNewLesson({ ...newLesson, title: e.target.value })
                                            }
                                            className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none"
                                        />
                                        <input
                                            placeholder="Duration (e.g., 15 min)"
                                            value={newLesson.duration}
                                            onChange={(e) =>
                                                setNewLesson({
                                                    ...newLesson,
                                                    duration: e.target.value,
                                                })
                                            }
                                            className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none"
                                        />
                                        <select
                                            value={newLesson.type}
                                            onChange={(e) =>
                                                setNewLesson({ ...newLesson, type: e.target.value })
                                            }
                                            className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:outline-none"
                                        >
                                            <option value="video">Video</option>
                                            <option value="article">Article</option>
                                            <option value="quiz">Quiz</option>
                                            <option value="assignment">Assignment</option>
                                        </select>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddLesson}
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium shadow-md"
                                    >
                                        <Plus size={18} className="inline mr-2" /> Add Lesson
                                    </motion.button>
                                </div>

                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {lessons.map((l, idx) => (
                                        <motion.div
                                            key={l.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                                                    {l.order}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{l.title}</h4>
                                                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} /> {l.duration}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            {l.type === "video" ? <Video size={14} /> : <FileText size={14} />}
                                                            {l.type}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle size={14} /> {l.completed} completed
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteLesson(l.id)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowLessonsModal(false)}
                                    className="mt-6 w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </motion.button>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Students Modal */}
            <AnimatePresence>
                {showStudentsModal && selectedCourse && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowStudentsModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex justify-center items-center p-4 z-50 overflow-y-auto">
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-3xl my-8 shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">Enrolled Students</h2>
                                        <p className="text-gray-600 mt-1">{selectedCourse.title}</p>
                                    </div>
                                    <button onClick={() => setShowStudentsModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {studentsList.map((s, idx) => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                                                    {s.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-lg">{s.name}</p>
                                                    <p className="text-sm text-gray-600">{s.email}</p>
                                                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                                        <span>Enrolled: {s.enrolled}</span>
                                                        <span>Last active: {s.lastActive}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-purple-600">{s.progress}%</p>
                                                    <p className="text-xs text-gray-600">Progress</p>
                                                </div>
                                                <div className="w-24 h-24 relative">
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <circle
                                                            cx="48"
                                                            cy="48"
                                                            r="40"
                                                            stroke="#e5e7eb"
                                                            strokeWidth="8"
                                                            fill="none"
                                                        />
                                                        <circle
                                                            cx="48"
                                                            cy="48"
                                                            r="40"
                                                            stroke="url(#gradient)"
                                                            strokeWidth="8"
                                                            fill="none"
                                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - s.progress / 100)}`}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <defs>
                                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#a855f7" />
                                                            <stop offset="100%" stopColor="#ec4899" />
                                                        </linearGradient>
                                                    </defs>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowStudentsModal(false)}
                                    className="mt-6 w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </motion.button>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Analytics Modal */}
            <AnimatePresence>
                {showAnalyticsModal && selectedCourse && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAnalyticsModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex justify-center items-center p-4 z-50 overflow-y-auto">
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-4xl my-8 shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">Course Analytics</h2>
                                        <p className="text-gray-600 mt-1">{selectedCourse.title}</p>
                                    </div>
                                    <button onClick={() => setShowAnalyticsModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-4 rounded-xl">
                                        <Users size={24} className="mb-2" />
                                        <p className="text-2xl font-bold">{selectedCourse.students}</p>
                                        <p className="text-sm opacity-90">Total Students</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-xl">
                                        <DollarSign size={24} className="mb-2" />
                                        <p className="text-2xl font-bold">${selectedCourse.revenue.toLocaleString()}</p>
                                        <p className="text-sm opacity-90">Total Revenue</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-4 rounded-xl">
                                        <Star size={24} className="mb-2" />
                                        <p className="text-2xl font-bold">{selectedCourse.rating}</p>
                                        <p className="text-sm opacity-90">Avg Rating</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-xl">
                                        <TrendingUp size={24} className="mb-2" />
                                        <p className="text-2xl font-bold">{selectedCourse.completionRate}%</p>
                                        <p className="text-sm opacity-90">Completion Rate</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gray-50 p-5 rounded-xl">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <MessageSquare size={20} /> Recent Reviews
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { name: "John Doe", rating: 5, comment: "Excellent course! Very detailed." },
                                                { name: "Jane Smith", rating: 4, comment: "Great content, well structured." },
                                                { name: "Mike Johnson", rating: 5, comment: "Best course I've taken!" },
                                            ].map((review, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-semibold text-sm">{review.name}</p>
                                                        <div className="flex">
                                                            {[...Array(review.rating)].map((_, i) => (
                                                                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-xl">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <TrendingUp size={20} /> Enrollment Trend
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { month: "October", students: 320 },
                                                { month: "November", students: 485 },
                                                { month: "December", students: 612 },
                                                { month: "January", students: 683 },
                                            ].map((data, idx) => (
                                                <div key={idx}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium">{data.month}</span>
                                                        <span className="text-gray-600">{data.students} students</span>
                                                    </div>
                                                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(data.students / 683) * 100}%` }}
                                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toast.success("📊 Report downloaded!", { position: "bottom-right" })}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium"
                                    >
                                        <Download size={18} className="inline mr-2" /> Download Report
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toast.info("🔗 Share link copied!", { position: "bottom-right" })}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium"
                                    >
                                        <Share2 size={18} className="inline mr-2" /> Share Course
                                    </motion.button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowAnalyticsModal(false)}
                                    className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </motion.button>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

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