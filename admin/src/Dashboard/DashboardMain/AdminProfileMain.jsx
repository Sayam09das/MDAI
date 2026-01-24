import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Home,
    ChevronRight,
    Calendar,
    Clock,
    Sun,
    Moon,
    Sunrise,
    Sunset,
    Heart
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminProfileMain = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState("");
    const [greetingIcon, setGreetingIcon] = useState(Sun);

    const [adminProfile, setAdminProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // 🔹 Greeting logic
    const updateGreeting = (date) => {
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting("Good Morning");
            setGreetingIcon(Sunrise);
        } else if (hour >= 12 && hour < 17) {
            setGreeting("Good Afternoon");
            setGreetingIcon(Sun);
        } else if (hour >= 17 && hour < 21) {
            setGreeting("Good Evening");
            setGreetingIcon(Sunset);
        } else {
            setGreeting("Good Night");
            setGreetingIcon(Moon);
        }
    };

    // 🔹 Time + Greeting updater
    useEffect(() => {
        updateGreeting(new Date());

        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            updateGreeting(now);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 🔹 Fetch Admin Profile
    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) return;

                const res = await fetch(`${BACKEND_URL}/api/admin/profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch admin profile");
                }

                const data = await res.json();
                setAdminProfile(data.admin);
            } catch (err) {
                console.error("PROFILE FETCH ERROR:", err.message);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);

    // 🔹 Format helpers
    const formatTime = (date) =>
        date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

    const formatDate = (date) =>
        date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const GreetingIcon = greetingIcon;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-indigo-600 font-medium">
                        Admin Profile
                    </span>
                </div>

                {/* Welcome Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-8 sm:p-10">
                        {/* Greeting */}
                        <div className="inline-flex items-center space-x-2 mb-4 bg-white/20 px-4 py-2 rounded-full">
                            <GreetingIcon className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">
                                {greeting}
                            </span>
                        </div>

                        {/* Name */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Hello,{" "}
                            {profileLoading
                                ? "Admin"
                                : adminProfile?.name || "Admin"}{" "}
                            👋
                        </h1>

                        <p className="text-indigo-100 text-lg mb-6">
                            Welcome back to your admin dashboard
                        </p>

                        {/* Time & Date */}
                        <div className="flex flex-wrap gap-4 items-center text-white/90">
                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                                <Clock className="w-4 h-4" />
                                <span className="font-mono text-sm">
                                    {formatTime(currentTime)}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                    {formatDate(currentTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Icon */}
                    <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <Heart className="w-full h-full text-white" />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminProfileMain;
