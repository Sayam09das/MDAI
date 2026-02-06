import React, { useState } from 'react';
import { motion } from 'react';
import {
    Home,
    ChevronRight,
    FolderOpen,
    List,
    Grid,
    BarChart3,
    FolderPlus,
    Upload,
    Search
} from 'lucide-react';
import ResourceList from './ResourceList';

const subTabs = [
    { id: 'all', label: 'All Resources', icon: Grid },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'upload', label: 'Upload New', icon: Upload }
];

const ReturnResources = () => {
    const [activeTab, setActiveTab] = useState('all');

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return <ResourceList />;
            case 'categories':
                return <CategoryView />;
            case 'upload':
                return <UploadView />;
            default:
                return <ResourceList />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 flex gap-2 border-b border-slate-200 pb-0">
                        {subTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                                    activeTab === tab.id
                                        ? 'text-indigo-600 border-indigo-600'
                                        : 'text-slate-600 border-transparent hover:text-slate-900'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </div>
        </div>
    );
};

// Simple placeholder views
const CategoryView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Category Management</h3>
        <p className="text-slate-600">Manage resource categories and organization.</p>
    </div>
);

const UploadView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <Upload className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Resources</h3>
        <p className="text-slate-600">Upload new learning materials and resources.</p>
    </div>
);

export default ReturnResources;

