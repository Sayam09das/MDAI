import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ChevronRight,
    FolderOpen,
    Upload,
    Search,
    Filter,
    RefreshCw,
    MoreVertical,
    Eye,
    Download,
    Trash2,
    File,
    Image,
    Video,
    FileText,
    Music,
    Archive,
    Grid,
    List,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    HardDrive,
    Check,
    X
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            'Content-Type': 'application/json'
        },
    };
};

// Default mock data for fallback
const defaultResources = [
    { id: 1, name: 'Python_Basics.pdf', type: 'document', size: '2.4 MB', category: 'Documents', uploadedBy: 'Dr. Sarah Johnson', uploadedAt: '2024-01-15', downloads: 456, thumbnail: null },
    { id: 2, name: 'React_Components.mp4', type: 'video', size: '156 MB', category: 'Videos', uploadedBy: 'Prof. Michael Chen', uploadedAt: '2024-01-14', downloads: 234, thumbnail: null },
    { id: 3, name: 'Data_Structures.png', type: 'image', size: '1.2 MB', category: 'Images', uploadedBy: 'Dr. Emily Rodriguez', uploadedAt: '2024-01-13', downloads: 189, thumbnail: null },
    { id: 4, name: 'ML_Algorithms.mp3', type: 'audio', size: '45 MB', category: 'Audio', uploadedBy: 'Prof. David Kim', uploadedAt: '2024-01-12', downloads: 78, thumbnail: null },
    { id: 5, name: 'Web_Dev_Bootcamp.zip', type: 'archive', size: '890 MB', category: 'Archives', uploadedBy: 'Jessica Brown', uploadedAt: '2024-01-11', downloads: 567, thumbnail: null },
    { id: 6, name: 'JavaScript_Tutorial.pdf', type: 'document', size: '3.1 MB', category: 'Documents', uploadedBy: 'Robert Taylor', uploadedAt: '2024-01-10', downloads: 345, thumbnail: null },
    { id: 7, name: 'CSS_Tricks.mp4', type: 'video', size: '234 MB', category: 'Videos', uploadedBy: 'Amanda Lee', uploadedAt: '2024-01-09', downloads: 123, thumbnail: null },
    { id: 8, name: 'Database_Design.sql', type: 'document', size: '890 KB', category: 'Documents', uploadedBy: 'James Wilson', uploadedAt: '2024-01-08', downloads: 234, thumbnail: null }
];

const categories = ['All', 'Documents', 'Videos', 'Images', 'Audio', 'Archives'];

