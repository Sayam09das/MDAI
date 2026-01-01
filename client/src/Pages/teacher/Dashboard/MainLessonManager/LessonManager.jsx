import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Plus,
    X,
    Save,
    Youtube,
    FileText,
    Video,
    Calendar,
    Clock,
    Trash2,
    Edit2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const LessonManager = () => {
    const [lessons, setLessons] = useState([
        {
            id: 1,
            title: 'Introduction to Web Development',
            youtubeLink: 'https://youtube.com/watch?v=example1',
            pdfFile: null,
            pdfName: 'intro-slides.pdf',
            meetLink: 'https://meet.google.com/abc-defg-hij',
            scheduleDate: '2024-01-15',
            scheduleTime: '10:00',
            expanded: false
        },
        {
            id: 2,
            title: 'HTML & CSS Fundamentals',
            youtubeLink: 'https://youtube.com/watch?v=example2',
            pdfFile: null,
            pdfName: 'html-css-guide.pdf',
            meetLink: 'https://meet.google.com/xyz-uvwx-rst',
            scheduleDate: '2024-01-17',
            scheduleTime: '14:30',
            expanded: false
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        youtubeLink: '',
        pdfFile: null,
        pdfName: '',
        meetLink: '',
        scheduleDate: '',
        scheduleTime: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload a PDF file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should be less than 10MB');
                return;
            }
            setFormData(prev => ({
                ...prev,
                pdfFile: file,
                pdfName: file.name
            }));
            toast.success('PDF uploaded successfully!');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            youtubeLink: '',
            pdfFile: null,
            pdfName: '',
            meetLink: '',
            scheduleDate: '',
            scheduleTime: ''
        });
        setEditingId(null);
    };

    const handleAddLesson = () => {
        if (!formData.title.trim()) {
            toast.error('Please enter a lesson title');
            return;
        }
        if (!formData.scheduleDate || !formData.scheduleTime) {
            toast.error('Please set a schedule date and time');
            return;
        }

        const newLesson = {
            id: Date.now(),
            ...formData,
            expanded: false
        };

        setLessons(prev => [...prev, newLesson]);
        toast.success('Lesson added successfully! 🎉');
        resetForm();
        setShowAddForm(false);
    };

    const handleEditLesson = (lesson) => {
        setFormData({
            title: lesson.title,
            youtubeLink: lesson.youtubeLink,
            pdfFile: lesson.pdfFile,
            pdfName: lesson.pdfName,
            meetLink: lesson.meetLink,
            scheduleDate: lesson.scheduleDate,
            scheduleTime: lesson.scheduleTime
        });
        setEditingId(lesson.id);
        setShowAddForm(true);
    };

    const handleUpdateLesson = () => {
        if (!formData.title.trim()) {
            toast.error('Please enter a lesson title');
            return;
        }

        setLessons(prev => prev.map(lesson =>
            lesson.id === editingId ? { ...lesson, ...formData } : lesson
        ));
        toast.success('Lesson updated successfully!');
        resetForm();
        setShowAddForm(false);
    };

    const handleDeleteLesson = (id) => {
        setLessons(prev => prev.filter(lesson => lesson.id !== id));
        toast.success('Lesson deleted successfully');
    };

    const toggleExpand = (id) => {
        setLessons(prev => prev.map(lesson =>
            lesson.id === id ? { ...lesson, expanded: !lesson.expanded } : lesson
        ));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
            <ToastContainer />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Lesson Management
                        </h1>
                        <p className="text-gray-600">Create and manage course lessons</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            if (showAddForm) resetForm();
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {showAddForm ? 'Cancel' : 'Add Lesson'}
                    </motion.button>
                </div>

                {/* Add/Edit Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mb-8"
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {editingId ? 'Edit Lesson' : 'Add New Lesson'}
                                </h2>

                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Edit2 className="w-4 h-4" />
                                            Lesson Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter lesson title"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* YouTube Link */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Youtube className="w-4 h-4" />
                                            YouTube Video Link
                                        </label>
                                        <input
                                            type="url"
                                            name="youtubeLink"
                                            value={formData.youtubeLink}
                                            onChange={handleInputChange}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* PDF Upload */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <FileText className="w-4 h-4" />
                                            Lesson PDF
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                                                <FileText className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-600">
                                                    {formData.pdfName || 'Choose PDF file'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            {formData.pdfName && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, pdfFile: null, pdfName: '' }))}
                                                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                >
                                                    <X className="w-5 h-5" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Google Meet Link */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Video className="w-4 h-4" />
                                            Google Meet Link
                                        </label>
                                        <input
                                            type="url"
                                            name="meetLink"
                                            value={formData.meetLink}
                                            onChange={handleInputChange}
                                            placeholder="https://meet.google.com/..."
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Schedule Date & Time */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                Schedule Date
                                            </label>
                                            <input
                                                type="date"
                                                name="scheduleDate"
                                                value={formData.scheduleDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <Clock className="w-4 h-4" />
                                                Schedule Time
                                            </label>
                                            <input
                                                type="time"
                                                name="scheduleTime"
                                                value={formData.scheduleTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={editingId ? handleUpdateLesson : handleAddLesson}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl"
                                        >
                                            <Save className="w-5 h-5" />
                                            {editingId ? 'Update Lesson' : 'Save Lesson'}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                setShowAddForm(false);
                                            }}
                                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lessons List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {lessons.map((lesson) => (
                        <motion.div
                            key={lesson.id}
                            variants={itemVariants}
                            layout
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            {/* Lesson Header */}
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {lesson.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(lesson.scheduleDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {lesson.scheduleTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleEditLesson(lesson)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleExpand(lesson.id)}
                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            {lesson.expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {lesson.expanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-6 pt-6 border-t border-gray-200 space-y-3"
                                        >
                                            {lesson.youtubeLink && (
                                                <div className="flex items-center gap-2">
                                                    <Youtube className="w-5 h-5 text-red-600" />
                                                    <a
                                                        href={lesson.youtubeLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate"
                                                    >
                                                        {lesson.youtubeLink}
                                                    </a>
                                                </div>
                                            )}
                                            {lesson.pdfName && (
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                    <span className="text-gray-700">{lesson.pdfName}</span>
                                                </div>
                                            )}
                                            {lesson.meetLink && (
                                                <div className="flex items-center gap-2">
                                                    <Video className="w-5 h-5 text-blue-600" />
                                                    <a
                                                        href={lesson.meetLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate"
                                                    >
                                                        {lesson.meetLink}
                                                    </a>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {lessons.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-xl"
                    >
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No lessons yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Click "Add Lesson" to create your first lesson
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default LessonManager;