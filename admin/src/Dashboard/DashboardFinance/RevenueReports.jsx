import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    Users,
    BookOpen,
    ArrowRight,
    RefreshCw,
    Calendar
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RevenueReports = () => {
    // This page is now simplified to redirect to Teacher Payments
    // The detailed revenue reports functionality has been moved to the FinanceOverview
    
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
                                    <DollarSign className="text-indigo-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Revenue Reports</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    View revenue analytics and reports
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-8 mb-6"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Revenue Reports
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Revenue reports have been simplified. You can now view all financial data 
                            including teacher payments, pending earnings, and transaction history 
                            in the Finance section.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/admin/dashboard/finance"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                            >
                                <DollarSign size={20} />
                                View Finance Overview
                            </Link>
                            <Link
                                to="/admin/dashboard/finance/payments"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                            >
                                <Users size={20} />
                                Manage Teacher Payments
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-50">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-xl font-bold text-gray-900">All in Finance</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-50">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Teacher Payments</p>
                                <p className="text-xl font-bold text-gray-900">90% of Revenue</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-50">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Course Sales</p>
                                <p className="text-xl font-bold text-gray-900">Track in Payments</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* How it works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        How Revenue Sharing Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-green-600 font-bold">1</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Student Enrolls</p>
                                <p className="text-sm text-gray-600">
                                    Student pays for a course
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-bold">2</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">90/10 Split</p>
                                <p className="text-sm text-gray-600">
                                    Teacher gets 90%, Platform gets 10%
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-600 font-bold">3</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Admin Payment</p>
                                <p className="text-sm text-gray-600">
                                    Admin pays teachers from pending balance
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RevenueReports;
