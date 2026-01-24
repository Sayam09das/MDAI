import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    TrendingUp,
    Users,
    BarChart3,
    PieChart,
    LineChart,
    Activity,
    Calendar,
    Download,
    Settings,
    Info,
    Sparkles,
    Database
} from 'lucide-react';

const StudentActivityAnalytics = () => {
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
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    // Chart Skeleton Component
    const ChartSkeleton = ({ type = 'line', title, description, height = 'h-80' }) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {description}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className={`${height} bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden`}>
                {/* Animated shimmer effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: 'easeInOut'
                    }}
                    style={{ opacity: 0.3 }}
                />

                {type === 'line' && <LineChartPlaceholder />}
                {type === 'bar' && <BarChartPlaceholder />}
                {type === 'pie' && <PieChartPlaceholder />}

                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200">
                    <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-semibold text-slate-700">
                            Awaiting Data Integration
                        </span>
                    </div>
                </div>

                {/* Center Message */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4"
                        >
                            <Sparkles className="w-8 h-8 text-indigo-600" />
                        </motion.div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">
                            Chart Placeholder
                        </h4>
                        <p className="text-sm text-slate-600 max-w-xs">
                            This visualization will populate with real-time data once backend integration is complete
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <Info className="w-4 h-4" />
                    <span>Data will update automatically when connected to analytics backend</span>
                </div>
            </div>
        </div>
    );

    // Line Chart Placeholder
    const LineChartPlaceholder = () => (
        <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.line
                    key={i}
                    x1="0"
                    y1={i * 60}
                    x2="600"
                    y2={i * 60}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                />
            ))}

            {/* Line Paths */}
            <motion.path
                d="M 50 250 Q 100 200 150 220 T 250 180 T 350 150 T 450 120 T 550 100"
                fill="none"
                stroke="url(#lineGradient1)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
            />

            <motion.path
                d="M 50 220 Q 100 180 150 190 T 250 160 T 350 180 T 450 150 T 550 140"
                fill="none"
                stroke="url(#lineGradient2)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, delay: 0.7, ease: 'easeInOut' }}
            />

            <defs>
                <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
        </svg>
    );

    // Bar Chart Placeholder
    const BarChartPlaceholder = () => (
        <div className="absolute inset-0 p-8 flex items-end justify-around gap-2">
            {[45, 65, 50, 80, 60, 90, 70, 55, 75, 85, 65, 95].map((height, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${height}%`, opacity: 0.6 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                    className="w-full bg-gradient-to-t from-indigo-400 to-indigo-200 rounded-t-lg relative group"
                >
                    <motion.div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ y: 5 }}
                        whileHover={{ y: 0 }}
                    >
                        {height}%
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );

    // Pie Chart Placeholder
    const PieChartPlaceholder = () => (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <g transform="translate(100, 100)">
                {/* Segments */}
                <motion.circle
                    r="70"
                    fill="none"
                    stroke="#e0e7ff"
                    strokeWidth="30"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                />

                <motion.circle
                    r="70"
                    fill="none"
                    stroke="url(#pieGradient)"
                    strokeWidth="30"
                    strokeDasharray="440"
                    strokeDashoffset="110"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.75 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    transform="rotate(-90)"
                />

                <defs>
                    <linearGradient id="pieGradient">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </g>

            {/* Center Text */}
            <text x="100" y="95" textAnchor="middle" className="text-2xl font-bold fill-slate-900">
                75%
            </text>
            <text x="100" y="110" textAnchor="middle" className="text-xs fill-slate-600">
                Sample Data
            </text>
        </svg>
    );

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
                        <span className="text-slate-600">Dashboard</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-600">Students</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-indigo-600 font-medium">Activity Analytics</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Student Activity Analytics
                        </h1>
                        <p className="text-slate-600">
                            Comprehensive analytics visualizations for student engagement and growth patterns.
                        </p>
                    </div>
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <Database className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Analytics Dashboard - Backend Integration Pending
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                The chart placeholders below are ready to display real-time student analytics once connected to your data backend. Each visualization has been designed for optimal data representation and will automatically populate when data sources are configured.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200 shadow-sm">
                                    📊 Charts Ready
                                </span>
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200 shadow-sm">
                                    🔌 API Integration Required
                                </span>
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200 shadow-sm">
                                    ⚡ Real-time Updates
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Chart - Student Registration Growth */}
                <motion.div variants={itemVariants}>
                    <ChartSkeleton
                        type="line"
                        title="Student Registration Growth"
                        description="Track new student registrations over time with trend analysis"
                        height="h-96"
                    />
                </motion.div>

                {/* Two Column Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active vs Inactive Students */}
                    <motion.div variants={itemVariants}>
                        <ChartSkeleton
                            type="pie"
                            title="Active vs Inactive Students"
                            description="Distribution of student account statuses"
                            height="h-80"
                        />
                    </motion.div>

                    {/* Course Participation Overview */}
                    <motion.div variants={itemVariants}>
                        <ChartSkeleton
                            type="bar"
                            title="Course Participation Overview"
                            description="Student engagement across different courses"
                            height="h-80"
                        />
                    </motion.div>
                </div>

                {/* Additional Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Engagement Trends */}
                    <motion.div variants={itemVariants}>
                        <ChartSkeleton
                            type="line"
                            title="Engagement Trends"
                            description="Daily active users and session metrics"
                            height="h-64"
                        />
                    </motion.div>

                    {/* Completion Rates */}
                    <motion.div variants={itemVariants}>
                        <ChartSkeleton
                            type="bar"
                            title="Completion Rates"
                            description="Course completion statistics"
                            height="h-64"
                        />
                    </motion.div>

                    {/* Performance Distribution */}
                    <motion.div variants={itemVariants}>
                        <ChartSkeleton
                            type="pie"
                            title="Performance Distribution"
                            description="Student grade distribution"
                            height="h-64"
                        />
                    </motion.div>
                </div>

                {/* Technical Information Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Activity className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">
                                Integration Requirements
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                        <span className="text-sm font-semibold text-slate-900">
                                            Student Registration API
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        GET /api/analytics/registrations
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                        <span className="text-sm font-semibold text-slate-900">
                                            Activity Status API
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        GET /api/analytics/student-status
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                        <span className="text-sm font-semibold text-slate-900">
                                            Course Participation API
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        GET /api/analytics/course-participation
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudentActivityAnalytics;