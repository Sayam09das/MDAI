import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save,
    Eye,
    Upload,
    Calendar,
    BookOpen,
    FileText,
    X,
    Check,
    AlertCircle,
    Trash2,
    Plus,
    Clock
} from 'lucide-react';
import { createExam, uploadQuestionPaper } from '../../../../lib/api/examApi';
import { getTeacherCourses } from '../../../../lib/api/courseApi';

const CreateExam = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Form state
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Exam data state - simplified for manual exams
    const [examData, setExamData] = useState({
        title: '',
        description: '',
        course: '',
        totalMarks: 100,
        passingMarks: 40,
        dueDate: '',
        instructions: '',
        allowLateSubmission: false,
        latePenaltyPercentage: 10,
        maxAnswerFileSize: 10,
        allowedAnswerFileTypes: ['application/pdf']
    });

    // Question paper file
    const [questionPaper, setQuestionPaper] = useState(null);
    const [questionPaperPreview, setQuestionPaperPreview] = useState(null);

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

    // Handle input changes
    const handleChange = (field, value) => {
        setExamData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle file selection
    const handleQuestionPaperChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                setError('Question paper must be a PDF file');
                return;
            }
            
            // Validate file size (max 20MB)
            if (file.size > 20 * 1024 * 1024) {
                setError('Question paper file size must be less than 20MB');
                return;
            }

            setQuestionPaper(file);
            setQuestionPaperPreview({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2)
            });
            setError(null);
        }
    };

    // Remove question paper
    const removeQuestionPaper = () => {
        setQuestionPaper(null);
        setQuestionPaperPreview(null);
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
        if (examData.totalMarks <= 0) {
            setError('Total marks must be greater than 0');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Create exam first
            const payload = {
                title: examData.title,
                description: examData.description,
                course: examData.course,
                totalMarks: parseInt(examData.totalMarks) || 100,
                passingMarks: parseInt(examData.passingMarks) || 0,
                dueDate: examData.dueDate || null,
                instructions: examData.instructions,
                allowLateSubmission: examData.allowLateSubmission,
                latePenaltyPercentage: parseInt(examData.latePenaltyPercentage) || 0,
                maxAnswerFileSize: parseInt(examData.maxAnswerFileSize) || 10,
                allowedAnswerFileTypes: examData.allowedAnswerFileTypes,
                isPublished: publish
            };

            const response = await createExam(payload);

            if (response.success) {
                const examId = response.exam._id || response.exam.id;

                // Upload question paper if provided
                if (questionPaper) {
                    setUploading(true);
                    try {
                        await uploadQuestionPaper(examId, questionPaper);
                    } catch (uploadError) {
                        console.error('Question paper upload failed:', uploadError);
                        // Continue even if upload fails
                    }
                    setUploading(false);
                }

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

    // Helper to get default due date (7 days from now)
    const getDefaultDueDate = () => {
        const now = new Date();
        now.setDate(now.getDate() + 7);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Create New Exam</h1>
                            <p className="text-gray-600 mt-1">Set up a manual evaluation exam for students</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleSave(false)}
                                disabled={saving || uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSave(true)}
                                disabled={saving || uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving || uploading ? (
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

                {/* Main Form */}
                <div className="space-y-6">
                    {/* Basic Information Card */}
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
                                onChange={(e) => handleChange('title', e.target.value)}
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
                                onChange={(e) => handleChange('description', e.target.value)}
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
                                onChange={(e) => handleChange('course', e.target.value)}
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
                    </div>

                    {/* Marks & Deadline Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-indigo-600" />
                            Marks & Deadline
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Total Marks */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Marks *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={examData.totalMarks}
                                    onChange={(e) => handleChange('totalMarks', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter total marks"
                                />
                            </div>

                            {/* Passing Marks */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Passing Marks (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={examData.passingMarks}
                                    onChange={(e) => handleChange('passingMarks', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter passing percentage"
                                />
                            </div>

                            {/* Due Date */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Due Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={examData.dueDate}
                                    onChange={(e) => handleChange('dueDate', e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Leave empty for no deadline
                                </p>
                            </div>

                            {/* Max File Size */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Answer File Size (MB)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={examData.maxAnswerFileSize}
                                    onChange={(e) => handleChange('maxAnswerFileSize', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Instructions for Students
                            </label>
                            <textarea
                                value={examData.instructions}
                                onChange={(e) => handleChange('instructions', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows="4"
                                placeholder="Enter instructions for students (e.g., write clearly, show all workings, etc.)"
                            />
                        </div>

                        {/* Late Submission */}
                        <div className="border-t border-gray-200 pt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={examData.allowLateSubmission}
                                    onChange={(e) => handleChange('allowLateSubmission', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Allow late submissions</span>
                            </label>

                            {examData.allowLateSubmission && (
                                <div className="mt-3 ml-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Late Penalty (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={examData.latePenaltyPercentage}
                                        onChange={(e) => handleChange('latePenaltyPercentage', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Percentage deduction for late submissions"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Question Paper Upload */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-indigo-600" />
                            Question Paper (Optional)
                        </h2>

                        <p className="text-gray-600 text-sm mb-4">
                            Upload a PDF containing the question paper. Students will be able to download it.
                        </p>

                        {!questionPaperPreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleQuestionPaperChange}
                                    className="hidden"
                                    id="question-paper-upload"
                                />
                                <label
                                    htmlFor="question-paper-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-12 h-12 text-indigo-400 mb-3" />
                                    <p className="text-lg font-medium text-gray-700 mb-1">
                                        Click to upload Question Paper
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        PDF only, max 20MB
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-green-600" />
                                        <div>
                                            <p className="font-medium text-gray-800">{questionPaperPreview.name}</p>
                                            <p className="text-sm text-gray-500">{questionPaperPreview.size} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeQuestionPaper}
                                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Allowed File Types */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-indigo-600" />
                            Allowed Answer File Types
                        </h2>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={examData.allowedAnswerFileTypes.includes('application/pdf')}
                                    onChange={(e) => {
                                        const types = [...examData.allowedAnswerFileTypes];
                                        if (e.target.checked) {
                                            types.push('application/pdf');
                                        } else {
                                            const index = types.indexOf('application/pdf');
                                            if (index > -1) types.splice(index, 1);
                                        }
                                        handleChange('allowedAnswerFileTypes', types);
                                    }}
                                    className="w-4 h-4 text-indigo-600 rounded"
                                />
                                <span className="text-sm text-gray-700">PDF (.pdf)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={examData.allowedAnswerFileTypes.includes('application/msword')}
                                    onChange={(e) => {
                                        const types = [...examData.allowedAnswerFileTypes];
                                        if (e.target.checked) {
                                            types.push('application/msword');
                                            types.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                                        } else {
                                            const idx1 = types.indexOf('application/msword');
                                            if (idx1 > -1) types.splice(idx1, 1);
                                            const idx2 = types.indexOf('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                                            if (idx2 > -1) types.splice(idx2, 1);
                                        }
                                        handleChange('allowedAnswerFileTypes', types);
                                    }}
                                    className="w-4 h-4 text-indigo-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Word Document (.doc, .docx)</span>
                            </label>
                        </div>

                        {examData.allowedAnswerFileTypes.length === 0 && (
                            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-yellow-700 text-sm">
                                    ⚠️ Please select at least one file type
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExam;

