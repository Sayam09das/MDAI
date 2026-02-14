import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    BookOpen,
    BarChart3,
    Eye,
    Users,
    Plus,
    RefreshCw,
    Check,
    X,
    Upload,
    Download
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ReturnTeacherExams = () => {
    const token = localStorage.getItem("token");

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/exams/teacher`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setExams(data.exams || []);
            } else {
                setError(data.message || "Failed to fetch exams");
            }
        } catch (err) {
            console.error("Error fetching exams:", err);
            setError("Failed to fetch exams");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not set";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'closed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleTogglePublish = async (examId, currentStatus) => {
        const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
        const actionText = newStatus === 'published' ? 'publish' : 'unpublish';
        
        if (!window.confirm(`Are you sure you want to ${actionText} this exam?`)) {
            return;
        }

        setActionLoading(examId);
        try {
            const res = await fetch(`${BACKEND_URL}/api/exams/${examId}/publish`, {
                method: 'PATCH',
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();

            if (data.success) {
                fetchExams();
                setError("");
            } else {
                setError(data.message || `Failed to ${actionText} exam`);
            }
        } catch (err) {
            console.error(`Error ${actionText}ing exam:`, err);
            setError(`Failed to ${actionText} exam`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchExams();
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-8 h-8 text-indigo-600" />
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                Exam Management
                            </h1>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh
                        </button>
                    </div>
                    <p className="text-gray-600">Create and manage manual evaluation exams</p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
                    >
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </motion.div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {exams.filter(e => e.status === 'published').length}
                                </p>
                                <p className="text-sm text-gray-500">Published</p>
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
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {exams.filter(e => e.status === 'draft').length}
                                </p>
                                <p className="text-sm text-gray-500">Drafts</p>
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
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {exams.reduce((sum, e) => sum + (e.totalSubmissions || 0), 0)}
                                </p>
                                <p className="text-sm text-gray-500">Total Submissions</p>
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
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {exams.reduce((sum, e) => sum + (e.gradedCount || 0), 0)}
                                </p>
                                <p className="text-sm text-gray-500">Graded</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Create Exam Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <Link
                        to="/teacher-dashboard/create-exam"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Exam
                    </Link>
                </motion.div>

                {/* Exams List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Your Exams
                    </h2>

                    {exams.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No exams found</h3>
                            <p className="text-gray-500 mb-4">Create your first exam to get started</p>
                            <Link
                                to="/teacher-dashboard/create-exam"
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Exam
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {exams.map((exam, index) => (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen className="w-4 h-4 text-indigo-600" />
                                                    <span className="text-sm text-indigo-600 font-medium">
                                                        {exam.course?.title || "Unknown Course"}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-800">
                                                    {exam.title}
                                                </h3>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                                                {exam.status?.charAt(0).toUpperCase() + exam.status?.slice(1)}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {exam.description || "No description"}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FileText className="w-4 h-4" />
                                                <span>Total Marks: {exam.totalMarks || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>Submissions: {exam.totalSubmissions || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Graded: {exam.gradedCount || 0}</span>
                                            </div>
                                            {exam.dueDate && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Due: {formatDate(exam.dueDate)}</span>
                                                </div>
                                            )}
                                            {exam.questionPaper?.filename && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                                    <Download className="w-4 h-4" />
                                                    <span>Question paper attached</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                            {/* Publish/Unpublish Button */}
                                            <button
                                                onClick={() => handleTogglePublish(exam.id, exam.status)}
                                                disabled={actionLoading === exam.id}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    exam.status === 'draft'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                } disabled:opacity-50`}
                                            >
                                                {actionLoading === exam.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                ) : exam.status === 'draft' ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Publish
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="w-4 h-4" />
                                                        Unpublish
                                                    </>
                                                )}
                                            </button>
                                            
                                            {/* Results Button */}
                                            <Link
                                                to={`/teacher-dashboard/exams/${exam.id}/results`}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Submissions
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ReturnTeacherExams;

