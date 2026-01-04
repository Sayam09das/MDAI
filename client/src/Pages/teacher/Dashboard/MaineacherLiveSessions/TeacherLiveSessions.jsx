import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    Video,
    Calendar,
    Clock,
    Users,
    Play,
    Copy,
    Plus,
    ArrowLeft,
    Filter,
    Search,
    AlertCircle,
    Trash2,
} from "lucide-react"

const TeacherLiveSessions = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [sessions, setSessions] = useState([
        {
            id: 1,
            title: "Introduction to React Hooks",
            course: "Full Stack Development",
            startTime: "2025-01-05T10:00:00",
            endTime: "2025-01-05T11:30:00",
            duration: "90 min",
            meetLink: "https://meet.google.com/abc-defg-hij",
            students: 45,
            maxStudents: 50,
            status: "upcoming",
        },
        {
            id: 2,
            title: "JavaScript ES6+ Features",
            course: "Web Development Bootcamp",
            startTime: "2025-01-04T14:30:00",
            endTime: "2025-01-04T16:00:00",
            duration: "90 min",
            meetLink: "https://meet.google.com/xyz-abcd-efg",
            students: 32,
            maxStudents: 40,
            status: "ongoing",
        },
        {
            id: 3,
            title: "CSS Grid & Flexbox Mastery",
            course: "Frontend Design",
            startTime: "2025-01-05T15:00:00",
            endTime: "2025-01-05T16:30:00",
            duration: "90 min",
            meetLink: "https://meet.google.com/pqr-stuv-wxy",
            students: 28,
            maxStudents: 35,
            status: "upcoming",
        },
        {
            id: 4,
            title: "Node.js & Express Basics",
            course: "Backend Development",
            startTime: "2025-01-06T11:00:00",
            endTime: "2025-01-06T12:30:00",
            duration: "90 min",
            meetLink: "https://meet.google.com/lmn-opqr-stu",
            students: 38,
            maxStudents: 45,
            status: "upcoming",
        },
    ])

    const [filterStatus, setFilterStatus] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timer)
    }, [])

    const getTimeUntilSession = (startTime) => {
        const start = new Date(startTime)
        const diff = start - currentTime
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (diff < 0) return "Started"
        if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    const handleStartClass = (session) => {
        window.open(session.meetLink, '_blank')
        toast.success(`🎥 Starting class: ${session.title}`, {
            position: "top-center",
            autoClose: 3000,
        })
    }

    const handleJoinClass = (session) => {
        window.open(session.meetLink, '_blank')
        toast.info(`🚀 Joining: ${session.title}`, {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const copyMeetLink = (link, title) => {
        navigator.clipboard.writeText(link)
        toast.success(`📋 Link copied for: ${title}`, {
            position: "bottom-right",
            autoClose: 2000,
        })
    }

    const handleDeleteSession = (id) => {
        setSessions(sessions.filter(s => s.id !== id))
        toast.warning("🗑️ Session deleted", {
            position: "bottom-left",
            autoClose: 2000,
        })
    }

    const filteredSessions = sessions
        .filter(session => {
            const matchSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.course.toLowerCase().includes(searchQuery.toLowerCase())
            const matchFilter = filterStatus === "all" || session.status === filterStatus
            return matchSearch && matchFilter
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

    const ongoingSessions = filteredSessions.filter(s => s.status === "ongoing")
    const upcomingSessions = filteredSessions.filter(s => s.status === "upcoming")

    const totalSessions = sessions.length
    const totalStudents = sessions.reduce((sum, s) => sum + s.students, 0)
    const ongoingCount = sessions.filter(s => s.status === "ongoing").length

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-indigo-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    <Video className="text-blue-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Live Sessions</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Manage your live classes and meetings
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.info("🎯 Schedule feature coming soon!")}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                        >
                            <Plus size={20} /> <span className="hidden sm:inline">Schedule</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Calendar className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Sessions</p>
                        <p className="text-2xl sm:text-3xl font-bold">{totalSessions}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Video className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Live Now</p>
                        <p className="text-2xl sm:text-3xl font-bold">{ongoingCount}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 col-span-2 lg:col-span-1"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Users className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Students</p>
                        <p className="text-2xl sm:text-3xl font-bold">{totalStudents}</p>
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
                                placeholder="Search sessions..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 sm:py-3 focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {["all", "ongoing", "upcoming"].map((f) => (
                                <motion.button
                                    key={f}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterStatus(f)}
                                    className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm font-medium transition-all ${filterStatus === f
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
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

                {/* Ongoing Sessions */}
                {ongoingSessions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                            <Video className="text-green-600" size={24} />
                            <span>Live Now</span>
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                LIVE
                            </span>
                        </h2>

                        <div className="grid gap-4 sm:gap-6">
                            {ongoingSessions.map((session) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border-2 border-green-200"
                                >
                                    <div className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center">
                                                    <Video size={32} className="animate-pulse" />
                                                    <span className="text-xs font-bold mt-1">LIVE</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">
                                                            {session.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-2">{session.course}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Clock size={16} />
                                                        <span>{session.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Users size={16} />
                                                        <span>{session.students}/{session.maxStudents}</span>
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-2 text-gray-700">
                                                        <Calendar size={16} />
                                                        <span className="truncate">
                                                            {new Date(session.startTime).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleJoinClass(session)}
                                                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium shadow-lg"
                                                    >
                                                        <Play size={18} /> Join Class
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => copyMeetLink(session.meetLink, session.title)}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg font-medium"
                                                    >
                                                        <Copy size={16} /> Copy Link
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Upcoming Sessions */}
                {upcomingSessions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="text-blue-600" size={24} />
                            Upcoming Sessions
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {upcomingSessions.map((session, idx) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs opacity-90 mb-1">Starting in</p>
                                                <p className="text-2xl font-bold">
                                                    {getTimeUntilSession(session.startTime)}
                                                </p>
                                            </div>
                                            <Video size={32} className="opacity-80" />
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5">
                                        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">
                                            {session.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">{session.course}</p>

                                        <div className="space-y-2 text-sm text-gray-700 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-blue-500" />
                                                <span>{session.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-purple-500" />
                                                <span>{session.students}/{session.maxStudents} students</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-green-500" />
                                                <span className="truncate">
                                                    {new Date(session.startTime).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleStartClass(session)}
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium"
                                            >
                                                <Play size={16} /> Start Class
                                            </motion.button>

                                            <div className="grid grid-cols-2 gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => copyMeetLink(session.meetLink, session.title)}
                                                    className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    <Copy size={14} /> Copy
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteSession(session.id)}
                                                    className="flex items-center justify-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {filteredSessions.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-600 mb-2">No sessions found</p>
                        <p className="text-gray-500 mb-6">Try adjusting your search or schedule a new session</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.info("🎯 Schedule feature coming soon!")}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
                        >
                            <Plus size={18} className="inline mr-2" /> Schedule Session
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Mobile FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.info("🎯 Schedule feature coming soon!")}
                className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40"
            >
                <Plus size={28} />
            </motion.button>
        </div>
    )
}

export default TeacherLiveSessions