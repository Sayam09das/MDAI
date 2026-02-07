import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    Users,
    BookOpen,
    Calendar,
    CreditCard,
    CheckCircle,
    Clock,
    RefreshCw,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ================= ANIMATION VARIANTS ================= */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/* ================= MAIN COMPONENT ================= */
const TeacherFinance = () => {
    const [stats, setStats] = useState({
        totalEarnings: 0,
        pendingEarnings: 0,
        completedPayments: 0,
        totalStudents: 0,
    });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState("all");

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const res = await fetch(`${BACKEND_URL}/api/teacher/earnings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch finance data");
            }

            const data = await res.json();
            
            // Calculate stats from payments
            const paymentsData = data.payments || [];
            const completedPayments = paymentsData.filter(p => p.paymentStatus === "PAID");
            
            setStats({
                totalEarnings: completedPayments.reduce((sum, p) => sum + (p.teacherAmount || 0), 0),
                pendingEarnings: paymentsData
                    .filter(p => p.paymentStatus === "PENDING")
                    .reduce((sum, p) => sum + (p.teacherAmount || 0), 0),
                completedPayments: completedPayments.length,
                totalStudents: data.totalStudents || completedPayments.length,
            });
            
            setPayments(paymentsData);
            setError(null);
        } catch (err) {
            console.error("Error fetching finance data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, [timeFilter]);

    // Filter payments based on time filter
    const filteredPayments = payments.filter(payment => {
        if (timeFilter === "all") return true;
        
        const paymentDate = new Date(payment.createdAt);
        const now = new Date();
        
        if (timeFilter === "today") {
            return paymentDate.toDateString() === now.toDateString();
        } else if (timeFilter === "week") {
            const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
        } else if (timeFilter === "month") {
            const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
            return paymentDate >= monthAgo;
        }
        return true;
    });

    // Get recent payments (last 5)
    const recentPayments = [...filteredPayments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

    if (loading && payments.length === 0) {
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Wallet className="text-indigo-600" size={28} />
                        Teacher Finance
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track your earnings and payment history
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
                    <CreditCard size={20} />
                    {error}
                </motion.div>
            )}

            {/* Stats Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {/* Total Earnings */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-100 p-3 rounded-lg">
                            <DollarSign className="text-emerald-600" size={24} />
                        </div>
                        <span className="text-emerald-500 flex items-center gap-1 text-sm">
                            <ArrowUpRight size={16} />
                            Total
                        </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total Earnings</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.totalEarnings)}
                    </p>
                </motion.div>

                {/* Pending Earnings */}
                <motion.div
                    variants={itemVariants}
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
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Earnings</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.pendingEarnings)}
                    </p>
                </motion.div>

                {/* Completed Payments */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <CheckCircle className="text-blue-600" size={24} />
                        </div>
                        <span className="text-blue-500 flex items-center gap-1 text-sm">
                            <CheckCircle size={16} />
                            Completed
                        </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Completed Payments</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats.completedPayments}
                    </p>
                </motion.div>

                {/* Total Students */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Users className="text-purple-600" size={24} />
                        </div>
                        <span className="text-purple-500 flex items-center gap-1 text-sm">
                            <Users size={16} />
                            Active
                        </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total Students</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats.totalStudents}
                    </p>
                </motion.div>
            </motion.div>

            {/* Time Filter */}
            <div className="flex gap-2 mb-6">
                {[
                    { value: "all", label: "All Time" },
                    { value: "month", label: "This Month" },
                    { value: "week", label: "This Week" },
                    { value: "today", label: "Today" },
                ].map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setTimeFilter(filter.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            timeFilter === filter.value
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Recent Payments Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Payments</h2>
                    <p className="text-gray-600 text-sm">Latest payment transactions</p>
                </div>

                {recentPayments.length === 0 ? (
                    <div className="p-8 text-center">
                        <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No payments found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="p-4 text-left">Student</th>
                                    <th className="p-4 text-left">Course</th>
                                    <th className="p-4 text-center">Date</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Your Earnings</th>
                                    <th className="p-4 text-center">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPayments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-indigo-600 font-medium">
                                                        {payment.student?.fullName?.charAt(0) || "S"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {payment.student?.fullName || "Unknown"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {payment.student?.email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-900">
                                                {payment.course?.title || "N/A"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {payment.course?.category || ""}
                                            </p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span className="text-gray-600">
                                                    {formatDate(payment.createdAt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                                    payment.paymentStatus === "PAID"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : payment.paymentStatus === "PENDING"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {payment.paymentStatus === "PAID" ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <Clock size={14} />
                                                )}
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-bold text-emerald-600 text-lg">
                                                {formatCurrency(payment.teacherAmount || 0)}
                                            </span>
                                            {payment.course?.price && (
                                                <p className="text-xs text-gray-500">
                                                    of {formatCurrency(payment.course.price)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {payment.paymentStatus === "PAID" && payment.receipt?.url ? (
                                                <a
                                                    href={payment.receipt.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                                >
                                                    <CreditCard size={14} />
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3"
            >
                <TrendingUp className="text-blue-600 mt-0.5" size={20} />
                <div>
                    <h4 className="font-medium text-blue-900">How Earnings Work</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        When a student pays for your course, you receive <strong>90%</strong> of the course price.
                        The remaining <strong>10%</strong> is retained by the platform as a service fee.
                        Earnings are updated in real-time as students make payments.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default TeacherFinance;

