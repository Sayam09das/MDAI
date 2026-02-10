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
    Timer
} from 'lucide-react';
import useExamSecurity from '../../hooks/useExamSecurity';
import { getAssignment } from '../../lib/api/assignmentApi';

// Sample questions - in real app, these would come from the assignment
const sampleQuestions = [
    {
        id: 1,
        type: 'multiple_choice',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        marks: 1
    },
    {
        id: 2,
        type: 'multiple_choice',
        question: 'Which programming language is used for React?',
        options: ['Python', 'JavaScript', 'Java', 'C++'],
        marks: 1
    },
    {
        id: 3,
        type: 'multiple_choice',
        question: 'What does HTML stand for?',
        options: [
            'Hyper Text Markup Language',
            'High Text Machine Language',
            'Hyperlinks and Text Markup Language',
            'None of the above'
        ],
        marks: 1
    },
    {
        id: 4,
        type: 'multiple_choice',
        question: 'What is the correct way to create a React component?',
        options: [
            'function MyComponent() {}',
            'class MyComponent {}',
            'const MyComponent = () => {}',
            'All of the above'
        ],
        marks: 1
    },
    {
        id: 5,
        type: 'multiple_choice',
        question: 'Which hook is used for side effects in React?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        marks: 1
    },
    {
        id: 6,
        type: 'true_false',
        question: 'React is a framework for building mobile applications.',
        options: ['True', 'False'],
        marks: 1
    },
    {
        id: 7,
        type: 'multiple_choice',
        question: 'What is JSX in React?',
        options: [
            'A database query language',
            'A syntax extension for JavaScript',
            'A CSS framework',
            'A testing library'
        ],
        marks: 1
    },
    {
        id: 8,
        type: 'multiple_choice',
        question: 'Which method is used to update state in a React class component?',
        options: ['this.setState()', 'this.updateState()', 'this.state =', 'useState()'],
        marks: 1
    }
];

const ExamPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // Local state
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [examStarted, setExamStarted] = useState(false);
    const [examCompleted, setExamCompleted] = useState(false);
    
    // Question navigation
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questionStatus, setQuestionStatus] = useState({}); // answered, current, unanswered
    
    // Use exam security hook
    const {
        timeRemaining,
        formattedTime,
        isTimeUp,
        violations,
        violationCount,
        warningMessage,
        timeOutside,
        formattedTimeOutside,
        isOutside,
        examStatus,
        isDisqualified,
        disqualificationReason,
        isFullscreenMode,
        lastHeartbeat,
        loading: securityLoading,
        submitting,
        startExamSession,
        submitExamSession,
        updateAnswer,
        cleanupSecurity,
        config
    } = useExamSecurity(assignmentId, null);

    // Fetch assignment details
    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await getAssignment(assignmentId);
                if (response.success) {
                    setAssignment(response.assignment);
                } else {
                    setError(response.message || 'Failed to load assignment');
                }
            } catch (err) {
                setError('Failed to load assignment');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    // Initialize question status
    useEffect(() => {
        const status = {};
        sampleQuestions.forEach((q, index) => {
            status[q.id] = index === 0 ? 'current' : 'unanswered';
        });
        setQuestionStatus(status);
    }, []);

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
    };

    // Navigate to next question
    const nextQuestion = () => {
        if (currentQuestion < sampleQuestions.length - 1) {
            setCurrentQuestion(prev => {
                const next = prev + 1;
                // Update status
                setQuestionStatus(s => ({
                    ...s,
                    [sampleQuestions[prev].id]: answers[sampleQuestions[prev].id] ? 'answered' : 'unanswered',
                    [sampleQuestions[next].id]: 'current'
                }));
                return next;
            });
        }
    };

    // Navigate to previous question
    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => {
                const prevQ = prev - 1;
                setQuestionStatus(s => ({
                    ...s,
                    [sampleQuestions[prev].id]: 'unanswered',
                    [sampleQuestions[prevQ].id]: 'current'
                }));
                return prevQ;
            });
        }
    };

    // Jump to specific question
    const jumpToQuestion = (index) => {
        setCurrentQuestion(prev => {
            setQuestionStatus(s => ({
                ...s,
                [sampleQuestions[prev].id]: answers[sampleQuestions[prev].id] ? 'answered' : 'unanswered',
                [sampleQuestions[index].id]: 'current'
            }));
            return index;
        });
    };

    // Start exam
    const handleStartExam = async () => {
        try {
            const response = await startExamSession(assignment?.duration || 60);
            if (response.success) {
                setExamStarted(true);
            }
        } catch (err) {
            setError('Failed to start exam. Please try again.');
        }
    };

    // Submit exam
    const handleSubmitExam = async () => {
        if (window.confirm('Are you sure you want to submit your exam?')) {
            try {
                await submitExamSession();
                setExamCompleted(true);
            } catch (err) {
                setError('Failed to submit exam. Please try again.');
            }
        }
    };

    // Calculate answered count
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = sampleQuestions.length;

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading exam...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !examStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Cannot Start Exam</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/student-dashboard/assignments')}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Back to Assignments
                    </button>
                </div>
            </div>
        );
    }

    // Disqualified state
    if (isDisqualified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-red-800 mb-4">🚫 Disqualified</h1>
                    <p className="text-gray-700 mb-4">{disqualificationReason}</p>
                    <div className="bg-red-50 rounded-lg p-4 mb-6">
                        <p className="text-red-700 font-medium">
                            Your exam has been auto-submitted and recorded as disqualified.
                        </p>
                    </div>
                    <div className="space-y-2 mb-6">
                        <p className="text-sm text-gray-600">Violation Count: {violationCount}</p>
                        <p className="text-sm text-gray-600">Time Outside: {formattedTimeOutside}</p>
                    </div>
                    <button
                        onClick={() => navigate('/student-dashboard/assignments')}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Exam completed state
    if (examCompleted || (examStatus === 'SUBMITTED' || examStatus === 'AUTO_SUBMITTED')) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-800 mb-4">
                        {examStatus === 'AUTO_SUBMITTED' ? '⏰ Time Expired' : '✅ Exam Submitted'}
                    </h1>
                    <p className="text-gray-700 mb-6">
                        {examStatus === 'AUTO_SUBMITTED' 
                            ? 'Your exam was automatically submitted when time ran out.'
                            : 'Your exam has been submitted successfully.'}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Questions Answered: {answeredCount} / {totalQuestions}</p>
                        <p className="text-sm text-gray-600 mb-2">Violations Recorded: {violationCount}</p>
                        {timeOutside > 0 && (
                            <p className="text-sm text-gray-600">Time Outside: {formattedTimeOutside}</p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/student-dashboard/assignments')}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Return to Assignments
                    </button>
                </div>
            </div>
        );
    }

    // Pre-exam start screen
    if (!examStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Shield className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure Exam Mode</h1>
                        <p className="text-gray-600">{assignment?.title || 'Online Examination'}</p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Important Instructions
                        </h3>
                        <ul className="space-y-3 text-indigo-700">
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>You must stay on this screen for the entire duration of the exam</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Switching tabs, windows, or apps will be recorded as violations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>After 5 minutes outside the exam window, you will be automatically disqualified</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Copy, paste, and right-click are disabled</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>Keyboard shortcuts (Ctrl+C, F12, etc.) are blocked</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>The exam will auto-submit when time expires</span>
                            </li>
                        </ul>
                    </div>

                    {/* Security Warnings */}
                    <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-yellow-800 mb-4">⚠️ Security Monitoring</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-yellow-700">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>Tab switching detection</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Maximize className="w-4 h-4" />
                                <span>Fullscreen mode required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wifi className="w-4 h-4" />
                                <span>Heartbeat monitoring</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4" />
                                <span>Auto-submit on timeout</span>
                            </div>
                        </div>
                    </div>

                    {/* Exam Details */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-800">{assignment?.duration || 60} min</p>
                            <p className="text-sm text-gray-600">Duration</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <FileText className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-800">{totalQuestions}</p>
                            <p className="text-sm text-gray-600">Questions</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <CheckCircle className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-800">{assignment?.maxMarks || totalQuestions}</p>
                            <p className="text-sm text-gray-600">Total Marks</p>
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={handleStartExam}
                        disabled={securityLoading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {securityLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                Starting Exam...
                            </>
                        ) : (
                            <>
                                <Shield className="w-6 h-6" />
                                Start Secure Exam
                            </>
                        )}
                    </button>

                    {/* Cancel Link */}
                    <button
                        onClick={() => navigate('/student-dashboard/assignments')}
                        className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Cancel and return to assignments
                    </button>
                </div>
            </div>
        );
    }

    // Warning banner when outside
    if (warningMessage) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-6 max-w-md mx-4">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        <h2 className="text-xl font-bold text-yellow-800">Warning!</h2>
                    </div>
                    <p className="text-yellow-700 mb-4">{warningMessage}</p>
                    <p className="text-sm text-yellow-600">
                        Time outside exam: {formattedTimeOutside}
                    </p>
                    <button
                        onClick={() => setWarningMessage(null)}
                        className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        );
    }

    // Main exam interface
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Warning Banner - Outside Exam */}
            {isOutside && (
                <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-3 px-4 z-50 animate-pulse">
                    <div className="flex items-center justify-center gap-3">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-bold">WARNING: You are outside the exam window!</span>
                        <span className="opacity-75">Time outside: {formattedTimeOutside}</span>
                    </div>
                </div>
            )}

            {/* Exam Header */}
            <div className={`bg-indigo-900 text-white py-4 px-6 ${isOutside ? 'mt-12' : ''}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8" />
                        <div>
                            <h1 className="text-xl font-bold">{assignment?.title || 'Exam'}</h1>
                            <p className="text-indigo-300 text-sm">
                                {answeredCount} of {totalQuestions} answered
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Timer */}
                        <div className={`flex items-center gap-2 ${isTimeUp ? 'text-red-400' : isOutside ? 'text-red-300' : 'text-white'}`}>
                            <Clock className="w-6 h-6" />
                            <span className="text-2xl font-mono font-bold">
                                {isTimeUp ? '00:00' : formattedTime}
                            </span>
                        </div>
                        
                        {/* Violations */}
                        <div className={`flex items-center gap-2 ${violationCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                            <AlertTriangle className="w-6 h-6" />
                            <span className="font-bold">{violationCount}</span>
                        </div>
                        
                        {/* Network Status */}
                        <div className="flex items-center gap-2 text-green-400">
                            {lastHeartbeat ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                        </div>
                        
                        {/* Fullscreen Status */}
                        <div className={`flex items-center gap-2 ${isFullscreenMode ? 'text-green-400' : 'text-yellow-400'}`}>
                            {isFullscreenMode ? <Maximize className="w-6 h-6" /> : <Minimize className="w-6 h-6" />}
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitExam}
                            disabled={submitting}
                            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
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
                                {sampleQuestions.map((q, index) => (
                                    <button
                                        key={q.id}
                                        onClick={() => jumpToQuestion(index)}
                                        className={`
                                            w-full aspect-square rounded-lg font-bold text-sm flex items-center justify-center transition-all
                                            ${questionStatus[q.id] === 'answered'
                                                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                                : questionStatus[q.id] === 'current'
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
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                                    <span>Unanswered</span>
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
                                        {sampleQuestions[currentQuestion].marks} mark(s)
                                    </span>
                                </div>
                                <span className="text-gray-500 text-sm capitalize">
                                    {sampleQuestions[currentQuestion].type.replace('_', ' ')}
                                </span>
                            </div>

                            {/* Question Text */}
                            <h2 className="text-xl font-bold text-gray-800 mb-8">
                                {sampleQuestions[currentQuestion].question}
                            </h2>

                            {/* Options */}
                            <div className="space-y-3">
                                {sampleQuestions[currentQuestion].options.map((option, index) => (
                                    <label
                                        key={index}
                                        className={`
                                            flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                                            ${answers[sampleQuestions[currentQuestion].id] === option
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${sampleQuestions[currentQuestion].id}`}
                                            value={option}
                                            checked={answers[sampleQuestions[currentQuestion].id] === option}
                                            onChange={() => handleAnswerChange(sampleQuestions[currentQuestion].id, option)}
                                            className="w-5 h-5 text-indigo-600"
                                        />
                                        <span className="text-gray-800 font-medium">
                                            {String.fromCharCode(65 + index)}. {option}
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
                                        disabled={submitting}
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
                            {isOutside ? `Outside: ${formattedTimeOutside}` : 'In Exam'}
                        </span>
                        <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            {violationCount} Violations
                        </span>
                    </div>
                    <div>
                        {lastHeartbeat && (
                            <span>Last heartbeat: {new Date(lastHeartbeat).toLocaleTimeString()}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamPage;

