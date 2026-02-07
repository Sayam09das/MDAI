import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    Receipt, 
    Search, 
    Filter, 
    Download, 
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle
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
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function ManageTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        totalAmount: 0,
    });
    const token = localStorage.getItem("adminToken");

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/finance/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const data = await res.json();
            setTransactions(data.transactions || []);
            setStats({
                total: data.transactions?.length || 0,
                completed: data.transactions?.filter(t => t.status === "COMPLETED").length || 0,
                pending: data.transactions?.filter(t => t.status === "PENDING").length || 0,
                failed: data.transactions?.filter(t => t.status === "FAILED").length || 0,
                totalAmount: data.transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
            });
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter((tx) => {
        const matchesSearch = 
            tx._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.teacherEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mb-4 mx-auto"></div>
                    <p className="text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle className="text-green-500" size={18} />;
            case "PENDING":
                return <Clock className="text-yellow-500" size={18} />;
            case "FAILED":
                return <XCircle className="text-red-500" size={18} />;
            default:
                return <AlertCircle className="text-gray-500" size={18} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "FAILED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Receipt className="text-indigo-600" size={28} />
                        Manage Transactions
                    </h1>
                    <p className="text-gray-600 mt-1">
                        View and manage all payment transactions
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Download size={18} />
                    Export CSV
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500"
                >
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500"
                >
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Completed</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500"
                >
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500"
                >
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Failed</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500"
                >
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Total Amount</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalAmount)}</p>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <tr>
                                <th className="p-4 text-left">Transaction ID</th>
                                <th className="p-4 text-left">Type</th>
                                <th className="p-4 text-center">Amount</th>
                                <th className="p-4 text-center">Admin (10%)</th>
                                <th className="p-4 text-center">Teacher (90%)</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-left">Student</th>
                                <th className="p-4 text-left">Teacher</th>
                                <th className="p-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-8 text-center">
                                        <Transaction size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500">No transactions found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx, index) => (
                                    <motion.tr
                                        key={tx._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-gray-600">
                                                {tx._id?.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-gray-900">
                                                {tx.type || "PAYMENT"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-gray-900">
                                                {formatCurrency(tx.amount || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-blue-600">
                                                {formatCurrency(tx.adminAmount || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-green-600">
                                                {formatCurrency(tx.teacherAmount || 0)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {getStatusIcon(tx.status)}
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tx.status)}`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-600">
                                                {tx.studentEmail || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-600">
                                                {tx.teacherEmail || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-600 text-sm">
                                                {formatDate(tx.createdAt)}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

