import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    MoreVertical,
    Trash2,
    Pencil,
    Search,
} from "lucide-react";

/* ===== INITIAL TASKS ===== */
const initialTasks = [
    { id: 1, title: "Grade Student Essays", date: "Jan 16, 2026", completed: false },
    { id: 2, title: "Update Student Marksheet", date: "Jan 24, 2026", completed: false },
    { id: 3, title: "Attend Parents Meeting", date: "Jan 31, 2026", completed: true },
    { id: 4, title: "Prepare Weekly Lesson Plan", date: "Feb 02, 2026", completed: false },
    { id: 5, title: "Upload Assignment Solutions", date: "Feb 05, 2026", completed: false },
];

const TeacherTasks = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    /* TOGGLE COMPLETE */
    const toggleComplete = (id) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    /* DELETE */
    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setMenuOpen(null);
    };

    /* START EDIT */
    const startEdit = (task) => {
        setEditingId(task.id);
        setEditText(task.title);
        setMenuOpen(null);
    };

    /* SAVE EDIT */
    const saveEdit = (id) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, title: editText } : t
            )
        );
        setEditingId(null);
    };

    /* FILTER */
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm w-full"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Tasks
                </h3>

                <select className="text-sm bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                    <option>Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>

            {/* SEARCH */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Task"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 outline-none"
                />
            </div>

            {/* TASK LIST */}
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scroll">
                <AnimatePresence>
                    {filteredTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-start justify-between gap-3"
                        >
                            {/* LEFT */}
                            <div className="flex items-start gap-3 flex-1">
                                {/* CHECK */}
                                <button
                                    onClick={() => toggleComplete(task.id)}
                                    className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center mt-1"
                                >
                                    <AnimatePresence>
                                        {task.completed && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4 text-white" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>

                                {/* TEXT */}
                                <div className="flex-1">
                                    {editingId === task.id ? (
                                        <input
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onBlur={() => saveEdit(task.id)}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" && saveEdit(task.id)
                                            }
                                            autoFocus
                                            className="w-full text-sm border rounded-md px-2 py-1"
                                        />
                                    ) : (
                                        <>
                                            <p
                                                className={`text-sm font-medium ${task.completed
                                                        ? "line-through text-gray-400"
                                                        : "text-gray-900"
                                                    }`}
                                            >
                                                {task.title}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {task.date}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* MENU */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setMenuOpen(
                                            menuOpen === task.id ? null : task.id
                                        )
                                    }
                                    className="p-1 rounded-md hover:bg-gray-100"
                                >
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>

                                {menuOpen === task.id && (
                                    <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-md z-10">
                                        <button
                                            onClick={() => startEdit(task)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 w-full"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* SCROLLBAR */}
            <style>{`
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 6px;
                }
            `}</style>
        </motion.div>
    );
};

export default TeacherTasks;