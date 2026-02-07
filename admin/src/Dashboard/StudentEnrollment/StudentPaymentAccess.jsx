import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    User,
    BookOpen,
    Calculator,
    ArrowRight,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function StudentPaymentAccess() {
    const [enrollments, setEnrollments] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [financeData, setFinanceData] = useState(null);
    const token = localStorage.getItem("adminToken");

    // Helper to format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "$0.00";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const fetchEnrollments = async () => {
        if (!token) {
            setError("Admin not logged in");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/enrollments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Unauthorized or session expired");
            }

            const data = await res.json();
            setEnrollments(data.enrollments || []);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updatePayment = async (id) => {
        if (!token) return;

        setProcessingId(id);
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/admin/enrollments/${id}/payment-status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: "PAID" }),
                }
            );

            const data = await res.json();

            if (data.success) {
                // Show finance breakdown in alert
                setFinanceData({
                    ...data.finance,
                    enrollmentId: id,
                });
                fetchEnrollments();
            } else {
                setError(data.message || "Failed to process payment");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to process payment");
        } finally {
            setProcessingId(null);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    // Get pending enrollments count
    const pendingCount = enrollments.filter(
        (e) => e.paymentStatus === "PENDING"
    ).length;
    const paidCount = enrollments.filter((e) => e.paymentStatus === "PAID").length;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CreditCard className="text-indigo-600" size={28} />
                        Student Payments
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage course payments and track revenue
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchEnrollments}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    Refresh
                </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Pending Payments</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                        </div>
                        <Clock className="text-yellow-500" size={32} />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Completed Payments</p>
                            <p className="text-2xl font-bold text-green-600">{paidCount}</p>
                        </div>
                        <CheckCircle className="text-green-500" size={32} />
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Enrollments</p>
                            <p className="text-2xl font-bold text-indigo-600">{enrollments.length}</p>
                        </div>
                        <BookOpen className="text-indigo-500" size={32} />
                    </div>
                </motion.div>
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

            {/* Finance Breakdown Modal */}
            {financeData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setFinanceData(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
                            <p className="text-gray-600 mt-1">Revenue Breakdown</p>
                        </div>

                        <div className="space-y-4">
                            {/* Total Amount */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600">Course Price</span>
                                    <span className="text-xl font-bold text-gray-900">
                                        {formatCurrency(financeData.coursePrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Admin Cut */}
                            <div className="bg-indigo-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-indigo-600 flex items-center gap-2">
                                        <DollarSign size={16} />
                                        Admin Cut ({financeData.adminPercentage}%)
                                    </span>
                                    <span className="text-lg font-bold text-indigo-600">
                                        {formatCurrency(financeData.adminAmount)}
                                    </span>
                                </div>
                                <p className="text-xs text-indigo-500">
                                    Platform fee for maintaining the system
                                </p>
                            </div>

                            {/* Teacher Earnings */}
                            <div className="bg-green-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-green-600 flex items-center gap-2">
                                        <User size={16} />
                                        Teacher Earnings (90%)
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                        {formatCurrency(financeData.teacherAmount)}
                                    </span>
                                </div>
                                <p className="text-xs text-green-500">
                                    Amount credited to teacher's account
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFinanceData(null)}
                            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium"
                        >
                            Close
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}

            {/* Enrollments Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <tr>
                                <th className="p-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        Student
                                    </div>
                                </th>
                                <th className="p-4 text-left">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} />
                                        Course
                                    </div>
                                </th>
                                <th className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <DollarSign size={16} />
                                        Price
                                    </div>
                                </th>
                                <th className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <CreditCard size={16} />
                                        Status
                                    </div>
                                </th>
                                <th className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Calculator size={16} />
                                        Action
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mb-3"></div>
                                            <p className="text-gray-500">Loading enrollments...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <BookOpen size={48} className="text-gray-300 mb-3" />
                                            <p className="text-gray-500">No enrollments found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                enrollments.map((e, index) => (
                                    <motion.tr
                                        key={e._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-indigo-600 font-medium">
                                                        {e.student?.fullName?.charAt(0) || "S"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {e.student?.fullName || "Unknown"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {e.student?.email || "No email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <p className="font-medium text-gray-900">
                                                {e.course?.title || "N/A"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {e.course?.category || "General"}
                                            </p>
                                        </td>

                                        <td className="p-4 text-center">
                                            <span className="font-bold text-gray-900">
                                                {formatCurrency(e.amount || e.course?.price || 0)}
                                            </span>
                                            {e.paymentStatus === "PAID" && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    Teacher: {formatCurrency(e.teacherAmount || 0)}
                                                </p>
                                            )}
                                        </td>

                                        <td className="p-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                                    e.paymentStatus === "PAID"
                                                        ? "bg-green-100 text-green-700"
                                                        : e.paymentStatus === "LATER"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {e.paymentStatus === "PAID" ? (
                                                    <CheckCircle size={14} />
                                                ) : e.paymentStatus === "LATER" ? (
                                                    <XCircle size={14} />
                                                ) : (
                                                    <Clock size={14} />
                                                )}
                                                {e.paymentStatus}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center">
                                            {e.paymentStatus === "PAID" ? (
                                                <button
                                                    disabled
                                                    className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                                                >
                                                    Completed
                                                </button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => updatePayment(e._id)}
                                                    disabled={processingId === e._id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                                                >
                                                    {processingId === e._id ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DollarSign size={16} />
                                                            Mark as Paid
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                <Calculator className="text-blue-600 mt-0.5" size={20} />
                <div>
                    <h4 className="font-medium text-blue-900">How Payments Work</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        When you mark a payment as "Paid", the system automatically calculates:
                    </p>
                    <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
                        <li>
                            <strong>Course Price</strong> - Total amount paid by student
                        </li>
                        <li>
                            <strong>Admin Cut (10%)</strong> - Platform fee retained by admin
                        </li>
                        <li>
                            <strong>Teacher Earnings (90%)</strong> - Amount credited to teacher's account
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}



