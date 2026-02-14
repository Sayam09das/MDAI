import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Filter,
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
    Shield,
    File,
    Upload,
    Save,
    X
} from 'lucide-react';
import { getExamResults, getExam, getExamStats, getAttemptDetails, gradeExamAnswer, downloadExamFile } from '../../../../lib/api/examApi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExamResults = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [exam, setExam] = useState(null);
    const [results, setResults] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [attemptDetails, setAttemptDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [gradingQuestion, setGradingQuestion] = useState(null);
    const [gradingMarks, setGradingMarks] = useState('');
    const [gradingNotes, setGradingNotes] = useState('');
    const [savingGrade, setSavingGrade] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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
            
            // Fetch exam results
            const resultsRes = await getExamResults(examId);
            if (resultsRes.success) {
                setResults(resultsRes.attempts);
            }
            
            // Fetch exam stats
            const statsRes = await getExamStats(examId);
            if (statsRes.success) {
                setStats(statsRes.stats);
            }
        } catch (err) {
            setError('Failed to load exam results');
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

    const formatDuration = (seconds) => {
        if (!seconds) return '-';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    // Handle viewing attempt details
    const handleViewDetails = async (attempt) => {
        setSelectedAttempt(attempt);
        setLoadingDetails(true);
        setAttemptDetails(null);
        setGradingQuestion(null);
        try {
            const detailsRes = await getAttemptDetails(attempt.id);
            if (detailsRes.success) {
                setAttemptDetails(detailsRes);
            }
        } catch (err) {
            console.error('Failed to load attempt details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Handle downloading student uploaded file
    const handleDownloadFile = async (questionId, fileName) => {
        if (!selectedAttempt) return;
        
        try {
            const blob = await downloadExamFile(selectedAttempt.id, questionId);
            // Create download link
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

    // Handle grading question
    const handleStartGrading = (question) => {
        setGradingQuestion(question);
        setGradingMarks(question.studentAnswer?.marksObtained?.toString() || '');
        setGradingNotes(question.studentAnswer?.gradingNotes || '');
    };

    const handleSaveGrade = async () => {
        if (!gradingQuestion || !selectedAttempt) return;
        
        const marks = parseFloat(gradingMarks);
        if (isNaN(marks) || marks < 0 || marks > gradingQuestion.marks) {
            alert(`Marks must be between 0 and ${gradingQuestion.marks}`);
            return;
        }

        setSavingGrade(true);
        try {
            const res = await gradeExamAnswer(
                selectedAttempt.id,
                gradingQuestion._id,
                marks,
                gradingNotes
            );
            
            if (res.success) {
                // Refresh attempt details
                const detailsRes = await getAttemptDetails(selectedAttempt.id);
                if (detailsRes.success) {
                    setAttemptDetails(detailsRes);
                    // Update the selected attempt with new marks
                    setSelectedAttempt(prev => ({
                        ...prev,
                        marks: res.attempt.obtainedMarks,
                        percentage: res.attempt.percentage,
                        passed: res.attempt.passed
                    }));
                }
                setGradingQuestion(null);
                alert('Grade saved successfully!');
            }
        } catch (err) {
            console.error('Failed to save grade:', err);
            alert('Failed to save grade');
        } finally {
            setSavingGrade(false);
        }
    };

    const handleCloseGrading = () => {
        setGradingQuestion(null);
        setGradingMarks('');
        setGradingNotes('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUBMITTED': return 'bg-green-100 text-green-700';
            case 'AUTO_SUBMITTED': return 'bg-yellow-100 text-yellow-700';
            case 'DISQUALIFIED': return 'bg-red-100 text-red-700';
            case 'EXPIRED': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SUBMITTED': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'AUTO_SUBMITTED': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'DISQUALIFIED': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    // Filter attempts
    const filteredAttempts = results?.filter(attempt => {
        const matchesFilter = filter === 'all' || 
            (filter === 'passed' && attempt.passed) ||
            (filter === 'failed' && !attempt.passed) ||
            (filter === 'disqualified' && attempt.status === 'DISQUALIFIED');
        
        const matchesSearch = attempt.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attempt.student?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    }) || [];

    // Calculate stats
    const passedCount = filteredAttempts.filter(a => a.passed).length;
    const failedCount = filteredAttempts.filter(a => !a.passed && a.status === 'SUBMITTED').length;
    const avgScore = filteredAttempts.length > 0 
        ? filteredAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / filteredAttempts.length 
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
                                Exam Results
                            </h1>
                            <p className="text-gray-600 mt-1">{exam?.title || 'Exam Results'}</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                                <Download className="w-5 h-5" />
                                Export
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
                                <p className="text-2xl font-bold text-gray-800">{results?.length || 0}</p>
                                <p className="text-sm text-gray-500">Total Attempts</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{passedCount}</p>
                                <p className="text-sm text-gray-500">Passed</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{failedCount}</p>
                                <p className="text-sm text-gray-500">Failed</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{avgScore.toFixed(1)}%</p>
                                <p className="text-sm text-gray-500">Average Score</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Shield className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats?.avgViolations?.toFixed(1) || 0}
                                </p>
                                <p className="text-sm text-gray-500">Avg Violations</p>
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
                                <option value="all">All Attempts</option>
                                <option value="passed">Passed Only</option>
                                <option value="failed">Failed Only</option>
                                <option value="disqualified">Disqualified</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Table */}
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
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time Taken
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Violations
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
                                {filteredAttempts.map((attempt) => (
                                    <tr key={attempt.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {attempt.student?.profileImage?.url ? (
                                                    <img
                                                        src={attempt.student.profileImage.url}
                                                        alt={attempt.student.fullName || 'Student'}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {attempt.student?.fullName || 'Unknown Student'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {attempt.student?.email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(attempt.status)}`}>
                                                {getStatusIcon(attempt.status)}
                                                {attempt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                    {attempt.marks}/{attempt.totalMarks}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ({attempt.percentage?.toFixed(1)}%)
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                {formatDuration(attempt.timeTaken)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <AlertTriangle className={`w-4 h-4 ${attempt.totalViolations > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
                                                <span className={attempt.totalViolations > 2 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                                    {attempt.totalViolations || 0}
                                                </span>
                                                {attempt.tabSwitchCount > 0 && (
                                                    <span className="text-xs text-gray-500">
                                                        ({attempt.tabSwitchCount} tab switches)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(attempt.submittedAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetails(attempt)}
                                                className="flex items-center gap-1 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredAttempts.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No attempts found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Attempt Details Modal */}
            {selectedAttempt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Attempt Details</h2>
                            <button
                                onClick={() => { setSelectedAttempt(null); setAttemptDetails(null); }}
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
                                    {selectedAttempt.student?.profileImage?.url ? (
                                        <img
                                            src={selectedAttempt.student.profileImage.url}
                                            alt={selectedAttempt.student.fullName || 'Student'}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-indigo-600" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-800">{selectedAttempt.student?.fullName}</p>
                                        <p className="text-sm text-gray-500">{selectedAttempt.student?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Score Summary */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Score Summary</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-blue-600">{selectedAttempt.marks}</p>
                                        <p className="text-sm text-gray-600">Marks Obtained</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-green-600">{selectedAttempt.totalMarks}</p>
                                        <p className="text-sm text-gray-600">Total Marks</p>
                                    </div>
                                    <div className={`rounded-lg p-4 text-center ${selectedAttempt.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <p className={`text-2xl font-bold ${selectedAttempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedAttempt.percentage?.toFixed(1)}%
                                        </p>
                                        <p className="text-sm text-gray-600">{selectedAttempt.passed ? 'Passed' : 'Failed'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Loading Details */}
                            {loadingDetails && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading details...</p>
                                </div>
                            )}

                            {/* Questions & Answers */}
                            {attemptDetails && !loadingDetails && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3">Questions & Answers</h3>
                                    <div className="space-y-4">
                                        {attemptDetails.questions?.map((question, index) => (
                                            <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                                                        <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                                                            {question.type.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-indigo-600">
                                                        {question.studentAnswer?.marksObtained || 0}/{question.marks} marks
                                                    </span>
                                                </div>
                                                
                                                <p className="font-medium text-gray-800 mb-3">{question.question}</p>

                                                {/* Multiple Choice / True-False */}
                                                {question.type === 'multiple_choice' || question.type === 'true_false' ? (
                                                    <div className="space-y-2">
                                                        {question.options?.map((option) => {
                                                            const isSelected = question.studentAnswer?.selectedOption === option._id;
                                                            const isCorrect = option.isCorrect;
                                                            
                                                            return (
                                                                <div
                                                                    key={option._id}
                                                                    className={`p-3 rounded-lg border ${
                                                                        isCorrect ? 'border-green-500 bg-green-50' :
                                                                        isSelected ? 'border-red-500 bg-red-50' :
                                                                        'border-gray-200'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        {isCorrect && <CheckCircle className="w-4 h-4 text-green-500" />}
                                                                        {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                                                                        <span className={isCorrect ? 'font-medium text-green-700' : ''}>
                                                                            {option.text}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : null}

                                                {/* Short Answer */}
                                                {question.type === 'short_answer' && (
                                                    <div className={`p-3 rounded-lg border ${
                                                        question.studentAnswer?.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                                    }`}>
                                                        <p className="text-sm text-gray-600 mb-1">Student's Answer:</p>
                                                        <p className="font-medium">{question.studentAnswer?.textAnswer || 'No answer'}</p>
                                                        {question.correctAnswer && (
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                Correct Answer: {question.correctAnswer}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* File Upload Question */}
                                                {question.type === 'file_upload' && (
                                                    <div className="space-y-3">
                                                        {question.studentAnswer?.uploadedFile ? (
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <File className="w-8 h-8 text-blue-600" />
                                                                        <div>
                                                                            <p className="font-medium text-gray-800">
                                                                                {question.studentAnswer.uploadedFile.originalName}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                {question.studentAnswer.uploadedFile.size && 
                                                                                    `${(question.studentAnswer.uploadedFile.size / 1024 / 1024).toFixed(2)} MB`}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDownloadFile(
                                                                            question._id, 
                                                                            question.studentAnswer.uploadedFile.originalName
                                                                        )}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                        Download
                                                                    </button>
                                                                </div>

                                                                {/* Grading Section */}
                                                                <div className="mt-4 pt-4 border-t border-blue-200">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm font-medium">
                                                                            Status: {question.studentAnswer.isGraded ? (
                                                                                <span className="text-green-600">Graded</span>
                                                                            ) : (
                                                                                <span className="text-yellow-600">Pending</span>
                                                                            )}
                                                                        </span>
                                                                        <span className="text-sm text-gray-500">
                                                                            Max Marks: {question.marks}
                                                                        </span>
                                                                    </div>

                                                                    {gradingQuestion?._id === question._id ? (
                                                                        <div className="bg-white rounded-lg p-4">
                                                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                        Marks (0-{question.marks})
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        max={question.marks}
                                                                                        value={gradingMarks}
                                                                                        onChange={(e) => setGradingMarks(e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                    Feedback/Notes
                                                                                </label>
                                                                                <textarea
                                                                                    value={gradingNotes}
                                                                                    onChange={(e) => setGradingNotes(e.target.value)}
                                                                                    rows={2}
                                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                                                                <button
                                                                                    onClick={handleCloseGrading}
                                                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleStartGrading(question)}
                                                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                                        >
                                                                            <Upload className="w-4 h-4" />
                                                                            {question.studentAnswer.isGraded ? 'Update Grade' : 'Grade'}
                                                                        </button>
                                                                    )}

                                                                    {question.studentAnswer.isGraded && question.studentAnswer.gradingNotes && (
                                                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                                            <p className="text-sm text-gray-600">Feedback:</p>
                                                                            <p className="text-sm">{question.studentAnswer.gradingNotes}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                                                <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-gray-500">No file uploaded</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Timing */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Timing Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Started</span>
                                        <span className="text-gray-800">
                                            {selectedAttempt.startTime ? formatDate(selectedAttempt.startTime) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Submitted</span>
                                        <span className="text-gray-800">
                                            {selectedAttempt.submittedAt ? formatDate(selectedAttempt.submittedAt) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Time Taken</span>
                                        <span className="text-gray-800">{formatDuration(selectedAttempt.timeTaken)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamResults;

