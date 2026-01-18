import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StudentProfile = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    /* ================= FETCH CURRENT USER ================= */
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

                setCurrentUser(data.user);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    if (!currentUser) return null;

    /* ================= INITIALS ================= */
    const getInitials = (fullName = "") => {
        return fullName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow w-full max-w-md mx-auto">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900">
                    Profile
                </h2>

                {/* EDIT ICON */}
                <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Pencil size={18} className="text-gray-600" />
                </button>
            </div>

            {/* PROFILE IMAGE / INITIALS */}
            <div className="flex flex-col items-center mt-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(currentUser.fullName)}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {currentUser.fullName}
                </h3>

                <p className="text-gray-500 text-sm">
                    College Student
                </p>
            </div>

            {/* SIMPLE DATE STRIP (UI ONLY) */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-600">
                February 2026
            </div>
        </div>
    );
};

export default StudentProfile;
