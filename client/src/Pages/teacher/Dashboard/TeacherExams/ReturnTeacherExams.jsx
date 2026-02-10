import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    BookOpen,
    ArrowRight,
    Shield,
    BarChart3,
    Eye,
    Users,
    RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ReturnTeacherExams = () => {
    const token = localStorage.getItem("token");

    const [assignments, setAssignments] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [examStats, setExamStats] = useState(null);

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
                setAssignments(data.assignments || []);
            }
        } catch (err) {
            console.error("Error fetching assignments:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExamAnalytics = async (assignmentId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/exams/analytics/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setExamStats(data.analytics);
            }
        } catch (err) {
            console.error("Error fetching exam analytics:", err);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'closed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleViewAnalytics = (assignment) => {
        setSelectedAssignment(assignment);
        fetchExamAnalytics(assignment._id);
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
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Exam Management
                        </h1>
                    </div>
                    <p className="text-gray-600">Monitor and manage secure online examinations</p>
                </motion.div>

                {/* Quick Stats */}
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
                                <p className="text-2xl font-bold text-gray-800">
                                    {assignments.filter(a => a.status === 'active').length}
                                </p>
                                <p className="text-sm text-gray-500">Active Exams</p>
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
                                <p className="text-2xl font-bold text-gray-800">
                                    {assignments.reduce((sum, a) => sum + (a.totalSubmissions || 0), 0)}
                                </p>
                                <p className="text-sm text-gray-500">Total Submissions</p>
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
                                <p className="text-2xl font-bold text-gray-800">
                                    {assignments.filter(a => new Date(a.dueDate) > new Date()).length}
                                </p>
                                <p className="text-sm text-gray-500">Upcoming</p>
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
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {assignments.length}
                                </p>
                                <p className="text-sm text-gray-500">Total Exams</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Assignments List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Your Exams
                    </h2>

                    {assignments.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No exams found</h3>
                            <p className="text-gray-500 mb-4">Create your first exam to get started</p>
                            <Link
                                to="/teacher-dashboard/create-assignment"
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                                <FileText className="w-5 h-5" />
                                Create Exam
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {assignments.map((assignment, index) => (
                                <motion.div
                                    key={assignment._id}
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
                                                        {assignment.course?.title || "Unknown Course"}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-800">
                                                    {assignment.title}
                                                </h3>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                                {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1)}
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
                                                <Clock className="w-4 h-4" />
                                                <span>Max Marks: {assignment.maxMarks}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>Submissions: {assignment.totalSubmissions || 0}</span>
                                            </div>
                                        </div>

                                        {/* Exam Analytics Preview */}
                                        {selectedAssignment?._id === assignment._id && examStats && (
                                            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                                                <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4" />
                                                    Exam Analytics
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className="bg-white rounded p-2">
                                                        <p className="text-gray-500">In Progress</p>
                                                        <p className="font-bold text-indigo-600">{examStats.inProgress || 0}</p>
                                                    </div>
                                                    <div className="bg-white rounded p-2">
                                                        <p className="text-gray-500">Submitted</p>
                                                        <p className="font-bold text-green-600">{examStats.submitted || 0}</p>
                                                    </div>
                                                    <div className="bg-white rounded p-2">
                                                        <p className="text-gray-500">Avg Violations</p>
                                                        <p className="font-bold text-yellow-600">{examStats.avgViolations || 0}</p>
                                                    </div>
                                                    <div className="bg-white rounded p-2">
                                                        <p className="text-gray-500">Disqualified</p>
                                                        <p className="font-bold text-red-600">{examStats.disqualified || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewAnalytics(assignment)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                                Analytics
                                            </button>
                                            <Link
                                                to={`/teacher-dashboard/assignments/${assignment._id}/detail`}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
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

