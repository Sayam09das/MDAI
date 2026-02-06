import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    GraduationCap,
    TrendingUp,
    ArrowUpRight,
    RefreshCw,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    PieChart,
    Zap,
    Mail
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

const UserAnalytics = () => {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [data, setData] = useState({
        overview: {},
        realtime: {},
        trends: {},
        charts: {
            userGrowth: [],
            dailyNewUsers: [],
            userAgeDistribution: [],
            genderDistribution: [],
            topActiveStudents: []
        },
        recentUsers: {
            students: [],
            teachers: []
        }
    });

    const fetchUserData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/analytics/users`, getAuthHeaders());

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
                if (showRefresh) toast.success('User analytics refreshed!');
            } else {
                throw new Error(result.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching user analytics:', error);
            // Only show toast error if not already handled by another component
            if (!error.message.includes('Server returned an invalid response')) {
                toast.error('Failed to load user analytics');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchUserData();
        const intervalId = setInterval(() => fetchUserData(false), 30000);
        return () => clearInterval(intervalId);
    }, [fetchUserData]);

    const handleRefresh = () => fetchUserData(true);

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

    const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '0';
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
            label: 'Total Users',
            value: loading ? '...' : formatNumber(data.overview.totalUsers),
            change: '+12.5%',
            isPositive: true,
            icon: Users,
            color: 'indigo',
            subtext: `${formatNumber(data.overview.activeUsers)} active`
        },
        {
            id: 2,
            label: 'Students',
            value: loading ? '...' : formatNumber(data.overview.totalUsers),
            change: '+15.2%',
            isPositive: true,
            icon: GraduationCap,
            color: 'cyan',
            subtext: `${formatNumber(data.overview.verifiedUsers)} verified`
        },
        {
            id: 3,
            label: 'Teachers',
            value: loading ? '...' : formatNumber(data.overview.totalTeachers),
            change: '+8.1%',
            isPositive: true,
            icon: UserPlus,
            color: 'green',
            subtext: `${formatNumber(data.trends.newTeachersThisMonth)} this month`
        },
        {
            id: 4,
            label: 'New Users Today',
            value: loading ? '...' : formatNumber(data.realtime.newUsersToday),
            change: '+22.3%',
            isPositive: true,
            icon: TrendingUp,
            color: 'amber',
            subtext: 'Last 24 hours'
        }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {formatNumber(entry.value)}
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
                <ToastContainer position="top-right" />

                {/* Header */}
                <motion.div variants={itemVariants}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                User Analytics
                            </h1>
                            <p className="text-slate-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                Real-time user statistics and trends
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
                                        <div className={`flex items-center space-x-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
                    {/* User Growth Chart */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">User Growth</h2>
                                    <p className="text-sm text-slate-600">Monthly user registrations</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={data.charts.userGrowth}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            name="New Users"
                                            stroke="#6366f1"
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Daily New Users */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-cyan-50 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-cyan-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Daily Signups</h2>
                                    <p className="text-sm text-slate-600">Last 7 days</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={data.charts.dailyNewUsers}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="users" name="Signups" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Distribution Pie Chart */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <PieChart className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">User Age Distribution</h2>
                                    <p className="text-sm text-slate-600">By registration time</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-80 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={data.charts.userAgeDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            nameKey="label"
                                        >
                                            {data.charts.userAgeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Top Active Students */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <GraduationCap className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">Most Active Students</h2>
                                        <p className="text-sm text-slate-600">By enrollment count</p>
                                    </div>
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
                                    {data.charts.topActiveStudents?.map((student, index) => (
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
                                                    <div className="font-medium text-slate-900">{student.name || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500">{student.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-indigo-600">{student.enrollmentCount}</div>
                                                <div className="text-xs text-slate-500">enrollments</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {(!data.charts.topActiveStudents || data.charts.topActiveStudents.length === 0) && (
                                        <div className="text-center py-8 text-slate-400">
                                            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>No data available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Users Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Students */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Recent Students</h2>
                                    <p className="text-sm text-slate-600">Latest registrations</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <div key={i} className="animate-pulse flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    data.recentUsers.students?.map((student) => (
                                        <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold">
                                                    {student.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{student.name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />{student.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {student.isVerified ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                                )}
                                                {student.isSuspended && (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-xs text-slate-400">{timeAgo(student.time)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Teachers */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Recent Teachers</h2>
                                    <p className="text-sm text-slate-600">Latest registrations</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <div key={i} className="animate-pulse flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    data.recentUsers.teachers?.map((teacher) => (
                                        <div key={teacher.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                                                    {teacher.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{teacher.name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />{teacher.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400">{timeAgo(teacher.time)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserAnalytics;

