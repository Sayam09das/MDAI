import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    AlertCircle, 
    CheckCircle, 
    XCircle, 
    Eye, 
    Trash2, 
    Filter,
    MessageSquare,
    User,
    Calendar,
    Clock,
    Send,
    ChevronDown,
    Search,
    ArrowUpDown
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

const getStatusColor = (status) => {
    switch (status) {
        case "pending": return "bg-yellow-100 text-yellow-700";
        case "in_review": return "bg-blue-100 text-blue-700";
        case "resolved": return "bg-green-100 text-green-700";
        case "rejected": return "bg-red-100 text-red-700";
        case "escalated": return "bg-orange-100 text-orange-700";
        default: return "bg-gray-100 text-gray-700";
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case "urgent": return "text-red-600";
        case "high": return "text-orange-600";
        case "medium": return "text-yellow-600";
        case "low": return "text-green-600";
        default: return "text-gray-600";
    }
};

const categories = [
    { value: "all", label: "All Categories" },
    { value: "academic", label: "Academic Issues" },
    { value: "payment", label: "Payment Issues" },
    { value: "harassment", label: "Harassment" },
    { value: "technical", label: "Technical Issues" },
    { value: "discrimination", label: "Discrimination" },
    { value: "course_content", label: "Course Content" },
    { value: "assessment", label: "Assessment Issues" },
    { value: "communication", label: "Communication" },
    { value: "facilities", label: "Facilities" },
    { value: "other", label: "Other" }
];

const statuses = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in_review", label: "In Review" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
    { value: "escalated", label: "Escalated" }
];

