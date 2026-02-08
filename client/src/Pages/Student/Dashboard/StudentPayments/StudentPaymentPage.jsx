import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function StudentPaymentPage() {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEnrollment = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to view payment details");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/enrollments/my-courses`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch enrollment");
                }

                // Find the specific enrollment
                const found = (data.enrollments || []).find(
                    (e) => e._id === enrollmentId
                );

                if (found) {
                    setEnrollment(found);
                } else {
                    setError("Enrollment not found");
                }
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load payment details");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [enrollmentId]);

    const getStatusConfig = (status) => {
        const configs = {
            PAID: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                icon: <CheckCircle className="w-5 h-5" />,
                label: "Paid"
            },
            PENDING: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                icon: <Clock className="w-5 h-5" />,
                label: "Pending"
            },
            LATER: {
                bg: "bg-slate-50",
                text: "text-slate-700",
                border: "border-slate-200",
                icon: <CreditCard className="w-5 h-5" />,
                label: "Pay Later"
            },
        };
        return configs[status] || configs.PENDING;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <AlertCircle className="w-8 h-8" />
                        <div>
                            <h3 className="font-semibold text-lg">Error</h3>
                            <p className="text-sm text-gray-600">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/student-dashboard/payments")}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Back to Payments
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Enrollment Not Found</h3>
                        <p className="text-gray-600 mb-4">The payment details you're looking for don't exist.</p>
                        <button
                            onClick={() => navigate("/student-dashboard/payments")}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Back to Payments
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(enrollment.paymentStatus);
    const course = enrollment.course || {};
    const receipt = enrollment.receipt || {};

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="min-h-screen bg-gray-50 py-6 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate("/student-dashboard/payments")}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Payments</span>
                    </motion.button>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-100 p-3 rounded-xl">
                                <FileText className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
                        </div>

                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            {statusConfig.icon}
                            <span className="font-semibold">{statusConfig.label}</span>
                        </div>
                    </motion.div>

                    {/* Course Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6 mb-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Course Name</p>
                                <p className="text-lg font-medium text-gray-900">{course.title || "N/A"}</p>
                            </div>
                            {course.category && (
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="text-gray-900">{course.category}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Payment Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6 mb-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <p className="text-gray-500">Amount</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ₹{enrollment.amount?.toLocaleString() || "0"}
                                </p>
                            </div>
                            {receipt.receiptNumber && (
                                <div className="flex justify-between">
                                    <p className="text-gray-500">Receipt Number</p>
                                    <p className="text-gray-900 font-mono">{receipt.receiptNumber}</p>
                                </div>
                            )}
                            {enrollment.verifiedAt && (
                                <div className="flex justify-between">
                                    <p className="text-gray-500">Verified On</p>
                                    <p className="text-gray-900">
                                        {new Date(enrollment.verifiedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <p className="text-gray-500">Enrolled On</p>
                                <p className="text-gray-900">
                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Receipt Button */}
                    {enrollment.paymentStatus === "PAID" && receipt.url && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Receipt</h2>
                            <a
                                href={receipt.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <FileText className="w-5 h-5" />
                                View Receipt
                            </a>
                        </motion.div>
                    )}

                    {/* Pending Notice */}
                    {enrollment.paymentStatus === "PENDING" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-amber-50 border border-amber-200 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 text-amber-700">
                                <Clock className="w-6 h-6" />
                                <div>
                                    <h3 className="font-semibold">Payment Pending</h3>
                                    <p className="text-sm">Your payment is awaiting verification by the admin.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Pay Later Notice */}
                    {enrollment.paymentStatus === "LATER" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 text-slate-700">
                                <CreditCard className="w-6 h-6" />
                                <div>
                                    <h3 className="font-semibold">Payment Deferred</h3>
                                    <p className="text-sm">You have been marked for "Pay Later". Please contact admin for payment details.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
