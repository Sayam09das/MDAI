import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    AlertCircle, 
    Send, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Eye, 
    Filter,
    Plus,
    MessageSquare,
    User,
    Calendar,
    ChevronRight,
    Users,
    Shield
} from "lucide-react";
import { getBackendURL } from "../../../../lib/config";

const BACKEND_URL = getBackendURL();

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

const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
];

export default function StudentComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipientsLoading, setRecipientsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [filter, setFilter] = useState("all");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        recipientId: "",
        recipientRole: "",
        category: "other",
        priority: "medium"
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

    // Get token dynamically - this is the KEY FIX!
    const getToken = useCallback(() => {
        return localStorage.getItem("token");
    }, []);

    // Initialize auth state
    useEffect(() => {
        const token = getToken();
        const storedUser = localStorage.getItem("user");
        
        if (!token) {
            setError("Please login to view complaints");
            setLoading(false);
            setIsAuthenticated(false);
            return;
        }
        
        setIsAuthenticated(true);
        
        // Parse user data to get role
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserRole(user.role || "student");
                setUserId(user.id || user._id);
                console.log("✅ User role:", user.role);
            } catch (e) {
                console.error("Error parsing user:", e);
            }
        }
        
        fetchComplaints(token);
        fetchRecipients(token);
    }, [getToken]);

    // Fetch recipients with the current token
    const fetchRecipients = async (token) => {
        if (!token) {
            console.log("❌ No token available for fetching recipients");
            return;
        }
        
        setRecipientsLoading(true);
        try {
            console.log("✅ Fetching recipients...");
            
            // First, let's verify the user's role
            const storedUser = localStorage.getItem("user");
            let userRole = "unknown";
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    userRole = user.role || "unknown";
                    console.log("🔍 User role from localStorage:", userRole);
                } catch (e) {}
            }
            
            const res = await fetch(`${BACKEND_URL}/api/complaints/recipients`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            const data = await res.json();
            console.log("✅ Recipients API response:", data);
            
            if (data.success && Array.isArray(data.recipients)) {
                setRecipients(data.recipients);
                console.log(`✅ Loaded ${data.recipients.length} recipients for ${userRole} user`);
                
                // Debug: Log recipients by role
                const teachers = data.recipients.filter(r => r.role === "teacher");
                const admins = data.recipients.filter(r => r.role === "admin");
                console.log(`   - Teachers: ${teachers.length}`);
                console.log(`   - Admins: ${admins.length}`);
                
                if (data.recipients.length > 0) {
                    console.log("Sample recipients:", data.recipients.slice(0, 3));
                } else {
                    console.log("⚠️ No recipients found!");
                    console.log("   Check: Are there teachers/admins in the database?");
                    console.log("   Check: Are you logged in as the correct role?");
                }
            } else {
                console.error("❌ Failed to fetch recipients:", data.message);
                setRecipients([]);
            }
        } catch (err) {
            console.error("❌ Fetch recipients error:", err);
            setRecipients([]);
        } finally {
            setRecipientsLoading(false);
        }
    };

    const fetchComplaints = async (token) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/complaints/my?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                setComplaints(data.complaints || []);
            } else {
                setError(data.message || "Failed to load complaints");
            }
        } catch (err) {
            console.error("Fetch complaints error:", err);
            setError("Failed to load complaints. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = async () => {
        // Ensure recipients are loaded before opening form
        const token = getToken();
        if (recipients.length === 0 && token) {
            console.log("⚠️ Recipients empty, fetching now...");
            await fetchRecipients(token);
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.recipientId || !formData.recipientRole) {
            setError("Please select a recipient");
            return;
        }
        
        const token = getToken();
        if (!token) {
            setError("Please login again");
            return;
        }
        
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${BACKEND_URL}/api/complaints`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (data.success) {
                setSuccess("Complaint submitted successfully!");
                setShowForm(false);
                setFormData({
                    title: "",
                    description: "",
                    recipientId: "",
                    recipientRole: "",
                    category: "other",
                    priority: "medium"
                });
                fetchComplaints(token);
            } else {
                setError(data.message || "Failed to submit complaint");
            }
        } catch (err) {
            console.error("Submit complaint error:", err);
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle recipient selection - FIX for key matching
    const handleRecipientChange = (e) => {
        const selectedId = e.target.value;
        console.log("Selected ID:", selectedId);
        console.log("Available recipients:", recipients.map(r => ({ id: r.userId, name: r.name })));
        
        // Find the recipient - handle both string and ObjectId comparison
        const selected = recipients.find(r => 
            r.userId === selectedId || 
            r.userId?.toString() === selectedId
        );
        
        console.log("Selected recipient:", selected);
        
        setFormData({
            ...formData,
            recipientId: selectedId,
            recipientRole: selected?.role || ""
        });
    };

    const filteredComplaints = complaints.filter(c => {
        if (filter === "all") return true;
        return c.status === filter;
    });

    const stats = {
        total: complaints?.length || 0,
        pending: complaints?.filter(c => c.status === "pending").length || 0,
        inReview: complaints?.filter(c => c.status === "in_review").length || 0,
        resolved: complaints?.filter(c => c.status === "resolved").length || 0
    };

    // Loading state for dropdown
    const isDropdownLoading = recipientsLoading || recipients.length === 0;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="text-indigo-600" size={28} />
                        My Complaints
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Submit and track your complaints
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenForm}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    New Complaint
                </motion.button>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500">
                    <p className="text-gray-600 text-sm">Total Complaints</p>
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
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {["all", "pending", "in_review", "resolved", "rejected"].map(status => (
                    <button
                        key={status}
                        onClick={() => { setFilter(status); fetchComplaints(getToken()); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === status 
                                ? "bg-indigo-600 text-white" 
                                : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {status.replace("_", " ").toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Complaints List */}
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
                <div className="space-y-4">
                    {filteredComplaints.map((complaint, index) => (
                        <motion.div
                            key={complaint._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint?.status)}`}>
                                                {(complaint?.status || "pending").replace("_", " ").toUpperCase()}
                                            </span>
                                            <span className={`text-xs font-medium ${getPriorityColor(complaint?.priority)}`}>
                                                {(complaint?.priority || "medium").toUpperCase()}
                                            </span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {(complaint?.category || "other").replace("_", " ")}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {complaint?.title || "Untitled Complaint"}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {complaint?.description || "No description provided"}
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setSelectedComplaint(complaint)}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                                    >
                                        <Eye size={20} />
                                    </motion.button>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>To: {complaint?.recipient?.name || "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{formatDate(complaint?.createdAt)}</span>
                                    </div>
                                </div>

                                {complaint?.adminResponse?.message && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-700 font-medium">Admin Response:</p>
                                        <p className="text-sm text-green-600 mt-1">{complaint.adminResponse.message}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* New Complaint Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
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
                                    <h2 className="text-xl font-bold">Submit New Complaint</h2>
                                    <button 
                                        onClick={() => setShowForm(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <XCircle size={24} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Brief summary of your complaint"
                                        maxLength={200}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Recipient *
                                        </label>
                                        
                                        {/* Debug info - remove in production */}
                                        <div className="text-xs text-gray-400 mb-1">
                                            Debug: {recipients.length} recipients loaded
                                        </div>
                                        
                                        <select
                                            required
                                            value={formData.recipientId}
                                            onChange={handleRecipientChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            disabled={isDropdownLoading}
                                        >
                                            <option value="">
                                                {isDropdownLoading ? "Loading..." : "Select recipient"}
                                            </option>
                                            
                                            {/* Teachers */}
                                            {recipients.filter(r => r.role === "teacher").length > 0 && (
                                                <optgroup label="Teachers">
                                                    {recipients
                                                        .filter(r => r.role === "teacher")
                                                        .map(r => (
                                                            <option key={r.userId} value={r.userId}>
                                                                🏫 {r.name} (Teacher)
                                                            </option>
                                                        ))}
                                                </optgroup>
                                            )}
                                            
                                            {/* Admins */}
                                            {recipients.filter(r => r.role === "admin").length > 0 && (
                                                <optgroup label="Admins">
                                                    {recipients
                                                        .filter(r => r.role === "admin")
                                                        .map(r => (
                                                            <option key={r.userId} value={r.userId}>
                                                                🛡️ {r.name} (Admin)
                                                            </option>
                                                        ))}
                                                </optgroup>
                                            )}
                                        </select>
                                        
                                        {/* Show empty state if no recipients */}
                                        {!isDropdownLoading && recipients.length === 0 && (
                                            <p className="text-red-500 text-sm mt-1">
                                                ⚠️ No recipients available. Please check your permissions or try logging out and back in.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {categories.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {priorities.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]"
                                        placeholder="Provide detailed description of your complaint..."
                                        maxLength={5000}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={submitting || isDropdownLoading}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Submit Complaint
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Complaint Detail Modal */}
            <AnimatePresence>
                {selectedComplaint && (
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
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint?.status)}`}>
                                        {(selectedComplaint?.status || "pending").replace("_", " ").toUpperCase()}
                                    </span>
                                    <span className={`text-xs font-medium ${getPriorityColor(selectedComplaint?.priority)}`}>
                                        {(selectedComplaint?.priority || "medium").toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedComplaint?.title || "Untitled"}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Category: {(selectedComplaint?.category || "other").replace("_", " ")}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint?.description || "No description provided"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">From:</p>
                                        <p className="font-medium">{selectedComplaint?.sender?.name || "Unknown"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">To:</p>
                                        <p className="font-medium">{selectedComplaint?.recipient?.name || "Unknown"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Submitted:</p>
                                        <p className="font-medium">{formatDate(selectedComplaint?.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Last Updated:</p>
                                        <p className="font-medium">{formatDate(selectedComplaint?.updatedAt)}</p>
                                    </div>
                                </div>

                                {selectedComplaint?.adminResponse?.message && (
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                        <p className="text-sm font-medium text-green-700 mb-1">Admin Response:</p>
                                        <p className="text-sm text-green-600">{selectedComplaint.adminResponse.message}</p>
                                        {selectedComplaint.adminResponse.respondedAt && (
                                            <p className="text-xs text-green-500 mt-2">
                                                Responded on {formatDate(selectedComplaint.adminResponse.respondedAt)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

