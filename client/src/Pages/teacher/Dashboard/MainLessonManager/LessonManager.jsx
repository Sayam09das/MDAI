import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    BookOpen,
    Plus,
    VideoIcon,
    FileText,
    Calendar,
    Clock,
    ArrowLeft,
    Edit,
    Trash2,
    Save,
    X,
    Upload,
    Eye,
    Youtube,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Copy,
    Download,
    PlayCircle,
    Sparkles,
    TrendingUp,
} from "lucide-react"

const LessonManager = () => {
    const [lessons, setLessons] = useState([
        {
            id: 1,
            title: "Introduction to Web Development",
            duration: "45 min",
            videoLink: "https://youtube.com",
            pdfFile: { name: "intro.pdf", size: "2.5 MB" },
            meetLink: "https://meet.google.com",
            scheduleTime: "2025-01-15T10:00",
            status: "published",
            views: 1245,
            order: 1,
        },
    ])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState(null)

    const [newLesson, setNewLesson] = useState({
        title: "",
        duration: "",
        videoLink: "",
        pdfFile: null,
        meetLink: "",
        scheduleTime: "",
    })

    const pdfRef = useRef(null)

    // ============================
    // HELPERS
    // ============================
    const handleAddLesson = () => {
        if (!newLesson.title.trim()) {
            toast.error("Lesson title required")
            return
        }

        setLessons([
            ...lessons,
            {
                ...newLesson,
                id: Date.now(),
                status: "draft",
                views: 0,
                order: lessons.length + 1,
            },
        ])

        setNewLesson({
            title: "",
            duration: "",
            videoLink: "",
            pdfFile: null,
            meetLink: "",
            scheduleTime: "",
        })

        setShowAddModal(false)
        toast.success("Lesson added")
    }

    const handleDelete = (id) => {
        setLessons(lessons.filter((l) => l.id !== id))
        toast.warning("Lesson deleted")
    }

    const handlePublish = (lesson) => {
        setLessons(
            lessons.map((l) =>
                l.id === lesson.id ? { ...l, status: "published" } : l
            )
        )
        toast.success("Lesson published")
    }

    // ============================
    // UI
    // ============================
    return (
        <div className="min-h-screen bg-indigo-50">
            <ToastContainer />

            {/* HEADER */}
            <div className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ArrowLeft className="cursor-pointer" onClick={() => history.back()} />
                    <h1 className="text-2xl font-bold flex gap-2 items-center">
                        <BookOpen /> Lesson Manager
                    </h1>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
                >
                    <Plus /> Add Lesson
                </button>
            </div>

            {/* LESSON LIST */}
            <div className="max-w-6xl mx-auto p-6 space-y-4">
                {lessons.map((lesson) => (
                    <motion.div
                        key={lesson.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-xl shadow p-6"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{lesson.title}</h3>
                                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                                    <span className="flex gap-1">
                                        <Clock size={14} /> {lesson.duration}
                                    </span>
                                    <span className="flex gap-1">
                                        <Eye size={14} /> {lesson.views}
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${lesson.status === "published"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {lesson.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedLesson(lesson)
                                        setShowPreviewModal(true)
                                    }}
                                    className="px-3 py-2 bg-purple-100 rounded"
                                >
                                    <Eye size={16} />
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedLesson(lesson)
                                        setShowEditModal(true)
                                    }}
                                    className="px-3 py-2 bg-indigo-100 rounded"
                                >
                                    <Edit size={16} />
                                </button>

                                {lesson.status === "draft" && (
                                    <button
                                        onClick={() => handlePublish(lesson)}
                                        className="px-3 py-2 bg-green-100 rounded"
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(lesson.id)}
                                    className="px-3 py-2 bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {lessons.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <AlertCircle size={48} className="mx-auto mb-3" />
                        No lessons yet
                    </div>
                )}
            </div>

            {/* ADD MODAL */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <div
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center"
                        >
                            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                                <h2 className="text-xl font-bold mb-4 flex gap-2">
                                    <Plus /> Add Lesson
                                </h2>

                                <input
                                    placeholder="Lesson title"
                                    className="w-full border p-3 rounded mb-3"
                                    value={newLesson.title}
                                    onChange={(e) =>
                                        setNewLesson({ ...newLesson, title: e.target.value })
                                    }
                                />

                                <input
                                    placeholder="Duration"
                                    className="w-full border p-3 rounded mb-3"
                                    value={newLesson.duration}
                                    onChange={(e) =>
                                        setNewLesson({ ...newLesson, duration: e.target.value })
                                    }
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddLesson}
                                        className="flex-1 bg-indigo-600 text-white py-3 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 bg-gray-200 py-3 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LessonManager
