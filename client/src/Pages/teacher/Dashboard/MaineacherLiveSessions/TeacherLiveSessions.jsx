import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Edit3, Trash2, X, Copy } from "lucide-react";

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

    /* ================= FETCH ================= */
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

    /* ================= CREATE / UPDATE ================= */
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

            toast.success(editingSession ? "Session updated" : "Session created");
            setShowModal(false);
            setEditingSession(null);
            fetchLessons();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
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

    /* ================= MODAL ================= */
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
        toast.success("Meet link copied");
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ToastContainer />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Live Sessions</h1>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={18} /> New Session
                </button>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : sessions.length === 0 ? (
                <p className="text-center text-gray-500">No sessions found</p>
            ) : (
                <div className="grid gap-4">
                    {sessions.map((s) => (
                        <div
                            key={s._id}
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-semibold">{s.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {s.course?.title || "N/A"} • {s.date} • {s.time}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => copyLink(s.meetLink)}>
                                    <Copy size={16} />
                                </button>
                                <button onClick={() => openEdit(s)}>
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(s._id)}
                                    className="text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center"
                    onClick={() => setShowModal(false)}
                >
                    <form
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-lg w-full max-w-md space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold">
                                {editingSession ? "Edit Session" : "New Session"}
                            </h2>
                            <X onClick={() => setShowModal(false)} className="cursor-pointer" />
                        </div>

                        <input
                            required
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border p-2 rounded"
                        />

                        <input
                            required
                            placeholder="Course ID"
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            className="w-full border p-2 rounded"
                        />

                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full border p-2 rounded"
                        />

                        <input
                            type="time"
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full border p-2 rounded"
                        />

                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                            <option value="120">120 min</option>
                        </select>

                        <input
                            required
                            placeholder="Meet link"
                            value={formData.meetLink}
                            onChange={(e) =>
                                setFormData({ ...formData, meetLink: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                        />

                        <button className="w-full bg-indigo-600 text-white py-2 rounded">
                            {editingSession ? "Update" : "Create"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeacherLiveSessions;
