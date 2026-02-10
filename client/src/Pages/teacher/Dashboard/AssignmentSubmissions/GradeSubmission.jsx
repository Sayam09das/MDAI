import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Download,
    Eye,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    Image as ImageIcon,
    X,
    Send,
    User,
    Calendar
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const GradeSubmission = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const token = localStorage.getItem("token");

    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        submitted: 0,
        graded: 0,
        late: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingData, setGradingData] = useState({
        marks: "",
        feedback: "",
        latePenalty: 0
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [assignmentId]);

    const fetchData = async () => {
        try {
            // Fetch assignment details
            const assignmentRes = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const assignmentData = await assignmentRes.json();

            if (assignmentData.success) {
                setAssignment(assignmentData.assignment);
            }

            // Fetch submissions
            const submissionsRes = await fetch(`${BACKEND_URL}/api/submissions/assignment/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const submissionsData = await submissionsRes.json();

            if (submissionsData.success) {
                setSubmissions(submissionsData.submissions);
                setStats(submissionsData.stats);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async () => {
        if (!gradingData.marks) {
            alert("Please enter marks");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/submissions/${selectedSubmission._id}/grade`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    marks: gradingData.marks,
                    feedback: gradingData.feedback,
                    latePenalty: gradingData.latePenalty,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Submission graded successfully!");
                setSelectedSubmission(null);
                setGradingData({ marks: "", feedback: "", latePenalty: 0 });
                fetchData();
            } else {
                alert(data.message || "Failed to grade submission");
            }
        } catch (error) {
            console.error("Error grading submission:", error);
            alert("Failed to grade submission");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status, isLate) => {
        if (status === "graded") {
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Graded</span>;
        }
        if (isLate) {
            return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Late</span>;
        }
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
    };

    const getFileIcon = (file) => {
        if (file.format?.includes("image")) {
            return <ImageIcon className="w-5 h-5 text-purple-500" />;
        }
        return <FileText className="w-5 h-5 text-blue-500" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        {assignment.title}
                    </h1>
                    <p className="text-gray-600">Review and grade student submissions</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-sm text-gray-500">Submissions</p>
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
                                <p className="text-2xl font-bold text-gray-800">{stats.graded}</p>
                                <p className="text-sm text-gray-500">Graded</p>
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
                                <p className="text-2xl font-bold text-gray-800">{stats.submitted - stats.graded}</p>
                                <p className="text-sm text-gray-500">Pending</p>
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
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
                                <p className="text-sm text-gray-500">Late</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Submissions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Student Submissions</h2>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="p-8 text-center">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No submissions yet</h3>
                            <p className="text-gray-500">Students haven't submitted any work for this assignment yet.</p>
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
                                    {submissions.map((submission) => (
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
                                                            <User className="w-5 h-5 text-indigo-600" />
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
                                                    {formatDate(submission.submittedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(submission.status, submission.isLate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {submission.marks !== null ? (
                                                    <span className="font-semibold text-green-600">
                                                        {submission.marks} / {submission.maxMarks}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedSubmission(submission)}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Grading Modal */}
                <AnimatePresence>
                    {selectedSubmission && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={() => setSelectedSubmission(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {selectedSubmission.student?.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {selectedSubmission.student?.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedSubmission(null)}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Submission Content */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Submission Details</h3>

                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500 mb-1">Submitted At</p>
                                                <p className="font-medium">{formatDate(selectedSubmission.submittedAt)}</p>
                                                {selectedSubmission.isLate && (
                                                    <p className="text-red-500 text-sm mt-1">Late Submission</p>
                                                )}
                                            </div>

                                            {selectedSubmission.textAnswer && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-500 mb-2">Text Answer</p>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        {selectedSubmission.textAnswer}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">Attachments</p>
                                                    <div className="space-y-2">
                                                        {selectedSubmission.files.map((file, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {getFileIcon(file)}
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-700">
                                                                            {file.originalName}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                >
                                                                    <Download className="w-5 h-5" />
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Grading Form */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Submission</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Marks (Max: {selectedSubmission.maxMarks})
                                                </label>
                                                <input
                                                    type="number"
                                                    value={gradingData.marks}
                                                    onChange={(e) => setGradingData({ ...gradingData, marks: e.target.value })}
                                                    min="0"
                                                    max={selectedSubmission.maxMarks}
                                                    placeholder="Enter marks"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Late Penalty (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={gradingData.latePenalty}
                                                    onChange={(e) => setGradingData({ ...gradingData, latePenalty: e.target.value })}
                                                    min="0"
                                                    max="100"
                                                    placeholder="0"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Feedback
                                                </label>
                                                <textarea
                                                    value={gradingData.feedback}
                                                    onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                                                    placeholder="Write your feedback..."
                                                    rows="5"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                                />
                                            </div>

                                            <button
                                                onClick={handleGrade}
                                                disabled={submitting}
                                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? (
                                                    "Grading..."
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        Submit Grade
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GradeSubmission;

