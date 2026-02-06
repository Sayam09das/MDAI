import React, { useState, useEffect, useCallback } from 'react';
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
    RefreshCw,
    Zap,
    Award
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    LineChart as RechartsLineChart,
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
    AreaChart,
    RadialBarChart,
    RadialBar
} from 'recharts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        if (window.location.pathname.includes('/admin')) {
            window.location.href = "/admin/login";
        }
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };
};

const StudentActivityAnalytics = () => {
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
            enrollmentByPayment: []
        },
        topPerformers: {
            students: [],
            courses: []
        }
    });

    const fetchData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/analytics/students`, getAuthHeaders());

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
                if (showRefresh) toast.success('Activity analytics refreshed!');
            } else {
                throw new Error(result.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching activity analytics:', error);
            // Only show toast error if not already handled by another component
            if (!error.message.includes('Server returned an invalid response')) {
                toast.error('Failed to load activity analytics');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchData();
        const intervalId = setInterval(() => fetchData(false), 30000);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    const handleRefresh = () => fetchData(true);

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

    // Colors
    const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const STATUS_COLORS = {
        'ACTIVE': '#10b981',
        'COMPLETED': '#6366f1',
        'PENDING': '#f59e0b',
        'cancelled': '#ef4444'
    };

    // Format helpers
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '0';
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num || 0);
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.name?.includes('Revenue') || entry.name?.includes('Amount') ? formatCurrency(entry.value) : formatNumber(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Loading skeleton
    const ChartSkeleton = ({ title, description }) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
            <div className="h-80 bg-slate-50 animate-pulse"></div>
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
                <ToastContainer position="top-right" />

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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Student Activity Analytics
                            </h1>
                            <p className="text-slate-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                Real-time student engagement and activity patterns
                                {lastUpdated && (
                                    <span className="text-xs text-slate-400">
                                        (Updated: {lastUpdated.toLocaleTimeString()})
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Refresh Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200 bg-white shadow-sm disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">Refresh</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Chart - Student Registration Growth */}
                <motion.div variants={itemVariants}>
                    {loading ? (
                        <ChartSkeleton
                            title="Enrollment Trends"
                            description="Monthly enrollment and revenue overview"
                        />
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Enrollment Trends
                                        </h2>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Monthly enrollment and revenue overview
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <ResponsiveContainer width="100%" height={380}>
                                    <AreaChart data={data.charts.enrollmentTrends}>
                                        <defs>
                                            <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                        <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="enrollments"
                                            name="Enrollments"
                                            stroke="#6366f1"
                                            fillOpacity={1}
                                            fill="url(#colorEnroll)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="revenue"
                                            name="Revenue"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorRev)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Two Column Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Activity */}
                    <motion.div variants={itemVariants}>
                        {loading ? (
                            <ChartSkeleton title="Daily Activity" description="Enrollments and completions" />
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-cyan-50 rounded-lg">
                                            <BarChart3 className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                Daily Activity
                                            </h2>
                                            <p className="text-sm text-slate-600">
                                                Enrollments and completions (Last 7 days)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={data.charts.dailyActivity}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                                            <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="enrollments" name="Enrollments" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="completions" name="Completions" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Enrollment Status */}
                    <motion.div variants={itemVariants}>
                        {loading ? (
                            <ChartSkeleton title="Enrollment Status" description="Current distribution" />
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                            <PieChart className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                Enrollment Status
                                            </h2>
                                            <p className="text-sm text-slate-600">
                                                Distribution by current status
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <ResponsiveContainer width="100%" height={280}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={data.charts.enrollmentByStatus}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="count"
                                                nameKey="status"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {data.charts.enrollmentByStatus?.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={STATUS_COLORS[entry.status?.toUpperCase()] || COLORS[index % COLORS.length]} 
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Top Performers Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performing Students */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Award className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Top Performing Students
                                        </h2>
                                        <p className="text-sm text-slate-600">
                                            Most completed courses
                                        </p>
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
                                                <div className="h-6 bg-slate-200 rounded w-12"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : data.topPerformers.students?.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.topPerformers.students.map((student, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                                                        {student.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">
                                                            {student.name || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {student.email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-indigo-600">
                                                        {student.completedCourses}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        courses
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Top Enrolled Courses */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Top Enrolled Courses
                                        </h2>
                                        <p className="text-sm text-slate-600">
                                            Most popular by enrollment count
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="animate-pulse flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-slate-200 rounded"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                                </div>
                                                <div className="h-6 bg-slate-200 rounded w-16"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : data.topPerformers.courses?.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.topPerformers.courses.map((course, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded bg-cyan-600 text-white flex items-center justify-center font-semibold">
                                                        {course.title?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 truncate max-w-[200px]">
                                                            {course.title || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {formatCurrency(course.revenue)} revenue
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-cyan-600">
                                                        {course.students}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        students
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Summary Stats Row */}
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Real-time stat cards */}
                        {[
                            { label: 'New Today', value: formatNumber(data.realtime.newEnrollmentsToday), icon: Users, color: 'indigo' },
                            { label: 'Completed Today', value: formatNumber(data.realtime.completionsToday), icon: Activity, color: 'green' },
                            { label: 'Revenue Today', value: formatCurrency(data.realtime.todayRevenue), icon: TrendingUp, color: 'amber' },
                            { label: 'Avg Progress', value: `${data.charts?.progressStats?.avgProgress || 0}%`, icon: Award, color: 'cyan' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                    </div>
                                    <span className="text-sm text-slate-600">{stat.label}</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900">
                                    {loading ? '...' : stat.value}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudentActivityAnalytics;

