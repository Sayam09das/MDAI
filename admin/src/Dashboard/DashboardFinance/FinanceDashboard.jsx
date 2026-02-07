import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    CreditCard,
    Receipt,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Calendar,
    Filter,
    Search,
    ChevronRight,
    Download,
    BookOpen,
} from "lucide-react";
import {
    getAdminFinanceStats,
    getAllFinanceTransactions,
    getAdminRevenueReport,
} from "../../../lib/api/adminFinanceApi";

// Helper to format currency
const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const AdminFinanceDashboard = () => {
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("30days");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    const fetchStats = useCallback(async () => {
        try {
            const response = await getAdminFinanceStats();
            if (response.success) {
                setStats(response.stats);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, []);

    const fetchTransactions = useCallback(async (page = 1) => {
        try {
            const response = await getAllFinanceTransactions({
                page,
                limit: pagination.limit,
                type: filterType,
            });
            if (response.success) {
                setTransactions(response.transactions);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [filterType, pagination.limit]);

    const fetchRevenueReport = useCallback(async () => {
        try {
            const response = await getAdminRevenueReport(selectedPeriod);
            if (response.success) {
                setRevenueData(response.data);
            }
        } catch (error) {
            console.error("Error fetching revenue report:", error);
        }
    }, [selectedPeriod]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStats(),
                fetchTransactions(),
                fetchRevenueReport(),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchStats, fetchTransactions, fetchRevenueReport]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchAllData();
        } finally {
            setRefreshing(false);
        }
    };

    // Filter transactions based on search
    const filteredTransactions = transactions.filter((tx) => {
        const matchSearch =
            tx.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.student.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filterType === "all" || tx.type === filterType;
        return matchSearch && matchFilter;
    });

    // Calculate max for chart
    const maxRevenue = revenueData.length > 0
        ? Math.max(...revenueData.map((d) => d.adminRevenue || 0))
        : 100;

    // Calculate total admin revenue
    const totalAdminRevenue = stats?.totalAdminRevenue || 0;
    const totalGrossRevenue = stats?.totalGrossRevenue || 0;
    const totalTeacherPayouts = stats?.totalTeacherPayouts || 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading finance data...</p>
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
                                    <span className="truncate">Admin Finance</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Manage platform revenue & teacher payments
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
                    {/* Total Gross Revenue */}
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalGrossRevenue)}</p>
                    </motion.div>

                    {/* Admin Revenue */}
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Receipt className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Admin Revenue (10%)</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalAdminRevenue)}</p>
                    </motion.div>

                    {/* Teacher Payouts */}
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Users className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Teacher Payouts (90%)</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalTeacherPayouts)}</p>
                    </motion.div>

                    {/* This Month */}
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
                                    <ArrowUpRight size={16} className="text-green-600" />
                                    <span className="text-green-600">+{stats?.growth}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight size={16} className="text-red-600" />
                                    <span className="text-red-600">{stats?.growth}%</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Top Teachers */}
                {stats?.topTeachers && stats.topTeachers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 lg:mb-8"
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

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 lg:mb-8"
                >
                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                                <PieChart className="text-indigo-600" size={24} />
                                Revenue Overview
                            </h2>
                            <div className="flex gap-2">
                                {["7days", "30days", "90days", "1year"].map((period) => (
                                    <motion.button
                                        key={period}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedPeriod(period)}
                                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium capitalize ${
                                            selectedPeriod === period
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {period === "7days" ? "7 Days" : period === "30days" ? "30 Days" : period === "90days" ? "90 Days" : "1 Year"}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Bar Chart */}
                        <div className="space-y-4">
                            {revenueData.length > 0 ? (
                                revenueData.map((data, idx) => (
                                    <motion.div
                                        key={data.period}
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ delay: idx * 0.05, duration: 0.5 }}
                                        className="flex items-center gap-4"
                                    >
                                        <span className="text-sm font-medium w-20 truncate">{data.period}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: maxRevenue > 0
                                                        ? `${((data.adminRevenue || 0) / maxRevenue) * 100}%`
                                                        : "0%"
                                                }}
                                                transition={{ delay: idx * 0.05 + 0.3, duration: 0.8 }}
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full flex items-center justify-end px-3"
                                            >
                                                <span className="text-white text-xs font-bold">
                                                    {formatCurrency(data.adminRevenue || 0)}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <DollarSign size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>No revenue data available</p>
                                </div>
                            )}
                        </div>

                        {/* Chart Legend */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    <span>Admin Revenue (10%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Teacher Payouts (90%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 lg:mt-8"
                >
                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <CreditCard className="text-indigo-600" size={24} />
                            Recent Transactions
                        </h2>

                        {/* Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by course, teacher, or student..."
                                    className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                {["all", "PAYMENT", "WITHDRAWAL"].map((f) => (
                                    <motion.button
                                        key={f}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setFilterType(f)}
                                        className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm font-medium ${
                                            filterType === f
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Filter size={14} className="inline mr-1" />
                                        {f === "all" ? "All" : f.toLowerCase()}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Transaction List */}
                        <div className="space-y-3">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx, idx) => (
                                    <motion.div
                                        key={tx.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.01 }}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                tx.type === "PAYMENT" ? 'bg-green-100' : 'bg-red-100'
                                            }`}
                                        >
                                            {tx.type === "PAYMENT" ? (
                                                <ArrowDownRight className="text-green-600" size={24} />
                                            ) : (
                                                <ArrowUpRight className="text-red-600" size={24} />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex-1">
                                            <h4 className="font-semibold text-sm sm:text-base mb-1 truncate">
                                                {tx.course}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {tx.teacher}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <BookOpen size={12} />
                                                    {tx.student}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        tx.status === "COMPLETED"
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg sm:text-xl font-bold text-indigo-600">
                                                    {formatCurrency(tx.adminAmount)}
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 hover:bg-gray-200 rounded-lg"
                                                >
                                                    <ChevronRight size={20} className="text-gray-400" />
                                                </motion.button>
                                            </div>
                                            {/* Show breakdown */}
                                            <div className="text-xs text-gray-500 sm:text-right">
                                                <span>Total: {formatCurrency(tx.grossAmount)}</span>
                                                <span className="mx-2">|</span>
                                                <span className="text-green-600">Teacher: {formatCurrency(tx.teacherAmount)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
                                    <p className="text-xl font-semibold text-gray-600 mb-2">No transactions found</p>
                                    <p className="text-gray-500">Transactions will appear here after payments</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fetchTransactions(i + 1)}
                                        className={`w-10 h-10 rounded-lg font-medium ${
                                            pagination.page === i + 1
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {i + 1}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminFinanceDashboard;

