import React, { useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Search,
    Filter,
    Download,
    TrendingUp,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

const StudentAttendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    const [students, setStudents] = useState([
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@email.com",
            avatar: "JS",
            attendance: {
                "2025-01-01": "present",
                "2025-01-02": "present",
                "2025-01-03": "absent",
                "2025-01-04": "present",
                "2025-01-05": "present",
            },
            totalPresent: 28,
            totalAbsent: 2,
            attendanceRate: 93,
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            avatar: "SJ",
            attendance: {
                "2025-01-01": "present",
                "2025-01-02": "present",
                "2025-01-03": "present",
                "2025-01-04": "present",
                "2025-01-05": "present",
            },
            totalPresent: 30,
            totalAbsent: 0,
            attendanceRate: 100,
        },
        {
            id: 3,
            name: "Alex Brown",
            email: "alex.brown@email.com",
            avatar: "AB",
            attendance: {
                "2025-01-01": "present",
                "2025-01-02": "absent",
                "2025-01-03": "present",
                "2025-01-04": "absent",
                "2025-01-05": "present",
            },
            totalPresent: 24,
            totalAbsent: 6,
            attendanceRate: 80,
        },
        {
            id: 4,
            name: "Emma Wilson",
            email: "emma.wilson@email.com",
            avatar: "EW",
            attendance: {
                "2025-01-01": "present",
                "2025-01-02": "present",
                "2025-01-03": "present",
                "2025-01-04": "absent",
                "2025-01-05": "present",
            },
            totalPresent: 27,
            totalAbsent: 3,
            attendanceRate: 90,
        },
        {
            id: 5,
            name: "Michael Davis",
            email: "michael.davis@email.com",
            avatar: "MD",
            attendance: {
                "2025-01-01": "absent",
                "2025-01-02": "present",
                "2025-01-03": "absent",
                "2025-01-04": "present",
                "2025-01-05": "absent",
            },
            totalPresent: 20,
            totalAbsent: 10,
            attendanceRate: 67,
        },
        {
            id: 6,
            name: "Olivia Martinez",
            email: "olivia.martinez@email.com",
            avatar: "OM",
            attendance: {
                "2025-01-01": "present",
                "2025-01-02": "present",
                "2025-01-03": "present",
                "2025-01-04": "present",
                "2025-01-05": "present",
            },
            totalPresent: 29,
            totalAbsent: 1,
            attendanceRate: 97,
        },
    ])

    const dateKey = selectedDate.toISOString().split('T')[0]

    const totalStudents = students.length
    const presentToday = students.filter(s => s.attendance[dateKey] === "present").length
    const absentToday = students.filter(s => s.attendance[dateKey] === "absent").length
    const avgAttendanceRate = Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)

    const handleMarkAttendance = (studentId, status) => {
        setStudents(students.map(s => {
            if (s.id === studentId) {
                const newAttendance = { ...s.attendance, [dateKey]: status }
                return { ...s, attendance: newAttendance }
            }
            return s
        }))

        const student = students.find(s => s.id === studentId)
        toast.success(`✅ ${student.name} marked as ${status}`, {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const changeDate = (days) => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + days)
        setSelectedDate(newDate)
    }

    const filteredStudents = students.filter(student => {
        const matchSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())

        const todayStatus = student.attendance[dateKey]
        const matchFilter =
            filterStatus === "all" ||
            (filterStatus === "present" && todayStatus === "present") ||
            (filterStatus === "absent" && todayStatus === "absent") ||
            (filterStatus === "unmarked" && !todayStatus)

        return matchSearch && matchFilter
    })

    const getAttendanceColor = (rate) => {
        if (rate >= 90) return "from-green-500 to-emerald-500"
        if (rate >= 75) return "from-blue-500 to-cyan-500"
        if (rate >= 60) return "from-yellow-500 to-orange-500"
        return "from-red-500 to-rose-500"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
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
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-cyan-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-cyan-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    <CheckCircle className="text-blue-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Attendance</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Track student attendance
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.info("📊 Exporting...", { position: "bottom-right" })}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
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
                            <CheckCircle className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Present</p>
                        <p className="text-2xl sm:text-3xl font-bold">{presentToday}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-red-500 to-rose-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <XCircle className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Absent</p>
                        <p className="text-2xl sm:text-3xl font-bold">{absentToday}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Avg Rate</p>
                        <p className="text-2xl sm:text-3xl font-bold">{avgAttendanceRate}%</p>
                    </motion.div>
                </motion.div>

                {/* Date Selector */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => changeDate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </motion.button>

                        <div className="text-center">
                            <div className="flex items-center gap-2 justify-center mb-1">
                                <Calendar className="text-blue-600" size={20} />
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold">
                                    {selectedDate.toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">
                                {selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                                    ? "Today"
                                    : selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
                                }
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => changeDate(1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    </div>

                    <div className="flex gap-2 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDate(new Date())}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                            Today
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const yesterday = new Date()
                                yesterday.setDate(yesterday.getDate() - 1)
                                setSelectedDate(yesterday)
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            Yesterday
                        </motion.button>
                    </div>
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
                                placeholder="Search students..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 sm:py-3 focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {["all", "present", "absent", "unmarked"].map((f) => (
                                <motion.button
                                    key={f}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterStatus(f)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg capitalize whitespace-nowrap text-xs sm:text-sm font-medium transition-all ${filterStatus === f
                                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
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

                {/* Attendance List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3 sm:space-y-4"
                >
                    {filteredStudents.map((student, idx) => {
                        const todayStatus = student.attendance[dateKey]

                        return (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                            <div className={`bg-gradient-to-r ${getAttendanceColor(student.attendanceRate)} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                                                {student.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-base sm:text-lg mb-1">{student.name}</h3>
                                                <p className="text-sm text-gray-600 truncate mb-2">{student.email}</p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700">
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle size={14} className="text-green-600" />
                                                        {student.totalPresent} P
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <XCircle size={14} className="text-red-600" />
                                                        {student.totalAbsent} A
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp size={14} className="text-blue-600" />
                                                        {student.attendanceRate}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleMarkAttendance(student.id, "present")}
                                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all ${todayStatus === "present"
                                                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                                    }`}
                                            >
                                                <CheckCircle size={18} />
                                                <span className="hidden sm:inline">Present</span>
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleMarkAttendance(student.id, "absent")}
                                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all ${todayStatus === "absent"
                                                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                    }`}
                                            >
                                                <XCircle size={18} />
                                                <span className="hidden sm:inline">Absent</span>
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                            <span>Overall Rate</span>
                                            <span className="font-bold">{student.attendanceRate}%</span>
                                        </div>
                                        <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${student.attendanceRate}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1 }}
                                                className={`bg-gradient-to-r ${getAttendanceColor(student.attendanceRate)} h-full`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Empty State */}
                {filteredStudents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-600 mb-2">No students found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default StudentAttendance