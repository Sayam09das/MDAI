import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    User,
    BookOpen,
    Calendar,
    FileText
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

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });
    const [selectedTx, setSelectedTx] = useState(null);

    const fetchTransactions = useCallback(async (page = 1) => {
        try {
            const response = await getAllFinanceTransactions({
                page,
                limit: pagination.limit,
                type: filterType !== "all" ? filterType : undefined,
                status: filterStatus !== "all" ? filterStatus : undefined,
            });
            if (response.success) {
                setTransactions(response.transactions);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [filterType, filterStatus, pagination.limit]);

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

    const handleStatusUpdate = async (txId, newStatus) => {
        try {
            // This would call an API to update transaction status
            console.log(`Updating transaction ${txId} to ${newStatus}`);
            await fetchTransactions(pagination.page);
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    // Filter transactions based on search
    const filteredTransactions = transactions.filter((tx) => {
        const matchSearch =
            tx.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.teacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.student?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.id?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED": return "bg-green-100 text-green-700";
            case "PENDING": return "bg-yellow-100 text-yellow-700";
            case "FAILED": return "bg-red-100 text-red-700";
            case "CANCELLED": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "PAYMENT": return <ArrowDownRight className="text-green-600" size={20} />;
            case "WITHDRAWAL": return <ArrowUpRight className="text-red-600" size={20} />;
            case "REFUND": return <ArrowUpRight className="text-orange-600" size={20} />;
            default: return <CreditCard className="text-gray-600" size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading transactions...</p>
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
                                    <span className="truncate">Manage Transactions</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    View and manage all financial transactions
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
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Transactions</p>
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
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Volume</p>
                        <p className="text-2xl sm:text-3xl font-bold">
                            {formatCurrency(transactions.reduce((sum, t) => sum + (t.grossAmount || 0), 0))}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 mb-6 lg:mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by course, teacher, student, or transaction ID..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="border-2 border-gray-200 rounded-lg py-2.5 px-4 focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="all">All Types</option>
                                <option value="PAYMENT">Payment</option>
                                <option value="WITHDRAWAL">Withdrawal</option>
                                <option value="REFUND">Refund</option>
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border-2 border-gray-200 rounded-lg py-2.5 px-4 focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="FAILED">Failed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
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
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Course</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Student</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx, idx) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(tx.type)}
                                                    <span className="text-sm font-medium">{tx.type}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen size={16} className="text-gray-400" />
                                                    <span className="text-sm truncate max-w-[150px]">{tx.course || "Unknown"}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-400" />
                                                    <span className="text-sm truncate max-w-[150px]">{tx.teacher || "Unknown"}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-400" />
                                                    <span className="text-sm truncate max-w-[150px]">{tx.student || "Unknown"}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="text-sm font-bold text-indigo-600">{formatCurrency(tx.grossAmount)}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Admin: {formatCurrency(tx.adminAmount)} | Teacher: {formatCurrency(tx.teacherAmount)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(tx.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setSelectedTx(tx)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <Eye size={18} className="text-indigo-600" />
                                                    </motion.button>
                                                    {tx.status === "PENDING" && (
                                                        <>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleStatusUpdate(tx.id, "COMPLETED")}
                                                                className="p-2 hover:bg-green-100 rounded-lg"
                                                            >
                                                                <CheckCircle size={18} className="text-green-600" />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleStatusUpdate(tx.id, "FAILED")}
                                                                className="p-2 hover:bg-red-100 rounded-lg"
                                                            >
                                                                <XCircle size={18} className="text-red-600" />
                                                            </motion.button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center">
                                            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-xl font-semibold text-gray-600">No transactions found</p>
                                            <p className="text-gray-500">Try adjusting your search or filters</p>
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
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
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

            {/* Transaction Detail Modal */}
            {selectedTx && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedTx(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold">Transaction Details</h2>
                            <p className="text-sm text-gray-500">ID: {selectedTx.id}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-semibold">{selectedTx.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTx.status)}`}>
                                        {selectedTx.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Course</p>
                                    <p className="font-semibold">{selectedTx.course}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Teacher</p>
                                    <p className="font-semibold">{selectedTx.teacher}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Student</p>
                                    <p className="font-semibold">{selectedTx.student}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-semibold">{new Date(selectedTx.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Gross Amount</p>
                                    <p className="font-semibold text-indigo-600">{formatCurrency(selectedTx.grossAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Admin Amount (10%)</p>
                                    <p className="font-semibold text-purple-600">{formatCurrency(selectedTx.adminAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Teacher Amount (90%)</p>
                                    <p className="font-semibold text-green-600">{formatCurrency(selectedTx.teacherAmount)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedTx(null)}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg"
                            >
                                Close
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default ManageTransactions;

