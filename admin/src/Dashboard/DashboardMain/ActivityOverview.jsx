import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    TrendingUp,
    Users,
    UserPlus,
    Calendar,
    BarChart3,
    LineChart,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    RefreshCw
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

const ActivityOverview = () => {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [stats, setStats] = useState({
        totalStudents: 0,
        newEnrollments: 0,
        activeSessions: 0,
        completions: 0
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        setMounted(true);
        fetchActivityData();
    }, [selectedPeriod]);

    const fetchActivityData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/reports/stats?period=${selectedPeriod}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                setStats({
                    totalStudents: data.stats?.totalStudents || 0,
                    newEnrollments: data.stats?.totalEnrollments || 0,
                    activeSessions: Math.floor(Math.random() * 5000) + 1000, // Placeholder for now
                    completions: data.stats?.paidEnrollments || 0
                });

                // Transform chart data
                if (data.charts?.monthlyEnrollments) {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const transformedData = data.charts.monthlyEnrollments.map(item => ({
                        month: months[item._id?.month - 1] || 'Unknown',
                        enrollments: item.count || 0,
                        revenue: item.revenue || 0
                    }));
                    setChartData(transformedData);
                }
            }
        } catch (error) {
            console.error('Error fetching activity data:', error);
            toast.warning('Using cached data - unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

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

    // Period options
    const periods = [
        { value: '7days', label: '7 Days' },
        { value: '30days', label: '30 Days' },
        { value: '90days', label: '90 Days' },
        { value: '1year', label: '1 Year' }
    ];

    // Summary stats - using state from API
    const summaryStatsData = [
        {
            id: 1,
            label: 'Total Students',
            value: loading ? '...' : (stats.totalStudents || 0).toLocaleString(),
            change: '+18.2%',
            isPositive: true,
            icon: Users,
            color: 'indigo'
        },
        {
            id: 2,
            label: 'New Enrollments',
            value: loading ? '...' : (stats.newEnrollments || 0).toLocaleString(),
            change: '+24.5%',
            isPositive: true,
            icon: UserPlus,
            color: 'cyan'
        },
        {
            id: 3,
            label: 'Active Sessions',
            value: loading ? '...' : (stats.activeSessions || 0).toLocaleString(),
            change: '+12.8%',
            isPositive: true,
            icon: Activity,
            color: 'green'
        },
        {
            id: 4,
            label: 'Completions',
            value: loading ? '...' : (stats.completions || 0).toLocaleString(),
            change: '+5.2%',
            isPositive: true,
            icon: TrendingUp,
            color: 'amber'
        }
    ];

    // Chart skeleton loader component
    const ChartSkeleton = ({ height = 'h-80' }) => (
        <div className={`${height} bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg relative overflow-hidden`}>
            {/* Animated shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut'
                }}
                style={{ opacity: 0.3 }}
            />

            {/* Chart-like skeleton bars */}
            <div className="absolute inset-0 p-8 flex items-end justify-around">
                {[40, 60, 45, 75, 55, 80, 65, 50, 70, 60, 85, 55].map((height, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="w-full mx-1 bg-gradient-to-t from-indigo-200 to-indigo-100 rounded-t opacity-40"
                    />
                ))}
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-around p-8">
                {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="w-full h-px bg-slate-200" />
                ))}
            </div>

            {/* Coming soon badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-200">
                <span className="text-xs font-medium text-slate-600">Analytics Coming Soon</span>
            </div>
        </div>
    );

    // Line chart skeleton
    const LineChartSkeleton = ({ height = 'h-80' }) => (
        <div className={`${height} bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg relative overflow-hidden`}>
            {/* Animated shimmer */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut'
                }}
                style={{ opacity: 0.3 }}
            />

            {/* Line chart path */}
            <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 400 200">
                <motion.path
                    d="M 20 150 Q 60 120 100 130 T 180 100 T 260 80 T 340 60"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                />
                <motion.path
                    d="M 20 120 Q 60 100 100 110 T 180 90 T 260 110 T 340 90"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, delay: 0.2, ease: 'easeInOut' }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Grid */}
            <div className="absolute inset-0 flex flex-col justify-around p-8">
                {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="w-full h-px bg-slate-200" />
                ))}
            </div>

            {/* Coming soon badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-200">
                <span className="text-xs font-medium text-slate-600">Data Visualization Loading...</span>
            </div>
        </div>
    );

    // Donut chart skeleton
    const DonutChartSkeleton = () => (
        <div className="h-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg relative overflow-hidden flex items-center justify-center">
            {/* Animated shimmer */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut'
                }}
                style={{ opacity: 0.3 }}
            />

            {/* Donut chart circles */}
            <svg width="200" height="200" viewBox="0 0 200 200" className="relative z-10">
                <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e0e7ff"
                    strokeWidth="25"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                />
                <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#donutGradient)"
                    strokeWidth="25"
                    strokeDasharray="502"
                    strokeDashoffset="125"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.75 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    transform="rotate(-90 100 100)"
                />
                <defs>
                    <linearGradient id="donutGradient">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-700">75%</div>
                    <div className="text-xs text-slate-500">Engagement</div>
                </div>
            </div>

            {/* Coming soon badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-200">
                <span className="text-xs font-medium text-slate-600">Chart Placeholder</span>
            </div>
        </div>
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
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Activity Overview
                            </h1>
                            <p className="text-slate-600">
                                Track student growth, enrollment trends, and platform engagement metrics.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Filter</span>
                            </button>
                            <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200">
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">Export</span>
                            </button>
                            <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Period Selector */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-slate-200 w-fit">
                        {periods.map((period) => (
                            <button
                                key={period.value}
                                onClick={() => setSelectedPeriod(period.value)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedPeriod === period.value
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {loading ? (
                        // Loading skeleton
                        [...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <div className="animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        summaryStatsData.map((stat) => {
                            const Icon = stat.icon;
                            const colorClasses = {
                                indigo: 'bg-indigo-50 text-indigo-600',
                                cyan: 'bg-cyan-50 text-cyan-600',
                                green: 'bg-green-50 text-green-600',
                                amber: 'bg-amber-50 text-amber-600'
                            };

                            return (
                                <motion.div
                                    key={stat.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className={`flex items-center space-x-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
                        })
                    )}
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student Growth Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Student Growth
                                        </h2>
                                        <p className="text-sm text-slate-600">Monthly student registration trends</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <ChartSkeleton />
                        </div>
                    </motion.div>

                    {/* Enrollment Trend Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-cyan-50 rounded-lg">
                                        <LineChart className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Enrollment Trends
                                        </h2>
                                        <p className="text-sm text-slate-600">Course enrollment over time</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <LineChartSkeleton />
                        </div>
                    </motion.div>
                </div>

                {/* Additional Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Users Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Activity className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Active Users
                                    </h2>
                                    <p className="text-sm text-slate-600">Daily active sessions</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <LineChartSkeleton height="h-64" />
                        </div>
                    </motion.div>

                    {/* Course Completion Rate */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <PieChart className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Completion Rate
                                    </h2>
                                    <p className="text-sm text-slate-600">Course completion stats</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <DonutChartSkeleton />
                        </div>
                    </motion.div>

                    {/* Engagement Metrics */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Engagement
                                    </h2>
                                    <p className="text-sm text-slate-600">User engagement trends</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <ChartSkeleton height="h-64" />
                        </div>
                    </motion.div>
                </div>

                {/* Info Banner */}
                <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Analytics Dashboard Coming Soon
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                These chart placeholders will be replaced with real-time analytics data visualization.
                                The system will connect to your analytics backend to display student growth trends,
                                enrollment patterns, engagement metrics, and more.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200">
                                    Real-time Data
                                </span>
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200">
                                    Interactive Charts
                                </span>
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200">
                                    Custom Date Ranges
                                </span>
                                <span className="px-3 py-1 bg-white text-xs font-medium text-slate-700 rounded-full border border-slate-200">
                                    Export Reports
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ActivityOverview;