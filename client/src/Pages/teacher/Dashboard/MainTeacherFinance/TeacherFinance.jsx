import React, { useState } from "react"
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
} from "lucide-react"

const TeacherFinance = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("month")
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")

    const stats = {
        totalEarnings: 45280,
        thisMonth: 5420,
        lastMonth: 4890,
        pending: 1250,
        growth: 10.8,
    }

    const transactions = [
        {
            id: 1,
            type: "income",
            title: "Course Payment - Full Stack Development",
            amount: 89.99,
            date: "2025-01-05",
            status: "completed",
            students: 3,
        },
        {
            id: 2,
            type: "income",
            title: "Course Payment - Python Data Science",
            amount: 79.99,
            date: "2025-01-04",
            status: "completed",
            students: 2,
        },
        {
            id: 3,
            type: "income",
            title: "Course Payment - React Advanced",
            amount: 69.99,
            date: "2025-01-03",
            status: "completed",
            students: 1,
        },
        {
            id: 4,
            type: "withdrawal",
            title: "Bank Transfer - Withdrawal",
            amount: -500,
            date: "2025-01-02",
            status: "completed",
        },
        {
            id: 5,
            type: "income",
            title: "Course Payment - CSS Mastery",
            amount: 59.99,
            date: "2025-01-01",
            status: "pending",
            students: 2,
        },
        {
            id: 6,
            type: "income",
            title: "Course Payment - JavaScript ES6",
            amount: 74.99,
            date: "2024-12-30",
            status: "completed",
            students: 1,
        },
    ]

    const monthlyData = [
        { month: "Jul", amount: 3200 },
        { month: "Aug", amount: 3800 },
        { month: "Sep", amount: 4100 },
        { month: "Oct", amount: 4500 },
        { month: "Nov", amount: 4890 },
        { month: "Dec", amount: 5420 },
    ]

    const filteredTransactions = transactions.filter(tx => {
        const matchSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchFilter =
            filterType === "all" ||
            tx.type === filterType
        return matchSearch && matchFilter
    })

    const handleWithdraw = () => {
        toast.success("💰 Withdrawal request submitted", {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const handleExport = () => {
        toast.info("📥 Exporting financial data...", {
            position: "bottom-right",
            autoClose: 2000,
        })
    }

    const maxAmount = Math.max(...monthlyData.map(d => d.amount))

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
                                    Track your earnings
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                        >
                            <Download size={20} /> <span className="hidden sm:inline">Export</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Earnings</p>
                        <p className="text-2xl sm:text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-2xl sm:text-3xl font-bold">${stats.thisMonth.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                            <ArrowUpRight size={16} />
                            <span>{stats.growth}%</span>
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
                        <p className="text-2xl sm:text-3xl font-bold">${stats.pending.toLocaleString()}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <CreditCard className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Last Month</p>
                        <p className="text-2xl sm:text-3xl font-bold">${stats.lastMonth.toLocaleString()}</p>
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
                                            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium capitalize ${selectedPeriod === period
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
                                {monthlyData.map((data, idx) => (
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
                                                animate={{ width: `${(data.amount / maxAmount) * 100}%` }}
                                                transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full flex items-center justify-end px-3"
                                            >
                                                <span className="text-white text-xs font-bold">
                                                    ${data.amount.toLocaleString()}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
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
                            <p className="text-3xl font-bold mb-4">${(stats.thisMonth - stats.pending).toLocaleString()}</p>
                            <p className="text-sm opacity-90">Ready to withdraw</p>
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
                                    placeholder="Search transactions..."
                                    className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                {["all", "income", "withdrawal"].map((f) => (
                                    <motion.button
                                        key={f}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setFilterType(f)}
                                        className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm font-medium ${filterType === f
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Filter size={14} className="inline mr-1" />
                                        {f}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Transaction List */}
                        <div className="space-y-3">
                            {filteredTransactions.map((tx, idx) => (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "income"
                                            ? 'bg-green-100'
                                            : 'bg-red-100'
                                        }`}>
                                        {tx.type === "income" ? (
                                            <ArrowDownRight className="text-green-600" size={24} />
                                        ) : (
                                            <ArrowUpRight className="text-red-600" size={24} />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm sm:text-base mb-1 truncate">{tx.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(tx.date).toLocaleDateString()}
                                            </span>
                                            {tx.students && (
                                                <span>{tx.students} student{tx.students > 1 ? 's' : ''}</span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tx.status === "completed"
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg sm:text-xl font-bold ${tx.type === "income" ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {tx.type === "income" ? '+' : ''}{tx.amount < 0 ? tx.amount : `$${tx.amount}`}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toast.info("👁️ Viewing transaction details")}
                                            className="p-2 hover:bg-gray-200 rounded-lg"
                                        >
                                            <ChevronRight size={20} className="text-gray-400" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {filteredTransactions.length === 0 && (
                            <div className="text-center py-12">
                                <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-xl font-semibold text-gray-600 mb-2">No transactions found</p>
                                <p className="text-gray-500">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default TeacherFinance