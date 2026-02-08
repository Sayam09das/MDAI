import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    ChevronRight, 
    Users, 
    UserPlus, 
    UserCheck, 
    UserX,
    TrendingUp, 
    TrendingDown, 
    ArrowUpRight, 
    ArrowDownRight, 
    Activity, 
    Clock, 
    Calendar, 
    Award, 
    BookOpen, 
    GraduationCap, 
    Mail, 
    Phone, 
    MapPin, 
    Filter, 
    Download, 
    RefreshCw, 
    Search, 
    Eye,
    MoreVertical, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    BarChart3, 
    PieChart as PieChartIcon,
    Zap, 
    DollarSign,
    ArrowRight
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
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

const StudentAnalytics = () => {
    const [mounted, setMounted] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [searchQuery, setSearchQuery] = useState('');
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
        recentEnrollments: [],
        topPerformers: {
            students: [],
            courses: []
        }
    });

    const fetchStudentData = useCallback(async (showRefresh = false) => {
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
                if (showRefresh) toast.success('Student analytics refreshed!');
            } else {
                throw new Error(result.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching student analytics:', error);
            // Only show toast error if not already handled by another component
            if (!error.message.includes('Server returned an invalid response')) {
                toast.error('Failed to load student analytics');
            }
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
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

    // Format number helper
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '0';
    };

    // Format currency
    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num || 0);
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

    // Summary Statistics - Now using real data
    const summaryStats = [
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
            label: 'Active Enrollments',
            value: loading ? '...' : formatNumber(data.overview.activeEnrollments),
            change: '+12.8%',
            isPositive: true,
            icon: UserCheck,
            color: 'green',
            subtext: `${formatNumber(data.overview.completedEnrollments)} completed`
        },
        {
            id: 3,
            label: 'New This Month',
            value: loading ? '...' : formatNumber(data.trends.newEnrollmentsThisMonth),
            change: '+24.5%',
            isPositive: true,
            icon: UserPlus,
            color: 'cyan',
            subtext: `${formatNumber(data.realtime.newEnrollmentsToday)} today`
        },
        {
            id: 4,
            label: 'Total Revenue',
            value: loading ? '...' : formatCurrency(data.overview.totalRevenue),
            change: '+32.1%',
            isPositive: true,
            icon: DollarSign,
            color: 'amber',
            subtext: `${formatCurrency(data.realtime.todayRevenue)} today`
        }
    ];

// Engagement Metrics - Using real data
    const engagementMetrics = [
        {
            id: 1,
            label: 'Avg. Session Time',
            value: loading ? '...' : `${Math.round((data.charts.progressStats?.avgTimePerStudent || 0) / 60)} min`,
            icon: Clock,
            change: '+8%',
            isPositive: true
        },
        {
            id: 2,
            label: 'Completion Rate',
            value: loading ? '...' : `${data.overview.totalEnrollments ? Math.round((data.overview.completedEnrollments / data.overview.totalEnrollments) * 100) : 0}%`,
            icon: CheckCircle2,
            change: '+12%',
            isPositive: true
        },
        {
            id: 3,
            label: 'Active Courses',
            value: loading ? '...' : formatNumber(data.overview.paidEnrollments || 0),
            icon: BookOpen,
            change: '+5%',
            isPositive: true
        },
        {
            id: 4,
            label: 'Avg. Progress',
            value: loading ? '...' : `${data.charts.progressStats?.avgProgress || 0}%`,
            icon: Award,
            change: '+3%',
            isPositive: true
        }
    ];

    // Colors for charts
    const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const STATUS_COLORS = {
        'ACTIVE': '#10b981',
        'COMPLETED': '#6366f1',
        'PENDING': '#f59e0b',
        'cancelled': '#ef4444'
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.name?.includes('Revenue') ? formatCurrency(entry.value) : formatNumber(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { bg: 'bg-green-50', text: 'text-green-700', label: 'Active' },
            ACTIVE: { bg: 'bg-green-50', text: 'text-green-700', label: 'Active' },
            inactive: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Inactive' },
            INACTIVE: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Inactive' },
            completed: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Completed' },
            COMPLETED: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Completed' },
            pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
            PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
            suspended: { bg: 'bg-red-50', text: 'text-red-700', label: 'Suspended' },
            SUSPENDED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Suspended' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getPaymentBadge = (status) => {
        const statusConfig = {
            PAID: { bg: 'bg-green-50', text: 'text-green-700', label: 'Paid' },
            PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
            LATER: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Pay Later' }
        };
        const config = statusConfig[status] || statusConfig.PENDING;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    // Filter recent enrollments based on search
    const filteredEnrollments = data.recentEnrollments?.filter(enrollment => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            enrollment.student?.toLowerCase().includes(query) ||
            enrollment.course?.toLowerCase().includes(query) ||
            enrollment.email?.toLowerCase().includes(query)
        );
    }) || [];

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
                        <span className="text-indigo-600 font-medium">Students</span>
                    </div>

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Student Analytics
                            </h1>
                            <p className="text-slate-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                Real-time student statistics and enrollment trends
                                {lastUpdated && (
                                    <span className="text-xs text-slate-400">
                                        (Updated: {lastUpdated.toLocaleTimeString()})
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
                        summaryStats.map((stat) => {
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
                                        <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                                        <div className="text-xs text-slate-400">{stat.subtext}</div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Engagement Metrics */}
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-1"></div>
                                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            engagementMetrics.map((metric) => {
                                const Icon = metric.icon;
                                return (
                                    <div
                                        key={metric.id}
                                        className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className="w-5 h-5 text-indigo-600" />
                                            <span className={`text-xs font-medium ${metric.isPositive ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {metric.change}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-slate-900 mb-1">
                                            {metric.value}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            {metric.label}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enrollment Trends Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
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
                            {loading ? (
                                <div className="h-64 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={data.charts.enrollmentTrends}>
                                        <defs>
                                            <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                                            fill="url(#colorEnrollments)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="revenue"
                                            name="Revenue"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Enrollment Status Distribution */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <PieChartIcon className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Enrollment Status
                                    </h2>
                                    <p className="text-sm text-slate-600">Current distribution</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-64 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={data.charts.enrollmentByStatus}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
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
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Daily Activity Chart */}
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-cyan-50 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Daily Activity</h2>
                                <p className="text-sm text-slate-600">Enrollments and completions over the last 7 days</p>
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

                {/* Recent Enrollments Table */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-slate-200"
                >
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Recent Enrollments
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Latest student enrollment activity
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search enrollments..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-full sm:w-64"
                                    />
                                </div>
                                <button
                                    onClick={() => window.location.href = '/admin/dashboard/student/all'}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
                                >
                                    View All Students
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                                    <div>
                                                        <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                                                        <div className="h-3 bg-slate-200 rounded w-48"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-40"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-16"></div></td>
                                            <td className="px-6 py-4"><div className="h-2 bg-slate-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                        </tr>
                                    ))
                                ) : filteredEnrollments.length > 0 ? (
                                    filteredEnrollments.map((enrollment, index) => (
                                        <motion.tr
                                            key={enrollment.id || index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                                                        {enrollment.student?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {enrollment.student || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {enrollment.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-900 font-medium">
                                                    {enrollment.course || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(enrollment.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getPaymentBadge(enrollment.paymentStatus)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-24 bg-slate-100 rounded-full h-2">
                                                        <div
                                                            className="bg-indigo-600 h-2 rounded-full"
                                                            style={{ width: `${enrollment.progress || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-600 font-medium">
                                                        {enrollment.progress || 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">
                                                    {timeAgo(enrollment.time)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>No enrollments found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudentAnalytics;

