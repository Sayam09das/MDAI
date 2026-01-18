import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, User, Mail, Phone, MapPin } from "lucide-react";
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

    /* ================= NAVIGATE TO PROFILE EDIT ================= */
    const handleEditClick = () => {
        navigate("/student/profile");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 w-full max-w-md mx-auto"
        >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-5 sm:mb-6">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center gap-2 sm:gap-3"
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        Profile
                    </h2>
                </motion.div>

                {/* EDIT BUTTON */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditClick}
                    className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors group"
                >
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                </motion.button>
            </div>

            {/* PROFILE IMAGE / INITIALS */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col items-center"
            >
                {/* Avatar Circle */}
                <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold shadow-lg">
                        {getInitials(currentUser.fullName)}
                    </div>

                    {/* Online Status Indicator */}
                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 sm:border-3 border-white rounded-full" />
                </div>

                {/* Name */}
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-semibold text-gray-900"
                >
                    {currentUser.fullName}
                </motion.h3>

                {/* Role Badge */}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="mt-1 sm:mt-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-medium rounded-full"
                >
                    Student
                </motion.span>
            </motion.div>

            {/* PROFILE DETAILS */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 space-y-3 sm:space-y-4"
            >
                {/* Email */}
                {currentUser.email && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <p className="text-sm sm:text-base text-gray-900 truncate">
                                {currentUser.email}
                            </p>
                        </div>
                    </div>
                )}

                {/* Phone */}
                {currentUser.phone && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                            <p className="text-sm sm:text-base text-gray-900">
                                {currentUser.phone}
                            </p>
                        </div>
                    </div>
                )}

                {/* Location */}
                {currentUser.location && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Location</p>
                            <p className="text-sm sm:text-base text-gray-900">
                                {currentUser.location}
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default StudentProfile;