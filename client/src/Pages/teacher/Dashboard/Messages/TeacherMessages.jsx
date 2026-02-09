import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Search,
    User,
    Users,
    ArrowLeft,
    MoreVertical,
    Phone,
    Video,
    Image as ImageIcon,
    Paperclip,
    Smile,
    Check,
    CheckCheck,
    Clock,
    X,
    MessageSquare,
    Bell,
    Settings,
    ChevronDown,
    BookOpen,
    GraduationCap,
    Globe
} from "lucide-react";
import { getBackendURL } from "../../../../lib/config";
import { useSocket } from "../../../../context/SocketContext";

const BACKEND_URL = getBackendURL();

// Format time
const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
};

const formatMessageTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
};

export default function TeacherMessages() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [newMessageType, setNewMessageType] = useState("individual"); // individual, course, broadcast

    // Form state
    const [messageContent, setMessageContent] = useState("");
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const messagesEndRef = useRef(null);
    const token = localStorage.getItem("token");
    const userRole = "teacher";
    const userId = localStorage.getItem("teacherId") || localStorage.getItem("userId");
    
    // Get SocketContext functions
    const { setConversationsData } = useSocket();

    useEffect(() => {
        fetchConversations();
        fetchRecipients();
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation._id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/messages/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setConversations(data.conversations || []);
                // Sync with SocketContext for real-time updates
                if (setConversationsData) {
                    setConversationsData(data.conversations || []);
                }
            } else {
                setError(data.message || "Failed to fetch conversations");
            }
        } catch (err) {
            console.error("Fetch conversations error:", err);
            setError("Failed to load conversations");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipients = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/messages/recipients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setRecipients(data.recipients || []);
            }
        } catch (err) {
            console.error("Fetch recipients error:", err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/messages/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setCourses(data.courses || []);
            }
        } catch (err) {
            console.error("Fetch courses error:", err);
        }
    };

    const fetchMessages = async (conversationId) => {
        setMessagesLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/messages/conversations/${conversationId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setMessages(data.messages || []);
            }
        } catch (err) {
            console.error("Fetch messages error:", err);
            setError("Failed to load messages");
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim()) return;

        setSending(true);
        setError("");
        setSuccess("");

        try {
            let payload = {
                content: messageContent,
                messageType: newMessageType
            };

            // For individual messages, get recipient from selectedConversation or selectedRecipient
            if (newMessageType === "individual") {
                let recipient = null;

                // If replying to an existing conversation, get recipient from conversation
                if (selectedConversation && !showNewMessage) {
                    recipient = selectedConversation.participants?.find(
                        p => p.userId !== userId
                    );
                    // Convert participantsModel to recipientRole
                    if (recipient) {
                        const modelToRole = {
                            "User": "student",
                            "Teacher": "teacher",
                            "Admin": "admin"
                        };
                        recipient = {
                            userId: recipient.userId?.toString ? recipient.userId.toString() : recipient.userId,
                            role: modelToRole[recipient.participantsModel] || recipient.role?.toLowerCase(),
                            participantsModel: recipient.participantsModel,
                            name: recipient.name,
                            email: recipient.email
                        };
                    }
                } else {
                    // For new message, use selectedRecipient
                    recipient = selectedRecipient;
                }

                if (!recipient || !recipient.userId) {
                    setError("Please select a recipient");
                    setSending(false);
                    return;
                }
                payload.recipientId = recipient.userId;
                payload.recipientRole = recipient.role;
            } else if (newMessageType === "course") {
                if (!selectedCourse) {
                    setError("Please select a course");
                    setSending(false);
                    return;
                }
                payload.courseId = selectedCourse._id;
            }

            const res = await fetch(`${BACKEND_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                setMessageContent("");
                setShowNewMessage(false);
                setSelectedRecipient(null);
                setSelectedCourse(null);
                setNewMessageType("individual");
                fetchConversations();

                if (selectedConversation) {
                    fetchMessages(selectedConversation._id);
                } else if (data.conversationId) {
                    fetchConversations().then(() => {
                        fetchMessages(data.conversationId);
                    });
                }
                
                if (data.recipientCount) {
                    setSuccess(`Message sent to ${data.recipientCount} recipient(s)`);
                }
            } else {
                setError(data.message || "Failed to send message");
            }
        } catch (err) {
            console.error("Send message error:", err);
            setError("Network error. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        
        if (conv.groupName?.toLowerCase().includes(search)) return true;
        
        return conv.participants?.some(p => 
            p.name?.toLowerCase().includes(search) ||
            p.email?.toLowerCase().includes(search)
        );
    });

    const selectedParticipant = selectedConversation?.participants?.find(
        p => p.userId !== userId
    );

    return (
        <div className="h-[calc(100vh-80px)] flex bg-gray-100">
            {/* Left Sidebar - Conversations List */}
            <div className={`w-full md:w-80 lg:w-96 bg-white border-r flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <GraduationCap className="text-indigo-600" />
                            Messages
                        </h1>
                        <button
                            onClick={() => setShowNewMessage(true)}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <MessageSquare size={48} className="mb-4 text-gray-300" />
                            <p>No conversations yet</p>
                            <button
                                onClick={() => setShowNewMessage(true)}
                                className="mt-4 text-indigo-600 hover:underline"
                            >
                                Start a new message
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredConversations.map((conv) => (
                                <motion.div
                                    key={conv._id}
                                    whileHover={{ backgroundColor: "#f3f4f6" }}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`p-4 cursor-pointer transition-colors ${
                                        selectedConversation?._id === conv._id ? "bg-indigo-50" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="relative">
                                            {conv.isGroup || conv.isCourseBroadcast || conv.isGlobalBroadcast ? (
                                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    {conv.isGlobalBroadcast ? (
                                                        <Globe className="text-indigo-600" size={20} />
                                                    ) : conv.isCourseBroadcast ? (
                                                        <BookOpen className="text-indigo-600" size={20} />
                                                    ) : (
                                                        <Users className="text-indigo-600" size={20} />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {conv.participants?.find(p => p.userId !== userId)?.name?.charAt(0) || "?"}
                                                </div>
                                            )}
                                            {conv.unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {conv.groupName || conv.participants?.find(p => p.userId !== userId)?.name || "Unknown"}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(conv.lastMessageAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {conv.lastMessage?.content || "No messages yet"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {conv.isCourseBroadcast && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600">
                                                        <BookOpen size={12} />
                                                        Course
                                                    </span>
                                                )}
                                                {conv.isGlobalBroadcast && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                                                        <Globe size={12} />
                                                        Broadcast
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedConversation(null)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                    {selectedParticipant?.name?.charAt(0) || selectedConversation.groupName?.charAt(0) || "?"}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {selectedConversation.groupName || selectedParticipant?.name || "Unknown"}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedParticipant?.role || selectedConversation.conversationType}
                                        {selectedConversation.isCourseBroadcast && " • Course Broadcast"}
                                        {selectedConversation.isGlobalBroadcast && " • Global Broadcast"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Phone size={20} className="text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Video size={20} className="text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messagesLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <MessageSquare size={48} className="mb-4 text-gray-300" />
                                    <p>No messages yet</p>
                                    <p className="text-sm">Send the first message!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isOwnMessage = msg.sender === userId || 
                                        (msg.sender._id && msg.sender._id === userId);
                                    const showDate = index === 0 || 
                                        new Date(messages[index - 1].createdAt).toDateString() !== 
                                        new Date(msg.createdAt).toDateString();

                                    return (
                                        <div key={msg._id}>
                                            {showDate && (
                                                <div className="flex items-center justify-center my-4">
                                                    <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                                                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                                            weekday: "long",
                                                            month: "short",
                                                            day: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : ""}`}>
                                                    {!isOwnMessage && (
                                                        <p className="text-xs text-gray-500 mb-1 ml-1">
                                                            {msg.sender?.fullName || msg.sender?.name || "Unknown"}
                                                        </p>
                                                    )}
                                                    <div className={`px-4 py-2 rounded-2xl ${
                                                        isOwnMessage
                                                            ? "bg-indigo-600 text-white rounded-br-md"
                                                            : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                                                    }`}>
                                                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                                    </div>
                                                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                                        <span>{formatMessageTime(msg.createdAt)}</span>
                                                        {isOwnMessage && (
                                                            msg.readBy?.length > 1 || msg.readBy?.some(r => r.userId !== userId) ? (
                                                                <CheckCheck size={14} className="text-indigo-600" />
                                                            ) : (
                                                                <Check size={14} />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Paperclip size={20} className="text-gray-600" />
                                </button>
                                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                                    <ImageIcon size={20} className="text-gray-600" />
                                </button>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        placeholder="Type a message..."
                                        className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    />
                                </div>
                                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Smile size={20} className="text-gray-600" />
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={sending || !messageContent.trim()}
                                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </>
                ) : (
                    /* No Conversation Selected */
                    <div className="flex-1 hidden md:flex flex-col items-center justify-center text-gray-500">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <GraduationCap size={48} className="text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Messages</h2>
                        <p className="text-center max-w-md">
                            Select a conversation from the sidebar or start a new message. 
                            Teachers can send individual messages or broadcast to entire courses.
                        </p>
                        <button
                            onClick={() => setShowNewMessage(true)}
                            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            New Message
                        </button>
                    </div>
                )}
            </div>

            {/* New Message Modal */}
            <AnimatePresence>
                {showNewMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowNewMessage(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">New Message</h2>
                                    <button
                                        onClick={() => setShowNewMessage(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X size={20} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Message Type Toggle */}
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setNewMessageType("individual")}
                                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                                            newMessageType === "individual"
                                                ? "bg-white text-indigo-600 shadow"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <User size={16} className="inline mr-2" />
                                        Individual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewMessageType("course")}
                                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                                            newMessageType === "course"
                                                ? "bg-white text-indigo-600 shadow"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <BookOpen size={16} className="inline mr-2" />
                                        Course
                                    </button>
                                </div>

                                {/* Individual Recipient Selection */}
                                {newMessageType === "individual" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Student
                                        </label>
                                        <select
                                            value={selectedRecipient?.userId || ""}
                                            onChange={(e) => {
                                                const recipient = recipients.find(r => r.userId === e.target.value);
                                                setSelectedRecipient(recipient);
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Choose a student...</option>
                                            {recipients.map((r) => (
                                                <option key={r.userId} value={r.userId}>
                                                    {r.name} ({r.role})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Students can message you back individually
                                        </p>
                                    </div>
                                )}

                                {/* Course Selection */}
                                {newMessageType === "course" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Course for Broadcast
                                        </label>
                                        <select
                                            value={selectedCourse?._id || ""}
                                            onChange={(e) => {
                                                const course = courses.find(c => c._id === e.target.value);
                                                setSelectedCourse(course);
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Choose a course...</option>
                                            {courses.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.title} ({c.studentCount} students)
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-indigo-600 mt-1">
                                            ⚠️ Message will be sent to ALL enrolled students
                                        </p>
                                    </div>
                                )}

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        placeholder="Write your message..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                                    />
                                </div>

                                {/* Send Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSendMessage}
                                    disabled={sending || !messageContent.trim() || 
                                        (newMessageType === "individual" && !selectedRecipient) ||
                                        (newMessageType === "course" && !selectedCourse)}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            {newMessageType === "course" ? "Broadcast to Course" : "Send Message"}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error/Success Messages */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg z-50"
                >
                    {error}
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg z-50"
                >
                    {success}
                </motion.div>
            )}
        </div>
    );
}

