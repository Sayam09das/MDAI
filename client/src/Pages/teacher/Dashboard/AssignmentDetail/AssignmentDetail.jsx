import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Edit2,
    Trash2,
    Eye,
    Calendar,
    Clock,
    Users,
    FileText,
    Download,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    MoreVertical,
    BarChart3,
    Send,
    Filter
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AssignmentDetail = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const token = localStorage.getItem("token");

    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        submitted: 0,
        graded: 0,
        late: 0,
        pending: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
    });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [assignmentId]);

    const fetchData = async () => {
        try {
            setError(null);
            
            // Fetch assignment details
            const assignmentRes = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const assignmentData = await assignmentRes.json();

            if (assignmentData.success) {
                setAssignment(assignmentData.assignment);
            } else {
                setError(assignmentData.message || "Failed to load assignment");
            }

            // Fetch submissions with stats
            const submissionsRes = await fetch(`${BACKEND_URL}/api/submissions/assignment/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const submissionsData = await submissionsRes.json();

            if (submissionsData.success) {
                setSubmissions(submissionsData.submissions || []);
                
                // Calculate additional stats
                const gradedSubmissions = (submissionsData.submissions || []).filter(s => s.status === "graded");
                const scores = gradedSubmissions.map(s => s.marks || 0);
                
                setStats({
                    total: submissionsData.submissions?.length || 0,
                    submitted: submissionsData.stats?.submitted || 0,
                    graded: submissionsData.stats?.graded || 0,
                    late: submissionsData.stats?.late || 0,
                    pending: (submissionsData.stats?.submitted || 0) - (submissionsData.stats?.graded || 0),
                    averageScore: gradedSubmissions.length > 0 
                        ? (gradedSubmissions.reduce((sum, s) => sum + (s.marks || 0), 0) / gradedSubmissions.length).toFixed(1)
                        : 0,
                    highestScore: scores.length > 0 ? Math.max(...scores) : 0,
                    lowestScore: scores.length > 0 ? Math.min(...scores) : 0
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to connect to server. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status, isLate) => {
        if (status === "graded") {
            return (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Graded
                </span>
            );
        }
        if (isLate) {
            return (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Late
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending
            </span>
        );
    };

    const handleTogglePublish = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}/toggle-publish`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
                setShowMenu(false);
            }
        } catch (error) {
            console.error("Error toggling publish:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this assignment? This will also delete all submissions.")) {
            try {
                const res = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    navigate("/teacher-dashboard/assignments");
                }
            } catch (error) {
                console.error("Error deleting assignment:", error);
            }
        }
    };

    const getFileIcon = (file) => {
        if (file.format?.includes("image")) {
            return <FileText className="w-5 h-5 text-purple-500" />;
        }
        return <FileText className="w-5 h-5 text-blue-500" />;
    };

    const filteredSubmissions = submissions.filter(sub => {
        if (statusFilter === "all") return true;
        if (statusFilter === "graded") return sub.status === "graded";
        if (statusFilter === "pending") return sub.status === "submitted" && !sub.isLate;
        if (statusFilter === "late") return sub.isLate;
        if (statusFilter === "not_submitted") return !sub.submittedAt;
        return true;
    });

    const isOverdue = () => {
        if (!assignment) return false;
        return new Date() > new Date(assignment.dueDate);
    };

    const submissionRate = stats.total > 0 
        ? ((stats.submitted / stats.total) * 100).toFixed(1) 
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error && !assignment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Assignment</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate("/teacher-dashboard/assignments")}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Back to Assignments
                        </button>
                        <button
                            onClick={() => fetchData()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Assignment not found</h2>
                    <button
                        onClick={() => navigate("/teacher-dashboard/assignments")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Back to Assignments
                    </button>
                </div>
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
                    <button
                        onClick={() => navigate("/teacher-dashboard/assignments")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Assignments
                    </button>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                    {assignment.title}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    assignment.isPublished 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-gray-100 text-gray-700"
                                }`}>
                                    {assignment.isPublished ? "Published" : "Draft"}
                                </span>
                            </div>
                            <p className="text-gray-600">{assignment.course?.title}</p>
                        </div>

                        {/* Actions Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700 font-medium">Actions</span>
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden"
                                    >
                                        <Link
                                            to={`/teacher-dashboard/assignments/${assignmentId}/edit`}
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Assignment
                                        </Link>
                                        <Link
                                            to={`/teacher-dashboard/assignments/${assignmentId}/analytics`}
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            View Analytics
                                        </Link>
                                        <button
                                            onClick={handleTogglePublish}
                                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700"
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
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-xs text-gray-500">Enrolled</p>
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
                                <p className="text-2xl font-bold text-gray-800">{stats.submitted}</p>
                                <p className="text-xs text-gray-500">Submitted ({submissionRate}%)</p>
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
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                                <p className="text-xs text-gray-500">Pending</p>
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
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.averageScore}</p>
                                <p className="text-xs text-gray-500">Avg Score</p>
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
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.highestScore}</p>
                                <p className="text-xs text-gray-500">Highest</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
                                <p className="text-xs text-gray-500">Late</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Assignment Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Assignment Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                                <p className="text-gray-800">{assignment.description}</p>
                            </div>

                            {assignment.instructions && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Instructions</p>
                                    <p className="text-gray-800 whitespace-pre-wrap">{assignment.instructions}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                                    <p className={`font-medium ${isOverdue() ? "text-red-600" : "text-gray-800"}`}>
                                        {formatDate(assignment.dueDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Maximum Marks</p>
                                    <p className="font-medium text-gray-800">{assignment.maxMarks}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Submission Type</p>
                                    <p className="font-medium text-gray-800 capitalize">{assignment.submissionType}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <p className="font-medium text-gray-800">{assignment.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Attachments */}
                    {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Assignment Materials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {assignment.attachments.map((attachment, index) => (
                                    <a
                                        key={index}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <FileText className="w-8 h-8 text-indigo-600" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate">
                                                {attachment.originalName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <Download className="w-4 h-4 text-gray-400" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Submissions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-xl shadow-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Student Submissions</h2>
                            <p className="text-sm text-gray-500">{filteredSubmissions.length} students</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="graded">Graded</option>
                                    <option value="pending">Pending</option>
                                    <option value="late">Late</option>
                                </select>
                            </div>

                            <Link
                                to={`/teacher-dashboard/assignments/${assignmentId}/submissions`}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                                <Eye className="w-4 h-4" />
                                Grade All
                            </Link>
                        </div>
                    </div>

                    {filteredSubmissions.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No submissions yet</h3>
                            <p className="text-gray-500">No submissions match your filter criteria.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Marks
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredSubmissions.map((submission) => (
                                        <tr key={submission._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        {submission.student?.profileImage ? (
                                                            <img
                                                                src={submission.student.profileImage}
                                                                alt={submission.student.name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <Users className="w-5 h-5 text-indigo-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {submission.student?.name || "Unknown Student"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {submission.student?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    {submission.submittedAt 
                                                        ? formatDate(submission.submittedAt)
                                                        : "-"
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(submission.status, submission.isLate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {submission.marks !== null ? (
                                                    <span className="font-semibold text-green-600">
                                                        {submission.marks} / {assignment.maxMarks}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/teacher-dashboard/assignments/${assignmentId}/submissions`}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Review
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AssignmentDetail;

