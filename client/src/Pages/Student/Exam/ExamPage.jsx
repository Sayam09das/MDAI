import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Calendar,
    Upload,
    Download,
    BookOpen,
    Users,
    AlertTriangle,
    Eye,
    Send,
    File,
    X,
    RefreshCw
} from 'lucide-react';
import { getStudentExams, getMySubmission, submitExam, downloadQuestionPaper } from '../../../lib/api/examApi';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // State
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Current exam state
    const [currentExam, setCurrentExam] = useState(null);
    const [mySubmission, setMySubmission] = useState(null);
    
    // File upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Load exams
    useEffect(() => {
        fetchData();
    }, [examId]);

    const fetchData = async () => {
        try {
            setError(null);
            
            // If we have an examId, get that specific exam
            if (examId) {
                // Fetch available exams to get this specific one
                const examsRes = await getStudentExams();
                if (examsRes.success) {
                    const exam = examsRes.exams.find(e => e.id === examId || e._id === examId);
                    if (exam) {
                        setCurrentExam(exam);
                        // Fetch my submission
                        const submissionRes = await getMySubmission(examId);
                        if (submissionRes.success && submissionRes.submission) {
                            setMySubmission(submissionRes.submission);
                        }
                    } else {
                        setError('Exam not found or not available');
                    }
                }
            } else {
                // Fetch available exams
                const examsRes = await getStudentExams();
                if (examsRes.success) {
                    setExams(examsRes.exams);
                }
            }
        } catch (err) {
            setError('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = currentExam?.allowedAnswerFileTypes || ['application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setError('Invalid file type. Allowed: PDF, DOC, DOCX');
                return;
            }
            
            // Validate file size
            const maxSize = (currentExam?.maxAnswerFileSize || 10) * 1024 * 1024;
            if (file.size > maxSize) {
                setError(`File size must be less than ${currentExam?.maxAnswerFileSize || 10}MB`);
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    };

    // Remove selected file
    const removeSelectedFile = () => {
        setSelectedFile(null);
    };

    // Handle exam submission
    const handleSubmitExam = async () => {
        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        setSubmitting(true);
        setError(null);
        
        try {
            const response = await submitExam(examId, selectedFile);
            
            if (response.success) {
                setSuccess('Exam submitted successfully!');
                setSelectedFile(null);
                // Refresh submission data
                const submissionRes = await getMySubmission(examId);
                if (submissionRes.success && submissionRes.submission) {
                    setMySubmission(submissionRes.submission);
                }
            } else {
                setError(response.message || 'Failed to submit exam');
            }
        } catch (err) {
            setError(err.message || 'Failed to submit exam');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle downloading question paper
    const handleDownloadQuestionPaper = async () => {
        try {
            const blob = await downloadQuestionPaper(examId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'question_paper.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Failed to download question paper:', err);
            alert('Failed to download question paper');
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Check if exam is past due
    const isPastDue = (dueDate) => {
        if (!dueDate) return false;
        return new Date() > new Date(dueDate);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading exams...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !currentExam) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // If viewing a specific exam
    if (currentExam) {
        const exam = currentExam;
        const pastDue = isPastDue(exam.dueDate);
        const canSubmit = !mySubmission && (!pastDue || exam.allowLateSubmission);

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/student-dashboard/exams')}
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Back to Exams
                        </button>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                            <button onClick={() => setError(null)} className="ml-auto">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            {success}
                        </div>
                    )}

                    {/* Exam Details */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
                                <p className="text-gray-600 mt-1">{exam.course?.title}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Available
                            </span>
                        </div>

                        {exam.description && (
                            <p className="text-gray-600 mb-4">{exam.description}</p>
                        )}

                        {/* Exam Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-gray-800">{exam.totalMarks}</p>
                                <p className="text-xs text-gray-500">Total Marks</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-gray-800">{exam.passingMarks}%</p>
                                <p className="text-xs text-gray-500">Pass Marks</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-gray-800">
                                    {exam.dueDate ? formatDate(exam.dueDate) : 'No deadline'}
                                </p>
                                <p className="text-xs text-gray-500">Due Date</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-gray-800">{exam.instructor?.name || 'N/A'}</p>
                                <p className="text-xs text-gray-500">Instructor</p>
                            </div>
                        </div>

                        {/* Instructions */}
                        {exam.instructions && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                                <p className="text-blue-700 whitespace-pre-wrap">{exam.instructions}</p>
                            </div>
                        )}

                        {/* Question Paper */}
                        {exam.hasQuestionPaper && (
                            <div className="mb-4">
                                <button
                                    onClick={handleDownloadQuestionPaper}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Question Paper
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submission Section */}
                    {mySubmission ? (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Exam Submitted</h2>
                                <p className="text-gray-600 mb-4">
                                    Submitted on {formatDate(mySubmission.submittedAt)}
                                    {mySubmission.isLate && <span className="text-orange-600"> (Late Submission)</span>}
                                </p>

                                {/* Show file info */}
                                {mySubmission.answerFile && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4 inline-block">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-gray-600" />
                                            <span className="text-gray-700">{mySubmission.answerFile.originalName}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Show grades if published */}
                                {mySubmission.resultPublished && mySubmission.gradingStatus === 'published' && (
                                    <div className="mt-6 p-6 bg-green-50 rounded-xl">
                                        <h3 className="text-xl font-bold text-green-800 mb-4">Your Result</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-green-600">
                                                    {mySubmission.obtainedMarks}/{mySubmission.totalMarks}
                                                </p>
                                                <p className="text-sm text-gray-600">Marks</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-green-600">
                                                    {mySubmission.percentage?.toFixed(1)}%
                                                </p>
                                                <p className="text-sm text-gray-600">Score</p>
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-3xl font-bold ${mySubmission.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                    {mySubmission.passed ? 'PASSED' : 'FAILED'}
                                                </p>
                                                <p className="text-sm text-gray-600">Status</p>
                                            </div>
                                        </div>
                                        {mySubmission.feedback && (
                                            <div className="mt-4 pt-4 border-t border-green-200">
                                                <p className="text-sm text-gray-600">Feedback:</p>
                                                <p className="text-gray-800">{mySubmission.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pending grading */}
                                {mySubmission.gradingStatus === 'pending' && (
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                                        <p className="text-yellow-700">
                                            ⏳ Your exam is being reviewed. Results will be published soon.
                                        </p>
                                    </div>
                                )}

                                {/* Graded but not published */}
                                {mySubmission.gradingStatus === 'graded' && !mySubmission.resultPublished && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <p className="text-blue-700">
                                            ✓ Your exam has been graded. The result will be published soon.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Your Answer</h2>
                            
                            {canSubmit ? (
                                <>
                                    <p className="text-gray-600 mb-4">
                                        Upload your answer file (PDF, DOC, or DOCX)
                                    </p>

                                    {/* File Upload */}
                                    {!selectedFile ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                                            <input
                                                type="file"
                                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="answer-file-upload"
                                            />
                                            <label
                                                htmlFor="answer-file-upload"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <Upload className="w-12 h-12 text-indigo-400 mb-3" />
                                                <p className="text-lg font-medium text-gray-700 mb-1">
                                                    Click to upload your answer
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    PDF, DOC, or DOCX up to {exam.maxAnswerFileSize || 10}MB
                                                </p>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-8 h-8 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{selectedFile.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={removeSelectedFile}
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmitExam}
                                        disabled={!selectedFile || submitting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Submit Exam
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <XCircle className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {pastDue ? 'Submission Deadline Passed' : 'Cannot Submit'}
                                    </h3>
                                    <p className="text-gray-600">
                                        {pastDue 
                                            ? 'The deadline for this exam has passed. Late submissions are not allowed.'
                                            : 'This exam is not available for submission.'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Exam list view
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Exams</h1>
                    <p className="text-gray-600">View and submit your exam answer sheets</p>
                </div>

                {/* Available Exams */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        Available Exams
                    </h2>
                    
                    {exams.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No exams available for your enrolled courses.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {exams.map((exam) => {
                                const pastDue = isPastDue(exam.dueDate);
                                const canSubmit = !exam.hasSubmitted && (!pastDue || exam.allowLateSubmission);
                                
                                return (
                                    <div key={exam.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{exam.title}</h3>
                                                <p className="text-sm text-gray-500">{exam.course?.title}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                exam.hasSubmitted ? 'bg-green-100 text-green-700' :
                                                pastDue && !exam.allowLateSubmission ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {exam.hasSubmitted ? 'Submitted' : 
                                                 pastDue ? 'Expired' : 'Available'}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                                        
                                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                            <div className="bg-gray-50 rounded p-2">
                                                <p className="text-sm font-bold text-gray-800">{exam.totalMarks}</p>
                                                <p className="text-xs text-gray-500">Marks</p>
                                            </div>
                                            <div className="bg-gray-50 rounded p-2">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {exam.dueDate ? formatDate(exam.dueDate).split(',')[0] : 'No deadline'}
                                                </p>
                                                <p className="text-xs text-gray-500">Due</p>
                                            </div>
                                            <div className="bg-gray-50 rounded p-2">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {exam.hasQuestionPaper ? 'Yes' : 'No'}
                                                </p>
                                                <p className="text-xs text-gray-500">Questions</p>
                                            </div>
                                        </div>
                                        
                                        {/* Status for submitted exams */}
                                        {exam.hasSubmitted && (
                                            <div className={`mb-4 p-3 rounded-lg ${
                                                exam.gradingStatus === 'published' ? 'bg-green-50' :
                                                exam.gradingStatus === 'graded' ? 'bg-blue-50' :
                                                'bg-yellow-50'
                                            }`}>
                                                {exam.gradingStatus === 'published' ? (
                                                    <div>
                                                        <p className="text-sm font-medium text-green-700">
                                                            ✓ Graded: {exam.obtainedMarks}/{exam.totalMarks} ({exam.percentage?.toFixed(1)}%)
                                                        </p>
                                                        <p className="text-xs text-green-600">
                                                            {exam.passed ? 'Passed' : 'Failed'}
                                                        </p>
                                                    </div>
                                                ) : exam.gradingStatus === 'graded' ? (
                                                    <p className="text-sm text-blue-700">
                                                        ✓ Graded - Results will be published soon
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-yellow-700">
                                                        ⏳ Submitted - Awaiting grading
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        
                                        <button
                                            onClick={() => navigate(`/student-dashboard/exams/${exam.id}`)}
                                            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                                                canSubmit
                                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    : exam.hasSubmitted
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            disabled={!canSubmit && !exam.hasSubmitted}
                                        >
                                            {exam.hasSubmitted ? (
                                                <>
                                                    <Eye className="w-5 h-5" />
                                                    View Submission
                                                </>
                                            ) : canSubmit ? (
                                                <>
                                                    <Upload className="w-5 h-5" />
                                                    Submit Answer
                                                </>
                                            ) : pastDue ? (
                                                <>
                                                    <XCircle className="w-5 h-5" />
                                                    Expired
                                                </>
                                            ) : (
                                                'Not Available'
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamPage;

