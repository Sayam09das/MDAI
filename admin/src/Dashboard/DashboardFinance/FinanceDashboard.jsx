import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Users,
    BookOpen,
    Calculator,
    AlertCircle,
    Clock,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

export default function FinanceDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        adminEarnings: 0,
        teacherPayouts: 0,
        pendingPayouts: 0,
        totalTransactions: 0,
        totalStudents: 0,
        totalCourses: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("adminToken");

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/finance/overview`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch finance data");
            }

            const data = await res.json();
            
            // Set stats from response
            setStats({
                totalRevenue: data.overview?.totalRevenue || 0,
                adminEarnings: data.overview?.adminEarnings || 0,
                teacherPayouts: data.overview?.teacherPayouts || 0,
                pendingPayouts: data.overview?.pendingPayouts || 0,
                totalTransactions: data.overview?.totalTransactions || 0,
                totalStudents: data.overview?.totalStudents || 0,
                totalCourses: data.overview?.totalCourses || 0,
            });
            
            setRecentTransactions(data.transactions || []);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    if (loading && stats.totalRevenue === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mb-4 mx-auto"></div>
                    <p className="text-gray-600">Loading finance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign className="text-indigo-600" size={28} />
                        Finance Overview
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track platform revenue and payment distribution
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchFinanceData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    Refresh
                </motion.button>
            </div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3"
                >
                    <AlertCircle size={20} />
                    {error}
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Revenue */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <TrendingUp className="text-indigo-600" size={24} />
                        </div>
                        <span className="text-emerald-500 flex items-center gap-1 text-sm">
                            <ArrowUpRight size={16} />
                            Total
                        </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                    </p>
                </motion.div>

                {/* Admin Earnings */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                        <span className="text-blue-500 flex items-center gap-1 text-sm">
                            <ArrowUpRight size={16} />
                            Platform
                        </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Admin Earnings (10%)</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.adminEarnings)}
                    </p>
                </motion.div>

                {/* Teacher Payouts */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <span className="text-green-500 flex items-center gap-1 text-sm">
                            <ArrowUpRight size={16} />
                            Paid
                        </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Teacher Payouts (90%)</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.teacherPayouts)}
                    </p>
                </motion.div>

                {/* Pending Payouts */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <Clock className="text-amber-600" size={24} />
                        </div>
                        <span className="text-amber-500 flex items-center gap-1 text-sm">
                            <Clock size={16} />
                            Pending
                        </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Payouts</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.pendingPayouts)}
                    </p>
                </motion.div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                        </div>
                        <CreditCard className="text-purple-500" size={32} />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-cyan-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                        </div>
                        <Users className="text-cyan-500" size={32} />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-pink-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                        </div>
                        <BookOpen className="text-pink-500" size={32} />
                    </div>
                </motion.div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                    <p className="text-gray-600 text-sm">Latest payment activities</p>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="p-8 text-center">
                        <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No transactions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
<thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">Type</th>
                                    <th className="p-4 text-left">Student</th>
                                    <th className="p-4 text-left">Course</th>
                                    <th className="p-4 text-center">Amount</th>
                                    <th className="p-4 text-center">Admin (10%)</th>
                                    <th className="p-4 text-center">Teacher (90%)</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Date</th>
                                </tr>
                            </thead>
<tbody>
                                {recentTransactions.map((transaction, index) => (
                                    <motion.tr
                                        key={transaction._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-gray-600">
                                                {transaction._id?.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-gray-900">
                                                {transaction.type || "PAYMENT"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-600">
                                                {transaction.studentName || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-600">
                                                {transaction.courseName || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-gray-900">
                                                {formatCurrency(transaction.amount || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-blue-600 font-medium">
                                                {formatCurrency(transaction.adminAmount || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-green-600 font-medium">
                                                {formatCurrency(transaction.teacherAmount || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                                    transaction.status === "COMPLETED"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-gray-600">
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                <Calculator className="text-blue-600 mt-0.5" size={20} />
                <div>
                    <h4 className="font-medium text-blue-900">Revenue Distribution</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        All course payments are automatically split: <strong>90%</strong> goes to the teacher,
                        <strong>10%</strong> is retained by the platform as a service fee.
                    </p>
                </div>
            </div>
        </div>
    );
}
