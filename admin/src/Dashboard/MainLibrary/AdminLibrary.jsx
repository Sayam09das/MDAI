import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BookOpen,
    FileText,
    Video,
    Image,
    File,
    Download,
    Eye,
    Trash2,
    Edit,
    Search,
    Filter,
    ArrowLeft,
    Folder,
    Clock,
    Share2,
    Grid,
    List,
    X,
    User,
    Mail,
    FileArchive,
    Plus,
    Upload,
    Pencil,
    Save,
    XCircle,
} from 'lucide-react';
import {
    getAllResourcesAdmin,
    updateResourceAdmin,
    deleteResourceAdmin,
} from '../../../../client/src/lib/resourceApi';

const AdminLibrary = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterUploader, setFilterUploader] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedResource, setSelectedResource] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        courseTitle: '',
        fileType: 'other',
        driveLink: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch all resources on mount
    useEffect(() => {
        fetchResources();
    }, [filterType, filterUploader]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const data = await getAllResourcesAdmin({
                fileType: filterType,
                uploadedBy: filterUploader,
                search: searchQuery,
            });
            setResources(data);
        } catch (error) {
            toast.error('Failed to load resources');
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== undefined) {
                fetchResources();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filter resources
    const filteredResources = resources.filter((resource) => {
        const matchSearch =
            resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSearch;
    });

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText className="text-red-600" size={32} />;
            case 'video': return <Video className="text-blue-600" size={32} />;
            case 'image': return <Image className="text-green-600" size={32} />;
            case 'zip': return <FileArchive className="text-yellow-600" size={32} />;
            default: return <File className="text-gray-600" size={32} />;
        }
    };

    const getFileColor = (type) => {
        switch (type) {
            case 'pdf': return 'from-red-500 to-rose-500';
            case 'video': return 'from-blue-500 to-cyan-500';
            case 'image': return 'from-green-500 to-emerald-500';
            case 'zip': return 'from-yellow-500 to-orange-500';
            default: return 'from-gray-500 to-slate-500';
        }
    };

    const handleDownload = (resource) => {
        if (resource.driveLink) {
            window.open(resource.driveLink, '_blank');
        } else if (resource.file?.url) {
            const link = document.createElement('a');
            link.href = resource.file.url;
            link.download = resource.title || 'download';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        toast.success(`📥 Downloading ${resource.title}...`, {
            position: 'bottom-right',
            autoClose: 2000,
        });
    };

    const handleDelete = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteResourceAdmin(resourceId);
            toast.success('🗑️ Resource deleted successfully');
            fetchResources();
        } catch (error) {
            toast.error('Failed to delete resource');
            console.error('Error deleting resource:', error);
        }
    };

    const handleEditClick = (resource) => {
        setEditingResource(resource);
        setEditForm({
            title: resource.title || '',
            description: resource.description || '',
            courseTitle: resource.courseTitle || '',
            fileType: resource.fileType || 'other',
            driveLink: resource.driveLink || '',
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await updateResourceAdmin(editingResource._id, editForm);
            toast.success('✏️ Resource updated successfully');
            setShowEditModal(false);
            fetchResources();
        } catch (error) {
            toast.error('Failed to update resource');
            console.error('Error updating resource:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePreview = (resource) => {
        setSelectedResource(resource);
        setShowPreviewModal(true);
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (date) => {
        if (!date) return 'Unknown';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-gray-200"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    <BookOpen className="text-gray-700 flex-shrink-0" size={28} />
                                    <span className="truncate">Library Management</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Manage all resources (Teachers & Admin uploads)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    {[
                        { icon: BookOpen, label: 'Total Resources', value: resources.length, color: 'from-gray-500 to-gray-700' },
                        { icon: User, label: 'Teacher Uploads', value: resources.filter(r => r.uploadedBy === 'teacher').length, color: 'from-blue-500 to-indigo-600' },
                        { icon: FileText, label: 'PDFs', value: resources.filter(r => r.fileType === 'pdf').length, color: 'from-red-500 to-rose-500' },
                        { icon: Video, label: 'Videos', value: resources.filter(r => r.fileType === 'video').length, color: 'from-purple-500 to-violet-600' },
                        { icon: Folder, label: 'Other', value: resources.filter(r => !['pdf', 'video'].includes(r.fileType)).length, color: 'from-green-500 to-emerald-500' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                        >
                            <div className={`bg-gradient-to-r ${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3`}>
                                <stat.icon className="text-white" size={20} />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search resources..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 sm:py-3 focus:border-gray-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* File Type Filter */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="all">All Types</option>
                                <option value="pdf">PDF</option>
                                <option value="video">Video</option>
                                <option value="image">Image</option>
                                <option value="zip">ZIP</option>
                                <option value="document">Document</option>
                            </select>

                            {/* Uploader Filter */}
                            <select
                                value={filterUploader}
                                onChange={(e) => setFilterUploader(e.target.value)}
                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="all">All Uploaders</option>
                                <option value="teacher">Teachers</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100'}`}
                            >
                                <Grid size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100'}`}
                            >
                                <List size={20} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
                    </div>
                )}

                {/* Resources Grid/List */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={viewMode === 'grid'
                            ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                            : 'space-y-3 sm:space-y-4'
                        }
                    >
                        <AnimatePresence>
                            {filteredResources.map((resource, idx) => (
                                <motion.div
                                    key={resource._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                                >
                                    {viewMode === 'grid' ? (
                                        <>
                                            <div className="relative h-40 bg-gray-200">
                                                {resource.thumbnail?.url ? (
                                                    <img
                                                        src={resource.thumbnail.url}
                                                        alt={resource.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                        {getFileIcon(resource.fileType)}
                                                    </div>
                                                )}
                                                <div className={`absolute inset-0 bg-gradient-to-r ${getFileColor(resource.fileType)} opacity-20`}></div>
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getFileColor(resource.fileType)}`}>
                                                        {resource.fileType?.toUpperCase()}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${resource.uploadedBy === 'teacher' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                                        {resource.uploadedBy?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-5">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className={`bg-gradient-to-r ${getFileColor(resource.fileType)} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                                        {getFileIcon(resource.fileType)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-base mb-1 line-clamp-2">{resource.title}</h3>
                                                        <p className="text-sm text-gray-600 line-clamp-1">{resource.courseTitle}</p>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {resource.description}
                                                </p>

                                                {/* Uploader Info */}
                                                <div className={`rounded-lg p-2 mb-3 ${resource.uploadedBy === 'teacher' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                                                    <div className="flex items-center gap-2">
                                                        {resource.uploadedBy === 'teacher' ? (
                                                            resource.teacherProfileImage?.url ? (
                                                                <img
                                                                    src={resource.teacherProfileImage.url}
                                                                    alt={resource.teacherName}
                                                                    className="w-6 h-6 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
                                                                    <User size={14} className="text-blue-600" />
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center">
                                                                <User size={14} className="text-purple-600" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium truncate">
                                                                {resource.uploadedBy === 'teacher' ? resource.teacherName : resource.adminName}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {resource.uploadedBy === 'teacher' ? resource.teacherEmail : resource.adminEmail}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(resource.createdAt)}
                                                    </span>
                                                    <span>{formatFileSize(resource.file?.size)}</span>
                                                </div>

                                                {/* Admin Actions */}
                                                <div className="grid grid-cols-4 gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handlePreview(resource)}
                                                        className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 rounded-lg"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDownload(resource)}
                                                        className="flex items-center justify-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-lg"
                                                        title="Download"
                                                    >
                                                        <Download size={14} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleEditClick(resource)}
                                                        className="flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 py-2 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDelete(resource._id)}
                                                        className="flex items-center justify-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 rounded-lg"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-4 sm:p-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`bg-gradient-to-r ${getFileColor(resource.fileType)} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                                    {getFileIcon(resource.fileType)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-base sm:text-lg mb-1">{resource.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-1">{resource.courseTitle}</p>
                                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                                        <span className={`px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${getFileColor(resource.fileType)}`}>
                                                            {resource.fileType?.toUpperCase()}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-full text-white ${resource.uploadedBy === 'teacher' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                                            {resource.uploadedBy?.toUpperCase()}
                                                        </span>
                                                        <span>{formatFileSize(resource.file?.size)}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} /> {formatDate(resource.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <User size={12} /> {resource.uploadedBy === 'teacher' ? resource.teacherName : resource.adminName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handlePreview(resource)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <Eye size={18} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDownload(resource)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <Download size={18} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEditClick(resource)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-yellow-600"
                                                    >
                                                        <Edit size={18} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(resource._id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                                                    >
                                                        <Trash2 size={18} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && filteredResources.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-600 mb-2">No resources found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreviewModal && selectedResource && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPreviewModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
                            >
                                <div className={`bg-gradient-to-r ${getFileColor(selectedResource.fileType)} p-6 rounded-t-2xl text-white`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center">
                                                {getFileIcon(selectedResource.fileType)}
                                            </div>
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-bold mb-1">{selectedResource.title}</h2>
                                                <p className="text-sm opacity-90">{selectedResource.courseTitle}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowPreviewModal(false)}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Preview Image/Thumbnail */}
                                    {selectedResource.thumbnail?.url && (
                                        <div className="bg-gray-100 rounded-xl h-64 mb-6 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={selectedResource.thumbnail.url}
                                                alt={selectedResource.title}
                                                className="max-h-full max-w-full rounded-lg object-contain"
                                            />
                                        </div>
                                    )}

                                    <p className="text-gray-700 mb-6">{selectedResource.description}</p>

                                    {/* Uploader Info */}
                                    <div className={`rounded-xl p-4 mb-6 ${selectedResource.uploadedBy === 'teacher' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                                        <p className="text-sm font-medium mb-2">
                                            {selectedResource.uploadedBy === 'teacher' ? 'Uploaded by Teacher' : 'Uploaded by Admin'}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {selectedResource.uploadedBy === 'teacher' ? (
                                                selectedResource.teacherProfileImage?.url ? (
                                                    <img
                                                        src={selectedResource.teacherProfileImage.url}
                                                        alt={selectedResource.teacherName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                                                        <User size={20} className="text-blue-600" />
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                                    <User size={20} className="text-purple-600" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {selectedResource.uploadedBy === 'teacher' ? selectedResource.teacherName : selectedResource.adminName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedResource.uploadedBy === 'teacher' ? selectedResource.teacherEmail : selectedResource.adminEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-600 mb-1">File Type</p>
                                            <p className="font-bold capitalize">{selectedResource.fileType}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-600 mb-1">Size</p>
                                            <p className="font-bold">{formatFileSize(selectedResource.file?.size)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-600 mb-1">Uploaded Date</p>
                                            <p className="font-bold">{formatDate(selectedResource.createdAt)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-600 mb-1">Uploaded By</p>
                                            <p className="font-bold capitalize">{selectedResource.uploadedBy}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleDownload(selectedResource)}
                                            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                        >
                                            <Download size={18} /> Download
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && editingResource && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8"
                            >
                                <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-t-2xl text-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
                                                <Pencil size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold">Edit Resource</h2>
                                                <p className="text-sm opacity-90">Update resource details</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleEditSubmit} className="p-6">
                                    <div className="space-y-4">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition-colors"
                                                required
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description *
                                            </label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                rows="3"
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition-colors"
                                                required
                                            />
                                        </div>

                                        {/* Course Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Course Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.courseTitle}
                                                onChange={(e) => setEditForm({ ...editForm, courseTitle: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition-colors"
                                                required
                                            />
                                        </div>

                                        {/* File Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                File Type
                                            </label>
                                            <select
                                                value={editForm.fileType}
                                                onChange={(e) => setEditForm({ ...editForm, fileType: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
                                            >
                                                <option value="pdf">PDF</option>
                                                <option value="video">Video</option>
                                                <option value="image">Image</option>
                                                <option value="zip">ZIP</option>
                                                <option value="document">Document</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        {/* Drive Link */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Drive Link (Optional)
                                            </label>
                                            <input
                                                type="url"
                                                value={editForm.driveLink}
                                                onChange={(e) => setEditForm({ ...editForm, driveLink: e.target.value })}
                                                placeholder="https://drive.google.com/..."
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            type="submit"
                                            disabled={submitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} /> Save Changes
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLibrary;

