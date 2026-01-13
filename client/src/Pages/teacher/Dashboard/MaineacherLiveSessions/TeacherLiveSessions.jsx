import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const TeacherLiveSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

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

            const formatted = data.lessons.map((lesson) => ({
                id: lesson._id,
                title: lesson.title,
                course: lesson.course?.title || "N/A",
                courseId: lesson.course?._id,
                date: lesson.date,
                time: lesson.time,
                duration: `${lesson.duration} min`,
                meetLink: lesson.meetLink,
                status: "upcoming",
                students: 0,
                maxStudents: 30,
                startTime: new Date(`${lesson.date}T${lesson.time}`),
            }));

            setSessions(formatted);
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
                ? `${BACKEND_URL}/api/lessons/${editingSession.id}`
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

            toast.success(editingSession ? "Session updated" : "Session created");
            setShowScheduleModal(false);
            setEditingSession(null);
            fetchLessons();
        } catch (err) {
            toast.error(err.message || "Error");
        }
    };

    const openScheduleModal = () => {
        setEditingSession(null);
        setFormData({
            title: "",
            course: "",
            date: "",
            time: "",
            duration: "90",
            meetLink: "",
        });
        setShowScheduleModal(true);
    };

    const openEditModal = (s) => {
        setEditingSession(s);
        setFormData({
            title: s.title,
            course: s.courseId,
            date: s.date,
            time: s.time,
            duration: s.duration.replace(" min", ""),
            meetLink: s.meetLink,
        });
        setShowScheduleModal(true);
    };

    const handleDeleteSession = async (id) => {
        if (!window.confirm("Delete this session?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/lessons/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            toast.success("Session deleted");
            fetchLessons();
        } catch {
            toast.error("Delete failed");
        }
    };

    const copyMeetLink = (link) => {
        navigator.clipboard.writeText(link);
        toast.success("Meet link copied");
    };

    const filteredSessions = sessions.filter((s) => {
        const matchSearch =
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.course.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filterStatus === "all" || s.status === filterStatus;
        return matchSearch && matchFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6">
            <ToastContainer />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <Video /> Live Sessions
                </h1>
                <button
                    onClick={openScheduleModal}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                    <Plus /> Schedule
                </button>
            </div>

            {/* Search */}
            <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full mb-6 px-4 py-3 rounded-xl border-2"
            />

            {/* Sessions */}
            {filteredSessions.length === 0 ? (
                <div className="text-center py-20">
                    <AlertCircle size={64} className="mx-auto text-gray-300" />
                    <p className="mt-4 text-xl font-bold">No sessions found</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredSessions.map((s) => (
                        <div
                            key={s.id}
                            className="bg-white p-6 rounded-2xl shadow-xl"
                        >
                            <h3 className="text-xl font-bold">{s.title}</h3>
                            <p className="text-purple-600 font-semibold">
                                {s.course}
                            </p>

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => copyMeetLink(s.meetLink)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    <Copy size={16} /> Copy
                                </button>
                                <button
                                    onClick={() => openEditModal(s)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    <Edit3 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteSession(s.id)}
                                    className="px-4 py-2 border rounded-lg text-red-600"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Schedule Modal */}
            <AnimatePresence>
                {showScheduleModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                        onClick={() => setShowScheduleModal(false)}
                    >
                        <motion.form
                            onClick={(e) => e.stopPropagation()}
                            onSubmit={handleSubmit}
                            className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    {editingSession ? "Edit Session" : "New Session"}
                                </h2>
                                <X
                                    className="cursor-pointer"
                                    onClick={() => setShowScheduleModal(false)}
                                />
                            </div>

                            <input
                                required
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                className="w-full border px-4 py-3 rounded-lg"
                            />

                            <input
                                required
                                placeholder="Course ID"
                                value={formData.course}
                                onChange={(e) =>
                                    setFormData({ ...formData, course: e.target.value })
                                }
                                className="w-full border px-4 py-3 rounded-lg"
                            />

                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                className="w-full border px-4 py-3 rounded-lg"
                            />

                            <input
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) =>
                                    setFormData({ ...formData, time: e.target.value })
                                }
                                className="w-full border px-4 py-3 rounded-lg"
                            />

                            <select
                                value={formData.duration}
                                onChange={(e) =>
                                    setFormData({ ...formData, duration: e.target.value })
                                }
                                className="w-full border px-4 py-3 rounded-lg"
                            >
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                                <option value="90">90 minutes</option>
                                <option value="120">120 minutes</option>
                            </select>

                            <input
                                required
                                placeholder="Meet Link"
                                value={formData.meetLink}
                                onChange={(e) =>
                                    setFormData({ ...formData, meetLink: e.target.value })
                                }
                                className="w-full border px-4 py-3 rounded-lg"
                            />

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-bold"
                            >
                                {editingSession ? "Update Session" : "Create Session"}
                            </button>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherLiveSessions;
