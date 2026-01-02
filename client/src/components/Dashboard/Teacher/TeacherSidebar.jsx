import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Plus,
    FileText,
    Video,
    Users,
    Calendar,
    ClipboardCheck,
    Library,
    MessageSquare,
    Wallet,
    CreditCard,
    User,
    Settings,
    LogOut,
    X,
} from "lucide-react";

/* ================= MENU ================= */
const mainMenu = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/teacher-dashboard" },
    { icon: BookOpen, label: "My Courses", path: "/teacher-dashboard/mycourse" },
    { icon: Plus, label: "Create Course", path: "/teacher-dashboard/create-course" },
    { icon: FileText, label: "Lessons", path: "/teacher-dashboard/lessons" },
    { icon: Video, label: "Live Sessions", path: "/teacher-dashboard/live-sessions" },
    { icon: Users, label: "Students", path: "/teacher-dashboard/students" },
];

const extraMenu = [
    { icon: ClipboardCheck, label: "Attendance", path: "/teacher-dashboard/attendance" },
    { icon: Calendar, label: "Calendar", path: "/teacher-dashboard/calendar" },
    { icon: Library, label: "Library", path: "/teacher-dashboard/library" },
    { icon: MessageSquare, label: "Messages", path: "/teacher-dashboard/messages" },
    { icon: Wallet, label: "Finance", path: "/teacher-dashboard/finance" },
    { icon: CreditCard, label: "Payments", path: "/teacher-dashboard/payments" },
];

const otherMenu = [
    { icon: User, label: "Profile", path: "/teacher/profile" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
    { icon: LogOut, label: "Logout", path: "/login" },
];

/* ================= SIDEBAR ================= */
const TeacherSidebar = ({ isOpen, onClose }) => {
    return (
        <>
            <aside
                className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white z-50
                transition-all duration-300 overflow-hidden
                ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-64 lg:translate-x-0"}`}
            >
                {/* HEADER */}
                <div className="h-16 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img
                                src="https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg"
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                            MDAI
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-50"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* MENU */}
                <nav className="h-full overflow-y-auto px-3 py-4 space-y-1">

                    {/* MAIN */}
                    {mainMenu.map(item => (
                        <SidebarLink key={item.label} {...item} onClick={onClose} />
                    ))}

                    {/* EXTRA */}
                    <div className="pt-5">
                        <p className="px-4 text-sm font-medium text-gray-500 mb-2">
                            Tools
                        </p>
                        {extraMenu.map(item => (
                            <SidebarLink key={item.label} {...item} onClick={onClose} />
                        ))}
                    </div>

                    {/* OTHERS */}
                    <div className="pt-6">
                        <p className="px-4 text-sm font-medium text-gray-500 mb-2">
                            Others
                        </p>
                        {otherMenu.map(item => (
                            <SidebarLink key={item.label} {...item} onClick={onClose} />
                        ))}
                    </div>
                </nav>
            </aside>

            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

/* ================= LINK ================= */
const SidebarLink = ({ icon: Icon, label, path, onClick }) => (
    <NavLink
        to={path}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-base transition
            ${isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`
        }
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </NavLink>
);

export default TeacherSidebar;
