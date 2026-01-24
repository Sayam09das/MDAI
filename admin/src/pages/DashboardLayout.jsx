import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    BookOpen,
    GraduationCap,
    UserCircle,
    FolderOpen,
    BarChart3,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// Navbar Component
const Navbar = ({ onMenuClick, currentPage, isDarkMode, setIsDarkMode }) => {
    const [adminProfile, setAdminProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const logoUrl = import.meta.env.VITE_LOGO_URL;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notificationCount] = useState(3);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                if (!token) return;

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/profile`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch admin profile");
                }

                const data = await res.json();
                setAdminProfile(data.admin);
            } catch (err) {
                console.error("PROFILE FETCH ERROR:", err.message);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);


    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                window.location.href = "/login";
                return;
            }

            await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/logout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.error("LOGOUT ERROR:", err.message);
        } finally {
            // ✅ Always clear token (even if API fails)
            localStorage.removeItem("adminToken");

            // ✅ Redirect to login
            window.location.href = "/login";
        }
    };


    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left - Menu Button & Logo */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <a href="/" className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
                                <img
                                    src={logoUrl || "/logo.png"}
                                    alt="MDAI Logo"
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>

                            <div className="hidden sm:block">
                                <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                    MDAI
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Center - Current Page */}
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-semibold text-slate-700">{currentPage}</h1>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center space-x-2">

                        {/* Notifications */}
                        <button className="hidden sm:flex relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            {notificationCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                                    {notificationCount}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="hidden sm:flex p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="hidden sm:block relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-2 pr-3 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {profileLoading
                                        ? "..."
                                        : adminProfile?.name
                                            ?.split(" ")
                                            .map(word => word[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase() || "AD"}
                                </div>

                                <ChevronDown
                                    className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>


                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg"
                                    >
                                        <div className="p-3 border-b border-slate-100">
                                            <div className="font-semibold text-slate-900 text-sm">
                                                {profileLoading
                                                    ? "Loading..."
                                                    : adminProfile?.name || "Admin"}
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                {profileLoading
                                                    ? "Loading..."
                                                    : adminProfile?.email || ""}
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
                                            </button>
                                        </div>
                                        <div className="py-2 border-t border-slate-100">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
            </div>
        </nav>
    );
};

// Sidebar Component
const Sidebar = ({ isOpen, onClose, currentRoute, setCurrentRoute, isCollapsed, setIsCollapsed }) => {
    const logoUrl = import.meta.env.VITE_LOGO_URL;
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
        { id: 'users', label: 'Users', icon: Users, route: '/users' },
        { id: 'courses', label: 'Courses', icon: BookOpen, route: '/courses' },
        { id: 'teachers', label: 'Teachers', icon: GraduationCap, route: '/teachers' },
        { id: 'students', label: 'Students', icon: UserCircle, route: '/students' },
        { id: 'resources', label: 'Resources', icon: FolderOpen, route: '/resources' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, route: '/analytics' },
        { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' }
    ];

    const handleNavClick = (route) => {
        setCurrentRoute(route);
        onClose();
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <a href="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
                        <img
                            src={logoUrl || "/logo.png"}
                            alt="MDAI Logo"
                            className="w-full h-full object-contain"
                            loading="lazy"
                        />
                    </div>

                    {!isCollapsed && (
                        <div>
                            <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                MDAI
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                                Admin Dashboard
                            </div>
                        </div>
                    )}
                </a>

                <button
                    onClick={() => window.innerWidth < 768 ? onClose() : setIsCollapsed(!isCollapsed)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {window.innerWidth < 768 ? (
                        <X className="w-5 h-5" />
                    ) : isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentRoute === item.route;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.route)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all relative ${isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-700 hover:bg-slate-100'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                                {!isCollapsed && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                                {isActive && !isCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="md:hidden fixed inset-0 bg-slate-900/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: window.innerWidth >= 768 ? (isCollapsed ? '80px' : '280px') : '280px',
                    x: window.innerWidth >= 768 ? 0 : (isOpen ? 0 : '-100%')
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-0 top-0 h-full z-50 md:z-40"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
};

// Main Dashboard Layout
const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentRoute, setCurrentRoute] = useState('/dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const pageNames = {
        '/dashboard': 'Dashboard',
        '/users': 'Users',
        '/courses': 'Courses',
        '/teachers': 'Teachers',
        '/students': 'Students',
        '/resources': 'Resources',
        '/analytics': 'Analytics',
        '/settings': 'Settings'
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentRoute={currentRoute}
                setCurrentRoute={setCurrentRoute}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div
                className="transition-all duration-300"
                style={{
                    marginLeft: window.innerWidth >= 768 ? (isCollapsed ? '80px' : '280px') : '0'
                }}
            >
                <Navbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    currentPage={pageNames[currentRoute]}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                Welcome to {pageNames[currentRoute]}
                            </h2>
                            <p className="text-slate-600">
                                This is your {pageNames[currentRoute].toLowerCase()} page content. The sidebar and navbar are fully integrated and responsive across all devices.
                            </p>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-lg border border-indigo-100">
                                        <div className="text-sm font-semibold text-indigo-600 mb-2">Card {item}</div>
                                        <div className="text-2xl font-bold text-slate-800">{Math.floor(Math.random() * 1000)}</div>
                                        <div className="text-xs text-slate-500 mt-1">Sample data</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;