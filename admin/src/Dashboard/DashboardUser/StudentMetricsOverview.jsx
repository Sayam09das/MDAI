import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    Users,
    UserCheck,
    UserX,
    UserPlus,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Activity,
    Eye,
    Download,
    Filter,
    RefreshCw
} from 'lucide-react';

const StudentMetricsOverview = () => {
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
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    // Metrics data
    const metrics = [
        {
            id: 1,
            label: 'Total Students',
            value: '12,458',
            subtext: 'Registered accounts',
            trend: {
                value: '+18.2%',
                direction: 'up',
                label: 'vs last month'
            },
            icon: Users,
            color: {
                bg: 'bg-indigo-50',
                text: 'text-indigo-600',
                gradient: 'from-indigo-500 to-indigo-600',
                lightGradient: 'from-indigo-50 to-indigo-100'
            }
        },
        {
            id: 2,
            label: 'Active Students',
            value: '8,245',
            subtext: 'Currently enrolled',
            trend: {
                value: '+12.8%',
                direction: 'up',
                label: 'vs last month'
            },
            icon: UserCheck,
            color: {
                bg: 'bg-green-50',
                text: 'text-green-600',
                gradient: 'from-green-500 to-green-600',
                lightGradient: 'from-green-50 to-green-100'
            }
        },
        {
            id: 3,
            label: 'Suspended Accounts',
            value: '892',
            subtext: 'Temporarily disabled',
            trend: {
                value: '-5.2%',
                direction: 'down',
                label: 'vs last month'
            },
            icon: UserX,
            color: {
                bg: 'bg-red-50',
                text: 'text-red-600',
                gradient: 'from-red-500 to-red-600',
                lightGradient: 'from-red-50 to-red-100'
            }
        },
        {
            id: 4,
            label: 'New Students',
            value: '1,482',
            subtext: 'Last 30 days',
            trend: {
                value: '+24.5%',
                direction: 'up',
                label: 'vs previous period'
            },
            icon: UserPlus,
            color: {
                bg: 'bg-cyan-50',
                text: 'text-cyan-600',
                gradient: 'from-cyan-500 to-cyan-600',
                lightGradient: 'from-cyan-50 to-cyan-100'
            }
        }
    ];

    // Additional quick stats
    const quickStats = [
        {
            id: 1,
            label: 'Average Session Time',
            value: '42 min',
            icon: Activity,
            change: '+8%'
        },
        {
            id: 2,
            label: 'Daily Active Users',
            value: '3,621',
            icon: Eye,
            change: '+15%'
        },
        {
            id: 3,
            label: 'Course Enrollments',
            value: '24,896',
            icon: TrendingUp,
            change: '+32%'
        }
    ];

    const getTrendIcon = (direction) => {
        if (direction === 'up') return ArrowUpRight;
        if (direction === 'down') return ArrowDownRight;
        return Minus;
    };

    const getTrendColor = (direction) => {
        if (direction === 'up') return 'text-green-600 bg-green-50';
        if (direction === 'down') return 'text-red-600 bg-red-50';
        return 'text-slate-600 bg-slate-50';
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

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
                        <span className="text-slate-600">Students</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-indigo-600 font-medium">Metrics Overview</span>
                    </div>

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Student Metrics Overview
                            </h1>
                            <p className="text-slate-600">
                                Real-time student enrollment and activity metrics.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors flex items-center space-x-2 border border-slate-200 bg-white shadow-sm"
                            >
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Filter</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors flex items-center space-x-2 border border-slate-200 bg-white shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">Export</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: 90 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Metrics Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={mounted ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
                >
                    {metrics.map((metric) => {
                        const Icon = metric.icon;
                        const TrendIcon = getTrendIcon(metric.trend.direction);
                        const trendColor = getTrendColor(metric.trend.direction);

                        return (
                            <motion.div
                                key={metric.id}
                                variants={cardVariants}
                                whileHover={{
                                    y: -8,
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    transition: { duration: 0.2 }
                                }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 cursor-pointer group relative overflow-hidden"
                            >
                                {/* Background Gradient Decoration */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color.lightGradient} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -translate-y-16 translate-x-16`} />

                                {/* Content */}
                                <div className="relative">
                                    {/* Icon and Trend */}
                                    <div className="flex items-start justify-between mb-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.2 }}
                                            className={`p-3 rounded-xl bg-gradient-to-br ${metric.color.gradient} shadow-md`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </motion.div>

                                        {/* Trend Badge */}
                                        <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trendColor}`}>
                                            <TrendIcon className="w-3.5 h-3.5" />
                                            <span>{metric.trend.value}</span>
                                        </div>
                                    </div>

                                    {/* Value */}
                                    <div className="mb-1">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + (metric.id * 0.1), duration: 0.5 }}
                                            className="text-3xl font-bold text-slate-900 mb-1"
                                        >
                                            {metric.value}
                                        </motion.div>
                                        <div className="text-sm font-medium text-slate-700 mb-1">
                                            {metric.label}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {metric.subtext}
                                        </div>
                                    </div>

                                    {/* Trend Label */}
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500">{metric.trend.label}</span>
                                            <motion.div
                                                initial={{ x: -5, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.5 + (metric.id * 0.1) }}
                                                className={`font-semibold ${metric.color.text}`}
                                            >
                                                {metric.trend.value}
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect Line */}
                                <motion.div
                                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${metric.color.gradient}`}
                                    initial={{ width: 0 }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Quick Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Additional Insights
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {quickStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all"
                                >
                                    <div className="p-2.5 bg-indigo-100 rounded-lg">
                                        <Icon className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-600 mb-1">
                                            {stat.label}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-xl font-bold text-slate-900">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs font-semibold text-green-600">
                                                {stat.change}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Student Growth Trending Upward
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Your platform has seen a <span className="font-semibold text-indigo-600">24.5% increase</span> in new student registrations over the last 30 days. Active engagement is also up by <span className="font-semibold text-green-600">12.8%</span>, indicating strong platform health.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200 shadow-sm">
                                    📈 High Growth
                                </span>
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200 shadow-sm">
                                    ✅ Healthy Metrics
                                </span>
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200 shadow-sm">
                                    🎯 Target Achieved
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StudentMetricsOverview;