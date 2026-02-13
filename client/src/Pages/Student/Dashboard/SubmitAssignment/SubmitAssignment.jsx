import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    X,
    FileText,
    Image as ImageIcon,
    File,
    Clock,
    Calendar,
    CheckCircle,
    AlertCircle,
    Send,
    Download
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SubmitAssignment = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const token = localStorage.getItem("token");

    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [textAnswer, setTextAnswer] = useState("");
    const [files, setFiles] = useState([]);

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
                // Handle enrollment/auth errors
                if (assignmentData.message === "You are not enrolled in this course") {
                    setError("You are not enrolled in this course. Please enroll to access this assignment.");
                } else if (assignmentData.message === "Assignment is not published") {
                    setError("This assignment is not yet published by the teacher.");
                } else if (assignmentData.message === "Unauthorized - Not your assignment") {
                    setError("You are not authorized to view this assignment.");
                } else if (assignmentRes.status === 404) {
                    setError("Assignment not found.");
                } else {
                    setError(assignmentData.message || "Failed to load assignment");
                }
                // Don't return here, still try to fetch submissions
            }

            // Fetch existing submission if any
            const submissionsRes = await fetch(`${BACKEND_URL}/api/submissions/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const submissionsData = await submissionsRes.json();

            if (submissionsData.success) {
                const mySubmission = submissionsData.submissions.find(
                    (s) => s.assignment && s.assignment._id === assignmentId
                );
                if (mySubmission) {
                    setSubmission(mySubmission);
                    setTextAnswer(mySubmission.textAnswer || "");
                }
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load assignment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validate based on submission type
        if (
            assignment.submissionType === "file" ||
            assignment.submissionType === "both"
        ) {
            if (files.length === 0) {
                alert("Please attach at least one file");
                return;
            }
        }

        if (
            assignment.submissionType === "text" ||
            assignment.submissionType === "both"
        ) {
            if (!textAnswer.trim()) {
                alert("Please provide a text answer");
                return;
            }
        }

        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("textAnswer", textAnswer);
            formDataToSend.append("submissionType", assignment.submissionType);

            files.forEach((file) => {
                formDataToSend.append("files", file);
            });

            const res = await fetch(`${BACKEND_URL}/api/submissions/${assignmentId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await res.json();

            if (data.success) {
                alert("Assignment submitted successfully!");
                navigate("/student-dashboard/assignments");
            } else {
                alert(data.message || "Failed to submit assignment");
            }
        } catch (error) {
            console.error("Error submitting assignment:", error);
            alert("Failed to submit assignment");
        } finally {
            setSubmitting(false);
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

    const getFileIcon = (file) => {
        const type = file.type?.split("/")[0];
        if (type === "image") return <ImageIcon className="w-5 h-5 text-purple-500" />;
        return <FileText className="w-5 h-5 text-blue-500" />;
    };

    const isOverdue = () => {
        if (!assignment) return false;
        return new Date() > new Date(assignment.dueDate);
    };

    const handleDownload = async (attachmentIndex, filename) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${BACKEND_URL}/api/assignments/${assignmentId}/download?attachmentIndex=${attachmentIndex}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download file");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Show error message if there's an error
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Cannot Access Assignment</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/student-dashboard/assignments")}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Back to Assignments
                    </button>
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
                        onClick={() => navigate("/student-dashboard/assignments")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Back to Assignments
                    </button>
                </div>
            </div>
        );
    }

    const submissionStatus = submission?.status;
    const canSubmit = !isOverdue() && submissionStatus !== "graded";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
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

                        {submissionStatus === "graded" ? (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Graded</span>
                            </div>
                        ) : isOverdue() ? (
                            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Overdue</span>
                            </div>
                        ) : null}
                    </div>
                </motion.div>

                {/* Assignment Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                                <p className="text-gray-800">{assignment.description}</p>
                            </div>

                            {assignment.instructions && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Instructions</h3>
                                    <p className="text-gray-800 whitespace-pre-wrap">{assignment.instructions}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                                    <p className={`font-medium ${isOverdue() && !submission ? "text-red-600" : "text-gray-800"}`}>
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

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Submission Type</p>
                                    <p className="font-medium text-gray-800 capitalize">{assignment.submissionType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Attachments */}
                    {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Assignment Materials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {assignment.attachments.map((attachment, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDownload(index, attachment.originalName)}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left w-full"
                                    >
                                        {getFileIcon(attachment)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate">
                                                {attachment.originalName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {attachment.size ? (attachment.size / 1024 / 1024).toFixed(2) : "0"} MB
                                            </p>
                                        </div>
                                        <Download className="w-4 h-4 text-gray-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Graded Result */}
                    {submissionStatus === "graded" && submission && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="bg-green-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-green-800 mb-4">Your Grade</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-green-700 mb-1">Marks Obtained</p>
                                        <p className="text-3xl font-bold text-green-700">
                                            {submission.marks} / {submission.maxMarks}
                                        </p>
                                    </div>
                                    {submission.feedback && (
                                        <div>
                                            <p className="text-sm text-green-700 mb-1">Feedback</p>
                                            <p className="text-gray-700 whitespace-pre-wrap">{submission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Submission Form */}
                {canSubmit && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {submission ? "Resubmit Assignment" : "Submit Assignment"}
                        </h2>

                        <div className="space-y-6">
                            {/* File Upload */}
                            {(assignment.submissionType === "file" || assignment.submissionType === "both") && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Files {assignment.submissionType === "both" && "(Required)"}
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept={assignment.allowedFileTypes?.join(",") || ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"}
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600">
                                                Click to upload files
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {assignment.allowedFileTypes?.join(", ") || "PDF, DOC, DOCX, TXT, JPG, PNG"}
                                                {" "}(Max {assignment.maxFileSize}MB)
                                            </p>
                                        </label>
                                    </div>

                                    {/* Selected Files */}
                                    {files.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {files.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {getFileIcon(file)}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                {file.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Text Answer */}
                            {(assignment.submissionType === "text" || assignment.submissionType === "both") && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Answer {assignment.submissionType === "both" && "(Required)"}
                                    </label>
                                    <textarea
                                        value={textAnswer}
                                        onChange={(e) => setTextAnswer(e.target.value)}
                                        placeholder="Write your answer here..."
                                        rows="8"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => navigate("/student-dashboard/assignments")}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            {submission ? "Resubmit" : "Submit"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Already Submitted - View Only */}
                {submissionStatus === "submitted" && !canSubmit && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-6">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                            <div>
                                <p className="font-medium text-blue-800">Assignment Submitted</p>
                                <p className="text-sm text-blue-600">
                                    Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {submission.files && submission.files.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Your Submissions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {submission.files.map((file, index) => (
                                        <a
                                            key={index}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            {getFileIcon(file)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate">
                                                    {file.originalName}
                                                </p>
                                            </div>
                                            <Download className="w-4 h-4 text-gray-400" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {submission.textAnswer && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Your Answer</h3>
                                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700">
                                    {submission.textAnswer}
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-500">
                            Waiting for your teacher to grade this assignment.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SubmitAssignment;

