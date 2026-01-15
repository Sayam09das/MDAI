import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CheckCircle, Copy, MessageCircle, Mail, FileText, AlertCircle, CreditCard, BookOpen, Loader2 } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PAYMENT_UPI = import.meta.env.VITE_PAYMENT_UPI;
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;
const SUPPORT_WHATSAPP = import.meta.env.VITE_SUPPORT_WHATSAPP;
const PAYMENT_FORM = import.meta.env.VITE_PAYMENT_FORM;

const PaymentInfo = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/courses/${courseId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch course");
            }

            setCourse(data.course);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 text-lg font-medium">Loading payment details...</p>
                </motion.div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-block p-3 bg-blue-600 rounded-full mb-4"
                    >
                        <CreditCard className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Complete Your Payment
                    </h1>
                    <p className="text-gray-600">Follow the steps below to access your course</p>
                </motion.div>

                {/* Course Info Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-100"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                {course.title}
                            </h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                                    ${course.price}
                                </span>
                                <span className="text-gray-500">one-time payment</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Instructions */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-100"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                        </div>
                        Make Payment
                    </h3>

                    {/* UPI Payment */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">UPI / Phone Number</span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(PAYMENT_UPI)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy"}
                            </motion.button>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 break-all">
                            {PAYMENT_UPI}
                        </div>
                    </div>

                    {/* Support Contacts */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <a
                            href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                            >
                                <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-xs font-medium text-green-700 mb-0.5">WhatsApp Support</div>
                                    <div className="text-sm font-semibold text-gray-900 truncate">{SUPPORT_WHATSAPP}</div>
                                </div>
                            </motion.div>
                        </a>

                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="block"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                            >
                                <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-xs font-medium text-purple-700 mb-0.5">Email Support</div>
                                    <div className="text-sm font-semibold text-gray-900 truncate">{SUPPORT_EMAIL}</div>
                                </div>
                            </motion.div>
                        </a>
                    </div>
                </motion.div>

                {/* Submit Form */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-100"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            2
                        </div>
                        Submit Payment Details
                    </h3>

                    <p className="text-gray-600 mb-6">
                        After completing your payment, please fill out the form below with your transaction details.
                    </p>

                    <a
                        href={PAYMENT_FORM}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <FileText className="w-5 h-5" />
                            Submit Payment Details
                        </motion.button>
                    </a>
                </motion.div>

                {/* Important Notice */}
                <motion.div
                    variants={itemVariants}
                    className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8"
                >
                    <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Important Notice</h4>
                            <p className="text-gray-700 mb-4">
                                Your course access will be granted after admin verification of your payment. This usually takes 2-4 hours during business hours.
                            </p>
                            <p className="text-sm text-gray-600">
                                Need immediate assistance? Contact us via WhatsApp or email using the links above.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentInfo;