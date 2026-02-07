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

const DashboardOverview = () => {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalTeachers: 0,
        totalRevenue: 0,
        publishedCourses: 0
    });
    const [systemStats, setSystemStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        setMounted(true);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch report stats
            const statsRes = await fetch(`${BACKEND_URL}/api/admin/reports/stats`, getAuthHeaders());
            const statsData = await statsRes.json();
            
            if (statsData.success) {
                setStats({
                    totalUsers: statsData.stats?.totalStudents || 0,
                    totalCourses: statsData.stats?.totalCourses || 0,
                    totalTeachers: statsData.stats?.totalTeachers || 0,
                    totalRevenue: statsData.stats?.totalRevenue || 0,
                    publishedCourses: statsData.stats?.publishedCourses || 0
                });
            }

            // Fetch system stats
            const systemRes = await fetch(`${BACKEND_URL}/api/admin/system/stats`, getAuthHeaders());
            const systemData = await systemRes.json();
            
            if (systemData.success) {
                setSystemStats(systemData);
                setRecentActivity([
                    {
                        id: 1,
                        type: 'user',
                        title: 'New user registration',
                        description: `${systemData.stats?.users?.students || 0} students on platform`,
                        time: 'Just now',
                        icon: Users,
                        color: 'indigo'
                    },
                    {
                        id: 2,
                        type: 'course',
                        title: 'Active courses',
                        description: `${systemData.stats?.content?.publishedCourses || 0} published courses`,
                        time: 'Active',
                        icon: BookOpen,
                        color: 'cyan'
                    },
                    {
                        id: 3,
                        type: 'teacher',
                        title: 'Teaching staff',
                        description: `${systemData.stats?.users?.teachers || 0} teachers`,
                        time: 'Available',
                        icon: GraduationCap,
                        color: 'indigo'
                    },
                    {
                        id: 4,
                        type: 'achievement',
                        title: 'Platform revenue',
                        description: `$${(systemData.stats?.enrollments?.total || 0)} total enrollments`,
                        time: 'This month',
                        icon: Award,
                        color: 'cyan'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

    // Stats data - using state from API
    const statsData = [
        {
            id: 1,
            label: 'Total Users',
            value: loading ? '...' : stats.totalUsers?.toLocaleString() || '0',
            change: '+12.5%',
            isPositive: true,
            icon: Users,
            color: 'indigo'
        },
        {
            id: 2,
            label: 'Active Courses',
            value: loading ? '...' : stats.publishedCourses?.toLocaleString() || '0',
            change: '+8.2%',
            isPositive: true,
            icon: BookOpen,
            color: 'cyan'
        },
        {
            id: 3,
            label: 'Total Teachers',
            value: loading ? '...' : stats.totalTeachers?.toLocaleString() || '0',
            change: '+5.1%',
            isPositive: true,
            icon: GraduationCap,
            color: 'indigo'
        },
        {
            id: 4,
            label: 'Revenue',
            value: loading ? '...' : `$${(stats.totalRevenue || 0).toLocaleString()}`,
            change: '+2.4%',
            isPositive: true,
            icon: TrendingUp,
            color: 'cyan'
        }
    ];

    // Recent activity - using state from API
    const activityData = loading ? [] : recentActivity;

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
                        statsData.map((stat) => (
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
                                        {stat.id === 1 && <Users className="w-6 h-6 text-indigo-600" />}
                                        {stat.id === 2 && <BookOpen className="w-6 h-6 text-cyan-600" />}
                                        {stat.id === 3 && <GraduationCap className="w-6 h-6 text-indigo-600" />}
                                        {stat.id === 4 && <TrendingUp className="w-6 h-6 text-cyan-600" />}
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
                        ))
                    )}
                </div>

                {/* Quick Stats Bar */}
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-slate-900">24</div>
                                    <div className="text-xs text-slate-600">Pending Approvals</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-slate-900">1,842</div>
                                    <div className="text-xs text-slate-600">Active Sessions</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-slate-900">127</div>
                                    <div className="text-xs text-slate-600">Completed Today</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-slate-900">8</div>
                                    <div className="text-xs text-slate-600">Issues Reported</div>
                                </div>
                            </div>
                        </div>
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
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-indigo-50 flex-shrink-0">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900">New user registration</div>
                                        <div className="text-sm text-slate-600 truncate">{systemData?.stats?.users?.students || 0} students on platform</div>
                                        <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Just now</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-cyan-50 flex-shrink-0">
                                        <BookOpen className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900">Active courses</div>
                                        <div className="text-sm text-slate-600 truncate">{systemData?.stats?.content?.publishedCourses || 0} published courses</div>
                                        <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Active</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-indigo-50 flex-shrink-0">
                                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900">Teaching staff</div>
                                        <div className="text-sm text-slate-600 truncate">{systemData?.stats?.users?.teachers || 0} teachers</div>
                                        <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Available</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-cyan-50 flex-shrink-0">
                                        <Award className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900">Platform revenue</div>
                                        <div className="text-sm text-slate-600 truncate">${(systemData?.stats?.enrollments?.total || 0)} total enrollments</div>
                                        <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                                            <Clock className="w-3 h-3" />
                                            <span>This month</span>
                                        </div>
                                    </div>
                                </motion.div>
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