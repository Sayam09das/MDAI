import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    Users,
    Search,
    Filter,
    Mail,
    Phone,
    Calendar,
    Award,
    TrendingUp,
    ArrowLeft,
    Eye,
    MessageSquare,
    X,
    CheckCircle,
    Clock,
    BookOpen,
    BarChart3,
    Download,
    UserCheck,
    AlertCircle,
} from "lucide-react"

const EnrolledStudents = () => {
    const [students, setStudents] = useState([
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@email.com",
            phone: "+1 234-567-8901",
            enrolledDate: "2024-11-15",
            course: "Full Stack Development",
            progress: 85,
            completedLessons: 34,
            totalLessons: 40,
            lastActive: "2 hours ago",
            status: "active",
            avatar: "JS",
            grade: "A",
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1 234-567-8902",
            enrolledDate: "2024-11-20",
            course: "Full Stack Development",
            progress: 92,
            completedLessons: 37,
            totalLessons: 40,
            lastActive: "1 day ago",
            status: "active",
            avatar: "SJ",
            grade: "A+",
        },
        {
            id: 3,
            name: "Alex Brown",
            email: "alex.brown@email.com",
            phone: "+1 234-567-8903",
            enrolledDate: "2024-12-01",
            course: "Full Stack Development",
            progress: 76,
            completedLessons: 30,
            totalLessons: 40,
            lastActive: "3 days ago",
            status: "active",
            avatar: "AB",
            grade: "B+",
        },
        {
            id: 4,
            name: "Emma Wilson",
            email: "emma.wilson@email.com",
            phone: "+1 234-567-8904",
            enrolledDate: "2024-12-05",
            course: "Full Stack Development",
            progress: 64,
            completedLessons: 26,
            totalLessons: 40,
            lastActive: "5 hours ago",
            status: "active",
            avatar: "EW",
            grade: "B",
        },
        {
            id: 5,
            name: "Michael Davis",
            email: "michael.davis@email.com",
            phone: "+1 234-567-8905",
            enrolledDate: "2024-11-10",
            course: "Full Stack Development",
            progress: 45,
            completedLessons: 18,
            totalLessons: 40,
            lastActive: "1 week ago",
            status: "inactive",
            avatar: "MD",
            grade: "C+",
        },
        {
            id: 6,
            name: "Olivia Martinez",
            email: "olivia.martinez@email.com",
            phone: "+1 234-567-8906",
            enrolledDate: "2024-12-10",
            course: "Full Stack Development",
            progress: 88,
            completedLessons: 35,
            totalLessons: 40,
            lastActive: "30 min ago",
            status: "active",
            avatar: "OM",
            grade: "A",
        },
    ])

    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    const totalStudents = students.length
    const activeStudents = students.filter(s => s.status === "active").length
    const avgProgress = Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    const topPerformers = students.filter(s => s.progress >= 85).length

    const handleEmailStudent = (student) => {
        window.location.href = `mailto:${student.email}`
        toast.info(`📧 Opening email to ${student.name}`, {
            position: "bottom-right",
            autoClose: 2000,
        })
    }

    const handleViewDetails = (student) => {
        setSelectedStudent(student)
        setShowDetailsModal(true)
    }

    const handleSendMessage = (student) => {
        toast.success(`💬 Message sent to ${student.name}`, {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const filteredStudents = students
        .filter(student => {
            const matchSearch = 
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())
            const matchFilter = 
                filterStatus === "all" || 
                student.status === filterStatus
            return matchSearch && matchFilter
        })
        .sort((a, b) => b.progress - a.progress)

    const getProgressColor = (progress) => {
        if (progress >= 80) return "from-green-500 to-emerald-500"
        if (progress >= 60) return "from-blue-500 to-cyan-500"
        if (progress >= 40) return "from-yellow-500 to-orange-500"
        return "from-red-500 to-rose-500"
    }

    const getGradeColor = (grade) => {
        if (grade.startsWith("A")) return "bg-green-100 text-green-700"
        if (grade.startsWith("B")) return "bg-blue-100 text-blue-700"
        if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700"
        return "bg-red-100 text-red-700"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-purple-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    <Users className="text-violet-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Students</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Track student progress
                                </p>
                            </div>
                        </div>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.info("📊 Exporting...", { position: "bottom-right" })}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                        >
                            <Download size={20} /> <span className="hidden sm:inline">Export</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Users className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-2xl sm:text-3xl font-bold">{totalStudents}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <UserCheck className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Active</p>
                        <p className="text-2xl sm:text-3xl font-bold">{activeStudents}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Avg Progress</p>
                        <p className="text-2xl sm:text-3xl font-bold">{avgProgress}%</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Award className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Top</p>
                        <p className="text-2xl sm:text-3xl font-bold">{topPerformers}</p>
                    </motion.div>
                </motion.div>

                {/* Search & Filter */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 sm:py-3 focus:border-violet-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {["all", "active", "inactive"].map((f) => (
                                <motion.button
                                    key={f}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterStatus(f)}
                                    className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm font-medium transition-all ${
                                        filterStatus === f
                                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    <Filter size={14} className="inline mr-1" />
                                    {f}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Students List */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                    {filteredStudents.map((student, idx) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className={`bg-gradient-to-r ${getProgressColor(student.progress)} p-4 text-white`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg">
                                        {student.avatar}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(student.grade)} bg-white/90`}>
                                        {student.grade}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs opacity-90">Progress</p>
                                        <p className="text-2xl font-bold">{student.progress}%</p>
                                    </div>
                                    <BarChart3 size={32} className="opacity-80" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 sm:p-5">
                                <h3 className="font-bold text-base sm:text-lg mb-1">{student.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                                    <Mail size={14} />
                                    <span className="truncate">{student.email}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                        <span className="flex items-center gap-1">
                                            <BookOpen size={12} />
                                            {student.completedLessons}/{student.totalLessons}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {student.lastActive}
                                        </span>
                                    </div>
                                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${student.progress}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className={`bg-gradient-to-r ${getProgressColor(student.progress)} h-full`}
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone size={14} className="text-violet-500" />
                                        <span className="truncate">{student.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span>{new Date(student.enrolledDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            student.status === "active" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {student.status === "active" ? (
                                                <><CheckCircle size={12} className="inline mr-1" />Active</>
                                            ) : (
                                                <><AlertCircle size={12} className="inline mr-1" />Inactive</>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-3 gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleViewDetails(student)}
                                        className="flex items-center justify-center gap-1 bg-violet-100 text-violet-700 hover:bg-violet-200 py-2 rounded-lg text-xs font-medium"
                                    >
                                        <Eye size={14} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEmailStudent(student)}
                                        className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 rounded-lg text-xs font-medium"
                                    >
                                        <Mail size={14} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSendMessage(student)}
                                        className="flex items-center justify-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-lg text-xs font-medium"
                                    >
                                        <MessageSquare size={14} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredStudents.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <Users size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-600 mb-2">No students found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedStudent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetailsModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8"
                            >
                                <div className={`bg-gradient-to-r ${getProgressColor(selectedStudent.progress)} text-white p-6 rounded-t-2xl`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
                                                {selectedStudent.avatar}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                                                <p className="text-sm opacity-90">{selectedStudent.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowDetailsModal(false)}>
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Progress */}
                                    <div>
                                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                            <BarChart3 size={20} className="text-violet-600" />
                                            Progress
                                        </h3>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Completion</span>
                                                <span className="text-2xl font-bold text-violet-600">{selectedStudent.progress}%</span>
                                            </div>
                                            <div className="bg-gray-200 h-3 rounded-full overflow-hidden mb-3">
                                                <div 
                                                    className={`bg-gradient-to-r ${getProgressColor(selectedStudent.progress)} h-full`}
                                                    style={{ width: `${selectedStudent.progress}%` }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="bg-white p-3 rounded-lg">
                                                    <p className="text-gray-600 mb-1">Lessons</p>
                                                    <p className="text-xl font-bold">{selectedStudent.completedLessons}/{selectedStudent.totalLessons}</p>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg">
                                                    <p className="text-gray-600 mb-1">Grade</p>
                                                    <p className="text-xl font-bold">{selectedStudent.grade}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                            <Mail size={20} className="text-blue-600" />
                                            Contact
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                                                <Mail size={18} className="text-blue-600" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-600">Email</p>
                                                    <p className="font-medium truncate">{selectedStudent.email}</p>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEmailStudent(selectedStudent)}
                                                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg"
                                                >
                                                    <Mail size={16} />
                                                </motion.button>
                                            </div>
                                            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                                                <Phone size={18} className="text-green-600" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-600">Phone</p>
                                                    <p className="font-medium">{selectedStudent.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                                                <Calendar size={18} className="text-purple-600" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-600">Enrolled</p>
                                                    <p className="font-medium">{new Date(selectedStudent.enrolledDate).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSendMessage(selectedStudent)}
                                            className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare size={18} /> Message
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowDetailsModal(false)}
                                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                                        >
                                            Close
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EnrolledStudents