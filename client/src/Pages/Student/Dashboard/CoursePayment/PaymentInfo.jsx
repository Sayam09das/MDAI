import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Copy, MessageCircle, Mail, FileText, AlertCircle, BookOpen, Check } from "lucide-react";

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"
                    />
                    <p className="text-gray-700 font-medium">Loading payment details...</p>
                </motion.div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Complete Your Payment
                    </h1>
                    <p className="text-gray-600">Follow the steps below to get access</p>
                </div>

                {/* Course Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-5 border border-gray-200"
                >
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                {course.title}
                            </h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-indigo-600">
                                    ${course.price}
                                </span>
                                <span className="text-sm text-gray-500">one-time</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-5 border border-gray-200"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            1
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Make Payment</h3>
                    </div>

                    {/* UPI */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 font-medium">UPI / Phone Number</span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(PAYMENT_UPI)}
                                className="flex items-center gap-1 px-3 py-1 bg-white rounded-md text-sm text-indigo-600 font-medium border border-gray-200 hover:bg-gray-50"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? "Copied" : "Copy"}
                            </motion.button>
                        </div>
                        <div className="text-xl font-semibold text-gray-800 break-all">
                            {PAYMENT_UPI}
                        </div>
                    </div>

                    {/* Support */}
                    <div className="space-y-3">
                        <a
                            href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer"
                            >
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="text-xs text-green-700 font-medium">WhatsApp</div>
                                    <div className="text-sm font-semibold text-gray-800">{SUPPORT_WHATSAPP}</div>
                                </div>
                            </motion.div>
                        </a>

                        <a href={`mailto:${SUPPORT_EMAIL}`}>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer"
                            >
                                <Mail className="w-5 h-5 text-blue-600" />
                                <div>
                                    <div className="text-xs text-blue-700 font-medium">Email</div>
                                    <div className="text-sm font-semibold text-gray-800">{SUPPORT_EMAIL}</div>
                                </div>
                            </motion.div>
                        </a>
                    </div>
                </motion.div>

                {/* Submit Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-5 border border-gray-200"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            2
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Submit Payment Details</h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                        After payment, fill the form with your transaction details.
                    </p>

                    <a href={PAYMENT_FORM} target="_blank" rel="noopener noreferrer">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Submit Payment Details
                        </motion.button>
                    </a>
                </motion.div>

                {/* Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-5"
                >
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-1">Important</h4>
                            <p className="text-sm text-gray-700 mb-2">
                                Access granted after admin verification (2-4 hours).
                            </p>
                            <p className="text-xs text-gray-600">
                                Need help? Contact us via WhatsApp or Email.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentInfo;