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
    Edit3,
    X,
    ExternalLink,
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
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [editingSession, setEditingSession] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        course: "",
        date: "",
        time: "",
        duration: "90",
        meetLink: "",
        maxStudents: "50"
    })

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

    const openScheduleModal = () => {
        setEditingSession(null)
        setFormData({
            title: "",
            course: "",
            date: "",
            time: "",
            duration: "90",
            meetLink: "",
            maxStudents: "50"
        })
        setShowScheduleModal(true)
    }

    const openEditModal = (session) => {
        setEditingSession(session)
        const sessionDate = new Date(session.startTime)
        setFormData({
            title: session.title,
            course: session.course,
            date: sessionDate.toISOString().split('T')[0],
            time: sessionDate.toTimeString().slice(0, 5),
            duration: session.duration.replace(' min', ''),
            meetLink: session.meetLink,
            maxStudents: session.maxStudents.toString()
        })
        setShowScheduleModal(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const startDateTime = new Date(`${formData.date}T${formData.time}:00`)
        const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000)

        const sessionData = {
            id: editingSession ? editingSession.id : Date.now(),
            title: formData.title,
            course: formData.course,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            duration: `${formData.duration} min`,
            meetLink: formData.meetLink,
            students: editingSession ? editingSession.students : 0,
            maxStudents: parseInt(formData.maxStudents),
            status: "upcoming"
        }

        if (editingSession) {
            setSessions(sessions.map(s => s.id === editingSession.id ? sessionData : s))
            toast.success("✅ Session updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            })
        } else {
            setSessions([...sessions, sessionData])
            toast.success("✅ Session scheduled successfully!", {
                position: "top-center",
                autoClose: 2000,
            })
        }

        setShowScheduleModal(false)
    }

    const filteredSessions = sessions
        .filter(session => {
            const matchSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.course.toLowerCase().includes(searchQuery.toLowerCase())
            const matchFilter = filterStatus === "all" || session.status === filterStatus
            return matchSearch && matchFilter
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

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
                            onClick={openScheduleModal}
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

                {/* All Sessions */}
                {filteredSessions.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="text-blue-600" size={24} />
                            All Sessions
                        </h2>

                        <div className="grid gap-4 sm:gap-6">
                            {filteredSessions.map((session, idx) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -3 }}
                                    className={`bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border-2 ${session.status === "ongoing"
                                            ? "border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50"
                                            : "border-gray-100"
                                        }`}
                                >
                                    <div className="p-4 sm:p-6">
                                        <div className="flex flex-col lg:flex-row gap-4">
                                            {/* Icon Section */}
                                            <div className="flex-shrink-0">
                                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center ${session.status === "ongoing"
                                                        ? "bg-gradient-to-br from-green-500 to-emerald-500"
                                                        : "bg-gradient-to-br from-blue-500 to-purple-500"
                                                    }`}>
                                                    {session.status === "ongoing" ? (
                                                        <>
                                                            <Video size={32} className="text-white animate-pulse" />
                                                            <span className="text-xs font-bold text-white mt-1">LIVE</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock size={32} className="text-white" />
                                                            <span className="text-xs font-bold text-white mt-1">
                                                                {getTimeUntilSession(session.startTime)}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start gap-2 mb-1">
                                                            <h3 className="text-lg sm:text-xl font-bold line-clamp-2 flex-1">
                                                                {session.title}
                                                            </h3>
                                                            {session.status === "ongoing" && (
                                                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex-shrink-0">
                                                                    <span className="relative flex h-2 w-2">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                                    </span>
                                                                    LIVE
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{session.course}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Clock size={16} className="text-blue-500 flex-shrink-0" />
                                                        <span>{session.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Users size={16} className="text-purple-500 flex-shrink-0" />
                                                        <span>{session.students}/{session.maxStudents}</span>
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-2 text-gray-700">
                                                        <Calendar size={16} className="text-green-500 flex-shrink-0" />
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

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => session.status === "ongoing" ? handleJoinClass(session) : handleStartClass(session)}
                                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium shadow-lg ${session.status === "ongoing"
                                                                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                                            }`}
                                                    >
                                                        <Play size={18} />
                                                        {session.status === "ongoing" ? "Join Class" : "Start Class"}
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => copyMeetLink(session.meetLink, session.title)}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg font-medium"
                                                    >
                                                        <Copy size={16} /> Copy Link
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => openEditModal(session)}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-medium"
                                                    >
                                                        <Edit3 size={16} /> Edit
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDeleteSession(session.id)}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-medium"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* Empty State */
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
                            onClick={openScheduleModal}
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
                onClick={openScheduleModal}
                className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40"
            >
                <Plus size={28} />
            </motion.button>

            {/* Schedule Modal */}
            <AnimatePresence>
                {showScheduleModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowScheduleModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {editingSession ? "Edit Session" : "Schedule New Session"}
                                            </h2>
                                            <p className="text-sm text-white/80">Fill in the details below</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowScheduleModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Session Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Session Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Introduction to React Hooks"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Course Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Course Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.course}
                                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                        placeholder="e.g., Full Stack Development"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Date and Time Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Duration and Max Students Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Duration */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Duration (minutes) <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                        >
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                            <option value="90">90 minutes</option>
                                            <option value="120">120 minutes</option>
                                        </select>
                                    </div>

                                    {/* Max Students */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Max Students
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="500"
                                            value={formData.maxStudents}
                                            onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                                            placeholder="50"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Google Meet Link */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Google Meet Link <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="url"
                                            required
                                            value={formData.meetLink}
                                            onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Create a meeting at <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">meet.google.com</a>
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowScheduleModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg"
                                    >
                                        {editingSession ? "Update Session" : "Create Session"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TeacherLiveSessions