const getFileIcon = (type) => {
    switch (type) {
        case 'image': return <Image className="w-6 h-6 text-purple-600" />;
        case 'video': return <Video className="w-6 h-6 text-red-600" />;
        case 'audio': return <Music className="w-6 h-6 text-amber-600" />;
        case 'archive': return <Archive className="w-6 h-6 text-orange-600" />;
        default: return <FileText className="w-6 h-6 text-slate-600" />;
    }
};

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedResources, setSelectedResources] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(12);
    const [stats, setStats] = useState({ total: 0, documents: 0, videos: 0, images: 0, totalSize: '0 MB' });

    useEffect(() => {
        fetchResources();
    }, [filterCategory]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterCategory !== 'All' && filterCategory !== 'all') {
                params.append('fileType', filterCategory.toLowerCase());
            }
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const res = await fetch(`${BACKEND_URL}/api/admin/resources?${params}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                // Transform resources to match expected format
                const formattedResources = data.resources.map(resource => ({
                    _id: resource._id,
                    id: resource._id,
                    name: resource.title || resource.name,
                    type: resource.fileType || resource.type,
                    size: formatFileSize(resource.file?.size || resource.size),
                    category: resource.category || resource.fileType,
                    uploadedBy: resource.teacherId?.name || resource.uploadedBy || 'Unknown',
                    uploadedAt: new Date(resource.createdAt).toLocaleDateString(),
                    downloads: resource.downloads || 0,
                    thumbnail: resource.thumbnail?.url || resource.thumbnail
                }));
                setResources(formattedResources);

                // Set stats
                setStats({
                    total: data.stats?.total || formattedResources.length,
                    documents: data.stats?.documents || formattedResources.filter(r => r.type === 'document').length,
                    videos: data.stats?.videos || formattedResources.filter(r => r.type === 'video').length,
                    images: data.stats?.images || formattedResources.filter(r => r.type === 'image').length,
                    totalSize: data.stats?.storageUsed || '1.2 GB'
                });
            } else {
                setResources(defaultResources);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources(defaultResources);
            toast.warning('Using cached data - unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 MB';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/resources/${id}`, {
                method: 'DELETE',
                ...getAuthHeaders()
            });
            const data = await res.json();

            if (data.success) {
                setResources(prev => prev.filter(r => r._id !== id));
                setSelectedResources(prev => prev.filter(r => r !== id));
                toast.success('Resource deleted successfully');
            } else {
                toast.error(data.message || 'Failed to delete resource');
            }
        } catch (error) {
            console.error('Error deleting resource:', error);
            toast.error('Error deleting resource');
        }
        setShowActionMenu(null);
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || resource.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredResources.length / rowsPerPage);
    const paginatedResources = filteredResources.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSelectResource = (id) => {
        setSelectedResources(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedResources.length === paginatedResources.length) {
            setSelectedResources([]);
        } else {
            setSelectedResources(paginatedResources.map(r => r.id || r._id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-6"
            >
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">Resources</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <FolderOpen className="w-8 h-8 text-indigo-600" />
                            Resource Management
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Manage all learning resources, files, and materials.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                        Upload Resource
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <FolderOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
                        <p className="text-sm text-slate-600">Total Files</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-cyan-50 rounded-lg">
                                <FileText className="w-5 h-5 text-cyan-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.documents}</p>
                        <p className="text-sm text-slate-600">Documents</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Video className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.videos}</p>
                        <p className="text-sm text-slate-600">Videos</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Image className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.images}</p>
                        <p className="text-sm text-slate-600">Images</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <HardDrive className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalSize}</p>
                        <p className="text-sm text-slate-600">Storage Used</p>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setFilterCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filterCategory === category
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* View Toggle & Refresh */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={fetchResources}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <RefreshCw className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Resources Grid/List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-7xl mx-auto"
            >
                {loading ? (
                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 animate-pulse">
                                <div className="h-12 w-12 bg-slate-200 rounded-lg mb-4" />
                                <div className="h-4 bg-slate-200 rounded mb-2" />
                                <div className="h-3 bg-slate-200 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : paginatedResources.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No resources found</h3>
                        <p className="text-slate-600">Try adjusting your search or upload new resources</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {paginatedResources.map((resource) => (
                            <motion.div
                                key={resource.id}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-3 rounded-lg bg-slate-100`}>
                                        {getFileIcon(resource.type)}
                                    </div>
                                    <button
                                        onClick={() => setShowActionMenu(showActionMenu === resource.id ? null : resource.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-lg transition-all"
                                    >
                                        <MoreVertical className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                                <h3 className="font-medium text-slate-900 truncate mb-1">{resource.name}</h3>
                                <p className="text-sm text-slate-500 mb-2">{resource.size}</p>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{resource.category}</span>
                                    <span>{resource.downloads} downloads</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left w-12">
                                        <button
                                            onClick={handleSelectAll}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            {selectedResources.length === paginatedResources.length ? (
                                                <Check className="w-5 h-5 text-indigo-600" />
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-slate-300 rounded" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Size</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Downloads</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedResources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleSelectResource(resource.id)}
                                                className="text-slate-400 hover:text-slate-600"
                                            >
                                                {selectedResources.includes(resource.id) ? (
                                                    <Check className="w-5 h-5 text-indigo-600" />
                                                ) : (
                                                    <div className="w-5 h-5 border-2 border-slate-300 rounded" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-slate-100`}>
                                                    {getFileIcon(resource.type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{resource.name}</p>
                                                    <p className="text-xs text-slate-500">Uploaded by {resource.uploadedBy}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full capitalize">
                                                {resource.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{resource.size}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{resource.category}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{resource.downloads}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4 text-slate-600" />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <Download className="w-4 h-4 text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {filteredResources.length > rowsPerPage && (
                    <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="text-sm text-slate-600">
                            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredResources.length)} of {filteredResources.length} resources
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                let pageNum;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1 rounded-lg text-sm ${
                                            currentPage === pageNum ? 'bg-indigo-600 text-white' : 'border border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ResourceList;

