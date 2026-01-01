import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Plus,
    FileText,
    Video,
    Users,
    X,
    ChevronRight,
    TrendingUp,
    Award,
} from "lucide-react";

/* ================= MENU CONFIG ================= */
const menuItems = [
    {
        id: "dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        badge: null,
        description: "Overview & analytics",
        path: "/teacher-dashboard",
        exact: true,
    },
    {
        id: "my-courses",
        icon: BookOpen,
        label: "My Courses",
        badge: "12",
        description: "Manage your courses",
        path: "/teacher-dashboard/mycourse",
    },
    {
        id: "create-course",
        icon: Plus,
        label: "Create Course",
        badge: null,
        description: "Add new course",
        path: "/teacher-dashboard/create-course",
    },
    {
        id: "lessons",
        icon: FileText,
        label: "Lessons",
        badge: "45",
        description: "Course content",
        path: "/teacher-dashboard/lessons",
    },
    {
        id: "live-sessions",
        icon: Video,
        label: "Live Sessions",
        badge: "3",
        description: "Scheduled classes",
        path: "/teacher-dashboard/live-sessions",
    },
    {
        id: "students",
        icon: Users,
        label: "Students",
        badge: "1.2K",
        description: "Manage students",
        path: "/teacher-dashboard/students",
    },
];

/* ================= SIDEBAR ================= */
const TeacherSidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* SIDEBAR */}
            <aside
                className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-50
        transition-all duration-300 overflow-hidden shadow-lg
        ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-64 lg:translate-x-0"}`}
            >
                {/* HEADER */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold">T</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">Teacher Panel</h2>
                            <p className="text-xs text-gray-500">Course Management</p>
                        </div>
                    </div>

                    {/* CLOSE (MOBILE) */}
                    <button
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* MENU */}
                <nav className="h-[calc(100%-4rem)] overflow-y-auto py-6 px-3 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                end={item.exact}
                                onClick={onClose} // auto close on mobile
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className={`w-5 h-5 transition-transform ${isActive ? "text-white rotate-6" : "text-gray-600 group-hover:scale-110"
                                                }`}
                                        />

                                        <div className="flex-1 text-left">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold">
                                                    {item.label}
                                                </span>

                                                {item.badge && (
                                                    <span
                                                        className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive
                                                                ? "bg-white/20 text-white"
                                                                : "bg-purple-100 text-purple-600"
                                                            }`}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>

                                            <p
                                                className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"
                                                    }`}
                                            >
                                                {item.description}
                                            </p>
                                        </div>

                                        {isActive && (
                                            <ChevronRight className="w-4 h-4 animate-pulse" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}

                    {/* QUICK STATS */}
                    <div className="mt-8 px-2">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border">
                            <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase">
                                This Week
                            </h3>

                            <div className="space-y-3">
                                <Stat icon={Video} label="Live Classes" value="8" />
                                <Stat icon={Users} label="New Students" value="42" />
                                <Stat icon={TrendingUp} label="Engagement" value="+15%" />
                            </div>
                        </div>
                    </div>

                    {/* ACHIEVEMENT */}
                    <div className="mt-6 px-2">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border">
                            <div className="flex items-center gap-3">
                                <Award className="w-6 h-6 text-amber-600" />
                                <span className="text-sm font-bold">Top Instructor</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                Keep up the great work 🎉
                            </p>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

/* ================= STAT ITEM ================= */
const Stat = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
);

export default TeacherSidebar;
