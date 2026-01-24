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
} from "lucide-react";

/* ===================== NAVBAR ===================== */
const Navbar = ({ onMenuClick, currentPage }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between h-16 px-6">

                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                    >
                        <Menu />
                    </button>
                    <h1 className="text-lg font-semibold">{currentPage}</h1>
                </div>

                {/* Right */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100"
                    >
                        <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                            AD
                        </div>
                        <ChevronDown />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow"
                            >
                                <button className="w-full px-4 py-2 text-left hover:bg-slate-50">
                                    Profile
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-slate-50 text-red-600">
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

/* ===================== SIDEBAR ===================== */
const Sidebar = ({ isOpen, onClose, isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            route: "/admin/dashboard",
        },
        {
            id: "users",
            label: "Users",
            icon: Users,
            route: "/admin/dashboard/user",
        },
    ];

    return (
        <>
            {/* Overlay (mobile) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40 md:hidden"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: window.innerWidth >= 768 ? (isCollapsed ? 80 : 260) : 260,
                    x: window.innerWidth >= 768 ? 0 : isOpen ? 0 : "-100%",
                }}
                className="fixed left-0 top-0 h-full bg-white border-r z-50"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {!isCollapsed && <h2 className="font-bold">Admin</h2>}
                    <button
                        onClick={() =>
                            window.innerWidth < 768
                                ? onClose()
                                : setIsCollapsed(!isCollapsed)
                        }
                    >
                        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="p-2 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.route;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    navigate(item.route);
                                    onClose();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg
                  ${isActive ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100"}
                  ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Icon size={18} />
                                {!isCollapsed && item.label}
                            </button>
                        );
                    })}
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
        "/admin/dashboard/user": "Users",
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <main
                className="min-h-screen transition-all"
                style={{
                    marginLeft:
                        window.innerWidth >= 768 ? (isCollapsed ? 80 : 260) : 0,
                }}
            >
                <Navbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    currentPage={pageNames[location.pathname]}
                />

                {/* ROUTE CONTENT */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
