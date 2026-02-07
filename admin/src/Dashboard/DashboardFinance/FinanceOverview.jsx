import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    ChevronRight, 
    DollarSign, 
    TrendingUp, 
    Users,
    UserPlus,
    BookOpen,
    CreditCard
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FinanceOverview = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalAdminAmount: 0,
        totalTeacherAmount: 0,
        totalTeachers: 0,
        totalStudents: 0,
        totalTransactions: 0
    });

    // Fetch finance data
    useEffect(() => {
        const fetchFinanceData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) return;

                const res = await fetch(`${BACKEND_URL}/api/admin/finance/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setStats(data.stats);
                    }
                }
            } catch (error) {
                console.error('Error fetching finance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb & Header */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">Finance</span>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        Finance Management
                    </h1>
                    <p className="text-slate-600 mt-1">Manage teacher payments and platform revenue</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Revenue */}
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
                            {loading ? '...' : formatCurrency(stats.totalRevenue)}
                        </div>
                        <div className="text-sm text-slate-600">Total Revenue</div>
                    </motion.div>

                    {/* Admin Earnings (10%) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-indigo-50">
                                <CreditCard className="w-6 h-6 text-indigo-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {loading ? '...' : formatCurrency(stats.totalAdminAmount)}
                        </div>
                        <div className="text-sm text-slate-600">Admin Earnings (10%)</div>
                    </motion.div>

                    {/* Teacher Payments (90%) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-amber-50">
                                <Users className="w-6 h-6 text-amber-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {loading ? '...' : formatCurrency(stats.totalTeacherAmount)}
                        </div>
                        <div className="text-sm text-slate-600">Teacher Payments (90%)</div>
                    </motion.div>

                    {/* Total Transactions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-cyan-50">
                                <BookOpen className="w-6 h-6 text-cyan-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {loading ? '...' : stats.totalTransactions}
                        </div>
                        <div className="text-sm text-slate-600">Total Transactions</div>
                    </motion.div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4"
                    >
                        <div className="p-2 rounded-lg bg-green-100">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">{loading ? '...' : stats.totalTeachers}</div>
                            <div className="text-sm text-slate-600">Active Teachers</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4"
                    >
                        <div className="p-2 rounded-lg bg-blue-100">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">{loading ? '...' : stats.totalStudents}</div>
                            <div className="text-sm text-slate-600">Total Students</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4"
                    >
                        <div className="p-2 rounded-lg bg-purple-100">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">{loading ? '...' : stats.totalTransactions}</div>
                            <div className="text-sm text-slate-600">Course Enrollments</div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Teacher Payments</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            View all teachers with their courses, student enrollments, and process payments.
                        </p>
                        <a 
                            href="/admin/dashboard/finance/payments"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Manage Payments
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment History</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            View all payments made to teachers and track payment history.
                        </p>
                        <a 
                            href="/admin/dashboard/finance/transactions"
                            className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                        >
                            <DollarSign className="w-4 h-4 mr-2" />
                            View History
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;
