import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    BookOpen,
    GraduationCap,
    Users,
    FolderOpen,
    Plus,
    ArrowRight,
    Settings,
    BarChart3,
    FileText,
    UserPlus,
    Upload,
    Download,
    Mail,
    Bell,
    Shield,
    Zap,
    Sparkles
} from 'lucide-react';

const QuickActions = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    // Primary Quick Actions
    const primaryActions = [
        {
            id: 1,
            title: 'Add New Course',
            description: 'Create and publish a new course to the platform',
            icon: BookOpen,
            route: '/courses/new',
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            stats: '246 courses'
        },
        {
            id: 2,
            title: 'View Teachers',
            description: 'Manage teacher accounts and permissions',
            icon: GraduationCap,
            route: '/teachers',
            color: 'cyan',
            gradient: 'from-cyan-500 to-cyan-600',
            stats: '432 teachers'
        },
        {
            id: 3,
            title: 'View Students',
            description: 'Access student profiles and enrollment data',
            icon: Users,
            route: '/students',
            color: 'green',
            gradient: 'from-green-500 to-green-600',
            stats: '12,458 students'
        },
        {
            id: 4,
            title: 'Manage Resources',
            description: 'Upload and organize learning materials',
            icon: FolderOpen,
            route: '/resources',
            color: 'amber',
            gradient: 'from-amber-500 to-amber-600',
            stats: '1,842 files'
        }
    ];

    // Secondary Quick Actions
    const secondaryActions = [
        {
            id: 1,
            title: 'Add Student',
            icon: UserPlus,
            route: '/students/new',
            color: 'indigo'
        },
        {
            id: 2,
            title: 'Upload Content',
            icon: Upload,
            route: '/content/upload',
            color: 'cyan'
        },
        {
            id: 3,
            title: 'Generate Report',
            icon: FileText,
            route: '/reports',
            color: 'green'
        },
        {
            id: 4,
            title: 'Send Notification',
            icon: Bell,
            route: '/notifications',
            color: 'amber'
        },
        {
            id: 5,
            title: 'Analytics',
            icon: BarChart3,
            route: '/analytics',
            color: 'purple'
        },
        {
            id: 6,
            title: 'Settings',
            icon: Settings,
            route: '/settings',
            color: 'slate'
        }
    ];

    // Recent shortcuts (most used)
    const recentShortcuts = [
        { id: 1, title: 'Course Management', route: '/courses', icon: BookOpen, uses: 45 },
        { id: 2, title: 'Student List', route: '/students', icon: Users, uses: 38 },
        { id: 3, title: 'Reports', route: '/reports', icon: FileText, uses: 29 },
        { id: 4, title: 'Email Templates', route: '/emails', icon: Mail, uses: 22 }
    ];

    // Color classes mapping
    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            border: 'border-indigo-200',
            hover: 'hover:bg-indigo-100'
        },
        cyan: {
            bg: 'bg-cyan-50',
            text: 'text-cyan-600',
            border: 'border-cyan-200',
            hover: 'hover:bg-cyan-100'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-200',
            hover: 'hover:bg-green-100'
        },
        amber: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-200',
            hover: 'hover:bg-amber-100'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-200',
            hover: 'hover:bg-purple-100'
        },
        slate: {
            bg: 'bg-slate-50',
            text: 'text-slate-600',
            border: 'border-slate-200',
            hover: 'hover:bg-slate-100'
        }
    };

    const handleActionClick = (route) => {
        console.log('Navigating to:', route);
        // window.location.href = route;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Breadcrumb & Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                        <Home className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-600">Dashboard</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-indigo-600 font-medium">Quick Actions</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">
                                Quick Actions
                            </h1>
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <Zap className="w-7 h-7 text-amber-500" />
                            </motion.div>
                        </div>
                        <p className="text-slate-600">
                            Shortcuts to frequently used admin functions and management tools.
                        </p>
                    </div>
                </motion.div>

                {/* Primary Action Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={mounted ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
                >
                    {primaryActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <motion.div
                                key={action.id}
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleActionClick(action.route)}
                                className="group cursor-pointer"
                            >
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full transition-all hover:shadow-lg hover:border-slate-300">
                                    {/* Gradient Header */}
                                    <div className={`h-2 bg-gradient-to-r ${action.gradient}`} />

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.2 }}
                                            className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${action.gradient} mb-4`}
                                        >
                                            <Icon className="w-7 h-7 text-white" />
                                        </motion.div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {action.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-slate-600 mb-4">
                                            {action.description}
                                        </p>

                                        {/* Stats & Arrow */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">
                                                {action.stats}
                                            </span>
                                            <motion.div
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Secondary Actions Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                    <div className="flex items-center space-x-2 mb-6">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            More Actions
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {secondaryActions.map((action, index) => {
                            const Icon = action.icon;
                            const colors = colorClasses[action.color];

                            return (
                                <motion.button
                                    key={action.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                                    whileHover={{ y: -4, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleActionClick(action.route)}
                                    className={`p-4 rounded-lg border-2 ${colors.border} ${colors.bg} ${colors.hover} transition-all group`}
                                >
                                    <Icon className={`w-6 h-6 ${colors.text} mx-auto mb-2`} />
                                    <div className={`text-xs font-medium ${colors.text} text-center`}>
                                        {action.title}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Two Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Shortcuts */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Most Used Shortcuts
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Your frequently accessed pages
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {recentShortcuts.map((shortcut, index) => {
                                    const Icon = shortcut.icon;
                                    return (
                                        <motion.button
                                            key={shortcut.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            whileHover={{ x: 4, backgroundColor: '#f8fafc' }}
                                            onClick={() => handleActionClick(shortcut.route)}
                                            className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                    <Icon className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {shortcut.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {shortcut.uses} times this week
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg text-white p-6"
                    >
                        <div className="flex items-center space-x-2 mb-6">
                            <Shield className="w-6 h-6" />
                            <h2 className="text-lg font-semibold">
                                Admin Summary
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold mb-1">24</div>
                                <div className="text-sm text-indigo-100">Pending Approvals</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold mb-1">156</div>
                                <div className="text-sm text-indigo-100">Active Sessions</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl font-bold mb-1">8</div>
                                <div className="text-sm text-indigo-100">New Messages</div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-4 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:shadow-lg transition-all"
                            >
                                View All Tasks
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Help Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <Sparkles className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                    Need Help Getting Started?
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Explore our admin documentation and video tutorials to make the most of these tools.
                                </p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                            View Guide
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default QuickActions;