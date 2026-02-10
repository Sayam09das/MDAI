import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    BookOpen,
    ArrowRight,
    Shield,
    MonitorPlay
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ReturnStudentAssignments = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setError(null);
            const res = await fetch(`${BACKEND_URL}/api/assignments/student`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch assignments");
            }
            
            if (data.success) {
                setAssignments(data.assignments || []);
                
                // Log helpful message if backend provides enrollment info
                if (data.message) {
                    console.log("Assignment info:", data.message);
                }
            } else {
                throw new Error(data.message || "Failed to fetch assignments");
            }
        } catch (err) {
            console.error("Error fetching assignments:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusInfo = (assignment) => {
        if (assignment.submission) {
            if (assignment.submission.status === "graded") {
                return {
                    status: "graded",
                    label: "Graded",
                    color: "bg-green-100 text-green-700 border-green-200",
                    icon: CheckCircle,
                    actionLabel: "View Feedback",
                };
            }
            return {
                status: "submitted",
                label: "Submitted",
                color: "bg-blue-100 text-blue-700 border-blue-200",
                icon: CheckCircle,
                actionLabel: "View Submission",
            };
        }
        if (assignment.isOverdue) {
            return {
                status: "overdue",
                label: "Overdue",
                color: "bg-red-100 text-red-700 border-red-200",
                icon: AlertCircle,
                actionLabel: "Submit Now",
            };
        }
        return {
            status: "pending",
            label: "Pending",
            color: "bg-yellow-100 text-yellow-700 border-yellow-200",
            icon: Clock,
            actionLabel: "Submit",
        };
    };

    const filteredAssignments = assignments.filter((assignment) => {
        if (filter === "all") return true;
        const status = getStatusInfo(assignment).status;
        return status === filter;
    });

    const stats = {
        total: assignments.length,
        pending: assignments.filter((a) => !a.submission && !a.isOverdue).length,
        submitted: assignments.filter((a) => a.submission && a.submission.status !== "graded").length,
        graded: assignments.filter((a) => a.submission?.status === "graded").length,
        overdue: assignments.filter((a) => a.isOverdue && !a.submission).length,
    };

    const getTimeRemaining = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff < 0) return "Overdue";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
        return "Less than an hour left";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        My Assignments
                    </h1>
                    <p className="text-gray-600">View and submit your course assignments</p>
                </motion.div>

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                        <button 
                            onClick={fetchAssignments}
                            className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </motion.div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-sm text-gray-500">Total</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                                <p className="text-sm text-gray-500">Pending</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <FileText className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.submitted}</p>
                                <p className="text-sm text-gray-500">Submitted</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.graded}</p>
                                <p className="text-sm text-gray-500">Graded</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.overdue}</p>
                                <p className="text-sm text-gray-500">Overdue</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { key: "all", label: "All" },
                        { key: "pending", label: "Pending" },
                        { key: "submitted", label: "Submitted" },
                        { key: "graded", label: "Graded" },
                        { key: "overdue", label: "Overdue" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                filter === tab.key
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Assignments List */}
                {filteredAssignments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-xl shadow-lg"
                    >
                        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No assignments found</h3>
                        <p className="text-gray-500">
                            {filter === "all"
                                ? "You don't have any assignments yet"
                                : `No ${filter} assignments`}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {filteredAssignments.map((assignment, index) => {
                                const statusInfo = getStatusInfo(assignment);
                                const StatusIcon = statusInfo.icon;
                                const isOverdue = assignment.isOverdue;

                                return (
                                    <motion.div
                                        key={assignment._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -5 }}
                                        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow ${
                                            isOverdue && !assignment.submission ? "border-l-4 border-red-500" : ""
                                        }`}
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <BookOpen className="w-4 h-4 text-indigo-600" />
                                                        <span className="text-sm text-indigo-600 font-medium">
                                                            {assignment.course?.title || "Unknown Course"}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-lg text-gray-800">
                                                        {assignment.title}
                                                    </h3>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon className="w-3 h-3 inline mr-1" />
                                                    {statusInfo.label}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {assignment.description}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Due: {formatDate(assignment.dueDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    <span className={isOverdue && !assignment.submission ? "text-red-600 font-medium" : "text-gray-500"}>
                                                        {getTimeRemaining(assignment.dueDate)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <FileText className="w-4 h-4" />
                                                    <span>Max Marks: {assignment.maxMarks}</span>
                                                </div>
                                            </div>

                                            {assignment.submission?.marks !== undefined && (
                                                <div className="bg-green-50 rounded-lg p-3 mb-4">
                                                    <p className="text-sm text-green-700">
                                                        Your Score: <span className="font-bold">{assignment.submission.marks}</span> / {assignment.maxMarks}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Regular Submit Button */}
                                            <Link
                                                to={`/student-dashboard/assignments/${assignment._id}/submit`}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                                                    statusInfo.status === "graded"
                                                        ? "bg-green-600 text-white hover:bg-green-700"
                                                        : isOverdue && !assignment.submission
                                                        ? "bg-red-600 text-white hover:bg-red-700"
                                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                }`}
                                            >
                                                {statusInfo.actionLabel}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>

                                            {/* Exam Button (for exam-type assignments) */}
                                            <button
                                                onClick={() => navigate(`/student-dashboard/exam/${assignment._id}`)}
                                                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                                            >
                                                <Shield className="w-5 h-5" />
                                                Start Secure Exam
                                                <MonitorPlay className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReturnStudentAssignments;

