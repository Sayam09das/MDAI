import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    UserPlus,
    BookOpen,
    DollarSign,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    RefreshCw,
    Clock,
    GraduationCap,
    Calendar,
    BarChart3,
    PieChart,
    Zap
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

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
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [data, setData] = useState({
        overview: {},
        realtime: {},
        trends: {},
        charts: {
            monthlyEnrollments: [],
            courseDistribution: [],
            dailyActivity: []
        },
        activityFeed: {
            recentUsers: [],
            recentEnrollments: [],
            recentCompletions: []
        },
        engagement: {}
    });

    const fetchActivityData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/activity/overview`, getAuthHeaders());

            // Check if response is JSON
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                console.error('Non-JSON response received:', text.substring(0, 200));
                throw new Error('Server returned an invalid response. Please check if the backend is running.');
            }

            const result = await res.json();

            if (result.success) {
                setData(result);
                setLastUpdated(new Date());
                if (showRefresh) {
                    toast.success('Dashboard refreshed successfully!');
                }
            } else {
                throw new Error(result.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching activity data:', error);
            // Only show toast error if not already handled by another component
            if (!error.message.includes('Server returned an invalid response')) {
                toast.error('Failed to load activity data');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchActivityData();
        
        // Auto-refresh every 30 seconds for real-time updates
        const intervalId = setInterval(() => {
            fetchActivityData(false);
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchActivityData]);

    const handleRefresh = () => {
        fetchActivityData(true);
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

    // Color palette for charts
    const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const GRADIENT_COLORS = ['#6366f1', '#06b6d4'];

    // Format numbers
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '0';
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Time ago helper
    const timeAgo = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    // Summary stats data
    const summaryStatsData = [
        {
            id: 1,
            label: 'Total Students',
            value: loading ? '...' : formatNumber(data.overview.totalStudents),
            change: '+18.2%',
            isPositive: true,
            icon: Users,
            color: 'indigo',
            subtext: `${formatNumber(data.realtime.newStudentsToday)} new today`
        },
        {
            id: 2,
            label: 'Active Courses',
            value: loading ? '...' : formatNumber(data.overview.publishedCourses),
            change: '+8.5%',
            isPositive: true,
            icon: BookOpen,
            color: 'cyan',
            subtext: `${formatNumber(data.overview.totalCourses)} total`
        },
        {
            id: 3,
            label: 'Active Sessions',
            value: loading ? '...' : formatNumber(data.realtime.activeSessionsToday),
            change: '+12.3%',
            isPositive: true,
            icon: Activity,
            color: 'green',
            subtext: 'Last 24 hours'
        },
        {
            id: 4,
            label: "Today's Revenue",
            value: loading ? '...' : formatCurrency(data.realtime.todayRevenue),
            change: '+24.1%',
            isPositive: true,
            icon: DollarSign,
            color: 'amber',
            subtext: `${formatCurrency(data.trends.weekRevenue)} this week`
        }
    ];

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('revenue') 
                                ? formatCurrency(entry.value) 
                                : formatNumber(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={mounted ? "visible" : "hidden"}
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Toast Container */}
                <ToastContainer position="top-right" />

                {/* Breadcrumb & Header */}
                <motion.div variants={itemVariants}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Activity Overview
                            </h1>
                            <p className="text-slate-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                Real-time platform analytics and engagement metrics
                                {lastUpdated && (
                                    <span className="text-xs text-slate-400">
                                        (Last updated: {lastUpdated.toLocaleTimeString()})
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span className="text-sm font-medium">Refresh</span>
                            </button>
                            <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Filter</span>
                            </button>
                            <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200">
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {loading ? (
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
                        <>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span>+18.2%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {formatNumber(data.overview.totalStudents)}
                                    </div>
                                    <div className="text-sm text-slate-600 mb-1">Total Students</div>
                                    <div className="text-xs text-slate-400">{formatNumber(data.realtime.newStudentsToday)} new today</div>
                                </div>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-cyan-50 text-cyan-600">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span>+8.5%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {formatNumber(data.overview.publishedCourses)}
                                    </div>
                                    <div className="text-sm text-slate-600 mb-1">Active Courses</div>
                                    <div className="text-xs text-slate-400">{formatNumber(data.overview.totalCourses)} total</div>
                                </div>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span>+12.3%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {formatNumber(data.realtime.activeSessionsToday)}
                                    </div>
                                    <div className="text-sm text-slate-600 mb-1">Active Sessions</div>
                                    <div className="text-xs text-slate-400">Last 24 hours</div>
                                </div>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span>+24.1%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {formatCurrency(data.realtime.todayRevenue)}
                                    </div>
                                    <div className="text-sm text-slate-600 mb-1">Today's Revenue</div>
                                    <div className="text-xs text-slate-400">{formatCurrency(data.trends.weekRevenue)} this week</div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Enrollment Trends Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Enrollment Trends
                                        </h2>
                                        <p className="text-sm text-slate-600">Monthly enrollments & revenue</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={data.charts.monthlyEnrollments}>
                                        <defs>
                                            <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="enrollments"
                                            name="Enrollments"
                                            stroke="#6366f1"
                                            fillOpacity={1}
                                            fill="url(#colorEnrollments)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            name="Revenue ($)"
                                            stroke="#06b6d4"
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Daily Activity Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-cyan-50 rounded-lg">
                                        <BarChart3 className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Daily Activity
                                        </h2>
                                        <p className="text-sm text-slate-600">Last 7 days activity</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={data.charts.dailyActivity}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="users" name="New Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="enrollments" name="Enrollments" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="completions" name="Completions" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Second Row - Pie Chart & Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Course Distribution Pie Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <PieChart className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Course Categories
                                    </h2>
                                    <p className="text-sm text-slate-600">Distribution by category</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : data.charts.courseDistribution?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={data.charts.courseDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="count"
                                            nameKey="category"
                                            label={({ category, percent }) => `${category || 'Other'} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {data.charts.courseDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value, name, props) => [
                                                `${value} courses`, 
                                                props.payload.category || 'Uncategorized'
                                            ]}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-80 flex items-center justify-center text-slate-400">
                                    No course data available
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Activity Feed */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Live Activity Feed
                                        </h2>
                                        <p className="text-sm text-slate-600">Real-time updates</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Live
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="animate-pulse flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {/* Recent Users */}
                                    {data.activityFeed.recentUsers?.map((user) => (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="p-2 bg-indigo-50 rounded-full">
                                                <UserPlus className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900">
                                                    New student: {user.name}
                                                </div>
                                                <div className="text-xs text-slate-500 truncate">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {timeAgo(user.time)}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Recent Enrollments */}
                                    {data.activityFeed.recentEnrollments?.map((enrollment) => (
                                        <motion.div
                                            key={enrollment.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="p-2 bg-cyan-50 rounded-full">
                                                <BookOpen className="w-4 h-4 text-cyan-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {enrollment.student} enrolled in
                                                </div>
                                                <div className="text-xs text-slate-500 truncate">
                                                    {enrollment.course}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    enrollment.paymentStatus === 'PAID' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {enrollment.paymentStatus}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {timeAgo(enrollment.time)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Recent Completions */}
                                    {data.activityFeed.recentCompletions?.map((completion) => (
                                        <motion.div
                                            key={completion.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="p-2 bg-green-50 rounded-full">
                                                <GraduationCap className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {completion.student} completed
                                                </div>
                                                <div className="text-xs text-slate-500 truncate">
                                                    {completion.course}
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {timeAgo(completion.time)}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {data.activityFeed.recentUsers?.length === 0 && 
                                     data.activityFeed.recentEnrollments?.length === 0 &&
                                     data.activityFeed.recentCompletions?.length === 0 && (
                                        <div className="text-center py-8 text-slate-400">
                                            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>No recent activity</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Engagement Metrics */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Engagement Metrics
                                    </h2>
                                    <p className="text-sm text-slate-600">Student engagement & progress</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-slate-100 rounded-lg p-4 h-24"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Average Progress */}
                                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                                        {data.engagement.avgProgress || 0}%
                                    </div>
                                    <div className="text-sm text-slate-600 mb-1">Average Progress</div>
                                    <div className="text-xs text-slate-400">
                                        Across all active courses
                                    </div>
                                    <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                                        <div 
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${data.engagement.avgProgress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Total Time Spent */}
                                <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                                    <div className="text-4xl font-bold text-cyan-600 mb-2">
                                        {formatNumber(data.engagement.totalTimeSpent || 0)}
                                    </div>
                                    <div className="text-sm text-slate-600 mb-1">Minutes Total Time</div>
                                    <div className="text-xs text-slate-400">
                                        Students spent learning
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-cyan-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatNumber(data.engagement.avgTimePerUser || 0)} min avg/user</span>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm text-slate-600">Active Enrollments</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {formatNumber(data.overview.totalEnrollments)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm text-slate-600">Paid Enrollments</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {formatNumber(data.overview.paidEnrollments)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                            <span className="text-sm text-slate-600">Total Revenue</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {formatCurrency(data.overview.totalRevenue)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ActivityOverview;

