import React from "react";

const StudentNavbar = ({ onMenuClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-4">
      <button
        onClick={onMenuClick}
        className="text-gray-700 font-semibold"
      >
        ☰
      </button>
      <h1 className="ml-4 font-bold">Student Dashboard</h1>
    </nav>
  );
};

export default StudentNavbar;
