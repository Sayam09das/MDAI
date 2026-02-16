import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    HelpCircle, 
    Send, 
    Clock, 
    CheckCircle, 
    Eye, 
    Plus,
    MessageSquare,
    User,
    Calendar,
    Mail,
    Phone,
    BookOpen,
    Video,
    CreditCard,
    FileText,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from "lucide-react";
import { getBackendURL } from "../../../../lib/config";

const BACKEND_URL = getBackendURL();

// FAQ Data
const faqData = [
    {
        question: "How do I enroll in a course?",
        answer: "Navigate to 'All Courses' from your sidebar, browse available courses, and click 'Enroll' on any course. You may need to complete payment if the course is paid.",
        category: "courses"
    },
    {
        question: "How do I access course materials?",
        answer: "Go to 'My Courses' and select the course you want to access. Click on the 'Course Content' or 'Resources' section to view all materials.",
        category: "courses"
    },
    {
        question: "How do I submit an assignment?",
        answer: "Go to 'Assignments' from your sidebar, find the assignment you need to submit, click on it, and use the submission form to upload your work.",
        category: "assignments"
    },
    {
        question: "How do I take an exam?",
        answer: "Go to 'Exams / Quizzes' from your sidebar, find the exam you need to take, and click 'Start Exam'. Make sure you have a stable internet connection.",
        category: "exams"
    },
    {
        question: "How do I make a payment?",
        answer: "Go to 'Payments' from your sidebar, select the course you want to pay for, and follow the payment instructions. You can pay via credit card or other available methods.",
        category: "payments"
    },
    {
        question: "How do I view my certificates?",
        answer: "Once you complete all course requirements, your certificate will be automatically generated. Go to 'Certificates' from your sidebar to view and download them.",
        category: "certificates"
    },
    {
        question: "How do I contact my teacher?",
        answer: "You can send a message to your teacher by going to 'Messages' from your sidebar and starting a new conversation.",
        category: "communication"
    },
    {
        question: "What should I do if I face technical issues?",
        answer: "You can submit a support ticket through this Help & Support page. Select 'Technical Issues' as the category and describe your problem in detail.",
        category: "technical"
    }
];

// Contact Information
const contactInfo = {
    email: "support@mdai.com",
    phone: "+1 (555) 123-4567",
    hours: "Monday - Friday, 9:00 AM - 6:00 PM"
};

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

const getCategoryIcon = (category) => {
    switch (category) {
        case "academic": return BookOpen;
        case "payment": return CreditCard;
        case "technical": return Video;
        default: return FileText;
    }
};

const categories = [
    { value: "academic", label: "Academic Issues" },
    { value: "payment", label: "Payment Issues" },
    { value: "technical", label: "Technical Issues" },
    { value: "communication", label: "Communication" },
    { value: "course_content", label: "Course Content" },
    { value: "assessment", label: "Assessment Issues" },
    { value: "other", label: "Other" }
];

const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
];

