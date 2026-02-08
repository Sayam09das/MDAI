import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    GraduationCap,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    RefreshCw,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart3,
    PieChart,
    Zap,
    Target,
    Calendar,
    Award
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

const StudentAnalytics = () => {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [data, setData] = useState({
        overview: {},
        realtime: {},
        trends: {},
        charts: {
            enrollmentTrends: [],
            dailyActivity: [],
            enrollmentByStatus: [],
            enrollmentByPayment: [],
            progressStats: {}
        },
        topPerformers: {
            students: [],
            courses: []
        },
        recentEnrollments: []
    });

    const fetchStudentData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/analytics/students`, getAuthHeaders());
            const result = await res.json();

            if (result.success) {
                setData(result);
                setLastUpdated(new Date());
                if (showRefresh) toast.success('Student analytics refreshed!');
            } else {
                throw new Error(result.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching student analytics:', error);
            toast.error('Failed to load student analytics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchStudentData();
        const intervalId = setInterval(() => fetchStudentData(false), 30000);
        return () => clearInterval(intervalId);
    }, [fetchStudentData]);

    const handleRefresh = () => fetchStudentData(true);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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

    const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '0';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

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

    const statsCards = [
        {
            id: 1,
            label: 'Total Students',
            value: loading ? '...' : formatNumber(data.overview.totalStudents),
            change: '+18.2%',
            isPositive: true,
            icon: Users,
            color: 'indigo',
            subtext: `${formatNumber(data.overview.activeStudents)} active`
        },
        {
            id: 2,
            label: 'Total Enrollments',
            value: loading ? '...' : formatNumber(data.overview.totalEnrollments),
            change: '+24.5%',
            isPositive: true,
            icon: BookOpen,
            color: 'cyan',
            subtext: `${formatNumber(data.overview.activeEnrollments)} active`
        },
        {
            id: 3,
            label: 'Completed',
            value: loading ? '...' : formatNumber(data.overview.completedEnrollments),
            change: '+12.8%',
            isPositive: true,
            icon: GraduationCap,
            color: 'green',
            subtext: 'Course completions'
        },
        {
            id: 4,
            label: 'Total Revenue',
            value: loading ? '...' : formatCurrency(data.overview.totalRevenue),
            change: '+31.2%',
            isPositive: true,
            icon: DollarSign,
            color: 'amber',
            subtext: `${formatCurrency(data.trends.weekRevenue)} this week`
        }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name.includes('Revenue') ? `${entry.name}: ${formatCurrency(entry.value)}` : `${entry.name}: ${formatNumber(entry.value)}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'ACTIVE': return 'bg-blue-100 text-blue-700';
            case 'COMPLETED': return 'bg-purple-100 text-purple-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={mounted ? "visible" : "hidden"}
                className="max-w-7xl mx-auto space-y-6"
            >
                <ToastContainer position="top-right" />

                {/* Header */}
                <motion.div variants={itemVariants}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Student Analytics
                            </h1>
                            <p className="text-slate-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                Real-time student engagement and enrollment metrics
                                {lastUpdated && (
                                    <span className="text-xs text-slate-400">
                                        (Updated: {lastUpdated.toLocaleTimeString()})
                                    </span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <motion.div key={i} variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        statsCards.map((stat) => {
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
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className={`flex items-center space-x-1 text-sm font-medium text-green-600`}>
                                            <ArrowUpRight className="w-4 h-4" />
                                            <span>{stat.change}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                                        <div className="text-xs text-slate-400">{stat.subtext}</div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Enrollment Trends */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Enrollment Trends</h2>
                                    <p className="text-sm text-slate-600">Monthly enrollments & completions</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={data.charts.enrollmentTrends}>
                                        <defs>
                                            <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorComplete" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke="#6366f1" fillOpacity={1} fill="url(#colorEnroll)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="completions" name="Completions" stroke="#10b981" fillOpacity={1} fill="url(#colorComplete)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Revenue Chart */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-cyan-50 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-cyan-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Revenue Trends</h2>
                                    <p className="text-sm text-slate-600">Monthly revenue from enrollments</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={data.charts.enrollmentTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${formatNumber(v)}`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="revenue" name="Revenue ($)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Daily Activity */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Daily Activity</h2>
                                    <p className="text-sm text-slate-600">Last 7 days enrollments & completions</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-64 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={data.charts.dailyActivity}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="enrollments" name="Enrollments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="completions" name="Completions" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Progress Stats */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Target className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Progress Metrics</h2>
                                    <p className="text-sm text-slate-600">Student engagement</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-lg"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-indigo-600 mb-2">
                                            {data.charts.progressStats?.avgProgress || 0}%
                                        </div>
                                        <div className="text-sm text-slate-600">Average Progress</div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${data.charts.progressStats?.avgProgress || 0}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-cyan-600 mb-2">
                                            {formatNumber(data.charts.progressStats?.totalTimeSpent || 0)}
                                        </div>
                                        <div className="text-sm text-slate-600">Minutes Total</div>
                                        <div className="text-xs text-slate-400 mt-1">Learning time</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-green-600 mb-2">
                                            {formatNumber(data.charts.progressStats?.avgTimePerStudent || 0)}
                                        </div>
                                        <div className="text-sm text-slate-600">Min/Student Avg</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performing Students */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Award className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Top Performers</h2>
                                    <p className="text-sm text-slate-600">Students with most completions</p>
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
                                <div className="space-y-4">
                                    {data.topPerformers.students?.map((student, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold">
                                                    {student.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{student.name || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500">{student.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-purple-600 font-semibold">
                                                    <GraduationCap className="w-4 h-4" />
                                                    {student.completedCourses}
                                                </div>
                                                <div className="text-xs text-slate-500">completed</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {(!data.topPerformers.students || data.topPerformers.students.length === 0) && (
                                        <div className="text-center py-8 text-slate-400">
                                            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>No data available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Top Enrolled Courses */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-cyan-50 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-cyan-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Popular Courses</h2>
                                    <p className="text-sm text-slate-600">Most enrolled courses</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="animate-pulse flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.topPerformers.courses?.map((course, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 truncate max-w-[200px]">{course.title || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500">{course.students} students</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-green-600">{formatCurrency(course.revenue)}</div>
                                                <div className="text-xs text-slate-500">revenue</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {(!data.topPerformers.courses || data.topPerformers.courses.length === 0) && (
                                        <div className="text-center py-8 text-slate-400">
                                            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>No data available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Enrollments */}
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Recent Enrollments</h2>
                                <p className="text-sm text-slate-600">Latest student enrollments</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <th className="pb-3">Student</th>
                                        <th className="pb-3">Course</th>
                                        <th className="pb-3">Progress</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Payment</th>
                                        <th className="pb-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="py-3"><div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div></td>
                                                <td className="py-3"><div className="h-6 bg-slate-200 rounded w-40 animate-pulse"></div></td>
                                                <td className="py-3"><div className="h-6 bg-slate-200 rounded w-20 animate-pulse"></div></td>
                                                <td className="py-3"><div className="h-6 bg-slate-200 rounded w-16 animate-pulse"></div></td>
                                                <td className="py-3"><div className="h-6 bg-slate-200 rounded w-16 animate-pulse"></div></td>
                                                <td className="py-3"><div className="h-6 bg-slate-200 rounded w-20 animate-pulse"></div></td>
                                            </tr>
                                        ))
) : (
                                        data.recentEnrollments?.map((enrollment) => (
                                            <tr key={enrollment.id} className="hover:bg-slate-50">
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                                                            {typeof enrollment.student === 'string' 
                                                                ? enrollment.student.charAt(0) 
                                                                : enrollment.student?.fullName?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900">
                                                                {typeof enrollment.student === 'string' 
                                                                    ? enrollment.student 
                                                                    : enrollment.student?.fullName || 'Unknown Student'}
                                                            </div>
                                                            <div className="text-xs text-slate-500">{enrollment.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="font-medium text-slate-900 truncate max-w-[200px]">{enrollment.course}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-16 bg-slate-200 rounded-full h-2">
                                                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${enrollment.progress || 0}%` }}></div>
                                                        </div>
                                                        <span className="text-xs text-slate-600">{enrollment.progress || 0}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(enrollment.status)}`}>
                                                        {enrollment.status}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(enrollment.paymentStatus)}`}>
                                                        {enrollment.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-sm text-slate-500">
                                                    {timeAgo(enrollment.time)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {(!data.recentEnrollments || data.recentEnrollments.length === 0) && !loading && (
                                <div className="text-center py-8 text-slate-400">
                                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No recent enrollments</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudentAnalytics;

