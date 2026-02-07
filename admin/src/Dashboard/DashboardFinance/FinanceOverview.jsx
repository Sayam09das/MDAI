import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    DollarSign,
    FileText,
    TrendingUp,
    Users,
    CreditCard,
    ArrowRight,
    RefreshCw,
    DollarSign as DollarSignIcon,
    PieChart,
    BarChart3,
    ChevronRight,
    Calendar,
    DollarTree,
} from "lucide-react";
import { getAdminFinanceStats, getAllFinanceTransactions } from "../../../lib/api/adminFinanceApi";

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const FinanceOverview = () => {
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, transactionsRes] = await Promise.all([
                getAdminFinanceStats(),
                getAllFinanceTransactions({ page: 1, limit: 5 })
            ]);
            
            if (statsRes.success) {
                setStats(statsRes.stats);
            }
            if (transactionsRes.success) {
                setRecentTransactions(transactionsRes.transactions);
            }
        } catch (error) {
            console.error("Error fetching finance data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchData();
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading finance overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-indigo-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    <DollarSign className="text-indigo-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Finance Overview</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Complete financial management dashboard
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                        >
                            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                            Refresh
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats?.totalGrossRevenue || 0)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <PieChart className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Admin Revenue (10%)</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats?.totalAdminRevenue || 0)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Users className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Teacher Payouts (90%)</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats?.totalTeacherPayouts || 0)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats?.thisMonthRevenue || 0)}</p>
                        <div className="flex items-center gap-1 text-sm mt-1">
                            {stats?.growth >= 0 ? (
                                <>
                                    <TrendingUp size={14} className="text-green-600" />
                                    <span className="text-green-600">+{stats?.growth}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingUp size={14} className="text-red-600" />
                                    <span className="text-red-600">{stats?.growth}%</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 lg:mb-8"
                >
                    <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                        <DollarSign className="text-indigo-600" size={24} />
                        Finance Management
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Manage Transactions */}
                        <Link to="/admin/dashboard/finance/transactions">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 cursor-pointer h-full"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="bg-indigo-100 p-3 rounded-xl">
                                        <FileText className="text-indigo-600" size={24} />
                                    </div>
                                    <ChevronRight className="text-gray-400" size={20} />
                                </div>
                                <h3 className="text-lg font-bold mt-4">Manage Transactions</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    View, filter, and manage all financial transactions
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-indigo-600 text-sm font-medium">
                                    <span>Access Panel</span>
                                    <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Teacher Payments */}
                        <Link to="/admin/dashboard/finance/payments">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 cursor-pointer h-full"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="bg-green-100 p-3 rounded-xl">
                                        <DollarSignIcon className="text-green-600" size={24} />
                                    </div>
                                    <ChevronRight className="text-gray-400" size={20} />
                                </div>
                                <h3 className="text-lg font-bold mt-4">Teacher Payments</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Track and manage teacher earnings and payouts
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <span>View Payments</span>
                                    <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Revenue Reports */}
                        <Link to="/admin/dashboard/finance/reports">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 cursor-pointer h-full"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="bg-purple-100 p-3 rounded-xl">
                                        <BarChart3 className="text-purple-600" size={24} />
                                    </div>
                                    <ChevronRight className="text-gray-400" size={20} />
                                </div>
                                <h3 className="text-lg font-bold mt-4">Revenue Reports</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Detailed financial reports and analytics
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-purple-600 text-sm font-medium">
                                    <span>View Reports</span>
                                    <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <CreditCard className="text-indigo-600" size={24} />
                            Recent Transactions
                        </h2>
                        <Link 
                            to="/admin/dashboard/finance/transactions"
                            className="text-indigo-600 text-sm font-medium hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Course</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((tx, idx) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm truncate max-w-[150px]">
                                                {tx.course || "Unknown"}
                                            </td>
                                            <td className="py-4 px-6 text-sm truncate max-w-[150px]">
                                                {tx.teacher || "Unknown"}
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-indigo-600">
                                                {formatCurrency(tx.grossAmount)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    tx.status === "COMPLETED" 
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center">
                                            <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-xl font-semibold text-gray-600">No transactions yet</p>
                                            <p className="text-gray-500">Transactions will appear here after payments</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Top Earning Teachers */}
                {stats?.topTeachers && stats.topTeachers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 lg:mt-8"
                    >
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-6">
                                <Users className="text-indigo-600" size={24} />
                                Top Earning Teachers
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stats.topTeachers.slice(0, 6).map((teacher, idx) => (
                                    <motion.div
                                        key={teacher.teacherId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                    >
                                        <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{teacher.name}</p>
                                            <p className="text-sm text-gray-500">{teacher.transactions} transactions</p>
                                        </div>
                                        <p className="font-bold text-green-600">{formatCurrency(teacher.earnings)}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FinanceOverview;

