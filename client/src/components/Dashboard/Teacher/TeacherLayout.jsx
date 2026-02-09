import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherNavbar from "./TeacherNavbar";
import TeacherSidebar from "./TeacherSidebar";
import useRouteLoader from "../../../hooks/useRouteLoader";
import PageLoader from "../../common/PageLoader";

const TeacherLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const loading = useRouteLoader(600); // 👈 route-change loader

    return (
        <div className="min-h-screen bg-gray-50">
            <TeacherNavbar onMenuClick={() => setSidebarOpen(true)} />

            <TeacherSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* CONTENT AREA */}
            <main className="pt-16 lg:ml-64 transition-all duration-300 relative">
                {loading && <PageLoader />}
                <Outlet />
            </main>
        </div>
    );
};

export default TeacherLayout;