export default function StudentSupport() {
    const [tickets, setTickets] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipientsLoading, setRecipientsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("faq"); // faq, contact, tickets
    const [showForm, setShowForm] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [expandedFaq, setExpandedFaq] = useState(null);
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

    const getToken = useCallback(() => {
        return localStorage.getItem("token");
    }, []);

    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchTickets(token);
            fetchRecipients(token);
        }
    }, [getToken]);

    const fetchRecipients = async (token) => {
        setRecipientsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/complaints/recipients`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.recipients)) {
                setRecipients(data.recipients);
            }
        } catch (err) {
            console.error("Fetch recipients error:", err);
        } finally {
            setRecipientsLoading(false);
        }
    };

    const fetchTickets = async (token) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/complaints/my?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                setTickets(data.complaints || []);
            } else {
                setError(data.message || "Failed to load tickets");
            }
        } catch (err) {
            console.error("Fetch tickets error:", err);
            setError("Failed to load tickets. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = async () => {
        const token = getToken();
        if (recipients.length === 0 && token) {
            await fetchRecipients(token);
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
                setSuccess("Support ticket submitted successfully!");
                setShowForm(false);
                setFormData({
                    title: "",
                    description: "",
                    recipientId: "",
                    recipientRole: "",
                    category: "other",
                    priority: "medium"
                });
                fetchTickets(token);
            } else {
                setError(data.message || "Failed to submit ticket");
            }
        } catch (err) {
            console.error("Submit ticket error:", err);
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRecipientChange = (e) => {
        const selectedId = e.target.value;
        const selected = recipients.find(r => 
            r.userId === selectedId || 
            r.userId?.toString() === selectedId
        );
        
        setFormData({
            ...formData,
            recipientId: selectedId,
            recipientRole: selected?.role || ""
        });
    };

    const filteredTickets = tickets.filter(t => {
        if (filter === "all") return true;
        return t.status === filter;
    });

    const stats = {
        total: tickets?.length || 0,
        pending: tickets?.filter(t => t.status === "pending").length || 0,
        inReview: tickets?.filter(t => t.status === "in_review").length || 0,
        resolved: tickets?.filter(t => t.status === "resolved").length || 0
    };

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <HelpCircle className="text-indigo-600" size={28} />
                        Help & Support
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Find answers or submit a support ticket
                    </p>
                </div>
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

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setActiveTab("faq")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "faq" 
                            ? "bg-indigo-600 text-white" 
                            : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    <HelpCircle size={16} className="inline mr-2" />
                    FAQ
                </button>
                <button
                    onClick={() => setActiveTab("contact")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "contact" 
                            ? "bg-indigo-600 text-white" 
                            : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    <Mail size={16} className="inline mr-2" />
                    Contact Us
                </button>
                <button
                    onClick={() => setActiveTab("tickets")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "tickets" 
                            ? "bg-indigo-600 text-white" 
                            : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    <MessageSquare size={16} className="inline mr-2" />
                    My Tickets
                </button>
                <button
                    onClick={handleOpenForm}
                    className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Ticket
                </button>
            </div>

            {/* FAQ Tab */}
            {activeTab === "faq" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                            {faqData.map((faq, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium text-gray-900">{faq.question}</span>
                                        {expandedFaq === index ? (
                                            <ChevronUp size={20} className="text-gray-500" />
                                        ) : (
                                            <ChevronDown size={20} className="text-gray-500" />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {expandedFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 bg-white text-gray-600">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-100 rounded-lg">
                                    <Mail className="text-indigo-600" size={24} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Email</p>
                                    <p className="text-gray-600">{contactInfo.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Phone className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Phone</p>
                                    <p className="text-gray-600">{contactInfo.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Clock className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Hours</p>
                                    <p className="text-gray-600">{contactInfo.hours}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a href="/student-dashboard/all-courses" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <BookOpen className="text-indigo-600" size={20} />
                                <span className="font-medium">Browse Courses</span>
                                <ExternalLink size={16} className="ml-auto text-gray-400" />
                            </a>
                            <a href="/student-dashboard/payments" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <CreditCard className="text-green-600" size={20} />
                                <span className="font-medium">Payment History</span>
                                <ExternalLink size={16} className="ml-auto text-gray-400" />
                            </a>
                            <a href="/student-dashboard/messages" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <MessageSquare className="text-blue-600" size={20} />
                                <span className="font-medium">Send Message</span>
                                <ExternalLink size={16} className="ml-auto text-gray-400" />
                            </a>
                            <a href="/student-dashboard/complaints" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <FileText className="text-orange-600" size={20} />
                                <span className="font-medium">View Complaints</span>
                                <ExternalLink size={16} className="ml-auto text-gray-400" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-gray-600 text-sm">Total Tickets</p>
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
                        {["all", "pending", "in_review", "resolved"].map(status => (
                            <button
                                key={status}
                                onClick={() => { setFilter(status); fetchTickets(getToken()); }}
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

                    {/* Tickets List */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No support tickets found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTickets.map((ticket, index) => {
                                const CategoryIcon = getCategoryIcon(ticket.category);
                                return (
                                    <motion.div
                                        key={ticket._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket?.status)}`}>
                                                            {(ticket?.status || "pending").replace("_", " ").toUpperCase()}
                                                        </span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                                            <CategoryIcon size={12} />
                                                            {(ticket?.category || "other").replace("_", " ")}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {ticket?.title || "Untitled Ticket"}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {ticket?.description || "No description provided"}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                                                >
                                                    <Eye size={20} />
                                                </motion.button>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <User size={14} />
                                                    <span>To: {ticket?.recipient?.name || "Unknown"}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(ticket?.createdAt)}</span>
                                                </div>
                                            </div>

                                            {ticket?.adminResponse?.message && (
                                                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <p className="text-sm text-green-700 font-medium">Response:</p>
                                                    <p className="text-sm text-green-600 mt-1">{ticket.adminResponse.message}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            )}

            {/* New Ticket Modal */}
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
                                    <h2 className="text-xl font-bold">Submit Support Ticket</h2>
                                    <button 
                                        onClick={() => setShowForm(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <span className="text-gray-500 text-2xl">&times;</span>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Brief summary of your issue"
                                        maxLength={200}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Person *
                                        </label>
                                        <select
                                            required
                                            value={formData.recipientId}
                                            onChange={handleRecipientChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            disabled={recipientsLoading}
                                        >
                                            <option value="">
                                                {recipientsLoading ? "Loading..." : "Select recipient"}
                                            </option>
                                            
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
                                        </select>
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
                                        placeholder="Provide detailed description of your issue..."
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
                                        disabled={submitting || recipientsLoading}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Submit Ticket
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ticket Detail Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedTicket(null)}
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
                                    <h2 className="text-xl font-bold">Ticket Details</h2>
                                    <button 
                                        onClick={() => setSelectedTicket(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <span className="text-gray-500 text-2xl">&times;</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket?.status)}`}>
                                        {(selectedTicket?.status || "pending").replace("_", " ").toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedTicket?.title || "Untitled"}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Category: {(selectedTicket?.category || "other").replace("_", " ")}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket?.description || "No description provided"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">From:</p>
                                        <p className="font-medium">{selectedTicket?.sender?.name || "Unknown"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">To:</p>
                                        <p className="font-medium">{selectedTicket?.recipient?.name || "Unknown"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Submitted:</p>
                                        <p className="font-medium">{formatDate(selectedTicket?.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Last Updated:</p>
                                        <p className="font-medium">{formatDate(selectedTicket?.updatedAt)}</p>
                                    </div>
                                </div>

                                {selectedTicket?.adminResponse?.message && (
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                        <p className="text-sm font-medium text-green-700 mb-1">Response:</p>
                                        <p className="text-sm text-green-600">{selectedTicket.adminResponse.message}</p>
                                        {selectedTicket.adminResponse.respondedAt && (
                                            <p className="text-xs text-green-500 mt-2">
                                                Responded on {formatDate(selectedTicket.adminResponse.respondedAt)}
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

