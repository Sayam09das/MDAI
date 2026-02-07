import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  BarChart3,
  FolderOpen,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  User,
  Settings,
  X,
  Bell,
  CreditCard,
} from "lucide-react";

/* ================= MENU ================= */
const mainMenu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student-dashboard" },
  { icon: Layers, label: "All Courses", path: "/student-dashboard/all-courses", },
  { icon: BookOpen, label: "My Courses", path: "/student-dashboard/student-mycourse" },
  { icon: BarChart3, label: "Course Progress", path: "/student-dashboard/course-progress" },
  { icon: FolderOpen, label: "Resources", path: "/student-dashboard/resources" },
  { icon: Bell, label: "Announcements", path: "/student-dashboard/announcements" },
  { icon: CreditCard, label: "Payments", path: "/student-dashboard/payments" },
];

const extraMenu = [
  { icon: ClipboardCheck, label: "Attendance", path: "/student-dashboard/attendance" },
  { icon: Calendar, label: "Calendar", path: "/student-dashboard/calendar" },
  { icon: MessageSquare, label: "Messages", path: "/student-dashboard/messages" },
];

const otherMenu = [
  { icon: User, label: "Profile", path: "/student-dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/student/settings" },
];

/* ================= SIDEBAR ================= */
const StudentSidebar = ({ isOpen, onClose }) => {
  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 lg:top-16 left-0 h-screen lg:h-[calc(100vh-4rem)] 
                bg-white shadow-xl lg:shadow-none z-50
                transition-transform duration-300 ease-in-out
                w-full max-w-[280px] sm:max-w-xs lg:max-w-none lg:w-64
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                flex flex-col`}
      >
        {/* HEADER */}
        <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-gray-200 lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src="https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg"
                alt="MDAI Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-gray-900 truncate">
              MDAI
            </span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* SCROLLABLE MENU */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1">

          {/* MAIN MENU */}
          <div className="space-y-1">
            {mainMenu.map(item => (
              <SidebarLink key={item.label} {...item} onClick={onClick} />
            ))}
          </div>

          {/* TOOLS SECTION */}
          <div className="pt-6 space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Tools
            </p>
            {extraMenu.map(item => (
              <SidebarLink key={item.label} {...item} onClick={onClose} />
            ))}
          </div>

          {/* OTHERS SECTION */}
          <div className="pt-6 pb-4 space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Account
            </p>
            {otherMenu.map(item => (
              <SidebarLink key={item.label} {...item} onClick={onClose} />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

/* ================= LINK ================= */
const SidebarLink = ({ icon: Icon, label, path, onClick }) => (
  <NavLink
    to={path}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
            transition-all duration-200 group relative overflow-hidden
            ${isActive
        ? "bg-blue-50 text-blue-700 shadow-sm"
        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />
        )}

        <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110
                    ${isActive ? "text-blue-600" : "text-gray-500"}`}
        />
        <span className="truncate">{label}</span>
      </>
    )}
  </NavLink>
);

export default StudentSidebar;
