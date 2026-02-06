import React, { useState } from 'react';
import { motion } from 'react';
import {
    Home,
    ChevronRight,
    FolderPlus,
    Edit,
    Trash2,
    MoreVertical,
    FolderOpen,
    FileText,
    Video,
    Image,
    Music,
    Archive,
    Plus,
    X,
    Check
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = [
    { id: 1, name: 'Documents', icon: 'document', count: 45, color: 'indigo' },
    { id: 2, name: 'Videos', icon: 'video', count: 32, color: 'red' },
    { id: 3, name: 'Images', icon: 'image', count: 128, color: 'purple' },
    { id: 4, name: 'Audio', icon: 'audio', count: 18, color: 'amber' },
    { id: 5, name: 'Archives', icon: 'archive', count: 8, color: 'orange' },
    { id: 6, name: 'Presentations', icon: 'document', count: 24, color: 'cyan' },
    { id: 7, name: 'Code Files', icon: 'document', count: 56, color: 'green' },
    { id: 8, name: 'Other', icon: 'folder', count: 12, color: 'slate' }
];

const getIcon = (iconType) => {
    switch (iconType) {
        case 'video': return <Video className="w-6 h-6" />;
        case 'image': return <Image className="w-6 h-6" />;
        case 'audio': return <Music className="w-6 h-6" />;
        case 'archive': return <Archive className="w-6 h-6" />;
        default: return <FileText className="w-6 h-6" />;
    }
};

const getColorClass = (color) => {
    const colors = {
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
        red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
        cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
        green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
        slate: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' }
    };
    return colors[color] || colors.slate;
};

const ResourceCategories = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', icon: 'document', color: 'indigo' });

    const handleAddCategory = () => {
        if (!newCategory.name.trim()) {
            toast.error('Please enter a category name');
            return;
        }
        toast.success('Category added successfully');
        setShowAddModal(false);
        setNewCategory({ name: '', icon: 'document', color: 'indigo' });
    };

    const handleDeleteCategory = (id) => {
        toast.success('Category deleted');
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
    };

    const handleSaveEdit = () => {
        toast.success('Category updated');
        setEditingCategory(null);
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
                    <span>Resources</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">Categories</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <FolderOpen className="w-8 h-8 text-indigo-600" />
                            Resource Categories
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Organize and manage resource categories.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </motion.button>
                </div>
            </motion.div>

            {/* Categories Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                {categories.map((category, index) => {
                    const colorClass = getColorClass(category.color);
                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className={`bg-white rounded-xl shadow-sm border ${colorClass.border} p-6 cursor-pointer group`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${colorClass.bg}`}>
                                    <div className={colorClass.text}>
                                        {getIcon(category.icon)}
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1 hover:bg-slate-100 rounded-lg">
                                        <MoreVertical className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                            <p className="text-sm text-slate-600">{category.count} files</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900">Add New Category</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter category name"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                                <div className="flex gap-2">
                                    {['indigo', 'red', 'purple', 'amber', 'orange', 'cyan', 'green', 'slate'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full ${getColorClass(color).bg} ${getColorClass(color).text} ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Add Category
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ResourceCategories;

