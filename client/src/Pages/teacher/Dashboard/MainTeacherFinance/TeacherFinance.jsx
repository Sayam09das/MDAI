import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Eye,
    CreditCard,
    Wallet,
    PieChart,
    ArrowLeft,
    Filter,
    Search,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Percent,
    Receipt,
    Users,
    Clock,
    RefreshCw,
} from "lucide-react"
import {
    getTeacherFinanceStats,
    getTeacherTransactions,
    getTeacherMonthlyEarnings,
    getTeacherCourseEarnings,
} from "../../../../lib/api/financeApi"

const TeacherFinance = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("month")
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // Data states
    const [stats, setStats] = useState({
        totalEarnings: 0,
        thisMonth: 0,
        lastMonth: 0,
        pending: 0,
        growth: 0,
        totalAdminCut: 0,
        totalGrossRevenue: 0,
        totalTransactions: 0,
        adminPercentage: 10,
    })

    const [transactions, setTransactions] = useState([])
    const [monthlyData, setMonthlyData] = useState([])
    const [courseEarnings, setCourseEarnings] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
    })

    // Fetch finance stats
    const fetchStats = useCallback(async () => {
        try {
            const response = await getTeacherFinanceStats()
            if (response.success) {
                setStats(response.stats)
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
            toast.error("Failed to load finance stats")
        }
    }, [])

    // Fetch transactions
    const fetchTransactions = useCallback(async (page = 1) => {
        try {
            const response = await getTeacherTransactions({
                page,
                limit: pagination.limit,
                type: filterType,
            })
            if (response.success) {
                setTransactions(response.transactions)
                setPagination(response.pagination)
            }
        } catch (error) {
            console.error("Error fetching transactions:", error)
            toast.error("Failed to load transactions")
        }
    }, [filterType, pagination.limit])

    // Fetch monthly earnings for chart
    const fetchMonthlyEarnings = useCallback(async () => {
        try {
            const response = await getTeacherMonthlyEarnings(6)
            if (response.success) {
                setMonthlyData(response.data)
            }
        } catch (error) {
            console.error("Error fetching monthly earnings:", error)
        }
    }, [])

    // Fetch course earnings
    const fetchCourseEarnings = useCallback(async () => {
        try {
            const response = await getTeacherCourseEarnings()
            if (response.success) {
                setCourseEarnings(response.courses)
            }
        } catch (error) {
            console.error("Error fetching course earnings:", error)
        }
    }, [])

    // Initial data fetch
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchStats(),
                    fetchTransactions(),
                    fetchMonthlyEarnings(),
                    fetchCourseEarnings(),
                ])
            } catch (error) {
                console.error("Error loading data:", error)
            } finally {
                setLoading(false)
            }
        }
        loadAllData()
    }, [fetchStats, fetchTransactions, fetchMonthlyEarnings, fetchCourseEarnings])

    // Refresh handler
    const handleRefresh = async () => {
        setRefreshing(true)
        try {
            await Promise.all([
                fetchStats(),
                fetchTransactions(),
                fetchMonthlyEarnings(),
                fetchCourseEarnings(),
            ])
            toast.success("Data refreshed successfully")
        } catch (error) {
            console.error("Error refreshing:", error)
        } finally {
            setRefreshing(false)
        }
    }

    // Filter transactions based on search
    const filteredTransactions = transactions.filter((tx) => {
        const matchSearch =
            tx.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchFilter = filterType === "all" || tx.type === filterType
        return matchSearch && matchFilter
    })

    // Calculate max for chart
    const maxAmount = monthlyData.length > 0
        ? Math.max(...monthlyData.map((d) => d.teacherAmount || 0))
        : 100

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0)
    }

    // Calculate admin cut for a transaction
    const calculateAdminCut = (grossAmount) => {
        return Math.round((grossAmount * stats.adminPercentage) / 100 * 100) / 100
    }

    // Calculate teacher share for a transaction
    const calculateTeacherShare = (grossAmount) => {
        return Math.round((grossAmount * (100 - stats.adminPercentage)) / 100 * 100) / 100
    }

    const handleWithdraw = () => {
        toast.info("💸 Withdrawal feature coming soon!")
    }

    const handleExport = () => {
        toast.info("📥 Exporting financial data...")
    }

    const handleViewDetails = (tx) => {
        toast.info(`📋 Viewing details for: ${tx.course}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading finance data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-teal-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    <DollarSign className="text-emerald-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Finance</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Track your earnings & transactions
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                title="Refresh Data"
                            >
                                <RefreshCw
                                    size={20}
                                    className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`}
                                />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                            >
                                <Download size={20} />
                                <span className="hidden sm:inline">Export</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Admin Cut Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 text-white"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Percent size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Platform Fee: {stats.adminPercentage}%</h3>
                                <p className="text-sm opacity-90">
                                    Admin collects {stats.adminPercentage}% on each course payment
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-8">
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats.totalGrossRevenue)}</p>
                                <p className="text-xs sm:text-sm opacity-90">Total Revenue</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats.totalAdminCut)}</p>
                                <p className="text-xs sm:text-sm opacity-90">Admin Collected</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Earnings (90%)</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats.totalTransactions} transactions
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats.thisMonth)}</p>
                        <div className="flex items-center gap-1 text-sm mt-1">
                            {stats.growth >= 0 ? (
                                <>
                                    <ArrowUpRight size={16} className="text-green-600" />
                                    <span className="text-green-600">+{stats.growth}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight size={16} className="text-red-600" />
                                    <span className="text-red-600">{stats.growth}%</span>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Wallet className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats.pending)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Receipt className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Last Month</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats.lastMonth)}</p>
                    </motion.div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                                    <PieChart className="text-emerald-600" size={24} />
                                    Earnings Overview
                                </h2>
                                <div className="flex gap-2">
                                    {["week", "month", "year"].map((period) => (
                                        <motion.button
                                            key={period}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedPeriod(period)}
                                            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium capitalize ${
                                                selectedPeriod === period
                                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {period}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="space-y-4">
                                {monthlyData.length > 0 ? (
                                    monthlyData.map((data, idx) => (
                                        <motion.div
                                            key={data.month}
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                                            className="flex items-center gap-4"
                                        >
                                            <span className="text-sm font-medium w-12">{data.month}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: maxAmount > 0
                                                            ? `${((data.teacherAmount || 0) / maxAmount) * 100}%`
                                                            : "0%"
                                                    }}
                                                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full flex items-center justify-end px-3"
                                                >
                                                    <span className="text-white text-xs font-bold">
                                                        {formatCurrency(data.teacherAmount || 0)}
                                                    </span>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <DollarSign size={48} className="mx-auto mb-2 opacity-50" />
                                        <p>No earnings data available yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Chart Legend */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span>Your Earnings (90%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                                        <span>Admin Cut (10%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleWithdraw}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    <Wallet size={18} />
                                    Withdraw Funds
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toast.info("💳 Opening payment settings")}
                                    className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={18} />
                                    Payment Methods
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleExport}
                                    className="w-full bg-purple-100 text-purple-700 hover:bg-purple-200 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    <Download size={18} />
                                    Download Report
                                </motion.button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl lg:rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="text-lg font-bold mb-2">Available Balance</h3>
                            <p className="text-3xl font-bold mb-4">{formatCurrency(stats.thisMonth - stats.pending)}</p>
                            <p className="text-sm opacity-90">Ready to withdraw</p>
                        </div>

                        {/* Top Courses */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="text-emerald-600" size={20} />
                                Top Courses
                            </h3>
                            <div className="space-y-3">
                                {courseEarnings.slice(0, 3).map((course, idx) => (
                                    <div
                                        key={course.courseId}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm truncate">{course.title}</p>
                                                <p className="text-xs text-gray-500">{course.totalStudents} students</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-emerald-600">{formatCurrency(course.teacherAmount)}</p>
                                    </div>
                                ))}
                                {courseEarnings.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No course earnings yet
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 lg:mt-8"
                >
                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Transactions</h2>

                        {/* Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by course or student..."
                                    className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 focus:border-emerald-500 focus:outline-none"
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
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
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
                                                    {tx.student}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </span>
                                                {tx.type === "PAYMENT" && (
                                                    <span className="flex items-center gap-1 text-violet-600">
                                                        <Percent size={12} />
                                                        {tx.adminPercentage}% admin
                                                    </span>
                                                )}
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
                                                {tx.type === "PAYMENT" ? (
                                                    <span className="text-lg sm:text-xl font-bold text-green-600">
                                                        +{formatCurrency(tx.teacherAmount)}
                                                    </span>
                                                ) : (
                                                    <span className="text-lg sm:text-xl font-bold text-red-600">
                                                        -{formatCurrency(Math.abs(tx.teacherAmount || 0))}
                                                    </span>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleViewDetails(tx)}
                                                    className="p-2 hover:bg-gray-200 rounded-lg"
                                                >
                                                    <ChevronRight size={20} className="text-gray-400" />
                                                </motion.button>
                                            </div>
                                            {/* Show breakdown for payments */}
                                            {tx.type === "PAYMENT" && (
                                                <div className="text-xs text-gray-500 sm:text-right">
                                                    <span>Gross: {formatCurrency(tx.grossAmount)}</span>
                                                    <span className="mx-2">|</span>
                                                    <span className="text-violet-600">Admin: {formatCurrency(tx.adminAmount)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
                                    <p className="text-xl font-semibold text-gray-600 mb-2">No transactions found</p>
                                    <p className="text-gray-500">
                                        {searchQuery ? "Try adjusting your search" : "Transactions will appear here after students enroll"}
                                    </p>
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
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
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
    )
}

export default TeacherFinance

