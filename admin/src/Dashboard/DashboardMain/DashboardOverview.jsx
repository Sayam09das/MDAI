import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Home,
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    FileText,
    Award
} from 'lucide-react';

const DashboardOverview = () => {
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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
    };

    // Stats data
    const stats = [
        {
            id: 1,
            label: 'Total Users',
            value: '12,458',
            change: '+12.5%',
            isPositive: true,
            icon: Users,
            color: 'indigo'
        },
        {
            id: 2,
            label: 'Active Courses',
            value: '246',
            change: '+8.2%',
            isPositive: true,
            icon: BookOpen,
            color: 'cyan'
        },
        {
            id: 3,
            label: 'Total Teachers',
            value: '432',
            change: '+5.1%',
            isPositive: true,
            icon: GraduationCap,
            color: 'indigo'
        },
        {
            id: 4,
            label: 'Revenue',
            value: '$84,290',
            change: '-2.4%',
            isPositive: false,
            icon: TrendingUp,
            color: 'cyan'
        }
    ];

    // Recent activity
    const recentActivity = [
        {
            id: 1,
            type: 'user',
            title: 'New user registration',
            description: 'Sarah Johnson joined the platform',
            time: '5 minutes ago',
            icon: Users,
            color: 'indigo'
        },
        {
            id: 2,
            type: 'course',
            title: 'Course published',
            description: 'Advanced React Development is now live',
            time: '23 minutes ago',
            icon: BookOpen,
            color: 'cyan'
        },
        {
            id: 3,
            type: 'teacher',
            title: 'Teacher approved',
            description: 'Michael Chen application accepted',
            time: '1 hour ago',
            icon: GraduationCap,
            color: 'indigo'
        },
        {
            id: 4,
            type: 'achievement',
            title: 'Milestone reached',
            description: '10,000 course completions',
            time: '2 hours ago',
            icon: Award,
            color: 'cyan'
        }
    ];

    // Quick stats
    const quickStats = [
        {
            id: 1,
            label: 'Pending Approvals',
            value: '24',
            icon: Clock,
            color: 'amber'
        },
        {
            id: 2,
            label: 'Active Sessions',
            value: '1,842',
            icon: Activity,
            color: 'green'
        },
        {
            id: 3,
            label: 'Completed Today',
            value: '127',
            icon: CheckCircle2,
            color: 'indigo'
        },
        {
            id: 4,
            label: 'Issues Reported',
            value: '8',
            icon: AlertCircle,
            color: 'red'
        }
    ];

    // Top courses
    const topCourses = [
        { id: 1, name: 'Introduction to Python', students: 2456, progress: 85 },
        { id: 2, name: 'Web Development Bootcamp', students: 1893, progress: 72 },
        { id: 3, name: 'Data Science Fundamentals', students: 1654, progress: 68 },
        { id: 4, name: 'Machine Learning Basics', students: 1432, progress: 61 },
        { id: 5, name: 'UI/UX Design Principles', students: 1289, progress: 58 }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={mounted ? "visible" : "hidden"}
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Breadcrumb & Header */}
                <motion.div variants={itemVariants}>
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                        <Home className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-indigo-600 font-medium">Dashboard</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-600">
                            Monitor platform activity and key metrics at a glance.
                        </p>
                    </div>
                </motion.div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.id}
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.color === 'indigo'
                                            ? 'bg-indigo-50'
                                            : 'bg-cyan-50'
                                        }`}>
                                        <Icon className={`w-6 h-6 ${stat.color === 'indigo'
                                                ? 'text-indigo-600'
                                                : 'text-cyan-600'
                                            }`} />
                                    </div>
                                    <div className={`flex items-center space-x-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.isPositive ? (
                                            <ArrowUpRight className="w-4 h-4" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4" />
                                        )}
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Stats Bar */}
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickStats.map((stat) => {
                            const Icon = stat.icon;
                            const colorClasses = {
                                amber: 'bg-amber-50 text-amber-600',
                                green: 'bg-green-50 text-green-600',
                                indigo: 'bg-indigo-50 text-indigo-600',
                                red: 'bg-red-50 text-red-600'
                            };

                            return (
                                <div
                                    key={stat.id}
                                    className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-slate-900">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-slate-600">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity - Takes 2 columns */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Recent Activity
                                </h2>
                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1">
                                    <span>View all</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => {
                                    const Icon = activity.icon;
                                    return (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${activity.color === 'indigo'
                                                    ? 'bg-indigo-50'
                                                    : 'bg-cyan-50'
                                                }`}>
                                                <Icon className={`w-5 h-5 ${activity.color === 'indigo'
                                                        ? 'text-indigo-600'
                                                        : 'text-cyan-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {activity.title}
                                                </div>
                                                <div className="text-sm text-slate-600 truncate">
                                                    {activity.description}
                                                </div>
                                                <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{activity.time}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Top Courses - Takes 1 column */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Top Courses
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {topCourses.map((course, index) => (
                                    <div key={course.id} className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900 truncate">
                                                    {course.name}
                                                </div>
                                                <div className="text-xs text-slate-600">
                                                    {course.students.toLocaleString()} students
                                                </div>
                                            </div>
                                            <div className="text-xs font-semibold text-indigo-600 ml-2">
                                                {course.progress}%
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.progress}%` }}
                                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section - Calendar & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upcoming Events */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-slate-900">
                                Upcoming Events
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { title: 'Teacher Workshop', date: 'Jan 28, 2026', time: '10:00 AM' },
                                { title: 'Platform Maintenance', date: 'Jan 30, 2026', time: '2:00 AM' },
                                { title: 'New Course Launch', date: 'Feb 2, 2026', time: '9:00 AM' }
                            ].map((event, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">{event.title}</div>
                                        <div className="text-xs text-slate-600">{event.date}</div>
                                    </div>
                                    <div className="text-xs font-medium text-indigo-600">{event.time}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* System Status */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <Activity className="w-5 h-5 text-green-600" />
                            <h2 className="text-lg font-semibold text-slate-900">
                                System Status
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'API Server', status: 'Operational', uptime: '99.9%' },
                                { name: 'Database', status: 'Operational', uptime: '100%' },
                                { name: 'CDN', status: 'Operational', uptime: '99.8%' }
                            ].map((system, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        <div className="text-sm font-medium text-slate-900">{system.name}</div>
                                    </div>
                                    <div className="text-xs text-slate-600">{system.uptime}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardOverview;