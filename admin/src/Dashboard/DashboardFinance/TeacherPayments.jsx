import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    Users,
    Search,
    Filter,
    Download,
    CheckCircle,
    Clock,
    TrendingUp,
    Calendar,
    CreditCard,
    ArrowRight,
    RefreshCw,
    Send,
    User,
    BookOpen
} from "lucide-react";
import { getAllTeachersWithEarnings, getAdminFinanceStats } from "../../../lib/api/adminFinanceApi";

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const TeacherPayments = () => {
    const [teachers, setTeachers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [teachersRes, statsRes] = await Promise.all([
                getAllTeachersWithEarnings(),
                getAdminFinanceStats()
            ]);
            
            if (teachersRes.success) {
                setTeachers(teachersRes.teachers);
            }
            if (statsRes.success) {
                setStats(statsRes.stats);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchData();
        } finally {
            setRefreshing(false);
        }
    };

    const handlePayout = async (teacherId) => {
        // This would initiate a payout process
        console.log(`Processing payout for teacher ${teacherId}`);
        alert(`Payout process initiated for teacher ID: ${teacherId}`);
    };

    // Filter teachers based on search
    const filteredTeachers = teachers.filter((teacher) => {
        return (
            teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading teacher payments...</p>
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
                                    <Users className="text-indigo-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Teacher Payments</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Manage and track teacher earnings & payouts
                                </p>
                            </div>
                        </div>

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
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Teacher Payouts</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats?.totalTeacherPayouts || 0)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Users className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Teachers</p>
                        <p className="text-2xl sm:text-3xl font-bold">{teachers.length}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency((stats?.totalTeacherPayouts || 0) * 0.3)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Clock className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending Payouts</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(0)}</p>
                    </motion.div>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 mb-6 lg:mb-8"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by teacher name or email..."
                            className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </motion.div>

                {/* Teacher Payments List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Transactions</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Admin Cut (10%)</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Gross Revenue</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total Earnings</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.length > 0 ? (
                                    filteredTeachers.map((teacher, idx) => (
                                        <motion.tr
                                            key={teacher.teacherId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <User size={18} className="text-indigo-600" />
                                                    </div>
                                                    <span className="font-semibold">{teacher.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-600">{teacher.email}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-medium">{teacher.transactionCount}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-semibold text-purple-600">{formatCurrency(teacher.adminCut)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-semibold text-blue-600">{formatCurrency(teacher.grossRevenue)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-bold text-green-600">{formatCurrency(teacher.totalEarnings)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setSelectedTeacher(teacher)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                        title="View Details"
                                                    >
                                                        <BookOpen size={18} className="text-indigo-600" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handlePayout(teacher.teacherId)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                                                        title="Process Payout"
                                                    >
                                                        <Send size={14} />
                                                        Payout
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center">
                                            <Users size={64} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-xl font-semibold text-gray-600">No teachers found</p>
                                            <p className="text-gray-500">Try adjusting your search</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Teacher Detail Modal */}
            {selectedTeacher && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedTeacher(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold">Teacher Payment Details</h2>
                            <p className="text-sm text-gray-500">ID: {selectedTeacher.teacherId}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold">{selectedTeacher.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{selectedTeacher.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Transactions</p>
                                    <p className="font-semibold">{selectedTeacher.transactionCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Admin Cut (10%)</p>
                                    <p className="font-semibold text-purple-600">{formatCurrency(selectedTeacher.adminCut)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Gross Revenue</p>
                                    <p className="font-semibold text-blue-600">{formatCurrency(selectedTeacher.grossRevenue)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Earnings (90%)</p>
                                    <p className="font-semibold text-green-600">{formatCurrency(selectedTeacher.totalEarnings)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedTeacher(null)}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg"
                            >
                                Close
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePayout(selectedTeacher.teacherId)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium"
                            >
                                Process Payout
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default TeacherPayments;

