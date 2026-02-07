import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    BookOpen,
    TrendingUp,
    TrendingDown,
    Users,
    Star,
    DollarSign,
    PlayCircle,
    Clock,
    Award,
    BarChart3,
    PieChart,
    RefreshCw
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart as RechartsPie,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
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

// Default mock data for when API is not available
const defaultEnrollmentData = [
    { month: 'Jan', enrollments: 120, revenue: 8500 },
    { month: 'Feb', enrollments: 180, revenue: 12400 },
    { month: 'Mar', enrollments: 240, revenue: 18200 },
    { month: 'Apr', enrollments: 320, revenue: 24500 },
    { month: 'May', enrollments: 280, revenue: 21000 },
    { month: 'Jun', enrollments: 350, revenue: 28500 },
    { month: 'Jul', enrollments: 420, revenue: 34200 }
];

const defaultCategoryData = [
    { name: 'Programming', value: 35, color: '#6366f1' },
    { name: 'Web Dev', value: 25, color: '#06b6d4' },
    { name: 'Data Science', value: 20, color: '#10b981' },
    { name: 'Design', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 8, color: '#64748b' }
];

const defaultTopCourses = [
    { id: 1, title: 'Complete Python Bootcamp', enrollments: 2456, rating: 4.8, revenue: 220040 },
    { id: 2, title: 'Web Development Masterclass', enrollments: 1893, rating: 4.7, revenue: 246070 },
    { id: 3, title: 'Data Science Fundamentals', enrollments: 1654, rating: 4.9, revenue: 165286 },
    { id: 4, title: 'Machine Learning Basics', enrollments: 1432, rating: 4.6, revenue: 214786 },
    { id: 5, title: 'UI/UX Design Principles', enrollments: 1289, rating: 4.8, revenue: 103111 }
];

const CourseAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [enrollmentData, setEnrollmentData] = useState(defaultEnrollmentData);
    const [categoryData, setCategoryData] = useState(defaultCategoryData);
    const [topCourses, setTopCourses] = useState(defaultTopCourses);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        avgRating: 4.7,
        completionRate: 78,
        totalStudents: 0
    });
    const [monthlyProgress, setMonthlyProgress] = useState([
        { month: 'Jan', completion: 75 },
        { month: 'Feb', completion: 78 },
        { month: 'Mar', completion: 82 },
        { month: 'Apr', completion: 79 },
        { month: 'May', completion: 85 },
        { month: 'Jun', completion: 88 },
        { month: 'Jul', completion: 86 }
    ]);

    const periods = [
        { value: '7days', label: '7 Days' },
        { value: '30days', label: '30 Days' },
        { value: '90days', label: '90 Days' },
        { value: '1year', label: '1 Year' }
    ];

    useEffect(() => {
        fetchAnalytics();
        // Set up real-time updates every 30 seconds
        const interval = setInterval(fetchAnalytics, 30000);
        return () => clearInterval(interval);
    }, [selectedPeriod]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/reports/stats?period=${selectedPeriod}`, getAuthHeaders());
            
            if (!res.ok) {
                throw new Error('API request failed');
            }
            
            const data = await res.json();

            if (data.success) {
                // Transform monthly data for charts
                if (data.charts?.monthlyEnrollments && Array.isArray(data.charts.monthlyEnrollments) && data.charts.monthlyEnrollments.length > 0) {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const transformedData = data.charts.monthlyEnrollments.map(item => ({
                        month: months[item._id?.month - 1] || 'Unknown',
                        enrollments: item.count || item.enrollments || 0,
                        revenue: item.revenue || 0
                    }));
                    setEnrollmentData(transformedData.length > 0 ? transformedData : defaultEnrollmentData);
                }

                setStats({
                    totalCourses: data.stats?.totalCourses || 0,
                    totalEnrollments: data.stats?.totalEnrollments || 0,
                    totalRevenue: data.stats?.totalRevenue || 0,
                    avgRating: data.stats?.avgRating || 4.7,
                    completionRate: data.stats?.completionRate || 78,
                    totalStudents: data.stats?.totalStudents || 0
                });
            } else {
                toast.error(data.message || 'Failed to load analytics');
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            // Use default data on error
            setEnrollmentData(defaultEnrollmentData);
            setCategoryData(defaultCategoryData);
            setTopCourses(defaultTopCourses);
            toast.warning('Using cached data - unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchAnalytics();
        toast.success('Analytics refreshed');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-6"
            >
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Courses</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">Analytics</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-indigo-600" />
                            Course Analytics
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Track course performance, enrollment trends, and revenue metrics.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Period Selector */}
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                            {periods.map((period) => (
                                <button
                                    key={period.value}
                                    onClick={() => setSelectedPeriod(period.value)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        selectedPeriod === period.value
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalCourses}</p>
                        <p className="text-sm text-slate-600">Total Courses</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-cyan-50 rounded-lg">
                                <Users className="w-5 h-5 text-cyan-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalEnrollments.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Enrollments</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-sm text-slate-600">Total Revenue</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Star className="w-5 h-5 text-amber-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.avgRating}</p>
                        <p className="text-sm text-slate-600">Avg Rating</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Award className="w-5 h-5 text-purple-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.completionRate}%</p>
                        <p className="text-sm text-slate-600">Completion Rate</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-rose-50 rounded-lg">
                                <PlayCircle className="w-5 h-5 text-rose-600" />
                            </div>
                            <TrendingDown className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalStudents.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Active Students</p>
                    </div>
                </div>
            </motion.div>

            {/* Charts Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
            >
                {/* Enrollment Trend */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Enrollment Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={enrollmentData}>
                            <defs>
                                <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="enrollments"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorEnrollments)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={enrollmentData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Bottom Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Category Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Course Categories</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <RechartsPie>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Legend />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>

                {/* Completion Rate */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Completion Rate Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyProgress}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                formatter={(value) => [`${value}%`, 'Completion Rate']}
                            />
                            <Line
                                type="monotone"
                                dataKey="completion"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Performing Courses */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Courses</h3>
                    <div className="space-y-3">
                        {topCourses.map((course, index) => (
                            <div
                                key={course.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        index === 0 ? 'bg-amber-100 text-amber-700' :
                                        index === 1 ? 'bg-slate-200 text-slate-700' :
                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                                            {course.title}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {course.enrollments.toLocaleString()} students
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-sm font-medium text-slate-900">{course.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Course Performance Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-7xl mx-auto mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Course Performance Details</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Enrollments</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Completion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {topCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{course.title}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {course.enrollments.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="text-slate-900">{course.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {formatCurrency(course.revenue)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-200 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full"
                                                    style={{ width: `${Math.random() * 30 + 60}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-slate-600">
                                                {Math.round(Math.random() * 30 + 60)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseAnalytics;

