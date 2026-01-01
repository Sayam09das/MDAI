import React, { useState } from "react";
import {
    GraduationCap,
    Bell,
    User,
    ChevronDown,
    DollarSign,
    Menu,
    LogOut,
    Video,
    Users,
    Award,
    Settings,
} from "lucide-react";

const TeacherNavbar = ({ onMenuClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, type: "live", message: "Live class starting in 15 minutes", time: "15m", unread: true },
        { id: 2, type: "student", message: "New student enrolled in your course", time: "1h", unread: true },
        { id: 3, type: "review", message: "You received a 5-star review", time: "2h", unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const profileMenuItems = [
        { id: "profile", icon: User, label: "My Profile", color: "text-blue-600" },
        { id: "earnings", icon: DollarSign, label: "Earnings", color: "text-green-600" },
        { id: "settings", icon: Settings, label: "Settings", color: "text-gray-600" },
        { id: "logout", icon: LogOut, label: "Logout", color: "text-red-600" },
    ];

    return (
        <>
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 shadow-sm">
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Menu */}
                        <button
                            onClick={onMenuClick}
                            aria-label="Open sidebar"
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Teacher Dashboard</h1>
                                <p className="text-xs text-gray-500 hidden sm:block">
                                    Manage your courses & students
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(prev => !prev)}
                                aria-label="Notifications"
                                className="relative p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Bell className="w-5 h-5 text-gray-700" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 animate-scaleIn">
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                                            <span className="text-xs text-indigo-600 font-semibold">{unreadCount} unread</span>
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${notification.unread ? 'bg-indigo-50/50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${notification.type === 'live' ? 'bg-red-100' :
                                                            notification.type === 'student' ? 'bg-blue-100' : 'bg-green-100'
                                                        }`}>
                                                        {notification.type === 'live' ? (
                                                            <Video className="w-4 h-4 text-red-600" />
                                                        ) : notification.type === 'student' ? (
                                                            <Users className="w-4 h-4 text-blue-600" />
                                                        ) : (
                                                            <Award className="w-4 h-4 text-green-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-900">{notification.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                    </div>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 text-center border-t border-gray-100">
                                        <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer">
                                            View All Notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(prev => !prev)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">T</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-scaleIn">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">Teacher Name</p>
                                        <p className="text-xs text-gray-500">teacher@eduplatform.com</p>
                                    </div>
                                    {profileMenuItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                                            >
                                                <Icon className={`w-4 h-4 ${item.color}`} />
                                                <span className="text-sm text-gray-700">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </nav>

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
