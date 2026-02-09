import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar onMenuClick={() => setSidebarOpen(true)} />

      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="pt-16 lg:ml-64 transition-all duration-300 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;

