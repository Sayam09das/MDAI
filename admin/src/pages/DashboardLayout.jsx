import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Moon,
    Sun,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    Users,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    GraduationCap,
    UserCircle,
    BarChart3,
    Search,
    Activity,
    Zap,
    Home,
    Megaphone,
    Server,
    Shield,
    TrendingUp,
    CreditCard,
    DollarSign
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


/* ===================== NAVBAR ===================== */
const Navbar = ({ onMenuClick, currentPage }) => {
    const logoUrl = import.meta.env.VITE_LOGO_URL;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationCount] = useState(3);
    const [searchOpen, setSearchOpen] = useState(false);
    const [adminProfile, setAdminProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) return;

                const res = await fetch(
                    `${BACKEND_URL}/api/admin/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                setAdminProfile(data.admin);
            } catch (err) {
                console.error("ADMIN PROFILE ERROR:", err);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);


    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            if (token) {
                await fetch(
                    "https://mdai-0jhi.onrender.com/api/admin/logout",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
        } catch (err) {
            console.error("LOGOUT ERROR:", err);
        } finally {
            localStorage.removeItem("adminToken");
            navigate("/");
        }
    };

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm backdrop-blur-sm bg-white/95">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">

                {/* Left Section */}
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onMenuClick}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5" />
                    </motion.button>

                    {/* Logo - Hidden on mobile when page title shows */}
                    <div className="hidden sm:flex items-center gap-2">
                        <a
                            href="/"
                            className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-md"
                        >
                            <img
                                src={logoUrl || "/logo.png"}
                                alt="MDAI Logo"
                                className="w-full h-full object-contain"
                                loading="lazy"
                            />
                        </a>

                        <div className="hidden lg:block">
                            <div className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                MDAI
                            </div>
                        </div>
                    </div>

                    {/* Page Title */}
                    <h1 className="text-base sm:text-lg font-semibold text-slate-800">
                        {currentPage}
                    </h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">

                    {/* Search Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="hidden sm:flex p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors relative"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </motion.button>

                    {/* Notifications */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:flex relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {notificationCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-semibold"
                            >
                                {notificationCount}
                            </motion.span>
                        )}
                    </motion.button>

                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="hidden sm:flex p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Toggle theme"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: isDarkMode ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </motion.div>
                    </motion.button>

                    {/* Profile Dropdown */}
                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="User menu"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md">
                                {profileLoading
                                    ? "..."
                                    : adminProfile?.name
                                        ?.split(" ")
                                        .map(w => w[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase() || "AD"}
                            </div>

                            <motion.div
                                animate={{ rotate: isProfileOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-4 h-4 text-slate-600" />
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="p-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100">
                                        <div className="font-semibold text-slate-900 text-sm">
                                            {profileLoading ? "Loading..." : adminProfile?.name || "Admin"}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {profileLoading ? "" : adminProfile?.email || ""}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                navigate("/admin/profile");
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/admin/settings");
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                    </div>

                                    {/* Logout */}
                                    <div className="py-2 border-t border-slate-100">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-200 bg-slate-50 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

/* ===================== SIDEBAR ===================== */
const Sidebar = ({ isOpen, onClose, isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (route) => {
        navigate(route);
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay (mobile) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: window.innerWidth >= 768 ? (isCollapsed ? 80 : 280) : 280,
                    x: window.innerWidth >= 768 ? 0 : isOpen ? 0 : "-100%",
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                    <motion.div
                        animate={{ opacity: isCollapsed ? 0 : 1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">MDAI</h1>
                                <p className="text-xs text-slate-500">Admin Panel</p>
                            </div>
                        )}
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                            window.innerWidth < 768
                                ? onClose()
                                : setIsCollapsed(!isCollapsed)
                        }
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                        {window.innerWidth < 768 ? (
                            <X className="w-5 h-5" />
                        ) : isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </motion.button>
                </div>

                {/* Quick Actions */}
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-4"
                    >
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium text-sm">
                            <Zap className="w-4 h-4" />
                            <span>Quick Actions</span>
                        </button>
                    </motion.div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Dashboard" : ""}
                    >
                        <LayoutDashboard className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Dashboard</span>}
                        {location.pathname === "/admin/dashboard" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Dashboard
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/activity")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/activity"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Activity Overview" : ""}
                    >
                        <Activity className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/activity" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Activity Overview</span>}
                        {location.pathname === "/admin/dashboard/activity" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Activity Overview
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/user")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/user"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Users" : ""}
                    >
                        <Users className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/user" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Users</span>}
                        {location.pathname === "/admin/dashboard/user" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Users
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/students")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/students"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Students" : ""}
                    >
                        <UserCircle className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/students" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Students</span>}
                        {location.pathname === "/admin/dashboard/students" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Students
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/teachers")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/teachers"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Teachers" : ""}
                    >
                        <GraduationCap className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/teachers" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Teachers</span>}
                        {location.pathname === "/admin/dashboard/teachers" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Teachers
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/courses")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/courses"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Courses" : ""}
                    >
                        <BookOpen className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/courses" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Courses</span>}
                        {location.pathname === "/admin/dashboard/courses" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Courses
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/courses/analytics")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/courses/analytics"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Course Analytics" : ""}
                    >
                        <BarChart3 className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/courses/analytics" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Course Analytics</span>}
                        {location.pathname === "/admin/dashboard/courses/analytics" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Course Analytics
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/announcements")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/announcements"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Announcements" : ""}
                    >
                        <Megaphone className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/announcements" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Announcements</span>}
                        {location.pathname === "/admin/dashboard/announcements" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Announcements
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/reports")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/reports"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Reports" : ""}
                    >
                        <TrendingUp className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/reports" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Reports</span>}
                        {location.pathname === "/admin/dashboard/reports" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Reports
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/students/paymentaccess")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/students/paymentaccess"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Payment Access" : ""}
                    >
                        <CreditCard className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/students/paymentaccess" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Payment Access</span>}
                        {location.pathname === "/admin/dashboard/students/paymentaccess" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Payment Access
                            </div>
                        )}
                    </motion.button>

                    {/* Finance Section with Sub-items */}
                    {!isCollapsed && (
                        <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Finance</p>
                        </div>
                    )}
                    
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/finance")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/finance"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Finance Overview" : ""}
                    >
                        <DollarSign className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/finance" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Finance Overview</span>}
                        {location.pathname === "/admin/dashboard/finance" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Finance Overview
                            </div>
                        )}
                    </motion.button>

                    {/* Finance Sub-items */}
                    {!isCollapsed && (
                        <div className="ml-4 space-y-1 border-l-2 border-slate-100 pl-4">
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.55 }}
                                whileHover={{ x: 2 }}
                                onClick={() => handleNavClick("/admin/dashboard/finance/transactions")}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm
                                    ${location.pathname === "/admin/dashboard/finance/transactions"
                                        ? "bg-indigo-50 text-indigo-600 font-medium"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }
                                `}
                            >
                                <CreditCard size={16} className={location.pathname === "/admin/dashboard/finance/transactions" ? 'text-indigo-600' : 'text-slate-400'} />
                                <span>Transactions</span>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ x: 2 }}
                                onClick={() => handleNavClick("/admin/dashboard/finance/payments")}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm
                                    ${location.pathname === "/admin/dashboard/finance/payments"
                                        ? "bg-indigo-50 text-indigo-600 font-medium"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }
                                `}
                            >
                                <DollarSign size={16} className={location.pathname === "/admin/dashboard/finance/payments" ? 'text-indigo-600' : 'text-slate-400'} />
                                <span>Teacher Payments</span>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.65 }}
                                whileHover={{ x: 2 }}
                                onClick={() => handleNavClick("/admin/dashboard/finance/reports")}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm
                                    ${location.pathname === "/admin/dashboard/finance/reports"
                                        ? "bg-indigo-50 text-indigo-600 font-medium"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }
                                `}
                            >
                                <TrendingUp size={16} className={location.pathname === "/admin/dashboard/finance/reports" ? 'text-indigo-600' : 'text-slate-400'} />
                                <span>Revenue Reports</span>
                            </motion.button>
                        </div>
                    )}

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/audit-logs")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/audit-logs"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Audit Logs" : ""}
                    >
                        <Shield className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/audit-logs" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Audit Logs</span>}
                        {location.pathname === "/admin/dashboard/audit-logs" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Audit Logs
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/system")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/system"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "System Health" : ""}
                    >
                        <Server className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/system" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">System Health</span>}
                        {location.pathname === "/admin/dashboard/system" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                System Health
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.65 }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavClick("/admin/dashboard/settings")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group
                            ${location.pathname === "/admin/dashboard/settings"
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? "Settings" : ""}
                    >
                        <Settings className={`w-5 h-5 flex-shrink-0 ${location.pathname === "/admin/dashboard/settings" ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
                        {location.pathname === "/admin/dashboard/settings" && !isCollapsed && (
                            <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Settings
                            </div>
                        )}
                    </motion.button>
                </nav>
            </motion.aside>
        </>
    );
};

/* ===================== DASHBOARD LAYOUT ===================== */
const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const pageNames = {
        "/admin/dashboard": "Dashboard",
        "/admin/dashboard/activity": "Activity Overview",
        "/admin/dashboard/user": "Users",
        "/admin/dashboard/students": "Students",
        "/admin/dashboard/teachers": "Teachers",
        "/admin/dashboard/courses": "Courses",
        "/admin/dashboard/courses/analytics": "Course Analytics",
        "/admin/dashboard/announcements": "Announcements",
        "/admin/dashboard/reports": "Reports",
        "/admin/dashboard/students/paymentaccess": "Payment Access",
        "/admin/dashboard/finance": "Finance Overview",
        "/admin/dashboard/finance/transactions": "Manage Transactions",
        "/admin/dashboard/finance/payments": "Teacher Payments",
        "/admin/dashboard/finance/reports": "Revenue Reports",
        "/admin/dashboard/audit-logs": "Audit Logs",
        "/admin/dashboard/system": "System Health",
        "/admin/profile": "Profile",
        "/admin/settings": "Settings",
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <motion.main
                initial={false}
                animate={{
                    marginLeft: window.innerWidth >= 768 ? (isCollapsed ? 80 : 280) : 0,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-screen transition-all"
            >
                <Navbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    currentPage={pageNames[location.pathname] || "Dashboard"}
                />

                {/* ROUTE CONTENT with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-4 sm:p-6"
                >
                    <Outlet />
                </motion.div>
            </motion.main>
        </div>
    );
};

export default DashboardLayout;