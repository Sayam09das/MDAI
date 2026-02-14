import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySubmissions } from '../../../../lib/api/examApi';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, Award, BookOpen } from 'lucide-react';

const StudentExamResults = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await getMySubmissions();
            
            if (response.success) {
                setSubmissions(response.submissions || []);
            } else {
                setError(response.message || 'Failed to fetch results');
            }
        } catch (err) {
            console.error('Error fetching exam results:', err);
            setError('Failed to load exam results. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (submission) => {
        // Show graded status if grading is complete, regardless of publication
        if (submission.gradingStatus === 'graded' || submission.gradingStatus === 'published') {
            if (submission.passed) {
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Passed
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3" />
                    Failed
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3" />
                Pending
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your exam results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Results</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchResults}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <Award className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
                            <p className="text-gray-600">View your submitted exam results</p>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Exams</p>
                                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Passed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {submissions.filter(s => s.resultPublished && s.passed).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {submissions.filter(s => !s.resultPublished).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results List */}
                {submissions.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Exam Results Yet</h3>
                        <p className="text-gray-600 mb-4">
                            You haven't submitted any exams yet. Once you submit exams, your results will appear here.
                        </p>
                        <button
                            onClick={() => navigate('/student-dashboard/student-mycourse')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            View My Courses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {submission.exam?.title || 'Exam'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {submission.course?.title || 'Course'} • Submitted: {formatDate(submission.submittedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {(submission.gradingStatus === 'graded' || submission.gradingStatus === 'published') ? (
                                            <>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-gray-900">
                                                        {submission.percentage}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {calculateGrade(submission.percentage)} Grade
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xl font-semibold text-gray-900">
                                                        {submission.obtainedMarks}/{submission.totalMarks}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Marks</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center px-4">
                                                <div className="text-sm text-gray-500">
                                                    Result not available yet
                                                </div>
                                            </div>
                                        )}
                                        {getStatusBadge(submission)}
                                    </div>
                                </div>

                                {/* Feedback Section - Show if graded or published */}
                                {(submission.gradingStatus === 'graded' || submission.gradingStatus === 'published') && submission.feedback && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback:</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {submission.feedback}
                                        </p>
                                    </div>
                                )}

                                {/* Late Submission Notice */}
                                {submission.isLate && (
                                    <div className="mt-3 flex items-center gap-2 text-sm text-orange-600">
                                        <Clock className="w-4 h-4" />
                                        Submitted late
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentExamResults;

