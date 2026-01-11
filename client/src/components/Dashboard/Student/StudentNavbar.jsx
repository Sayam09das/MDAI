import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    ChevronDown,
    Menu,
    Settings,
    Search,
    MessageSquare,
} from "lucide-react";

const StudentNavbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [time, setTime] = useState(new Date());

    /* Notifications state */
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            text: "Live class starts in 15 minutes",
            time: "15m",
            unread: true,
        },
        {
            id: 2,
            text: "New student enrolled",
            time: "1h",
            unread: true,
        },
        {
            id: 3,
            text: "You received a 5-star review",
            time: "2h",
            unread: false,
        },
    ]);




    /* ✅ Correct unread count */
    const unreadCount = notifications.filter(n => n.unread).length;

    /* Auto update time */
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white border border-gray-200 outline-none hover:border-gray-300 focus:border-gray-400"
                            />
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
                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        {currentUser?.fullName
                                            ? currentUser.fullName.charAt(0).toUpperCase()
                                            : "S"}
                                    </span>
                                </div>

                                <ChevronDown
                                    className={`w-4 h-4 transition ${isProfileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg">
                                    <button
                                        onClick={() => navigate("/teacher/profile")}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                                    >
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => navigate("/teacher/settings")}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                                    >
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => navigate("/login")}
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
                <div className="absolute right-6 top-16 w-80 bg-white rounded-xl shadow-lg z-50">
                    <div className="px-4 py-3 font-medium">Notifications</div>

                    {notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() =>
                                setNotifications(prev =>
                                    prev.map(item =>
                                        item.id === n.id
                                            ? { ...item, unread: false }
                                            : item
                                    )
                                )
                            }
                            className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="flex justify-between">
                                <span className={n.unread ? "font-medium" : "text-gray-600"}>
                                    {n.text}
                                </span>
                                {!n.unread && (
                                    <span className="w-2 h-2 rounded-full bg-green-400 mt-1" />
                                )}
                            </div>
                            <div className="text-xs text-gray-400">{n.time}</div>
                        </div>
                    ))}
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
