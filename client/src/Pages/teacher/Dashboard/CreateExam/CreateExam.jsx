import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Trash2,
    GripVertical,
    Save,
    Eye,
    Settings,
    Clock,
    Calendar,
    Shield,
    BookOpen,
    ChevronDown,
    ChevronUp,
    X,
    Check,
    AlertCircle,
    FileText,
    Calculator,
    Type,
    List
} from 'lucide-react';
import { createExam, updateExam, getExam } from '../../../../lib/api/examApi';
import { getTeacherCourses } from '../../../../lib/api/courseApi';

const CreateExam = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Form state
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Exam basic info
    const [examData, setExamData] = useState({
        title: '',
        description: '',
        course: '',
        duration: 60, // in minutes
        durationHours: 0,
        durationMinutes: 60,
        passingMarks: 40,
        shuffleQuestions: false,
        shuffleOptions: false,
        showResults: false,
        allowReview: true,
        startDate: '',
        endDate: '',
        maxAttempts: 1,
        security: {
            preventTabSwitch: true,
            preventCopyPaste: true,
            requireFullscreen: true,
            maxTimeOutside: 5,
            autoSubmitOnViolation: false
        }
    });

    // Questions state
    const [questions, setQuestions] = useState([]);

    // UI state
    const [showSettings, setShowSettings] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');
    const [previewMode, setPreviewMode] = useState(false);
    const [previewQuestion, setPreviewQuestion] = useState(null);

    // Load courses on mount
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await getTeacherCourses();
            if (response.success) {
                setCourses(response.courses || []);
            }
        } catch (err) {
            setError('Failed to load courses');
        }
    };

    // Question types
    const questionTypes = [
        { value: 'multiple_choice', label: 'Multiple Choice', icon: List },
        { value: 'true_false', label: 'True/False', icon: Check },
        { value: 'short_answer', label: 'Short Answer', icon: Type },
        { value: 'essay', label: 'Essay', icon: FileText },
        { value: 'file_upload', label: 'File Upload (PDF)', icon: FileText }
    ];

    // Add new question
    const addQuestion = (type = 'multiple_choice') => {
        const newQuestion = {
            _id: `temp_${Date.now()}`,
            type,
            question: '',
            options: type === 'multiple_choice' || type === 'true_false' 
                ? [
                    { _id: `opt_${Date.now()}_1`, text: '', isCorrect: false },
                    { _id: `opt_${Date.now()}_2`, text: '', isCorrect: false }
                  ]
                : [],
            correctAnswer: '',
            marks: 1,
            explanation: '',
            order: questions.length
        };
        setQuestions([...questions, newQuestion]);
    };

    // Update question
    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    // Update option
    const updateOption = (questionIndex, optionIndex, field, value) => {
        const updated = [...questions];
        updated[questionIndex].options[optionIndex][field] = value;
        setQuestions(updated);
    };

    // Add option
    const addOption = (questionIndex) => {
        const updated = [...questions];
        updated[questionIndex].options.push({
            _id: `opt_${Date.now()}_${updated[questionIndex].options.length + 1}`,
            text: '',
            isCorrect: false
        });
        setQuestions(updated);
    };

    // Remove option
    const removeOption = (questionIndex, optionIndex) => {
        const updated = [...questions];
        updated[questionIndex].options.splice(optionIndex, 1);
        setQuestions(updated);
    };

    // Remove question
    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
    };

    // Move question
    const moveQuestion = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= questions.length) return;
        const updated = [...questions];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setQuestions(updated);
    };

    // Set correct answer
    const setCorrectAnswer = (questionIndex, optionIndex) => {
        const updated = [...questions];
        updated[questionIndex].options = updated[questionIndex].options.map((opt, i) => ({
            ...opt,
            isCorrect: i === optionIndex
        }));
        setQuestions(updated);
    };

    // Calculate total marks
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

    // Handle duration change
    const handleDurationChange = (hours, minutes) => {
        const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
        setExamData(prev => ({
            ...prev,
            durationHours: parseInt(hours) || 0,
            durationMinutes: parseInt(minutes) || 0,
            duration: totalMinutes > 0 ? totalMinutes : 1
        }));
    };

    // Format duration display
    const formatDuration = () => {
        const { durationHours, durationMinutes } = examData;
        const parts = [];
        if (durationHours > 0) parts.push(`${durationHours} hour${durationHours > 1 ? 's' : ''}`);
        if (durationMinutes > 0) parts.push(`${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`);
        return parts.length > 0 ? parts.join(' ') : '0 minutes';
    };

    // Helper to get default start date (local timezone)
    const getDefaultStartDate = () => {
        const now = new Date();
        // Add 1 hour to current time
        now.setHours(now.getHours() + 1);
        // Format as YYYY-MM-DDTHH:mm (local time)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Helper to get default end date (local timezone)
    const getDefaultEndDate = () => {
        const now = new Date();
        // Add 2 hours to current time (duration + 1 hour buffer)
        now.setHours(now.getHours() + 2);
        // Format as YYYY-MM-DDTHH:mm (local time)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Save exam
    const handleSave = async (publish = false) => {
        if (!examData.title.trim()) {
            setError('Please enter exam title');
            return;
        }
        if (!examData.course) {
            setError('Please select a course');
            return;
        }
        if (questions.length === 0) {
            setError('Please add at least one question');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = {
                title: examData.title,
                description: examData.description,
                course: examData.course,
                duration: examData.duration,
                passingMarks: examData.passingMarks,
                shuffleQuestions: examData.shuffleQuestions,
                shuffleOptions: examData.shuffleOptions,
                showResults: examData.showResults,
                allowReview: examData.allowReview,
                startDate: examData.startDate || null,
                endDate: examData.endDate || null,
                maxAttempts: examData.maxAttempts,
                security: examData.security,
                questions: questions.map((q, index) => ({
                    type: q.type,
                    question: q.question,
                    correctAnswer: q.correctAnswer || '',
                    marks: q.marks || 1,
                    explanation: q.explanation || '',
                    order: index,
                    options: q.options && q.options.length > 0 
                        ? q.options.map(opt => ({
                            text: opt.text || '',
                            isCorrect: opt.isCorrect || false
                        }))
                        : []
                })),
                isPublished: publish,
                status: publish ? 'active' : 'draft'
            };

            const response = await createExam(payload);

            if (response.success) {
                setSuccess(publish ? 'Exam published successfully!' : 'Exam saved as draft!');
                setTimeout(() => {
                    navigate('/teacher-dashboard/exams');
                }, 2000);
            } else {
                setError(response.message || 'Failed to create exam');
            }
        } catch (err) {
            setError(err.message || 'Failed to create exam');
        } finally {
            setSaving(false);
        }
    };

    // Validate exam
    const validateExam = () => {
        const errors = [];
        if (!examData.title.trim()) errors.push('Exam title is required');
        if (!examData.course) errors.push('Course is required');
        if (questions.length === 0) errors.push('At least one question is required');
        questions.forEach((q, i) => {
            if (!q.question.trim()) errors.push(`Question ${i + 1} needs text`);
            if ((q.type === 'multiple_choice' || q.type === 'true_false') && 
                q.options.filter(o => o.isCorrect).length === 0) {
                errors.push(`Question ${i + 1} needs a correct answer`);
            }
        });
        return errors;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Create New Exam</h1>
                            <p className="text-gray-600 mt-1">Design and configure your exam with questions</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPreviewMode(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                <Eye className="w-5 h-5" />
                                Preview
                            </button>
                            <button
                                onClick={() => handleSave(false)}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSave(true)}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <Check className="w-5 h-5" />
                                )}
                                Publish Exam
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Exam Details */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                                Basic Information
                            </h2>

                            {/* Exam Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Exam Title *
                                </label>
                                <input
                                    type="text"
                                    value={examData.title}
                                    onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter exam title"
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={examData.description}
                                    onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="3"
                                    placeholder="Enter exam description"
                                />
                            </div>

                            {/* Course Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course *
                                </label>
                                <select
                                    value={examData.course}
                                    onChange={(e) => setExamData({ ...examData, course: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Duration *
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Hours</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={examData.durationHours}
                                            onChange={(e) => handleDurationChange(e.target.value, examData.durationMinutes)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={examData.durationMinutes}
                                            onChange={(e) => handleDurationChange(examData.durationHours, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Duration: {formatDuration()}</p>
                            </div>

                            {/* Passing Marks */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calculator className="w-4 h-4 inline mr-1" />
                                    Passing Marks (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={examData.passingMarks}
                                    onChange={(e) => setExamData({ ...examData, passingMarks: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Date Range */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Availability
                                </label>
                                
                                {/* Immediate availability toggle */}
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                    <input
                                        type="checkbox"
                                        checked={!examData.startDate}
                                        onChange={(e) => setExamData({ 
                                            ...examData, 
                                            startDate: e.target.checked ? '' : getDefaultStartDate(),
                                            endDate: e.target.checked ? '' : getDefaultEndDate()
                                        })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Make available immediately</span>
                                </label>
                                
                                {examData.startDate !== '' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                            <input
                                                type="datetime-local"
                                                value={examData.startDate}
                                                onChange={(e) => setExamData({ ...examData, startDate: e.target.value })}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                            <input
                                                type="datetime-local"
                                                value={examData.endDate}
                                                onChange={(e) => setExamData({ ...examData, endDate: e.target.value })}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Toggle Settings */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={examData.shuffleQuestions}
                                        onChange={(e) => setExamData({ ...examData, shuffleQuestions: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Shuffle Questions</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={examData.shuffleOptions}
                                        onChange={(e) => setExamData({ ...examData, shuffleOptions: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Shuffle Options</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={examData.showResults}
                                        onChange={(e) => setExamData({ ...examData, showResults: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Show Results to Students</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={examData.allowReview}
                                        onChange={(e) => setExamData({ ...examData, allowReview: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Allow Review</span>
                                </label>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-indigo-600" />
                                Security Settings
                            </h2>

                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700">Prevent Tab Switch</span>
                                    <input
                                        type="checkbox"
                                        checked={examData.security.preventTabSwitch}
                                        onChange={(e) => setExamData({
                                            ...examData,
                                            security: { ...examData.security, preventTabSwitch: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700">Prevent Copy/Paste</span>
                                    <input
                                        type="checkbox"
                                        checked={examData.security.preventCopyPaste}
                                        onChange={(e) => setExamData({
                                            ...examData,
                                            security: { ...examData.security, preventCopyPaste: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-gray-700">Require Fullscreen</span>
                                    <input
                                        type="checkbox"
                                        checked={examData.security.requireFullscreen}
                                        onChange={(e) => setExamData({
                                            ...examData,
                                            security: { ...examData.security, requireFullscreen: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                </label>
                                <div className="pt-2">
                                    <label className="block text-sm text-gray-700 mb-1">
                                        Max Time Outside (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={examData.security.maxTimeOutside}
                                        onChange={(e) => setExamData({
                                            ...examData,
                                            security: { ...examData.security, maxTimeOutside: parseInt(e.target.value) || 5 }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <label className="flex items-center justify-between cursor-pointer pt-2">
                                    <span className="text-sm text-gray-700">Auto-submit on Violations</span>
                                    <input
                                        type="checkbox"
                                        checked={examData.security.autoSubmitOnViolation}
                                        onChange={(e) => setExamData({
                                            ...examData,
                                            security: { ...examData.security, autoSubmitOnViolation: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Questions */}
                    <div className="lg:col-span-2">
                        {/* Questions Header */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                    Questions ({questions.length})
                                </h2>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Marks</p>
                                    <p className="text-2xl font-bold text-indigo-600">{totalMarks}</p>
                                </div>
                            </div>

                            {/* Question Type Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {questionTypes.map(type => (
                                    <button
                                        key={type.value}
                                        onClick={() => addQuestion(type.value)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                    >
                                        <type.icon className="w-4 h-4" />
                                        Add {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-4">
                            {questions.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Added</h3>
                                    <p className="text-gray-500 mb-4">Add questions to create your exam</p>
                                    <button
                                        onClick={() => addQuestion('multiple_choice')}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mx-auto"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add First Question
                                    </button>
                                </div>
                            ) : (
                                questions.map((question, qIndex) => (
                                    <div key={question._id} className="bg-white rounded-xl shadow-lg p-6">
                                        {/* Question Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => moveQuestion(qIndex, qIndex - 1)}
                                                    disabled={qIndex === 0}
                                                    className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                                                >
                                                    <ChevronUp className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => moveQuestion(qIndex, qIndex + 1)}
                                                    disabled={qIndex === questions.length - 1}
                                                    className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                                    Q{qIndex + 1}
                                                </span>
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm capitalize">
                                                    {question.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => removeQuestion(qIndex)}
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Question Text */}
                                        <div className="mb-4">
                                            <textarea
                                                value={question.question}
                                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                rows="2"
                                                placeholder="Enter your question..."
                                            />
                                        </div>

                                        {/* Marks */}
                                        <div className="mb-4 flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Marks:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={question.marks}
                                                onChange={(e) => updateQuestion(qIndex, 'marks', parseInt(e.target.value) || 1)}
                                                className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-center"
                                            />
                                        </div>

                                        {/* Options for MCQ/True-False */}
                                        {(question.type === 'multiple_choice' || question.type === 'true_false') && (
                                            <div className="space-y-2">
                                                {question.options.map((option, oIndex) => (
                                                    <div key={option._id} className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setCorrectAnswer(qIndex, oIndex)}
                                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                                option.isCorrect
                                                                    ? 'border-green-500 bg-green-500 text-white'
                                                                    : 'border-gray-300 hover:border-green-400'
                                                            }`}
                                                        >
                                                            {option.isCorrect && <Check className="w-4 h-4" />}
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={option.text}
                                                            onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                            placeholder={`Option ${oIndex + 1}`}
                                                        />
                                                        {question.type === 'multiple_choice' && question.options.length > 2 && (
                                                            <button
                                                                onClick={() => removeOption(qIndex, oIndex)}
                                                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                {question.type === 'multiple_choice' && (
                                                    <button
                                                        onClick={() => addOption(qIndex)}
                                                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm mt-2"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Option
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Short Answer */}
                                        {question.type === 'short_answer' && (
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Correct Answer:</label>
                                                <input
                                                    type="text"
                                                    value={question.correctAnswer}
                                                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Enter correct answer"
                                                />
                                            </div>
                                        )}

                                        {/* Essay */}
                                        {question.type === 'essay' && (
                                            <div className="bg-gray-100 rounded-lg p-4 text-center">
                                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-500">Essay question - Students will write their answer in a text area</p>
                                            </div>
                                        )}

                                        {/* File Upload */}
                                        {question.type === 'file_upload' && (
                                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                                <p className="text-gray-500">File upload question - Students will upload a PDF file (max 10MB)</p>
                                            </div>
                                        )}

                                        {/* Explanation */}
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <input
                                                type="text"
                                                value={question.explanation}
                                                onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                                placeholder="Explanation (optional, shown after exam)"
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add More Questions */}
                        {questions.length > 0 && (
                            <div className="mt-6">
                                <div className="flex flex-wrap gap-2">
                                    {questionTypes.map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => addQuestion(type.value)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Modal */}
                {previewMode && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Exam Preview</h2>
                                <button onClick={() => setPreviewMode(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold">{examData.title || 'Untitled Exam'}</h3>
                                    <p className="text-gray-600">{examData.description}</p>
                                    <div className="flex gap-4 mt-4 text-sm text-gray-500">
                                        <span>Duration: {formatDuration()}</span>
                                        <span>Questions: {questions.length}</span>
                                        <span>Total Marks: {totalMarks}</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {questions.map((q, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                                            <p className="font-bold mb-2">
                                                {i + 1}. {q.question || 'Untitled Question'}
                                                <span className="ml-2 text-sm text-gray-500">({q.marks} marks)</span>
                                            </p>
                                            {(q.type === 'multiple_choice' || q.type === 'true_false') && (
                                                <div className="space-y-2 ml-4">
                                                    {q.options.map((opt, j) => (
                                                        <div key={j} className="flex items-center gap-2">
                                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                                opt.isCorrect ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                                            }`} />
                                                            <span>{opt.text || `Option ${j + 1}`}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateExam;

