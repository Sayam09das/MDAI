import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    Upload,
    File,
    Image,
    Video,
    Music,
    FileText,
    Archive,
    X,
    Check,
    RefreshCw,
    FolderPlus,
    Link
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
        },
    };
};

const categories = [
    'Documents', 'Videos', 'Images', 'Audio', 'Archives', 'Other'
];

const getFileIcon = (type) => {
    switch (type) {
        case 'image': return <Image className="w-6 h-6 text-purple-600" />;
        case 'video': return <Video className="w-6 h-6 text-red-600" />;
        case 'audio': return <Music className="w-6 h-6 text-amber-600" />;
        case 'archive': return <Archive className="w-6 h-6 text-orange-600" />;
        default: return <FileText className="w-6 h-6 text-slate-600" />;
    }
};

const UploadResource = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'

    // Form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        course: '',
        tags: ''
    });
    const [urlInput, setUrlInput] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList).map(file => ({
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: getFileType(file.type)
        }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const getFileType = (mimeType) => {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
        return 'document';
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = async () => {
        if (files.length === 0 && !urlInput) {
            toast.error('Please select files or enter a URL');
            return;
        }

        if (!formData.title || !formData.category) {
            toast.error('Please fill in required fields');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);

        // Simulate API call
        setTimeout(() => {
            setUploading(false);
            toast.success('Resource uploaded successfully!');
            setFiles([]);
            setFormData({ title: '', description: '', category: '', course: '', tags: '' });
            setUrlInput('');
            setUploadProgress(0);
        }, 4000);
    };

    const totalSize = files.reduce((acc, f) => acc + parseFloat(f.size), 0).toFixed(2);

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto mb-6"
            >
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Resources</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">Upload</span>
                </div>

                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Upload className="w-8 h-8 text-indigo-600" />
                        Upload Resource
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Upload learning materials, documents, videos, and other resources.
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Upload Method Toggle */}
                    <div className="flex gap-4 border-b border-slate-200 pb-4">
                        <button
                            onClick={() => setUploadMethod('file')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                uploadMethod === 'file'
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <File className="w-5 h-5" />
                            Upload Files
                        </button>
                        <button
                            onClick={() => setUploadMethod('url')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                uploadMethod === 'url'
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <Link className="w-5 h-5" />
                            From URL
                        </button>
                    </div>

                    {/* File Upload Area */}
                    {uploadMethod === 'file' ? (
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                dragActive
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-300 hover:border-indigo-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="w-8 h-8 text-indigo-600" />
                                </div>
                                <p className="text-slate-900 font-medium mb-2">
                                    Drag and drop files here
                                </p>
                                <p className="text-sm text-slate-500 mb-4">
                                    or click to browse from your computer
                                </p>
                                <p className="text-xs text-slate-400">
                                    Supported: PDF, DOC, MP4, MP3, ZIP (Max 500MB per file)
                                </p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Resource URL *
                                </label>
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/resource-file.pdf"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-slate-900">
                                    Selected Files ({files.length})
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Total: {totalSize} MB
                                </p>
                            </div>
                            <div className="space-y-2">
                                {files.map((file) => (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                                    >
                                        <div className={`p-2 rounded-lg bg-white`}>
                                            {getFileIcon(file.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {file.size}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload Progress */}
                    {uploading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-indigo-50 rounded-lg"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-slate-900">Uploading...</p>
                                <p className="text-sm text-slate-600">{uploadProgress}%</p>
                            </div>
                            <div className="w-full bg-indigo-200 rounded-full h-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    className="bg-indigo-600 h-2 rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Resource Details */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">Resource Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter resource title"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter a description for this resource"
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="Enter tags separated by commas"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            onClick={() => {
                                setFiles([]);
                                setFormData({ title: '', description: '', category: '', course: '', tags: '' });
                                setUrlInput('');
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Clear All
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUpload}
                            disabled={uploading || (files.length === 0 && !urlInput)}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {uploading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Upload Resource
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadResource;

