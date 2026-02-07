import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    ChevronDown,
    Menu,
    Settings,
    Search,
    MessageSquare,
    X,
} from "lucide-react";
import { getBackendURL } from "../../../lib/config";

const BACKEND_URL = getBackendURL();

const extractUrl = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val.url) return val.url;
    return "";
};

/**
 * Format relative time from a date
 */
const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString();
};

/**
 * Safely extract image URL from various formats
 */
const extractImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === "string") {
        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }
        return null;
    }
    if (typeof image === "object") {
        if (image.secure_url) return image.secure_url;
        if (image.url) return image.url;
        if (image.path) return image.path;
    }
    return null;
};

const StudentNavbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [time, setTime] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    /* Notifications state - initialize from localStorage or empty */
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("student_notifications");
        return saved ? JSON.parse(saved) : [];
    });

    /* Save notifications to localStorage when they change */
    useEffect(() => {
        localStorage.setItem("student_notifications", JSON.stringify(notifications));
    }, [notifications]);

    /* Socket connection */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Dynamically import socket.io-client to avoid SSR issues
        import("socket.io-client").then(({ io }) => {
            const SOCKET_URL = BACKEND_URL || "http://localhost:3000";
            const newSocket = io(SOCKET_URL, {
                auth: { token },
                transports: ["websocket", "polling"],
            });

            newSocket.on("connect", () => {
                console.log("✅ Navbar Socket connected");
                setIsConnected(true);
            });

            newSocket.on("disconnect", () => {
                console.log("❌ Navbar Socket disconnected");
                setIsConnected(false);
            });

            newSocket.on("new_message_notification", (data) => {
                console.log("🔔 New notification received:", data);

                // Normalize the notification
                const message = data.message || {};
                const sender = message.sender || {};
                const senderName = sender.fullName || "Unknown User";
                const senderImage = extractImageUrl(sender.profileImage);
                const messageContent = message.content || "New message";
                const conversationId = data.conversationId || message.conversationId;

                const newNotification = {
                    id: Date.now().toString(),
                    text: `${senderName}: ${messageContent}`,
                    time: "Just now",
                    unread: true,
                    senderName,
                    senderImage,
                    conversationId,
                    createdAt: new Date().toISOString(),
                };

                // Add to notifications (max 20)
                setNotifications((prev) => {
                    const updated = [newNotification, ...prev].slice(0, 20);
                    return updated;
                });
            });

            // Handle new announcement notifications
            newSocket.on("new_announcement", (data) => {
                console.log("📢 New announcement received:", data);

                const newNotification = {
                    id: Date.now().toString(),
                    text: `📢 ${data.title || "New Announcement"}`,
                    time: "Just now",
                    unread: true,
                    senderName: "Admin",
                    senderImage: null,
                    announcementId: data.announcementId || data.id,
                    type: "announcement",
                    createdAt: new Date().toISOString(),
                };

                // Add to notifications (max 20)
                setNotifications((prev) => {
                    const updated = [newNotification, ...prev].slice(0, 20);
                    return updated;
                });

                // Show browser notification if permission granted
                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                    new Notification("New Announcement", {
                        body: data.title || "You have a new announcement",
                        icon: "https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg"
                    });
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        });
    }, []);

    /* Add new notification function */
    const addNotification = useCallback((notification) => {
        setNotifications((prev) => {
            const updated = [notification, ...prev].slice(0, 20);
            return updated;
        });
    }, []);

    /* Mark notification as read */
    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
        );
    }, []);

    /* Mark all as read */
    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }, []);

    /* Clear all notifications */
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

                setCurrentUser(data.user);
            } catch (error) {
                // Token expired / invalid
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
            }
        };

        fetchCurrentUser();
    }, [navigate]);


    const handleLogout = async () => {
        try {
            await fetch(`${BACKEND_URL}/api/auth/logout`, {
                method: "POST",
            });
        } catch {
            // ignore error
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
        }
    };

    /* ✅ Correct unread count */
    const unreadCount = notifications.filter(n => n.unread).length;

    /* Auto update time */
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    /* Search handlers */
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/student-dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleSearchClick = () => {
        if (searchQuery.trim()) {
            navigate(`/student-dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <>
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b border-gray-200">
                <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-50"
                        >
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden">
                                <img
                                    src="https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <span className="font-semibold text-gray-900">
                                Student Dashboard
                            </span>
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Search */}
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses, students..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchSubmit}
                                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white border border-gray-200 outline-none hover:border-gray-300 focus:border-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Time */}
                        <span className="text-sm text-gray-500">
                            {time.toLocaleDateString()} • {time.toLocaleTimeString()}
                        </span>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-1">

                        {/* PROFILE */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsProfileOpen(prev => !prev);
                                    setShowNotifications(false);
                                }}
                                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
                                    {currentUser?.profileImage?.url ? (
                                        <img
                                            src={currentUser.profileImage.url}
                                            alt="profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-sm font-semibold">
                                            {currentUser?.fullName
                                                ? currentUser.fullName.charAt(0).toUpperCase()
                                                : "U"}
                                        </span>
                                    )}
                                </div>


                                <ChevronDown
                                    className={`w-4 h-4 transition ${isProfileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg">
                                    <button
                                        onClick={() => navigate("/student-dashboard/profile")}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                                    >
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => navigate("/student-dashboard/settings")}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                                    >
                                        Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* NOTIFICATIONS */}
                        <button
                            onClick={() => {
                                setShowNotifications(prev => !prev);
                                setIsProfileOpen(false);
                            }}
                            className="relative p-2 rounded-md hover:bg-gray-50"
                        >
                            <Bell className="w-5 h-5 text-gray-700" />

                            {/* 🔴 Red dot */}
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                            )}
                        </button>

                        {/* MESSAGES */}
                        <button
                            onClick={() => navigate("/teacher/messages")}
                            className="p-2 rounded-md hover:bg-gray-50"
                        >
                            <MessageSquare className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
                <div className="absolute right-6 top-16 w-80 bg-white rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 font-medium flex justify-between items-center sticky top-0 bg-white">
                        <span>Notifications</span>
                        {notifications.length > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 hover:text-indigo-800"
                                >
                                    Mark all read
                                </button>
                                <button
                                    onClick={clearNotifications}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => {
                                    markAsRead(n.id);
                                    if (n.conversationId) {
                                        navigate(`/student-dashboard/messages?conversation=${n.conversationId}`);
                                    }
                                    setShowNotifications(false);
                                }}
                                className={`px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${n.unread ? 'bg-indigo-50/50' : ''}`}
                            >
                                <div className="flex gap-3 items-start">
                                    {/* Sender Avatar */}
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                        {n.senderImage ? (
                                            <img
                                                src={n.senderImage}
                                                alt={n.senderName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-semibold text-gray-600">
                                                {n.senderName?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className={`truncate ${n.unread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                {n.text}
                                            </span>
                                            {n.unread && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* OVERLAY */}
            {(isProfileOpen || showNotifications) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsProfileOpen(false);
                        setShowNotifications(false);
                    }}
                />
            )}
        </>
    );
};

export default StudentNavbar;
