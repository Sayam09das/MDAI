import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useSocket } from "../../../context/SocketContext";
import { getBackendURL } from "../../../lib/config";

const BACKEND_URL = getBackendURL();

// Accepts either a string URL or an object returned from Cloudinary
const getProfileImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object") {
        if (img.url) return img.url;
        if (img.secure_url) return img.secure_url;
    }
    return null;
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

const TeacherNavbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { totalUnread, isConnected: socketConnected, onlineUsers } = useSocket();
    const [currentUser, setCurrentUser] = useState(null);
    const profileRef = useRef(null);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [time, setTime] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    /* Notifications state - initialize from localStorage or empty */
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("teacher_notifications");
        return saved ? JSON.parse(saved) : [];
    });

    /* Save notifications to localStorage when they change */
    useEffect(() => {
        localStorage.setItem("teacher_notifications", JSON.stringify(notifications));
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

    // Close profile dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            navigate(`/teacher-dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleSearchClick = () => {
        if (searchQuery.trim()) {
            navigate(`/teacher-dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <>
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b border-slate-200 shadow-sm backdrop-blur-sm bg-white/95">
                <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-md">
                                <img
                                    src="https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="hidden lg:block">
                                <div className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                    MDAI
                                </div>
                            </div>

                            <span className="font-semibold text-slate-900 hidden sm:block">
                                Teacher Dashboard
                            </span>
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Search */}
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search courses, students..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchSubmit}
                                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white border border-slate-200 outline-none hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Time */}
                        <span className="text-sm text-slate-500">
                            {time.toLocaleDateString()} • {time.toLocaleTimeString()}
                        </span>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2">

                        {/* PROFILE */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsProfileOpen(prev => !prev);
                                    setShowNotifications(false);
                                }}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md">
                                    {currentUser?.fullName
                                        ? currentUser.fullName.charAt(0).toUpperCase()
                                        : "T"}
                                </div>

                                <ChevronDown
                                    className={`w-4 h-4 transition ${isProfileOpen ? "rotate-180" : ""} text-slate-600`}
                                />
                            </button>


                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100">
                                        <div className="font-semibold text-slate-900 text-sm">
                                            {currentUser?.fullName || "Teacher"}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {currentUser?.email || ""}
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <button
                                            onClick={() => navigate("/teacher-dashboard/profile")}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="text-slate-500">My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => navigate("/teacher-dashboard/settings")}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="text-slate-500">Settings</span>
                                        </button>
                                    </div>

                                    <div className="py-2 border-t border-slate-100">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NOTIFICATIONS */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(prev => !prev);
                                    setIsProfileOpen(false);
                                }}
                                className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                                aria-label="Notifications"
                            >
                                <Bell className="w-5 h-5" />

                                {/* 🔴 Green WhatsApp-style Unread Badge */}
                                {totalUnread > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#25D366] text-white text-xs font-bold rounded-full px-1">
                                        {totalUnread > 99 ? "99+" : totalUnread}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* MESSAGES */}
                        <div className="relative">
                            <button
                                onClick={() => navigate("/teacher-dashboard/messages")}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                                aria-label="Messages"
                            >
                                <MessageSquare className="w-5 h-5" />

                                {/* 🔵 Blue Message Badge */}
                                {totalUnread > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#34B7F1] text-white text-xs font-bold rounded-full px-1">
                                        {totalUnread > 99 ? "99+" : totalUnread}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
                <div className="absolute right-6 top-16 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 font-medium flex justify-between items-center sticky top-0 bg-slate-50 border-b border-slate-100">
                        <span>Notifications</span>
                        {notifications.length > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
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
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => {
                                    markAsRead(n.id);
                                    if (n.conversationId) {
                                        navigate(`/teacher-dashboard/messages?conversation=${n.conversationId}`);
                                    }
                                    setShowNotifications(false);
                                }}
                                className={`px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${n.unread ? 'bg-indigo-50/50' : ''}`}
                            >
                                <div className="flex gap-3 items-start">
                                    {/* Sender Avatar */}
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                        {n.senderImage ? (
                                            <img
                                                src={n.senderImage}
                                                alt={n.senderName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-600">
                                                {n.senderName?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className={`truncate ${n.unread ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                                {n.text}
                                            </span>
                                            {n.unread && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{n.time}</div>
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

export default TeacherNavbar;
