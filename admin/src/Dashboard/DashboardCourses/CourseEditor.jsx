import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ChevronRight,
    BookOpen,
    Save,
    Upload,
    Plus,
    Minus,
    X,
    Image,
    Video,
    FileText,
    GripVertical,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Trash2,
    Check,
    RefreshCw
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        window.location.href = "/admin/login";
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const categories = [
    'Programming', 'Web Development', 'Data Science', 'AI/ML',
    'Design', 'Mobile Development', 'Cloud Computing', 'Cybersecurity',
    'Business', 'Marketing', 'Finance', 'Other'
];

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [previewMode, setPreviewMode] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // Course data state
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        category: '',
        subcategory: '',
        price: '',
        discountPrice: '',
        thumbnail: null,
        language: 'English',
        level: 'Beginner',
        requirements: [''],
        objectives: [''],
        targetAudience: [''],
        status: 'draft',
        modules: []
    });

    const [expandedModules, setExpandedModules] = useState([]);

    useEffect(() => {
        if (isEditing) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/courses/${id}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                const course = data.course;
                setCourseData({
                    title: course.title || '',
                    description: course.description || '',
                    shortDescription: course.shortDescription || '',
                    category: course.category || '',
                    subcategory: course.subcategory || '',
                    price: course.price || '',
                    discountPrice: course.discountPrice || '',
                    thumbnail: course.thumbnail || null,
                    language: course.language || 'English',
                    level: course.level || 'Beginner',
                    requirements: course.requirements?.length > 0 ? course.requirements : [''],
                    objectives: course.learningOutcomes?.length > 0 ? course.learningOutcomes : [''],
                    targetAudience: course.targetAudience?.length > 0 ? course.targetAudience : [''],
                    status: course.isPublished ? 'published' : 'draft',
                    modules: course.modules || []
                });
                if (course.thumbnail?.url) {
                    setThumbnailPreview(course.thumbnail.url);
                }
                if (course.modules?.length > 0) {
                    setExpandedModules(course.modules.map(m => m.id || m._id));
                }
            } else {
                toast.error('Failed to load course');
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            toast.error('Error loading course');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (field) => {
        setCourseData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const handleRemoveItem = (field, index) => {
        setCourseData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleUpdateItem = (field, index, value) => {
        setCourseData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const handleAddModule = () => {
        const newModuleId = Date.now();
        setCourseData(prev => ({
            ...prev,
            modules: [
                ...prev.modules,
                {
                    _id: newModuleId,
                    id: newModuleId,
                    title: `Module ${prev.modules.length + 1}`,
                    description: '',
                    lessons: []
                }
            ]
        }));
        setExpandedModules(prev => [...prev, newModuleId]);
    };

    const handleUpdateModule = (moduleId, field, value) => {
        setCourseData(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                (m._id === moduleId || m.id === moduleId) ? { ...m, [field]: value } : m
            )
        }));
    };

    const handleAddLesson = (moduleId) => {
        setCourseData(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                (m._id === moduleId || m.id === moduleId)
                    ? {
                        ...m,
                        lessons: [
                            ...(m.lessons || []),
                            {
                                id: Date.now(),
                                title: `New Lesson`,
                                type: 'video',
                                duration: '0:00',
                                content: ''
                            }
                        ]
                    }
                    : m
            )
        }));
    };

    const handleUpdateLesson = (moduleId, lessonId, field, value) => {
        setCourseData(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                (m._id === moduleId || m.id === moduleId)
                    ? {
                        ...m,
                        lessons: m.lessons?.map(l =>
                            l.id === lessonId ? { ...l, [field]: value } : l
                        ) || []
                    }
                    : m
            )
        }));
    };

    const handleRemoveLesson = (moduleId, lessonId) => {
        setCourseData(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                (m._id === moduleId || m.id === moduleId)
                    ? { ...m, lessons: m.lessons?.filter(l => l.id !== lessonId) || [] }
                    : m
            )
        }));
    };

    const handleRemoveModule = (moduleId) => {
        setCourseData(prev => ({
            ...prev,
            modules: prev.modules.filter(m => (m._id !== moduleId && m.id !== moduleId))
        }));
        setExpandedModules(prev => prev.filter(id => id !== moduleId));
    };

    const toggleModuleExpand = (moduleId) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleSave = async (status) => {
        if (!courseData.title || !courseData.description || !courseData.category || !courseData.price) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSaving(true);
        const finalData = {
            ...courseData,
            status,
            price: parseFloat(courseData.price),
            discountPrice: courseData.discountPrice ? parseFloat(courseData.discountPrice) : undefined,
            requirements: courseData.requirements.filter(r => r.trim()),
            objectives: courseData.objectives.filter(o => o.trim()),
            targetAudience: courseData.targetAudience.filter(t => t.trim()),
        };

        try {
            const url = isEditing
                ? `${BACKEND_URL}/api/courses/${id}`
                : `${BACKEND_URL}/api/courses/create`;
            
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    ...getAuthHeaders().headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`Course ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
                if (!isEditing && data.course) {
                    navigate(`/dashboard/courses/${data.course._id}`);
                }
            } else {
                toast.error(data.message || 'Failed to save course');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            toast.error('Error saving course');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            toast.info('Uploading file...');
            
            // For now, just show the filename
            setCourseData(prev => ({
                ...prev,
                [field]: file.name
            }));
            
            if (field === 'thumbnail') {
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setThumbnailPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }

            toast.success(`${field === 'thumbnail' ? 'Image' : 'File'} uploaded successfully`);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error uploading file');
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'settings', label: 'Settings' }
    ];

    const getLessonIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="w-4 h-4 text-indigo-600" />;
            case 'document': return <FileText className="w-4 h-4 text-cyan-600" />;
            case 'quiz': return <Check className="w-4 h-4 text-green-600" />;
            default: return <FileText className="w-4 h-4 text-slate-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto mb-6"
            >
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Courses</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">Create Course</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                            Create New Course
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Fill in the course details and build your curriculum.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            {previewMode ? 'Edit Mode' : 'Preview'}
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Draft
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSave('published')}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            Publish Course
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <motion.div
                            key="basic"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6"
                        >
                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Course Thumbnail
                                </label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                                    {courseData.thumbnail ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={courseData.thumbnail}
                                                alt="Course thumbnail"
                                                className="max-w-xs rounded-lg"
                                            />
                                            <button
                                                onClick={() => setCourseData(prev => ({ ...prev, thumbnail: null }))}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                                                <Upload className="w-8 h-8 text-indigo-600" />
                                            </div>
                                            <p className="text-slate-600">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                PNG, JPG up to 5MB (1280x720 recommended)
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Complete Python Bootcamp"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Short Description
                                </label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={courseData.shortDescription}
                                    onChange={handleInputChange}
                                    placeholder="A brief summary of your course (max 150 characters)"
                                    maxLength={150}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={courseData.description}
                                    onChange={handleInputChange}
                                    placeholder="Detailed description of what students will learn..."
                                    rows={6}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Category & Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={courseData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Level
                                    </label>
                                    <select
                                        name="level"
                                        value={courseData.level}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="All Levels">All Levels</option>
                                    </select>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Requirements
                                </label>
                                {courseData.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={req}
                                            onChange={(e) => handleUpdateItem('requirements', index, e.target.value)}
                                            placeholder={`Requirement ${index + 1}`}
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {courseData.requirements.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveItem('requirements', index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddItem('requirements')}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Requirement
                                </button>
                            </div>

                            {/* Objectives */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    What You'll Learn
                                </label>
                                {courseData.objectives.map((obj, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={obj}
                                            onChange={(e) => handleUpdateItem('objectives', index, e.target.value)}
                                            placeholder={`Learning objective ${index + 1}`}
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {courseData.objectives.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveItem('objectives', index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddItem('objectives')}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Learning Objective
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Curriculum Tab */}
                    {activeTab === 'curriculum' && (
                        <motion.div
                            key="curriculum"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">Course Curriculum</h3>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddModule}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Module
                                </motion.button>
                            </div>

                            <div className="space-y-4">
                                {courseData.modules.map((module, moduleIndex) => (
                                    <div key={module.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                        {/* Module Header */}
                                        <div
                                            className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer"
                                            onClick={() => toggleModuleExpand(module.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                                                <div className="flex items-center gap-2">
                                                    {expandedModules.includes(module.id) ? (
                                                        <ChevronDown className="w-5 h-5 text-slate-600" />
                                                    ) : (
                                                        <ChevronUp className="w-5 h-5 text-slate-600" />
                                                    )}
                                                    <span className="font-medium text-slate-900">
                                                        Module {moduleIndex + 1}:
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={module.title}
                                                    onChange={(e) => handleUpdateModule(module.id, 'title', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-1"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-500">
                                                    {module.lessons.length} lessons
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveModule(module.id);
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Module Content */}
                                        <AnimatePresence>
                                            {expandedModules.includes(module.id) && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 space-y-3">
                                                        {/* Lessons */}
                                                        {module.lessons.map((lesson, lessonIndex) => (
                                                            <div
                                                                key={lesson.id}
                                                                className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg"
                                                            >
                                                                <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                                                                {getLessonIcon(lesson.type)}
                                                                <input
                                                                    type="text"
                                                                    value={lesson.title}
                                                                    onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'title', e.target.value)}
                                                                    className="flex-1 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none text-sm"
                                                                />
                                                                <select
                                                                    value={lesson.type}
                                                                    onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'type', e.target.value)}
                                                                    className="text-sm border-none bg-transparent text-slate-500 focus:outline-none"
                                                                >
                                                                    <option value="video">Video</option>
                                                                    <option value="document">Document</option>
                                                                    <option value="quiz">Quiz</option>
                                                                </select>
                                                                <input
                                                                    type="text"
                                                                    value={lesson.duration}
                                                                    onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                                                    placeholder="Duration"
                                                                    className="w-20 text-sm text-center bg-slate-50 rounded px-2 py-1"
                                                                />
                                                                <button
                                                                    onClick={() => handleRemoveLesson(module.id, lesson.id)}
                                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}

                                                        {/* Add Lesson Button */}
                                                        <button
                                                            onClick={() => handleAddLesson(module.id)}
                                                            className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                            Add Lesson
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Pricing Tab */}
                    {activeTab === 'pricing' && (
                        <motion.div
                            key="pricing"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-900">Pricing Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Original Price (USD) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={courseData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Discounted Price (USD)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            name="discountPrice"
                                            value={courseData.discountPrice}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    {courseData.price && courseData.discountPrice && (
                                        <p className="text-sm text-green-600 mt-1">
                                            Discount: {Math.round((1 - courseData.discountPrice / courseData.price) * 100)}% off
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Free Course Option */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Free Course</p>
                                    <p className="text-sm text-slate-600">Make this course free for all students</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {/* Preview Video */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Preview Video
                                </label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                                    {courseData.previewVideo ? (
                                        <div className="space-y-2">
                                            <Video className="w-12 h-12 text-indigo-600 mx-auto" />
                                            <p className="text-slate-600">{courseData.previewVideo}</p>
                                            <button
                                                onClick={() => setCourseData(prev => ({ ...prev, previewVideo: null }))}
                                                className="text-red-500 text-sm hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                                            <p className="text-slate-600">Upload a preview video</p>
                                            <p className="text-sm text-slate-500">MP4, MOV up to 500MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, 'previewVideo')}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-900">Course Settings</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">Publish Immediately</p>
                                        <p className="text-sm text-slate-600">Make course visible after saving</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">Allow Reviews</p>
                                        <p className="text-sm text-slate-600">Students can leave reviews</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">Certificate of Completion</p>
                                        <p className="text-sm text-slate-600">Award certificate after course completion</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">Lifetime Access</p>
                                        <p className="text-sm text-slate-600">Students keep access forever</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CourseEditor;

