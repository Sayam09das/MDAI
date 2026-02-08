import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    FileText, 
    Download, 
    Calendar,
    AlertCircle,
    Filter
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export default function RevenueReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dateRange, setDateRange] = useState("all");
    const [stats, setStats] = useState({
        totalRevenue: 0,
        adminShare: 0,
        teacherShare: 0,
        pendingPayouts: 0,
        totalTransactions: 0,
    });
    const [charts, setCharts] = useState({
        monthlyRevenue: [],
        categoryRevenue: [],
        dailyRevenue: [],
        topCourses: [],
        topTeachers: [],
    });
    const token = localStorage.getItem("adminToken");

    const fetchRevenueReports = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/finance/reports?range=${dateRange}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch revenue reports");
            }

            const data = await res.json();
            
            // Transform top courses to reports format
            const topCourses = data.charts?.topCourses || [];
            const reportsArray = topCourses.map((course, index) => ({
                _id: course.id || `course-${index}`,
                period: dateRange === 'all' ? 'All Time' : dateRange,
                totalRevenue: course.revenue || 0,
                adminShare: Math.round((course.revenue || 0) * 0.1 * 100) / 100,
                teacherShare: Math.round((course.revenue || 0) * 0.9 * 100) / 100,
                transactionCount: course.enrollments || 0,
                generatedAt: new Date().toISOString(),
                title: course.title,
            }));

            setReports(reportsArray);
            setStats({
                totalRevenue: data.stats?.totalRevenue || 0,
                adminShare: data.stats?.totalAdminEarnings || 0,
                teacherShare: data.stats?.totalTeacherEarnings || 0,
                pendingPayouts: data.stats?.pendingPayouts || 0,
                totalTransactions: data.stats?.totalTransactions || 0,
            });
            setCharts({
                monthlyRevenue: data.charts?.monthlyRevenue || [],
                categoryRevenue: data.charts?.categoryRevenue || [],
                dailyRevenue: data.charts?.dailyRevenue || [],
                topCourses: data.charts?.topCourses || [],
                topTeachers: data.charts?.topTeachers || [],
            });
            setError("");
        } catch (err) {
            setError(err.message);
            console.error("Fetch revenue reports error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueReports();
    }, [dateRange]);

    if (loading && reports.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mb-4 mx-auto"></div>
                    <p className="text-gray-600">Loading revenue reports...</p>
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
                        <FileText className="text-indigo-600" size={28} />
                        Revenue Reports
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Detailed revenue analysis and financial reports
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="border-none bg-transparent text-sm focus:outline-none"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <Download size={18} />
                        Export
                    </motion.button>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <DollarSign className="text-indigo-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Admin Share (10%)</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.adminShare)}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Teacher Share (90%)</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.teacherShare)}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <Calendar className="text-amber-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Payouts</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.pendingPayouts)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {stats.totalTransactions} transactions
                    </p>
                </motion.div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Revenue Breakdown</h2>
                    <p className="text-gray-600 text-sm">Detailed transaction analysis</p>
                </div>

                {reports.length === 0 ? (
                    <div className="p-8 text-center">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No reports available for this period</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">Course</th>
                                    <th className="p-4 text-center">Total Revenue</th>
                                    <th className="p-4 text-center">Admin (10%)</th>
                                    <th className="p-4 text-center">Teachers (90%)</th>
                                    <th className="p-4 text-center">Enrollments</th>
                                    <th className="p-4 text-center">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report, index) => (
                                    <motion.tr
                                        key={report._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-gray-600">
                                                {report._id?.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-gray-900">
                                                {report.title || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-indigo-600">
                                                {formatCurrency(report.totalRevenue || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-blue-600">
                                                {formatCurrency(report.adminShare || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-green-600">
                                                {formatCurrency(report.teacherShare || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-gray-600">
                                                {report.transactionCount || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-gray-600">
                                                {formatDate(report.generatedAt)}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

