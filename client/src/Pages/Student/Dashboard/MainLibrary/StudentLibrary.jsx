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
    Play,
    ExternalLink,
} from 'lucide-react';
import { getAllResources } from '../../../../lib/resourceApi';

const StudentLibrary = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedResource, setSelectedResource] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Fetch all resources on mount
    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const data = await getAllResources({ fileType: filterType, search: searchQuery });
            setResources(data);
        } catch (error) {
            toast.error('Failed to load resources');
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter resources
    const filteredResources = resources.filter((resource) => {
        const matchSearch =
            resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.teacherName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filterType === 'all' || resource.fileType === filterType;
        return matchSearch && matchFilter;
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

    const handlePreview = (resource) => {
        setSelectedResource(resource);
        setShowPreviewModal(true);
    };

    const handleShare = (resource) => {
        const url = resource.file?.url || resource.driveLink || '';
        navigator.clipboard.writeText(url);
        toast.success('🔗 Link copied to clipboard!', {
            position: 'top-center',
            autoClose: 2000,
        });
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-purple-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    <BookOpen className="text-purple-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Library</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Browse all learning resources
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
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    {[
                        { icon: BookOpen, label: 'Total Resources', value: resources.length, color: 'from-purple-500 to-pink-500' },
                        { icon: FileText, label: 'PDFs', value: resources.filter(r => r.fileType === 'pdf').length, color: 'from-red-500 to-rose-500' },
                        { icon: Video, label: 'Videos', value: resources.filter(r => r.fileType === 'video').length, color: 'from-blue-500 to-cyan-500' },
                        { icon: Folder, label: 'Other Files', value: resources.filter(r => !['pdf', 'video'].includes(r.fileType)).length, color: 'from-green-500 to-emerald-500' },
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
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search resources, teachers, courses..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 sm:py-3 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {['all', 'pdf', 'video', 'image', 'zip', 'document'].map((f) => (
                                <motion.button
                                    key={f}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterType(f)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg capitalize whitespace-nowrap text-xs sm:text-sm font-medium transition-all ${filterType === f
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    <Filter size={14} className="inline mr-1" />
                                    {f}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}
                            >
                                <Grid size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}
                            >
                                <List size={20} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                                                        {getFileIcon(resource.fileType)}
                                                    </div>
                                                )}
                                                <div className={`absolute inset-0 bg-gradient-to-r ${getFileColor(resource.fileType)} opacity-20`}></div>
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getFileColor(resource.fileType)}`}>
                                                        {resource.fileType?.toUpperCase()}
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

                                                {/* Teacher Info */}
                                                {resource.uploadedBy === 'teacher' && (
                                                    <div className="flex items-center gap-2 mb-3 p-2 bg-purple-50 rounded-lg">
                                                        {resource.teacherProfileImage?.url ? (
                                                            <img
                                                                src={resource.teacherProfileImage.url}
                                                                alt={resource.teacherName}
                                                                className="w-6 h-6 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center">
                                                                <User size={14} className="text-purple-600" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-purple-700 truncate">{resource.teacherName}</p>
                                                            <p className="text-xs text-purple-500 truncate">{resource.teacherEmail}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(resource.createdAt)}
                                                    </span>
                                                    <span>{formatFileSize(resource.file?.size)}</span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handlePreview(resource)}
                                                        className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 rounded-lg"
                                                    >
                                                        <Eye size={14} /> View
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDownload(resource)}
                                                        className="flex items-center justify-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-lg"
                                                    >
                                                        <Download size={14} /> Get
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleShare(resource)}
                                                        className="flex items-center justify-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 rounded-lg"
                                                    >
                                                        <Share2 size={14} />
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
                                                        <span className={`px-2 py-0.5 rounded-full ${getFileColor(resource.fileType)} text-white`}>
                                                            {resource.fileType?.toUpperCase()}
                                                        </span>
                                                        <span>{formatFileSize(resource.file?.size)}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} /> {formatDate(resource.createdAt)}
                                                        </span>
                                                        {resource.uploadedBy === 'teacher' && (
                                                            <span className="flex items-center gap-1">
                                                                <User size={12} /> {resource.teacherName}
                                                            </span>
                                                        )}
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
                                                        onClick={() => handleShare(resource)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <Share2 size={18} />
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

                                    {/* Teacher Info */}
                                    {selectedResource.uploadedBy === 'teacher' && (
                                        <div className="bg-purple-50 rounded-xl p-4 mb-6">
                                            <p className="text-sm font-medium text-purple-700 mb-2">Uploaded by</p>
                                            <div className="flex items-center gap-3">
                                                {selectedResource.teacherProfileImage?.url ? (
                                                    <img
                                                        src={selectedResource.teacherProfileImage.url}
                                                        alt={selectedResource.teacherName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                                        <User size={20} className="text-purple-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{selectedResource.teacherName}</p>
                                                    <p className="text-sm text-gray-600">{selectedResource.teacherEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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

                                    {/* Drive Link */}
                                    {selectedResource.driveLink && (
                                        <a
                                            href={selectedResource.driveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 p-4 rounded-xl mb-4 transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                            Open in Google Drive
                                        </a>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleDownload(selectedResource)}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                        >
                                            <Download size={18} /> Download
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleShare(selectedResource)}
                                            className="px-6 py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium flex items-center gap-2"
                                        >
                                            <Share2 size={18} /> Share
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentLibrary;

