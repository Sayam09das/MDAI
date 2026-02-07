import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    DollarSign,
    Wallet,
    TrendingUp,
    Users,
    BookOpen,
    RefreshCw,
    CheckCircle,
    Clock,
    Calendar,
    CreditCard
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('teacherToken') || localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };
};

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0);
};

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};

const TeacherFinance = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        overview: {
            totalEarnings: 0,
            pendingEarnings: 0,
            totalPaidOut: 0,
            courseCount: 0,
            studentCount: 0
        },
        courses: [],
        recentPayments: []
    });

    const fetchFinanceData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/teacher/finance/overview`, getAuthHeaders());
            
            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    setData(result);
                }
            }
        } catch (error) {
            console.error("Error fetching finance data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchFinanceData();
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your earnings...</p>
                </div>
            </div>
        );
    }

    const { overview, courses, recentPayments } = data;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb & Header */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">My Earnings</span>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        My Earnings
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Track your course revenue and payment history
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Earnings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-green-50">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {formatCurrency(overview.totalEarnings)}
                        </div>
                        <div className="text-sm text-slate-600">Total Earnings (90%)</div>
                    </motion.div>

                    {/* Pending Earnings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-amber-50">
                                <Wallet className="w-6 h-6 text-amber-600" />
                            </div>
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {formatCurrency(overview.pendingEarnings)}
                        </div>
                        <div className="text-sm text-slate-600">Pending Payment</div>
                    </motion.div>

                    {/* Paid Out */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-indigo-50">
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                            </div>
                            <CheckCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {formatCurrency(overview.totalPaidOut)}
                        </div>
                        <div className="text-sm text-slate-600">Paid Out</div>
                    </motion.div>

                    {/* Total Students */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-cyan-50">
                                <Users className="w-6 h-6 text-cyan-600" />
                            </div>
                            <Users className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {overview.studentCount}
                        </div>
                        <div className="text-sm text-slate-600">Total Students</div>
                    </motion.div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4"
                    >
                        <div className="p-2 rounded-lg bg-blue-100">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">{overview.courseCount}</div>
                            <div className="text-sm text-slate-600">Active Courses</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4"
                    >
                        <div className="p-2 rounded-lg bg-purple-100">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">10%</div>
                            <div className="text-sm text-slate-600">Platform Fee</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4"
                    >
                        <div className="p-2 rounded-lg bg-green-100">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">90%</div>
                            <div className="text-sm text-slate-600">Your Share</div>
                        </div>
                    </motion.div>
                </div>

                {/* Courses & Earnings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Your Courses & Earnings</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"
                        >
                            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                            Refresh
                        </motion.button>
                    </div>

                    {courses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Course</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Students</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Your Earnings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, idx) => (
                                        <motion.tr
                                            key={course.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                        <BookOpen size={18} className="text-indigo-600" />
                                                    </div>
                                                    <span className="font-medium text-slate-900 truncate max-w-[200px]">
                                                        {course.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-medium">{formatCurrency(course.price)}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className="text-gray-400" />
                                                    <span>{course.studentCount}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatCurrency(course.earnings)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <BookOpen size={48} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">No courses yet</p>
                            <p className="text-sm text-gray-500">Create courses to start earning</p>
                        </div>
                    )}
                </motion.div>

                {/* Payment History */}
                {recentPayments.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment History</h2>
                        <div className="space-y-3">
                            {recentPayments.map((payment) => (
                                <div 
                                    key={payment.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <CreditCard size={18} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {payment.description || "Course Payment"}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {formatDate(payment.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">
                                            +{formatCurrency(payment.amount)}
                                        </p>
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                            {payment.status || "COMPLETED"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* How it works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mt-6 text-white"
                >
                    <h3 className="text-lg font-semibold mb-4">How Your Earnings Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="font-medium mb-1">1. Student Enrolls</p>
                            <p className="text-sm text-white/80">
                                Student pays for your course
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="font-medium mb-1">2. Platform Fee</p>
                            <p className="text-sm text-white/80">
                                10% goes to platform
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="font-medium mb-1">3. You Earn</p>
                            <p className="text-sm text-white/80">
                                90% credited to your account
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TeacherFinance;
