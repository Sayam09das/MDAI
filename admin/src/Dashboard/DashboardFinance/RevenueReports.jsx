import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Download,
    Calendar,
    BarChart3,
    PieChart,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Users
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

const RevenueReports = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [stats, setStats] = useState(null);
    const [totals, setTotals] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState("30days");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const [reportRes, statsRes] = await Promise.all([
                fetch(`${BACKEND_URL}/api/admin/finance/reports/revenue?period=${selectedPeriod}`, getAuthHeaders()),
                fetch(`${BACKEND_URL}/api/admin/finance/stats`, getAuthHeaders())
            ]);
            
            const reportData = await reportRes.json();
            const statsData = await statsRes.json();
            
            if (reportData.success) {
                setRevenueData(reportData.data || []);
                setTotals(reportData.totals || {});
            }
            if (statsData.success) {
                setStats(statsData.stats || {});
            }
        } catch (error) {
            console.error("Error fetching revenue report:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchReport();
        } finally {
            setRefreshing(false);
        }
    };

    const handleExport = () => {
        // Export data as CSV
        const csvContent = [
            ["Period", "Gross Revenue", "Admin Revenue", "Teacher Payouts", "Transactions"].join(","),
            ...revenueData.map((item) => [
                item.period,
                item.grossRevenue,
                item.adminRevenue,
                item.teacherPayouts,
                item.transactions
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `revenue-report-${selectedPeriod}.csv`;
        a.click();
    };

    // Calculate max for chart
    const maxRevenue = revenueData.length > 0
        ? Math.max(...revenueData.map((d) => d.adminRevenue || 0))
        : 100;

    // Calculate trend
    const calculateTrend = () => {
        if (revenueData.length < 2) return 0;
        const midPoint = Math.floor(revenueData.length / 2);
        const firstHalf = revenueData.slice(0, midPoint).reduce((sum, d) => sum + (d.adminRevenue || 0), 0);
        const secondHalf = revenueData.slice(midPoint).reduce((sum, d) => sum + (d.adminRevenue || 0), 0);
        
        if (firstHalf === 0) return secondHalf > 0 ? 100 : 0;
        return Math.round(((secondHalf - firstHalf) / firstHalf) * 100 * 10) / 10;
    };

    const trend = calculateTrend();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading revenue reports...</p>
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
                                    <BarChart3 className="text-indigo-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Revenue Reports</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Detailed financial reports and analytics
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
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

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 whitespace-nowrap"
                            >
                                <Download size={18} />
                                Export
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Period Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 mb-6 lg:mb-8"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-gray-400" size={20} />
                            <span className="text-sm font-medium text-gray-600">Select Period:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: "7days", label: "7 Days" },
                                { value: "30days", label: "30 Days" },
                                { value: "90days", label: "90 Days" },
                                { value: "1year", label: "1 Year" }
                            ].map((period) => (
                                <motion.button
                                    key={period.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPeriod(period.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                                        selectedPeriod === period.value
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    {period.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

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
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Gross Revenue</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totals?.grossRevenue || 0)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <PieChart className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Admin Revenue (10%)</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totals?.adminRevenue || 0)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Users className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Teacher Payouts (90%)</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totals?.teacherPayouts || 0)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <CreditCard className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Transactions</p>
                        <p className="text-2xl sm:text-3xl font-bold">{totals?.totalTransactions || 0}</p>
                        <div className="flex items-center gap-1 text-sm mt-1">
                            {trend >= 0 ? (
                                <>
                                    <ArrowUpRight size={16} className="text-green-600" />
                                    <span className="text-green-600">+{trend}%</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight size={16} className="text-red-600" />
                                    <span className="text-red-600">{trend}%</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 lg:mb-8"
                >
                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-6">
                            <TrendingUp className="text-indigo-600" size={24} />
                            Revenue Overview - {selectedPeriod === "7days" ? "7 Days" : selectedPeriod === "30days" ? "30 Days" : selectedPeriod === "90days" ? "90 Days" : "1 Year"}
                        </h2>

                        {/* Bar Chart */}
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
                                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>No revenue data available</p>
                                </div>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
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

                {/* Detailed Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <PieChart className="text-indigo-600" size={24} />
                            Revenue Breakdown
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Period</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Gross Revenue</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Admin (10%)</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Teacher (90%)</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Transactions</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Avg. per Tx</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData.length > 0 ? (
                                    revenueData.map((data, idx) => (
                                        <motion.tr
                                            key={data.period}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6 font-medium">{data.period}</td>
                                            <td className="py-4 px-6">{formatCurrency(data.grossRevenue)}</td>
                                            <td className="py-4 px-6 text-purple-600 font-medium">{formatCurrency(data.adminRevenue)}</td>
                                            <td className="py-4 px-6 text-green-600 font-medium">{formatCurrency(data.teacherPayouts)}</td>
                                            <td className="py-4 px-6">{data.transactions}</td>
                                            <td className="py-4 px-6">
                                                {formatCurrency(data.transactions > 0 ? data.adminRevenue / data.transactions : 0)}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center">
                                            <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-xl font-semibold text-gray-600">No data available</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Row */}
                    {revenueData.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Total Gross</p>
                                    <p className="font-bold text-blue-600">{formatCurrency(totals?.grossRevenue || 0)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Admin</p>
                                    <p className="font-bold text-purple-600">{formatCurrency(totals?.adminRevenue || 0)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Teacher</p>
                                    <p className="font-bold text-green-600">{formatCurrency(totals?.teacherPayouts || 0)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Tx</p>
                                    <p className="font-bold">{totals?.totalTransactions || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Overall Avg</p>
                                    <p className="font-bold">{formatCurrency(totals?.totalTransactions > 0 ? totals?.adminRevenue / totals?.totalTransactions : 0)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default RevenueReports;

