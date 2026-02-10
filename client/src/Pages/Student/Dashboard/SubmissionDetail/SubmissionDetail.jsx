import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileText,
    Download,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    Calendar,
    MessageSquare,
    History
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SubmissionDetail = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const token = localStorage.getItem("token");

    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

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

            // Fetch student's submission
            const submissionsRes = await fetch(`${BACKEND_URL}/api/submissions/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const submissionsData = await submissionsRes.json();

            if (submissionsData.success) {
                const mySubmission = submissionsData.submissions.find(
                    (s) => s.assignment._id === assignmentId
                );
                if (mySubmission) {
                    setSubmission(mySubmission);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getFileIcon = (file) => {
        if (file.format?.includes("image")) {
            return <FileText className="w-5 h-5 text-purple-500" />;
        }
        return <FileText className="w-5 h-5 text-blue-500" />;
    };

    const getStatusBadge = (status, isLate) => {
        if (status === "graded") {
            return (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Graded
                </span>
            );
        }
        if (isLate) {
            return (
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Late Submission
                </span>
            );
        }
        return (
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /> Submitted
            </span>
        );
    };

    const isOverdue = () => {
        if (!assignment) return false;
        return new Date() > new Date(assignment.dueDate);
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
                        onClick={() => navigate("/student-dashboard/assignments")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Back to Assignments
                    </button>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Submission Found</h2>
                    <p className="text-gray-600 mb-4">You haven't submitted this assignment yet.</p>
                    <Link
                        to={`/student-dashboard/assignments/${assignmentId}/submit`}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Submit Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/student-dashboard/assignments")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Assignments
                    </button>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                {assignment.title}
                            </h1>
                            <p className="text-gray-600">{assignment.course?.title}</p>
                        </div>
                        {getStatusBadge(submission.status, submission.isLate)}
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Submission Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Graded Result */}
                        {submission.status === "graded" && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6" /> Your Grade
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <p className="text-sm text-green-600 mb-1">Marks Obtained</p>
                                        <p className="text-4xl font-bold text-green-700">
                                            {submission.marks}
                                        </p>
                                        <p className="text-sm text-gray-500">out of {submission.maxMarks}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <p className="text-sm text-green-600 mb-1">Percentage</p>
                                        <p className="text-4xl font-bold text-green-700">
                                            {((submission.marks / submission.maxMarks) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <p className="text-sm text-green-600 mb-1">Grade</p>
                                        <p className="text-4xl font-bold text-green-700">
                                            {((submission.marks / submission.maxMarks) * 100) >= 90 ? 'A' :
                                             ((submission.marks / submission.maxMarks) * 100) >= 80 ? 'B' :
                                             ((submission.marks / submission.maxMarks) * 100) >= 70 ? 'C' :
                                             ((submission.marks / submission.maxMarks) * 100) >= 60 ? 'D' : 'F'}
                                        </p>
                                    </div>
                                </div>

                                {submission.feedback && (
                                    <div className="mt-6 bg-white rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" /> Teacher Feedback
                                        </h3>
                                        <p className="text-gray-700 whitespace-pre-wrap">{submission.feedback}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Assignment Details */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Assignment Details</h2>
                            
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

                                {/* Assignment Materials */}
                                {assignment.attachments && assignment.attachments.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Assignment Materials</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {assignment.attachments.map((attachment, index) => (
                                                <a
                                                    key={index}
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    {getFileIcon(attachment)}
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
                            </div>
                        </div>

                        {/* Your Submission */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Submission</h2>

                            {submission.textAnswer && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Your Answer</p>
                                    <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700">
                                        {submission.textAnswer}
                                    </div>
                                </div>
                            )}

                            {submission.files && submission.files.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Your Files</p>
                                    <div className="space-y-2">
                                        {submission.files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {getFileIcon(file)}
                                                    <div>
                                                        <p className="font-medium text-gray-700">
                                                            {file.originalName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Previous Submissions */}
                            {submission.previousSubmissions && submission.previousSubmissions.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <History className="w-5 h-5" /> Submission History
                                    </h3>
                                    <div className="space-y-3">
                                        {submission.previousSubmissions.map((prev, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                                            >
                                                <p className="text-sm font-medium text-yellow-700 mb-2">
                                                    Submission #{submission.submissionNumber - 1 - index}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Submitted: {formatDate(prev.submittedAt)}
                                                </p>
                                                {prev.files && prev.files.length > 0 && (
                                                    <p className="text-sm text-gray-600">
                                                        Files: {prev.files.map(f => f.originalName).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column - Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Submission Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Submission Info</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Submitted On</p>
                                        <p className="font-medium text-gray-800">
                                            {formatDate(submission.submittedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Due Date</p>
                                        <p className={`font-medium ${isOverdue() && !submission.submittedAt ? "text-red-600" : "text-gray-800"}`}>
                                            {formatDate(assignment.dueDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Submission Type</p>
                                        <p className="font-medium text-gray-800 capitalize">
                                            {submission.submissionType}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <p className="font-medium text-gray-800 capitalize">
                                            {submission.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teacher Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Instructor</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    {assignment.instructor?.profileImage ? (
                                        <img
                                            src={assignment.instructor.profileImage}
                                            alt={assignment.instructor.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-indigo-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {assignment.instructor?.name || "Unknown Instructor"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {assignment.instructor?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Actions</h2>
                            <div className="space-y-3">
                                {submission.status !== "graded" && !isOverdue() && (
                                    <Link
                                        to={`/student-dashboard/assignments/${assignmentId}/submit`}
                                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Resubmit
                                    </Link>
                                )}
                                <Link
                                    to="/student-dashboard/assignments"
                                    className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    View All Assignments
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetail;

