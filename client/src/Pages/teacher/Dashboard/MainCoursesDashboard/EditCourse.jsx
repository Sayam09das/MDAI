import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    Upload,
    Plus,
    Minus,
    X,
    Image,
    Video,
    FileText,
    ChevronDown,
    ChevronUp,
    Trash2,
    Check,
    RefreshCw,
    BookOpen,
    Clock,
    Users,
    AlertCircle
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const categories = [
    'Programming', 'Web Development', 'Data Science', 'AI/ML',
    'Design', 'Mobile Development', 'Cloud Computing', 'Cybersecurity',
    'Business', 'Marketing', 'Finance', 'Other'
];

const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(courseId);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        duration: '',
        level: 'Beginner',
        language: 'English',
        requirements: [''],
        learningOutcomes: [''],
        thumbnail: null,
        modules: []
    });

    const [expandedModules, setExpandedModules] = useState([]);

    useEffect(() => {
        if (isEditing) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/courses/${courseId}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                const course = data.course;
                setCourseData({
                    title: course.title || '',
                    description: course.description || '',
                    price: course.price || '',
                    category: course.category || '',
                    duration: course.duration || '',
                    level: course.level || 'Beginner',
                    language: course.language || 'English',
                    requirements: course.requirements?.length > 0 ? course.requirements : [''],
                    learningOutcomes: course.learningOutcomes?.length > 0 ? course.learningOutcomes : [''],
                    thumbnail: course.thumbnail || null,
                    modules: course.modules || []
                });
                if (course.thumbnail?.url) {
                    setThumbnailPreview(course.thumbnail.url);
                }
                if (course.modules?.length > 0) {
                    setExpandedModules(course.modules.map(m => m._id || m.id));
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
        const newModuleId = Date.now().toString();
        setCourseData(prev => ({
            ...prev,
            modules: [
                ...prev.modules,
                {
                    _id: newModuleId,
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
                                _id: Date.now().toString(),
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
                            (l._id === lessonId || l.id === lessonId) ? { ...l, [field]: value } : l
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
                    ? { ...m, lessons: m.lessons?.filter(l => (l._id !== lessonId && l.id !== lessonId)) || [] }
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

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setCourseData(prev => ({
            ...prev,
            [field]: file
        }));

        if (field === 'thumbnail') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }

        toast.success('File selected');
    };

    const handleSave = async (status) => {
        if (!courseData.title || !courseData.description || !courseData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSaving(true);

        try {
            let thumbnailData = courseData.thumbnail;
            
            // If thumbnail is a file, upload it
            if (courseData.thumbnail && courseData.thumbnail instanceof File) {
                const formData = new FormData();
                formData.append('file', courseData.thumbnail);
                
                const uploadRes = await fetch(`${BACKEND_URL}/api/courses/upload-thumbnail`, {
                    method: 'POST',
                    headers: getAuthHeaders().headers,
                    body: formData
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    thumbnailData = uploadData;
                }
            }

            const finalData = {
                ...courseData,
                price: parseFloat(courseData.price) || 0,
                requirements: courseData.requirements.filter(r => r.trim()),
                learningOutcomes: courseData.learningOutcomes.filter(o => o.trim()),
                thumbnail: thumbnailData,
            };

            delete finalData.modules;

            const url = `${BACKEND_URL}/api/courses/${courseId}`;
            
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders().headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Course updated successfully!');
                navigate('/teacher-dashboard/mycourse');
            } else {
                toast.error(data.message || 'Failed to update course');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            toast.error('Error saving course');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'pricing', label: 'Pricing' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <ToastContainer />
            
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto mb-6"
            >
                <button
                    onClick={() => navigate('/teacher-dashboard/mycourse')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to My Courses
                </button>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                            Edit Course
                        </h1>
                        <p className="text-gray-600 mt-1">Update your course details and curriculum</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 inline-flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
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
                            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                        >
                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Thumbnail
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
                                    {thumbnailPreview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Course thumbnail"
                                                className="max-w-xs rounded-lg mx-auto"
                                            />
                                            <button
                                                onClick={() => {
                                                    setCourseData(prev => ({ ...prev, thumbnail: null }));
                                                    setThumbnailPreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Image className="w-10 h-10 text-gray-400 mx-auto" />
                                            <p className="text-gray-600">Click to upload thumbnail</p>
                                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Complete Python Bootcamp"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={courseData.description}
                                    onChange={handleInputChange}
                                    placeholder="Detailed description of your course..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            {/* Category & Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={courseData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Level
                                    </label>
                                    <select
                                        name="level"
                                        value={courseData.level}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="All Levels">All Levels</option>
                                    </select>
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (e.g., "10 hours")
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={courseData.duration}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 10 hours"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requirements
                                </label>
                                {courseData.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={req}
                                            onChange={(e) => handleUpdateItem('requirements', index, e.target.value)}
                                            placeholder={`Requirement ${index + 1}`}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Requirement
                                </button>
                            </div>

                            {/* Learning Outcomes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    What You'll Learn
                                </label>
                                {courseData.learningOutcomes.map((outcome, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={outcome}
                                            onChange={(e) => handleUpdateItem('learningOutcomes', index, e.target.value)}
                                            placeholder={`Learning outcome ${index + 1}`}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                        {courseData.learningOutcomes.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveItem('learningOutcomes', index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddItem('learningOutcomes')}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Learning Outcome
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
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Course Curriculum</h3>
                                <button
                                    onClick={handleAddModule}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Module
                                </button>
                            </div>

                            <div className="space-y-4">
                                {courseData.modules.map((module, moduleIndex) => (
                                    <div key={module._id} className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div
                                            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                                            onClick={() => toggleModuleExpand(module._id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {expandedModules.includes(module._id) ? (
                                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                                ) : (
                                                    <ChevronUp className="w-5 h-5 text-gray-600" />
                                                )}
                                                <span className="font-medium text-gray-900">
                                                    Module {moduleIndex + 1}:
                                                </span>
                                                <input
                                                    type="text"
                                                    value={module.title}
                                                    onChange={(e) => handleUpdateModule(module._id, 'title', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none px-1"
                                                />
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveModule(module._id);
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {expandedModules.includes(module._id) && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 space-y-3">
                                                        {module.lessons?.map((lesson, lessonIndex) => (
                                                            <div
                                                                key={lesson._id}
                                                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                                                            >
                                                                <Video className="w-5 h-5 text-indigo-600" />
                                                                <input
                                                                    type="text"
                                                                    value={lesson.title}
                                                                    onChange={(e) => handleUpdateLesson(module._id, lesson._id, 'title', e.target.value)}
                                                                    className="flex-1 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none text-sm"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={lesson.duration}
                                                                    onChange={(e) => handleUpdateLesson(module._id, lesson._id, 'duration', e.target.value)}
                                                                    placeholder="Duration"
                                                                    className="w-20 text-sm text-center bg-gray-50 rounded px-2 py-1"
                                                                />
                                                                <button
                                                                    onClick={() => handleRemoveLesson(module._id, lesson._id)}
                                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}

                                                        <button
                                                            onClick={() => handleAddLesson(module._id)}
                                                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
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
                            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-800">Pricing Settings</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (USD) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={courseData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-800">Pricing Information</p>
                                        <p className="text-sm text-blue-600 mt-1">
                                            You will receive 90% of the course price. The platform takes 10% commission.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EditCourse;

