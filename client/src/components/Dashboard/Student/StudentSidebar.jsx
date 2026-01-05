import React from "react";

const StudentSidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow z-40 transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <button
        onClick={onClose}
        className="lg:hidden p-2 text-right w-full"
      >
        ✕
      </button>

      <ul className="p-4 space-y-3">
        <li>Dashboard</li>
        <li>Courses</li>
        <li>Profile</li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
