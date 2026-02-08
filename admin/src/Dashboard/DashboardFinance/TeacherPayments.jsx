import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";

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
        hour: "2-digit",
        minute: "2-digit"
    });
};

export default function TeacherPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        totalPaid: 0,
        pending: 0,
        totalTeachers: 0,
        totalTransactions: 0
    });
    const token = localStorage.getItem("adminToken");

    const fetchTeacherPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/finance/teacher-payments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch teacher payments");
            }

            const data = await res.json();
            console.log("Teacher payments data:", data);
            
            // Transform individual transaction data - one row per payment
            const paymentsArray = (data.payments || []).map((p, index) => {
                console.log(`Payment ${index}:`, {
                    teacher: p.teacher,
                    course: p.course,
                    amount: p.teacherAmount
                });
                
                return {
                    _id: p._id,
                    teacherId: p.teacher?._id || p.teacher || "unknown",
                    teacherName: p.teacher?.name || "Unknown Teacher",
                    teacherEmail: p.teacher?.email || "N/A",
                    courseName: p.course?.title || "Unknown Course",
                    studentName: p.student?.fullName || "Unknown Student",
                    amount: p.teacherAmount || 0,
                    status: p.status || "COMPLETED",
                    createdAt: p.createdAt || new Date(),
                    description: p.description || ""
                };
            });

            setPayments(paymentsArray);
            setStats({
                totalPaid: data.stats?.completedPayouts || data.stats?.totalPayouts || 0,
                pending: data.stats?.pendingPayouts || 0,
                totalTeachers: data.stats?.totalTeachers || 0,
                totalTransactions: data.stats?.totalTransactions || paymentsArray.length
            });
            setError("");
        } catch (err) {
            setError(err.message);
            console.error("Fetch teacher payments error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacherPayments();
    }, []);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="text-indigo-600" size={28} />
                        Teacher Payments
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Individual payout transactions for all teachers
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchTeacherPayments}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                        <CheckCircle className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total Paid</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.totalPaid)}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <Clock className="text-amber-600" size={24} />
                        </div>
                        <Clock className="text-amber-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Pending</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.pending)}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="text-blue-600" size={24} />
                        </div>
                        <Users className="text-blue-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Teachers Paid</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats.totalTeachers}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <DollarSign className="text-purple-600" size={24} />
                        </div>
                        <DollarSign className="text-purple-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Transactions</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats.totalTransactions}
                    </p>
                </motion.div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Payment History</h2>
                    <p className="text-gray-600 text-sm">All teacher payout transactions (one per payment)</p>
                </div>

                {loading && payments.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mb-4 mx-auto"></div>
                        <p className="text-gray-600">Loading teacher payments...</p>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="p-8 text-center">
                        <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No payment records found</p>
                        <p className="text-gray-400 text-sm mt-2">Payments will appear here once teachers are paid</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="p-4 text-left">Payment ID</th>
                                    <th className="p-4 text-left">Teacher</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Course</th>
                                    <th className="p-4 text-center">Amount</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-gray-600">
                                                {payment._id?.substring(0, 12)}...
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-gray-900">
                                                {payment.teacherName || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-600">
                                                {payment.teacherEmail || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-700 font-medium">
                                                {payment.courseName || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-green-600">
                                                {formatCurrency(payment.amount || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                                    payment.status === "COMPLETED"
                                                        ? "bg-green-100 text-green-700"
                                                        : payment.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-gray-600 text-sm">
                                                {formatDate(payment.createdAt)}
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

