import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    ChevronRight, 
    DollarSign, 
    TrendingUp, 
    CreditCard, 
    Users,
    Wallet,
    CheckCircle
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FinanceOverview = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingPayments: 0,
        completedPayments: 0,
        totalTransactions: 0
    });

    // Fetch finance data
    useEffect(() => {
        const fetchFinanceData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) return;

                const res = await fetch(`${BACKEND_URL}/api/admin/reports/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setStats({
                            totalRevenue: data.stats?.totalRevenue || 0,
                            pendingPayments: data.stats?.totalEnrollments || 0,
                            completedPayments: data.stats?.totalEnrollments || 0,
                            totalTransactions: data.stats?.totalStudents || 0
                        });
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
                    <span className="text-slate-900 font-medium">Finance Overview</span>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        Finance Overview
                    </h1>
                    <p className="text-slate-600 mt-1">Platform revenue and transaction analytics</p>
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

                    {/* Pending Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-amber-50">
                                <CreditCard className="w-6 h-6 text-amber-600" />
                            </div>
                            <Wallet className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {loading ? '...' : stats.pendingPayments}
                        </div>
                        <div className="text-sm text-slate-600">Pending Payments</div>
                    </motion.div>

                    {/* Completed Payments */}
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
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {loading ? '...' : stats.completedPayments}
                        </div>
                        <div className="text-sm text-slate-600">Completed Payments</div>
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
                                <Users className="w-6 h-6 text-cyan-600" />
                            </div>
                            <DollarSign className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            {loading ? '...' : stats.totalTransactions.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">Total Transactions</div>
                    </motion.div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Manage Transactions</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            View and manage all platform transactions and payments.
                        </p>
                        <a 
                            href="/admin/dashboard/finance/transactions"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                            View Transactions
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Teacher Payments</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Manage teacher payouts and payment schedules.
                        </p>
                        <a 
                            href="/admin/dashboard/finance/payments"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                            View Payments
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Reports</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Detailed analytics and reports on platform revenue.
                        </p>
                        <a 
                            href="/admin/dashboard/finance/reports"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                            View Reports
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;

