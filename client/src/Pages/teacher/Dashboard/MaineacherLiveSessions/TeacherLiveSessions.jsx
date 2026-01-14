import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Plus,
    Edit3,
    Trash2,
    X,
    Copy,
    Video,
    Calendar,
    Clock,
    ExternalLink,
    AlertCircle,
    Loader,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const TeacherLiveSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        course: "",
        date: "",
        time: "",
        duration: "90",
        meetLink: "",
    });

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/lessons`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSessions(data.lessons);
        } catch (err) {
            toast.error(err.message || "Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingSession
                ? `${BACKEND_URL}/api/lessons/${editingSession._id}`
                : `${BACKEND_URL}/api/lessons/create`;

            const method = editingSession ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success(editingSession ? "✅ Session updated" : "✅ Session created");
            setShowModal(false);
            setEditingSession(null);
            fetchLessons();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this session?")) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/lessons/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!res.ok) throw new Error();
            toast.success("🗑️ Session deleted");
            fetchLessons();
        } catch {
            toast.error("Delete failed");
        }
    };

    const openCreate = () => {
        setEditingSession(null);
        setFormData({
            title: "",
            course: "",
            date: "",
            time: "",
            duration: "90",
            meetLink: "",
        });
        setShowModal(true);
    };

    const openEdit = (s) => {
        setEditingSession(s);
        setFormData({
            title: s.title,
            course: s.course?._id || "",
            date: s.date,
            time: s.time,
            duration: s.duration,
            meetLink: s.meetLink,
        });
        setShowModal(true);
    };

    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        toast.success("📋 Meet link copied");
    };

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 sm:p-3 rounded-xl">
                                <Video className="text-white" size={24} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Live Sessions
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Manage your live classes and meetings
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openCreate}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">New Session</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20"
                    >
                        <Loader className="animate-spin text-blue-600 mb-4" size={48} />
                        <p className="text-gray-600 font-medium">Loading sessions...</p>
                    </motion.div>
                ) : sessions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No sessions found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Create your first live session to get started
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                        >
                            <Plus size={18} /> Create Session
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="grid gap-4 sm:gap-6">
                        {sessions.map((session, idx) => (
                            <motion.div
                                key={session._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -3 }}
                                className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center">
                                                <Video size={32} className="text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
                                                {session.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {session.course?.title || "N/A"}
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Calendar
                                                        size={16}
                                                        className="text-blue-500 flex-shrink-0"
                                                    />
                                                    <span>{session.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Clock
                                                        size={16}
                                                        className="text-purple-500 flex-shrink-0"
                                                    />
                                                    <span>
                                                        {session.time} • {session.duration} min
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <ExternalLink
                                                        size={16}
                                                        className="text-green-500 flex-shrink-0"
                                                    />
                                                    <span className="truncate">Meet Link</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() =>
                                                        window.open(session.meetLink, "_blank")
                                                    }
                                                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium shadow-lg text-sm sm:text-base"
                                                >
                                                    <Video size={16} /> Join Class
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => copyLink(session.meetLink)}
                                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg font-medium text-sm sm:text-base"
                                                >
                                                    <Copy size={16} /> Copy
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openEdit(session)}
                                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-medium text-sm sm:text-base"
                                                >
                                                    <Edit3 size={16} /> Edit
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDelete(session._id)}
                                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-medium text-sm sm:text-base"
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
                )}
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openCreate}
                className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40"
            >
                <Plus size={28} />
            </motion.button>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold">
                                                {editingSession ? "Edit Session" : "New Session"}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-white/80">
                                                Fill in the details below
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Session Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="e.g., Introduction to React Hooks"
                                        className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Course ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.course}
                                        onChange={(e) =>
                                            setFormData({ ...formData, course: e.target.value })
                                        }
                                        placeholder="Enter course ID"
                                        className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, date: e.target.value })
                                            }
                                            className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time}
                                            onChange={(e) =>
                                                setFormData({ ...formData, time: e.target.value })
                                            }
                                            className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Duration <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) =>
                                            setFormData({ ...formData, duration: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                    >
                                        <option value="30">30 minutes</option>
                                        <option value="45">45 minutes</option>
                                        <option value="60">60 minutes</option>
                                        <option value="90">90 minutes</option>
                                        <option value="120">120 minutes</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Google Meet Link <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <ExternalLink
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="url"
                                            required
                                            value={formData.meetLink}
                                            onChange={(e) =>
                                                setFormData({ ...formData, meetLink: e.target.value })
                                            }
                                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                            className="w-full pl-11 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Create a meeting at{" "}
                                        <a
                                            href="https://meet.google.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            meet.google.com
                                        </a>
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        className="flex-1 px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg text-sm sm:text-base"
                                    >
                                        {editingSession ? "Update Session" : "Create Session"}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherLiveSessions;