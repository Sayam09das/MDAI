import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DollarSign,
    Users,
    Search,
    BookOpen,
    CreditCard,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Wallet,
    TrendingUp,
    RefreshCw,
    Send,
    User,
    Calendar
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

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};

const TeacherPayments = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTeacher, setExpandedTeacher] = useState(null);
    const [payingTeacher, setPayingTeacher] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [teachersRes, historyRes] = await Promise.all([
                fetch(`${BACKEND_URL}/api/admin/finance/teachers/courses`, getAuthHeaders()),
                fetch(`${BACKEND_URL}/api/admin/finance/payment-history?limit=5`, getAuthHeaders())
            ]);
            
            const teachersData = await teachersRes.json();
            const historyData = await historyRes.json();
            
            if (teachersData.success) {
                setTeachers(teachersData.teachers);
            }
            if (historyData.success) {
                setPaymentHistory(historyData.transactions);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
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

    const handleProcessPayment = async () => {
        if (!payingTeacher || !paymentAmount || parseFloat(paymentAmount) <= 0) {
            alert("Please enter a valid payment amount");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/finance/pay-teacher`, {
                method: "POST",
                headers: {
                    ...getAuthHeaders().headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teacherId: payingTeacher.id,
                    amount: parseFloat(paymentAmount),
                    description: `Manual payment to ${payingTeacher.name}`
                })
            });

            const data = await res.json();
            
            if (data.success) {
                alert(`Payment of ${formatCurrency(parseFloat(paymentAmount))} processed successfully for ${payingTeacher.name}`);
                setPayingTeacher(null);
                setPaymentAmount("");
                handleRefresh();
            } else {
                alert(data.message || "Payment failed");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
        }
    };

    // Filter teachers based on search
    const filteredTeachers = teachers.filter((teacher) => {
        return (
            teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Calculate totals
    const totalPending = teachers.reduce((sum, t) => sum + t.totalPending, 0);
    const totalCourses = teachers.reduce((sum, t) => sum + t.totalCourses, 0);

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
                                    Manage and pay teachers based on their course enrollments
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
                            <Wallet className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pending</p>
                        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalPending)}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <Users className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Teachers</p>
                        <p className="text-2xl sm:text-3xl font-bold">{teachers.length}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <BookOpen className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Courses</p>
                        <p className="text-2xl sm:text-3xl font-bold">{totalCourses}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Avg. per Teacher</p>
                        <p className="text-2xl sm:text-3xl font-bold">
                            {formatCurrency(teachers.length > 0 ? totalPending / teachers.length : 0)}
                        </p>
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
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Courses</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total Students</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Pending Payment (90%)</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.length > 0 ? (
                                    filteredTeachers.map((teacher, idx) => (
                                        <React.Fragment key={teacher.id}>
                                            <motion.tr
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
                                                        <div>
                                                            <span className="font-semibold">{teacher.name}</span>
                                                            <p className="text-sm text-gray-500">{teacher.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-medium">{teacher.totalCourses}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-medium">
                                                        {teacher.courses.reduce((sum, c) => sum + c.studentCount, 0)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-lg font-bold text-green-600">
                                                        {formatCurrency(teacher.totalPending)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setExpandedTeacher(
                                                                expandedTeacher === teacher.id ? null : teacher.id
                                                            )}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                                                        >
                                                            {expandedTeacher === teacher.id ? (
                                                                <>Hide <ChevronUp size={14} /></>
                                                            ) : (
                                                                <>View <ChevronDown size={14} /></>
                                                            )}
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => {
                                                                setPayingTeacher(teacher);
                                                                setPaymentAmount(teacher.totalPending.toString());
                                                            }}
                                                            disabled={teacher.totalPending <= 0}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Send size={14} />
                                                            Pay
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                            
                                            {/* Expanded Course Details */}
                                            <AnimatePresence>
                                                {expandedTeacher === teacher.id && (
                                                    <motion.tr
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                    >
                                                        <td colSpan={5} className="bg-gray-50 px-6 py-4">
                                                            <div className="space-y-3">
                                                                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                                    <BookOpen size={16} />
                                                                    Course Details
                                                                </h4>
                                                                <div className="grid gap-3">
                                                                    {teacher.courses.map((course) => (
                                                                        <div 
                                                                            key={course.id}
                                                                            className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-200"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <BookOpen size={18} className="text-gray-400" />
                                                                                <div>
                                                                                    <p className="font-medium">{course.title}</p>
                                                                                    <p className="text-sm text-gray-500">
                                                                                        Price: {formatCurrency(course.price)} | Students: {course.studentCount}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="text-sm text-gray-500">Teacher's Share</p>
                                                                                <p className="font-bold text-green-600">{formatCurrency(course.teacherShare)}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
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

                {/* Recent Payments */}
                {paymentHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CheckCircle className="text-green-600" size={20} />
                                Recent Payments
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Teacher</th>
                                        <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Amount</th>
                                        <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Date</th>
                                        <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentHistory.map((payment) => (
                                        <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-6">
                                                <span className="font-medium">{payment.teacher?.fullName || payment.teacher?.name}</span>
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className="font-bold text-green-600">{formatCurrency(payment.teacherAmount)}</span>
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={14} />
                                                    {formatDate(payment.completedAt || payment.createdAt)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {payingTeacher && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setPayingTeacher(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold">Process Payment</h2>
                                <p className="text-sm text-gray-500">Pay teacher for their course earnings</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Teacher</p>
                                    <p className="font-semibold text-lg">{payingTeacher.name}</p>
                                    <p className="text-sm text-gray-500">{payingTeacher.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Available Pending</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(payingTeacher.totalPending)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 mb-1 block">
                                        Payment Amount
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            max={payingTeacher.totalPending}
                                            min="0"
                                            step="0.01"
                                            className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setPayingTeacher(null)}
                                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleProcessPayment}
                                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Process Payment
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherPayments;

