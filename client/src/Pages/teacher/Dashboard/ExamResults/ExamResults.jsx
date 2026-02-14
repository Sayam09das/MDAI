import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Search,
    User,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    BarChart3,
    FileText,
    Calendar,
    Users,
    TrendingUp,
    File,
    Upload,
    Save,
    X,
    Send,
    CheckSquare,
    Upload as UploadIcon
} from 'lucide-react';
import { getExamSubmissions, getExam, getExamStats, getSubmissionDetails, gradeSubmission, downloadAnswerFile, publishResult, publishAllResults, downloadQuestionPaper } from '../../../../lib/api/examApi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExamResults = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [exam, setExam] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [gradingMarks, setGradingMarks] = useState('');
    const [gradingFeedback, setGradingFeedback] = useState('');
    const [savingGrade, setSavingGrade] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [publishingAll, setPublishingAll] = useState(false);

    useEffect(() => {
        fetchExamData();
    }, [examId]);

    const fetchExamData = async () => {
        try {
            setLoading(true);
            
            // Fetch exam details
            const examRes = await getExam(examId);
            if (examRes.success) {
                setExam(examRes.exam);
            }
            
            // Fetch exam submissions
            const submissionsRes = await getExamSubmissions(examId);
            if (submissionsRes.success) {
                setSubmissions(submissionsRes.submissions);
                setStats(submissionsRes.stats);
            }
        } catch (err) {
            setError('Failed to load exam submissions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    // Handle viewing submission details
    const handleViewDetails = async (submission) => {
        setSelectedSubmission(submission);
        setLoadingDetails(true);
        setSubmissionDetails(null);
        setGradingMarks(submission.obtainedMarks?.toString() || '');
        setGradingFeedback(submission.feedback || '');
        try {
            const detailsRes = await getSubmissionDetails(submission.id);
            if (detailsRes.success) {
                setSubmissionDetails(detailsRes);
            }
        } catch (err) {
            console.error('Failed to load submission details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Handle downloading student's answer file
    const handleDownloadFile = async (submissionId, fileName) => {
        try {
            const blob = await downloadAnswerFile(submissionId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'answer_file.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Failed to download file:', err);
            alert('Failed to download file');
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
            alert('No question paper available');
        }
    };

    // Handle grading submission
    const handleSaveGrade = async () => {
        if (!selectedSubmission) return;
        
        const marks = parseFloat(gradingMarks);
        if (isNaN(marks) || marks < 0 || marks > exam?.totalMarks) {
            alert(`Marks must be between 0 and ${exam?.totalMarks}`);
            return;
        }

        setSavingGrade(true);
        try {
            const res = await gradeSubmission(
                selectedSubmission.id,
                marks,
                gradingFeedback
            );
            
            if (res.success) {
                // Refresh data
                await fetchExamData();
                
                // Update selected submission
                setSelectedSubmission(prev => ({
                    ...prev,
                    obtainedMarks: res.grade.obtainedMarks,
                    percentage: res.grade.percentage,
                    passed: res.grade.passed,
                    gradingStatus: res.grade.gradingStatus
                }));
                
                // Refresh details
                const detailsRes = await getSubmissionDetails(selectedSubmission.id);
                if (detailsRes.success) {
                    setSubmissionDetails(detailsRes);
                }
                
                alert('Grade saved successfully!');
            }
        } catch (err) {
            console.error('Failed to save grade:', err);
            alert('Failed to save grade');
        } finally {
            setSavingGrade(false);
        }
    };

    // Handle publishing single result
    const handlePublishResult = async (submissionId) => {
        if (!confirm('Are you sure you want to publish this result? Students will be able to see their marks.')) {
            return;
        }

        try {
            const res = await publishResult(submissionId);
            if (res.success) {
                alert('Result published successfully!');
                await fetchExamData();
            }
        } catch (err) {
            console.error('Failed to publish result:', err);
            alert('Failed to publish result');
        }
    };

    // Handle publishing all results
    const handlePublishAllResults = async () => {
        if (!confirm('Are you sure you want to publish all graded results? Students will be able to see their marks.')) {
            return;
        }

        setPublishingAll(true);
        try {
            const res = await publishAllResults(examId);
            if (res.success) {
                alert(`${res.publishedCount} results published successfully!`);
                await fetchExamData();
            }
        } catch (err) {
            console.error('Failed to publish results:', err);
            alert('Failed to publish results');
        } finally {
            setPublishingAll(false);
        }
    };

    // Get grading status color
    const getGradingStatusColor = (status) => {
        switch (status) {
            case 'graded': return 'bg-green-100 text-green-700';
            case 'published': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Get grading status text
    const getGradingStatusText = (status) => {
        switch (status) {
            case 'graded': return 'Graded';
            case 'published': return 'Published';
            case 'pending': return 'Pending';
            default: return 'Unknown';
        }
    };

    const getStatusColor = (submission) => {
        if (submission.isLate) return 'bg-orange-100 text-orange-700';
        return 'bg-green-100 text-green-700';
    };

    // Filter submissions
    const filteredSubmissions = submissions.filter(submission => {
        const matchesFilter = filter === 'all' || 
            (filter === 'graded' && submission.gradingStatus === 'graded') ||
            (filter === 'pending' && submission.gradingStatus === 'pending') ||
            (filter === 'published' && submission.gradingStatus === 'published');
        
        const matchesSearch = submission.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.student?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    }) || [];

    // Calculate stats
    const gradedCount = filteredSubmissions.filter(s => s.gradingStatus === 'graded' || s.gradingStatus === 'published').length;
    const pendingCount = filteredSubmissions.filter(s => s.gradingStatus === 'pending').length;
    const avgScore = filteredSubmissions.length > 0 
        ? filteredSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / filteredSubmissions.filter(s => s.percentage).length 
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Results</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/teacher-dashboard/exams')}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/teacher-dashboard/exams')}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Exams
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-indigo-600" />
                                Exam Submissions
                            </h1>
                            <p className="text-gray-600 mt-1">{exam?.title || 'Exam Submissions'}</p>
                        </div>
                        
                        <div className="flex gap-3">
                            {exam?.hasQuestionPaper && (
                                <button
                                    onClick={handleDownloadQuestionPaper}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Download className="w-5 h-5" />
                                    Question Paper
                                </button>
                            )}
                            <button
                                onClick={handlePublishAllResults}
                                disabled={publishingAll || gradedCount === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {publishingAll ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                Publish All Results
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats?.totalSubmissions || 0}</p>
                                <p className="text-sm text-gray-500">Total Submissions</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
                                <p className="text-sm text-gray-500">Pending</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{gradedCount}</p>
                                <p className="text-sm text-gray-500">Graded</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{avgScore.toFixed(1)}%</p>
                                <p className="text-sm text-gray-500">Avg Score</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats?.late || 0}</p>
                                <p className="text-sm text-gray-500">Late</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by student name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Submissions</option>
                                <option value="pending">Pending</option>
                                <option value="graded">Graded</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grading
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSubmissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {submission.student?.profileImage?.url ? (
                                                    <img
                                                        src={submission.student.profileImage.url}
                                                        alt={submission.student.fullName || 'Student'}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {submission.student?.fullName || 'Unknown Student'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {submission.student?.email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission)}`}>
                                                {submission.isLate ? 'Late' : 'On Time'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getGradingStatusColor(submission.gradingStatus)}`}>
                                                {getGradingStatusText(submission.gradingStatus)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {submission.gradingStatus !== 'pending' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${submission.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                        {submission.obtainedMarks}/{submission.totalMarks}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        ({submission.percentage?.toFixed(1)}%)
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(submission.submittedAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(submission)}
                                                    className="flex items-center gap-1 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View & Grade
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredSubmissions.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No submissions found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Submission Details Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Submission Details</h2>
                            <button
                                onClick={() => { setSelectedSubmission(null); setSubmissionDetails(null); }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Student Info */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Student Information</h3>
                                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                                    {selectedSubmission.student?.profileImage?.url ? (
                                        <img
                                            src={selectedSubmission.student.profileImage.url}
                                            alt={selectedSubmission.student.fullName || 'Student'}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-indigo-600" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-800">{selectedSubmission.student?.fullName}</p>
                                        <p className="text-sm text-gray-500">{selectedSubmission.student?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submission Info */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Submission Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Submitted</p>
                                        <p className="font-medium">{formatDate(selectedSubmission.submittedAt)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="font-medium">
                                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedSubmission)}`}>
                                                {selectedSubmission.isLate ? 'Late' : 'On Time'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Answer File */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Answer File</h3>
                                {(submissionDetails?.submission?.answerFile || submissionDetails?.data?.submission?.answerFile) ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {submissionDetails?.submission?.answerFile?.originalName || submissionDetails?.data?.submission?.answerFile?.originalName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {(submissionDetails?.submission?.answerFile?.size || submissionDetails?.data?.submission?.answerFile?.size) && 
                                                            `${((submissionDetails?.submission?.answerFile?.size || submissionDetails?.data?.submission?.answerFile?.size) / 1024 / 1024).toFixed(2)} MB`}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadFile(
                                                    selectedSubmission.id, 
                                                    submissionDetails?.submission?.answerFile?.originalName || submissionDetails?.data?.submission?.answerFile?.originalName
                                                )}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                ) : loadingDetails ? (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                                        <p className="text-gray-500 mt-2">Loading...</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                        <p className="text-gray-500">No answer file uploaded</p>
                                    </div>
                                )}
                            </div>

                            {/* Grading Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Grading</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Marks (0-{exam?.totalMarks || 100})
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={exam?.totalMarks || 100}
                                            value={gradingMarks}
                                            onChange={(e) => setGradingMarks(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter marks"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Feedback (Optional)
                                        </label>
                                        <textarea
                                            value={gradingFeedback}
                                            onChange={(e) => setGradingFeedback(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Add feedback for the student..."
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveGrade}
                                            disabled={savingGrade}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {savingGrade ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            Save Grade
                                        </button>
                                        {selectedSubmission.gradingStatus === 'graded' && selectedSubmission.gradingStatus !== 'published' && (
                                            <button
                                                onClick={() => handlePublishResult(selectedSubmission.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                <Send className="w-4 h-4" />
                                                Publish Result
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Current Grade Display */}
                            {selectedSubmission.gradingStatus !== 'pending' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-800 mb-2">Current Grade</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">
                                                {selectedSubmission.obtainedMarks}/{selectedSubmission.totalMarks}
                                            </p>
                                            <p className="text-sm text-gray-600">Marks</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">
                                                {selectedSubmission.percentage?.toFixed(1)}%
                                            </p>
                                            <p className="text-sm text-gray-600">Score</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-2xl font-bold ${selectedSubmission.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                {selectedSubmission.passed ? 'PASSED' : 'FAILED'}
                                            </p>
                                            <p className="text-sm text-gray-600">Status</p>
                                        </div>
                                    </div>
                                    {submissionDetails?.submission?.feedback && (
                                        <div className="mt-4 pt-4 border-t border-green-200">
                                            <p className="text-sm text-gray-600">Feedback:</p>
                                            <p className="text-gray-800">{submissionDetails.submission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamResults;

