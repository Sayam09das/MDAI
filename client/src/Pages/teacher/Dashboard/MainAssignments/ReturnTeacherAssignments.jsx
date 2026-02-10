import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    Calendar,
    Clock,
    Users,
    FileText,
    MoreVertical,
    CheckCircle,
    XCircle,
    AlertCircle,
    X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ReturnTeacherAssignments = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        draft: 0,
        totalSubmissions: 0
    });

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/assignments/teacher`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setAssignments(data.assignments);
                calculateStats(data.assignments);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (assignments) => {
        setStats({
            total: assignments.length,
            active: assignments.filter(a => a.status === "active").length,
            draft: assignments.filter(a => a.status === "draft").length,
            totalSubmissions: assignments.reduce((sum, a) => sum + (a.totalSubmissions || 0), 0),
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this assignment? This will also delete all submissions.")) {
            try {
                const res = await fetch(`${BACKEND_URL}/api/assignments/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    fetchAssignments();
                }
            } catch (error) {
                console.error("Error deleting assignment:", error);
            }
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/assignments/${id}/toggle-publish`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                fetchAssignments();
            }
        } catch (error) {
            console.error("Error toggling publish:", error);
        }
    };

    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: "bg-gray-100 text-gray-700",
            active: "bg-green-100 text-green-700",
            closed: "bg-red-100 text-red-700",
            archived: "bg-yellow-100 text-yellow-700",
        };
        return badges[status] || badges.draft;
    };

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
                        Assignments
                    </h1>
                    <p className="text-gray-600">Create and manage your course assignments</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                                <p className="text-sm text-gray-500">Total Assignments</p>
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
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
                                <p className="text-sm text-gray-500">Active</p>
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
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Edit2 className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.draft}</p>
                                <p className="text-sm text-gray-500">Drafts</p>
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
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalSubmissions}</p>
                                <p className="text-sm text-gray-500">Submissions</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg p-4 mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                                <option value="archived">Archived</option>
                            </select>
                            <Link
                                to="/teacher-dashboard/create-assignment"
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Assignments Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredAssignments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-xl shadow-lg"
                    >
                        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No assignments found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm ? "Try adjusting your search" : "Create your first assignment to get started"}
                        </p>
                        {!searchTerm && (
                            <Link
                                to="/teacher-dashboard/create-assignment"
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Assignment
                            </Link>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredAssignments.map((assignment, index) => (
                                <motion.div
                                    key={assignment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                                                    {assignment.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {assignment.course?.title || "No course"}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status)}`}>
                                                {assignment.status}
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
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FileText className="w-4 h-4" />
                                                <span>Max Marks: {assignment.maxMarks}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>Submissions: {assignment.totalSubmissions || 0}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
<Link
                                                to={`/teacher-dashboard/assignments/${assignment._id}/detail`}
                                                className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleTogglePublish(assignment._id)}
                                                className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                                    assignment.isPublished
                                                        ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                                        : "bg-green-50 text-green-600 hover:bg-green-100"
                                                }`}
                                            >
                                                {assignment.isPublished ? (
                                                    <>
                                                        <XCircle className="w-4 h-4" />
                                                        Unpublish
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        Publish
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(assignment._id)}
                                                className="flex items-center justify-center gap-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReturnTeacherAssignments;

