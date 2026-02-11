import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
    Maximize,
    Minimize,
    FileText,
    ChevronLeft,
    ChevronRight,
    Send,
    Shield,
    Wifi,
    WifiOff,
    Timer,
    BookOpen,
    Users,
    Calendar
} from 'lucide-react';
import { getStudentExams, startExamAttempt, getMyAttempts } from '../../../lib/api/examApi';
import useExamSecurity from '../../../hooks/useExamSecurity';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // State
    const [exams, setExams] = useState([]);
    const [myAttempts, setMyAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Current exam state
    const [currentExam, setCurrentExam] = useState(null);
    const [attemptId, setAttemptId] = useState(null);
    const [examStarted, setExamStarted] = useState(false);
    const [examCompleted, setExamCompleted] = useState(false);
    
    // Question navigation
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questionStatus, setQuestionStatus] = useState({});

    // Security hook
    const security = useExamSecurity(examId, attemptId);

    // Load exams and attempts
    useEffect(() => {
        fetchData();
    }, [examId]);

    const fetchData = async () => {
        try {
            setError(null);
            
            // Fetch available exams
            const examsRes = await getStudentExams();
            if (examsRes.success) {
                setExams(examsRes.exams);
            }

            // Fetch my attempts
            const attemptsRes = await getMyAttempts();
            if (attemptsRes.success) {
                setMyAttempts(attemptsRes.attempts);
            }
        } catch (err) {
            setError('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    // Start exam
    const handleStartExam = async (exam) => {
        try {
            setLoading(true);
            const response = await startExamAttempt(exam.id);
            
            if (response.success) {
                setCurrentExam(response.exam);
                setAttemptId(response.attempt.id);
                
                if (response.resuming) {
                    // Resume existing attempt
                    setExamStarted(true);
                } else {
                    // Start new attempt
                    setExamStarted(true);
                    security.startExam();
                }
            } else {
                setError(response.message || 'Failed to start exam');
            }
        } catch (err) {
            setError('Failed to start exam');
        } finally {
            setLoading(false);
        }
    };

    // Handle answer change
    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
        
        setQuestionStatus(prev => ({
            ...prev,
            [questionId]: 'answered'
        }));
        
        security.updateAnswer(questionId, answer);
    };

    // Navigate questions
    const nextQuestion = () => {
        if (currentQuestion < currentExam.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    // Submit exam
    const handleSubmitExam = async () => {
        if (window.confirm('Are you sure you want to submit your exam?')) {
            try {
                const response = await security.submitExam();
                if (response.success) {
                    setExamCompleted(true);
                }
            } catch (err) {
                setError('Failed to submit exam');
            }
        }
    };

    // Initialize question status when exam starts
    useEffect(() => {
        if (currentExam?.questions) {
            const status = {};
            currentExam.questions.forEach((q, index) => {
                status[q._id] = index === 0 ? 'current' : 'unanswered';
            });
            setQuestionStatus(status);
        }
    }, [currentExam]);

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
    if (error) {
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

    // Disqualified state
    if (security.isDisqualified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-red-800 mb-4">🚫 Disqualified</h1>
                    <p className="text-gray-700 mb-4">{security.disqualificationReason}</p>
                    <div className="bg-red-50 rounded-lg p-4 mb-6">
                        <p className="text-red-700 font-medium">
                            Your exam has been auto-submitted and recorded as disqualified.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Exam completed state
    if (examCompleted || ['SUBMITTED', 'AUTO_SUBMITTED'].includes(security.examStatus)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-800 mb-4">
                        {security.examStatus === 'AUTO_SUBMITTED' ? '⏰ Time Expired' : '✅ Exam Submitted'}
                    </h1>
                    <p className="text-gray-700 mb-6">
                        {security.examStatus === 'AUTO_SUBMITTED' 
                            ? 'Your exam was automatically submitted when time ran out.'
                            : 'Your exam has been submitted successfully.'}
                    </p>
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Active exam interface
    if (examStarted && currentExam) {
        const questions = currentExam.questions;
        const totalQuestions = questions.length;
        const answeredCount = Object.keys(answers).length;

        return (
            <div className="min-h-screen bg-gray-100">
                {/* Warning Banner - Outside Exam */}
                {security.isOutside && (
                    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-3 px-4 z-50 animate-pulse">
                        <div className="flex items-center justify-center gap-3">
                            <AlertTriangle className="w-6 h-6" />
                            <span className="font-bold">WARNING: You are outside the exam window!</span>
                            <span className="opacity-75">Time outside: {security.formattedTimeOutside}</span>
                        </div>
                    </div>
                )}

                {/* Exam Header */}
                <div className={`bg-indigo-900 text-white py-4 px-6 ${security.isOutside ? 'mt-12' : ''}`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <FileText className="w-8 h-8" />
                            <div>
                                <h1 className="text-xl font-bold">{currentExam.title}</h1>
                                <p className="text-indigo-300 text-sm">
                                    {answeredCount} of {totalQuestions} answered
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            {/* Timer */}
                            <div className={`flex items-center gap-2 ${security.isTimeUp ? 'text-red-400' : 'text-white'}`}>
                                <Clock className="w-6 h-6" />
                                <span className="text-2xl font-mono font-bold">
                                    {security.isTimeUp ? '00:00:00' : security.formattedTime}
                                </span>
                            </div>
                            
                            {/* Violations */}
                            <div className={`flex items-center gap-2 ${security.violationCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                <AlertTriangle className="w-6 h-6" />
                                <span className="font-bold">{security.violationCount}</span>
                            </div>
                            
                            {/* Network Status */}
                            <div className="flex items-center gap-2 text-green-400">
                                {security.lastHeartbeat ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                            </div>
                            
                            {/* Fullscreen Status */}
                            <div className={`flex items-center gap-2 ${security.isFullscreenMode ? 'text-green-400' : 'text-yellow-400'}`}>
                                {security.isFullscreenMode ? <Maximize className="w-6 h-6" /> : <Minimize className="w-6 h-6" />}
                            </div>
                            
                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitExam}
                                disabled={security.submitting}
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {security.submitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Question Navigator */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-6">
                                <h3 className="font-bold text-gray-800 mb-4">Question Navigator</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {questions.map((q, index) => (
                                        <button
                                            key={q._id}
                                            onClick={() => jumpToQuestion(index)}
                                            className={`
                                                w-full aspect-square rounded-lg font-bold text-sm flex items-center justify-center transition-all
                                                ${questionStatus[q._id] === 'answered'
                                                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                                    : questionStatus[q._id] === 'current'
                                                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500 ring-2 ring-indigo-200'
                                                    : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
                                                }
                                            `}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                                        <span>Answered</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                                        <span>Current</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Question Display */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                {/* Question Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                                            Question {currentQuestion + 1} of {totalQuestions}
                                        </span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                            {questions[currentQuestion].marks} mark(s)
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm capitalize">
                                        {questions[currentQuestion].type.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Question Text */}
                                <h2 className="text-xl font-bold text-gray-800 mb-8">
                                    {questions[currentQuestion].question}
                                </h2>

                                {/* Options */}
                                <div className="space-y-3">
                                    {questions[currentQuestion].options.map((option, index) => (
                                        <label
                                            key={option._id}
                                            className={`
                                                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                                                ${answers[questions[currentQuestion]._id] === option._id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${questions[currentQuestion]._id}`}
                                                value={option._id}
                                                checked={answers[questions[currentQuestion]._id] === option._id}
                                                onChange={() => handleAnswerChange(questions[currentQuestion]._id, option._id)}
                                                className="w-5 h-5 text-indigo-600"
                                            />
                                            <span className="text-gray-800 font-medium">
                                                {String.fromCharCode(65 + index)}. {option.text}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={prevQuestion}
                                        disabled={currentQuestion === 0}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Previous
                                    </button>
                                    
                                    {currentQuestion < totalQuestions - 1 ? (
                                        <button
                                            onClick={nextQuestion}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                                        >
                                            Next
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmitExam}
                                            disabled={security.submitting}
                                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                                        >
                                            <Send className="w-5 h-5" />
                                            Submit Exam
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Info Footer */}
                <div className="bg-gray-800 text-gray-400 py-4 px-6 mt-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-400" />
                                Secure Mode Active
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {security.isOutside ? `Outside: ${security.formattedTimeOutside}` : 'In Exam'}
                            </span>
                            <span className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                {security.violationCount} Violations
                            </span>
                        </div>
                        <div>
                            {security.lastHeartbeat && (
                                <span>Last heartbeat: {new Date(security.lastHeartbeat).toLocaleTimeString()}</span>
                            )}
                        </div>
                    </div>
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Online Exams</h1>
                    <p className="text-gray-600">Attempt secure online exams with anti-cheating protection</p>
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
                                const attempt = myAttempts.find(a => a.id === exam.id);
                                const canAttempt = exam.canAttempt && !attempt;
                                
                                return (
                                    <div key={exam.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{exam.title}</h3>
                                                <p className="text-sm text-gray-500">{exam.course?.title}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                exam.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {exam.status}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                                        
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                                                <p className="text-sm font-bold text-gray-800">{exam.duration} min</p>
                                                <p className="text-xs text-gray-500">Duration</p>
                                            </div>
                                            <div className="text-center">
                                                <FileText className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                                                <p className="text-sm font-bold text-gray-800">{exam.questionCount}</p>
                                                <p className="text-xs text-gray-500">Questions</p>
                                            </div>
                                            <div className="text-center">
                                                <CheckCircle className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                                                <p className="text-sm font-bold text-gray-800">{exam.totalMarks}</p>
                                                <p className="text-xs text-gray-500">Total Marks</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {exam.attemptsUsed}/{exam.maxAttempts} attempts
                                            </span>
                                            {exam.endDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Ends: {new Date(exam.endDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={() => handleStartExam(exam)}
                                            disabled={!canAttempt || exam.status !== 'active'}
                                            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                                                canAttempt && exam.status === 'active'
                                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <Shield className="w-5 h-5" />
                                            {attempt ? 'Already Attempted' : !canAttempt ? 'Attempts Exhausted' : 'Start Secure Exam'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* My Attempts */}
                {myAttempts.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            My Attempts
                        </h2>
                        
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violations</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {myAttempts.map((attempt) => (
                                        <tr key={attempt.id}>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-800">{attempt.exam?.title}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    attempt.status === 'SUBMITTED' ? 'bg-green-100 text-green-700' :
                                                    attempt.status === 'DISQUALIFIED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {attempt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={attempt.passed ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                    {attempt.marks}/{attempt.totalMarks} ({attempt.percentage?.toFixed(1)}%)
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600">{attempt.totalViolations || 0}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-500 text-sm">
                                                    {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamPage;
