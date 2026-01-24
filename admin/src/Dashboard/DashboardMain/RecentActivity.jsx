import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ChevronRight,
    UserPlus,
    BookOpen,
    GraduationCap,
    Clock,
    Filter,
    Search,
    RefreshCw,
    Calendar,
    CheckCircle2,
    FileEdit,
    UserCheck,
    Award,
    MessageSquare,
    Settings,
    Trash2,
    MoreVertical
} from 'lucide-react';

const RecentActivity = () => {
    const [mounted, setMounted] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
    };

    // Activity data
    const activities = [
        {
            id: 1,
            type: 'student',
            category: 'New Registration',
            icon: UserPlus,
            title: 'New student registered',
            description: 'Sarah Johnson created an account and enrolled in 2 courses',
            timestamp: '2 minutes ago',
            color: 'indigo',
            user: 'Sarah Johnson',
            metadata: '2 courses enrolled'
        },
        {
            id: 2,
            type: 'course',
            category: 'Course Created',
            icon: BookOpen,
            title: 'New course published',
            description: 'Advanced React Development course is now available',
            timestamp: '15 minutes ago',
            color: 'cyan',
            user: 'Dr. Michael Chen',
            metadata: 'Web Development'
        },
        {
            id: 3,
            type: 'teacher',
            category: 'Teacher Activity',
            icon: GraduationCap,
            title: 'Teacher approved',
            description: 'Emily Rodriguez application has been approved',
            timestamp: '32 minutes ago',
            color: 'green',
            user: 'Emily Rodriguez',
            metadata: 'Mathematics Department'
        },
        {
            id: 4,
            type: 'student',
            category: 'New Registration',
            icon: UserPlus,
            title: 'New student registered',
            description: 'James Wilson joined the platform',
            timestamp: '1 hour ago',
            color: 'indigo',
            user: 'James Wilson',
            metadata: '1 course enrolled'
        },
        {
            id: 5,
            type: 'teacher',
            category: 'Teacher Activity',
            icon: FileEdit,
            title: 'Course content updated',
            description: 'Dr. Amanda Lee updated Introduction to Python materials',
            timestamp: '1 hour ago',
            color: 'green',
            user: 'Dr. Amanda Lee',
            metadata: 'Added 5 new lessons'
        },
        {
            id: 6,
            type: 'course',
            category: 'Course Created',
            icon: BookOpen,
            title: 'New course published',
            description: 'Machine Learning Fundamentals is now live',
            timestamp: '2 hours ago',
            color: 'cyan',
            user: 'Prof. David Kim',
            metadata: 'Data Science'
        },
        {
            id: 7,
            type: 'student',
            category: 'Achievement',
            icon: Award,
            title: 'Student achievement',
            description: 'Maria Garcia completed Web Development Bootcamp',
            timestamp: '2 hours ago',
            color: 'amber',
            user: 'Maria Garcia',
            metadata: '100% completion'
        },
        {
            id: 8,
            type: 'teacher',
            category: 'Teacher Activity',
            icon: MessageSquare,
            title: 'Discussion replied',
            description: 'Dr. Robert Taylor replied to 12 student questions',
            timestamp: '3 hours ago',
            color: 'green',
            user: 'Dr. Robert Taylor',
            metadata: 'Course Q&A'
        },
        {
            id: 9,
            type: 'student',
            category: 'New Registration',
            icon: UserPlus,
            title: 'New student registered',
            description: 'Lisa Anderson joined and verified email',
            timestamp: '4 hours ago',
            color: 'indigo',
            user: 'Lisa Anderson',
            metadata: 'Email verified'
        },
        {
            id: 10,
            type: 'course',
            category: 'Course Updated',
            icon: CheckCircle2,
            title: 'Course milestone',
            description: 'UI/UX Design reached 1000 enrollments',
            timestamp: '5 hours ago',
            color: 'cyan',
            user: 'System',
            metadata: '1000 students'
        },
        {
            id: 11,
            type: 'teacher',
            category: 'Teacher Activity',
            icon: GraduationCap,
            title: 'Teacher certification',
            description: 'Jessica Brown completed advanced teaching certification',
            timestamp: '6 hours ago',
            color: 'green',
            user: 'Jessica Brown',
            metadata: 'Advanced Certificate'
        },
        {
            id: 12,
            type: 'student',
            category: 'New Registration',
            icon: UserPlus,
            title: 'Bulk registrations',
            description: '15 students registered via corporate partnership',
            timestamp: 'Yesterday',
            color: 'indigo',
            user: 'TechCorp Inc.',
            metadata: '15 students'
        }
    ];

    // Filter categories
    const filterOptions = [
        { value: 'all', label: 'All Activity', count: activities.length },
        { value: 'student', label: 'Students', count: activities.filter(a => a.type === 'student').length },
        { value: 'course', label: 'Courses', count: activities.filter(a => a.type === 'course').length },
        { value: 'teacher', label: 'Teachers', count: activities.filter(a => a.type === 'teacher').length }
    ];

    // Filtered activities
    const filteredActivities = activities.filter(activity => {
        const matchesFilter = filter === 'all' || activity.type === filter;
        const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.user.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Color classes
    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            border: 'border-indigo-100',
            hover: 'hover:bg-indigo-100'
        },
        cyan: {
            bg: 'bg-cyan-50',
            text: 'text-cyan-600',
            border: 'border-cyan-100',
            hover: 'hover:bg-cyan-100'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-100',
            hover: 'hover:bg-green-100'
        },
        amber: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-100',
            hover: 'hover:bg-amber-100'
        }
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

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Recent Activity
                        </h1>
                        <p className="text-slate-600">
                            Track all platform activities including student registrations, course updates, and teacher actions.
                        </p>
                    </div>
                </motion.div>

                {/* Filters and Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setFilter(option.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === option.value
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {option.label}
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === option.value
                                            ? 'bg-indigo-500'
                                            : 'bg-slate-200'
                                        }`}>
                                        {option.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search and Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Search */}
                            <div className="relative flex-1 lg:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search activities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Refresh Button */}
                            <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Activity List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={mounted ? "visible" : "hidden"}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Activity Feed
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                                <Calendar className="w-4 h-4" />
                                <span>Last 24 hours</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Items */}
                    <div className="divide-y divide-slate-100">
                        <AnimatePresence mode="popLayout">
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map((activity, index) => {
                                    const Icon = activity.icon;
                                    const colors = colorClasses[activity.color];

                                    return (
                                        <motion.div
                                            key={activity.id}
                                            variants={itemVariants}
                                            layout
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-start space-x-4">
                                                {/* Icon */}
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className={`p-3 rounded-lg ${colors.bg} ${colors.hover} flex-shrink-0 transition-colors`}
                                                >
                                                    <Icon className={`w-5 h-5 ${colors.text}`} />
                                                </motion.div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            {/* Category Badge */}
                                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} mb-2`}>
                                                                {activity.category}
                                                            </span>

                                                            {/* Title */}
                                                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                                                {activity.title}
                                                            </h3>

                                                            {/* Description */}
                                                            <p className="text-sm text-slate-600 mb-2">
                                                                {activity.description}
                                                            </p>

                                                            {/* Metadata */}
                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                                                <div className="flex items-center space-x-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{activity.timestamp}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <span className="font-medium text-slate-700">{activity.user}</span>
                                                                </div>
                                                                {activity.metadata && (
                                                                    <div className="px-2 py-0.5 bg-slate-100 rounded-full">
                                                                        {activity.metadata}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-12 text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                                        <Search className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        No activities found
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Try adjusting your filters or search query
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Load More Button */}
                    {filteredActivities.length > 0 && (
                        <div className="p-6 border-t border-slate-200 bg-slate-50">
                            <button className="w-full py-3 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                                Load More Activities
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <UserPlus className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">127</div>
                                <div className="text-sm text-slate-600">New Students Today</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-cyan-50 rounded-lg">
                                <BookOpen className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">18</div>
                                <div className="text-sm text-slate-600">Courses Published</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">43</div>
                                <div className="text-sm text-slate-600">Teacher Activities</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default RecentActivity;