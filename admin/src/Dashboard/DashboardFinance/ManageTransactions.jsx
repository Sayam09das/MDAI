import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    Search,
    CheckCircle,
    Clock,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Calendar,
    FileText,
    User
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
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
    }).format(amount);
};

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    const fetchTransactions = useCallback(async (page = 1) => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/admin/finance/payment-history?page=${page}&limit=${pagination.limit}`,
                getAuthHeaders()
            );
            const data = await response.json();
            if (data.success) {
                setTransactions(data.transactions);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.limit]);

    useEffect(() => {
        fetchTransactions(1);
    }, [fetchTransactions]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchTransactions(pagination.page);
        } finally {
            setRefreshing(false);
        }
    };

    // Filter transactions based on search
    const filteredTransactions = transactions.filter((tx) => {
        const teacherName = tx.teacher?.fullName || tx.teacher?.name || "";
        const matchSearch = 
            teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx._id?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading payment history...</p>
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
                                    <FileText className="text-indigo-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Payment History</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    View all teacher payments made
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
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Payments</p>
                        <p className="text-2xl sm:text-3xl font-bold">{pagination.total}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <CheckCircle className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-2xl sm:text-3xl font-bold">
                            {transactions.filter(t => t.status === "COMPLETED").length}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Clock className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                        <p className="text-2xl sm:text-3xl font-bold">
                            {transactions.filter(t => t.status === "PENDING").length}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl sm:text-3xl font-bold">
                            {formatCurrency(transactions.reduce((sum, t) => sum + (t.teacherAmount || 0), 0))}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 mb-6 lg:mb-8"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by teacher name or description..."
                            className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </motion.div>

                {/* Transactions Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Description</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Method</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx, idx) => (
                                        <motion.tr
                                            key={tx._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <User size={16} className="text-indigo-600" />
                                                    </div>
                                                    <span className="font-medium">
                                                        {tx.teacher?.fullName || tx.teacher?.name || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-600">{tx.description || "Payment"}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatCurrency(tx.teacherAmount)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={16} className="text-gray-400" />
                                                    <span className="text-sm">{tx.paymentMethod || "BANK_TRANSFER"}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {formatDate(tx.completedAt || tx.createdAt)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    tx.status === "COMPLETED" 
                                                        ? "bg-green-100 text-green-700"
                                                        : tx.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center">
                                            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-xl font-semibold text-gray-600">No payments found</p>
                                            <p className="text-gray-500">Payments will appear here once teachers are paid</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} payments
                            </p>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => fetchTransactions(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-2 border-2 border-gray-200 rounded-lg disabled:opacity-50"
                                >
                                    <ChevronLeft size={20} />
                                </motion.button>
                                <span className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-medium">
                                    {pagination.page} / {pagination.pages}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => fetchTransactions(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                    className="p-2 border-2 border-gray-200 rounded-lg disabled:opacity-50"
                                >
                                    <ChevronRight size={20} />
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ManageTransactions;