const senderRoles = [
    { value: "all", label: "All Roles" },
    { value: "student", label: "Students" },
    { value: "teacher", label: "Teachers" }
];

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState("resolved");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        fetchComplaints();
    }, [statusFilter, categoryFilter, roleFilter]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            let url = `${BACKEND_URL}/api/complaints/admin/all?`;
            if (statusFilter !== "all") url += `status=${statusFilter}&`;
            if (categoryFilter !== "all") url += `category=${categoryFilter}&`;
            if (roleFilter !== "all") url += `senderRole=${roleFilter}&`;
            
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                setComplaints(data.complaints);
            }
        } catch (err) {
            setError("Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (complaintId, newStatus, remark) => {
        setSubmitting(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/complaints/${complaintId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    responseMessage: remark
                })
            });
            const data = await res.json();
            
            if (data.success) {
                setSuccess("Complaint updated successfully!");
                setShowResponseModal(false);
                setResponseMessage("");
                fetchComplaints();
            } else {
                setError(data.message || "Failed to update complaint");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (complaintId) => {
        if (!confirm("Are you sure you want to delete this complaint?")) return;
        
        try {
            const res = await fetch(`${BACKEND_URL}/api/complaints/${complaintId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                setSuccess("Complaint deleted successfully!");
                fetchComplaints();
            } else {
                setError(data.message || "Failed to delete complaint");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
    };

    const filteredComplaints = complaints.filter(c => {
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                c.title?.toLowerCase().includes(search) ||
                c.description?.toLowerCase().includes(search) ||
                c.sender?.name?.toLowerCase().includes(search) ||
                c.recipient?.name?.toLowerCase().includes(search)
            );
        }
        return true;
    });

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === "pending").length,
        inReview: complaints.filter(c => c.status === "in_review").length,
        resolved: complaints.filter(c => c.status === "resolved").length,
        escalated: complaints.filter(c => c.isEscalated).length
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="text-indigo-600" size={28} />
                        Complaint Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Review and manage all complaints
                    </p>
                </div>

                <button
                    onClick={fetchComplaints}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    <Clock size={18} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                >
                    {error}
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                >
                    {success}
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500">
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm">In Review</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inReview}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
                    <p className="text-gray-600 text-sm">Escalated</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.escalated}</p>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {categories.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {senderRoles.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Complaints Table */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
                </div>
            ) : filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No complaints found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="p-4 text-left">Title</th>
                                    <th className="p-4 text-left">From</th>
                                    <th className="p-4 text-left">To</th>
                                    <th className="p-4 text-center">Category</th>
                                    <th className="p-4 text-center">Priority</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Date</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredComplaints.map((complaint, index) => (
                                    <motion.tr
                                        key={complaint._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <div className="max-w-xs">
                                                <p className="font-medium text-gray-900 truncate">{complaint.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{complaint.description}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{complaint.sender?.name}</p>
                                                <p className="text-xs text-gray-500 uppercase">{complaint.sender?.role}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{complaint.recipient?.name}</p>
                                                <p className="text-xs text-gray-500 uppercase">{complaint.recipient?.role}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm text-gray-600">
                                                {complaint.category?.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                                                {complaint.priority?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                                {complaint.status?.replace("_", " ").toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm text-gray-600">
                                                {formatDate(complaint.createdAt)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setSelectedComplaint(complaint)}
                                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </motion.button>
                                                
                                                {complaint.status !== "resolved" && complaint.status !== "rejected" && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => {
                                                            setSelectedComplaint(complaint);
                                                            setShowResponseModal(true);
                                                        }}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                                        title="Update Status"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </motion.button>
                                                )}
                                                
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDelete(complaint._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Complaint Detail Modal */}
            <AnimatePresence>
                {selectedComplaint && !showResponseModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedComplaint(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Complaint Details</h2>
                                    <button 
                                        onClick={() => setSelectedComplaint(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <XCircle size={24} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                                        {selectedComplaint.status?.replace("_", " ").toUpperCase()}
                                    </span>
                                    <span className={`text-xs font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                                        {selectedComplaint.priority?.toUpperCase()}
                                    </span>
                                    {selectedComplaint.isEscalated && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                            ESCALATED
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedComplaint.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Category: {selectedComplaint.category?.replace("_", " ")}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">From:</p>
                                        <p className="font-medium">{selectedComplaint.sender?.name}</p>
                                        <p className="text-gray-500">{selectedComplaint.sender?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">To:</p>
                                        <p className="font-medium">{selectedComplaint.recipient?.name}</p>
                                        <p className="text-gray-500">{selectedComplaint.recipient?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Submitted:</p>
                                        <p className="font-medium">{formatDate(selectedComplaint.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Last Updated:</p>
                                        <p className="font-medium">{formatDate(selectedComplaint.updatedAt)}</p>
                                    </div>
                                </div>

                                {selectedComplaint.adminResponse?.message && (
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                        <p className="text-sm font-medium text-green-700 mb-1">Admin Response:</p>
                                        <p className="text-sm text-green-600">{selectedComplaint.adminResponse.message}</p>
                                    </div>
                                )}

                                {/* Status History */}
                                {selectedComplaint.statusHistory?.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Status History</h4>
                                        <div className="space-y-2">
                                            {selectedComplaint.statusHistory.map((history, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm">
                                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-600"></div>
                                                    <div>
                                                        <p className="text-gray-700">
                                                            Status changed to <span className="font-medium">{history.status}</span>
                                                        </p>
                                                        <p className="text-gray-500 text-xs">
                                                            {history.changedBy?.name} • {formatDate(history.changedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="flex gap-4 pt-4 border-t">
                                    <button
                                        onClick={() => setShowResponseModal(true)}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        Update Status
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedComplaint._id)}
                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Response Modal */}
            <AnimatePresence>
                {showResponseModal && selectedComplaint && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowResponseModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Update Complaint Status</h2>
                                    <button 
                                        onClick={() => setShowResponseModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <XCircle size={24} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Status
                                    </label>
                                    <select
                                        value={responseStatus}
                                        onChange={e => setResponseStatus(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="in_review">In Review</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="escalated">Escalated</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Response / Remarks
                                    </label>
                                    <textarea
                                        value={responseMessage}
                                        onChange={e => setResponseMessage(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                                        placeholder="Enter your response or remarks..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setShowResponseModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleStatusUpdate(selectedComplaint._id, responseStatus, responseMessage)}
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Update
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
