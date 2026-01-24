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
    Crown
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminProfileMain = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState("");
    const [greetingIcon, setGreetingIcon] = useState(Sun);
    const [greetingType, setGreetingType] = useState("day");

    const [adminProfile, setAdminProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // 🔹 Greeting + icon logic
    const updateGreeting = (date) => {
        const hour = date.getHours();

        if (hour >= 5 && hour < 12) {
            setGreeting("Good Morning");
            setGreetingIcon(Sunrise);
            setGreetingType("morning");
        } else if (hour >= 12 && hour < 17) {
            setGreeting("Good Afternoon");
            setGreetingIcon(Sun);
            setGreetingType("afternoon");
        } else if (hour >= 17 && hour < 21) {
            setGreeting("Good Evening");
            setGreetingIcon(Sunset);
            setGreetingType("evening");
        } else {
            setGreeting("Good Night");
            setGreetingIcon(Moon);
            setGreetingType("night");
        }
    };

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setAdminProfile(data.admin);
            } catch (err) {
                console.error(err);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);

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

    // 🔹 Icon animations based on time
    const greetingAnimation = {
        morning: { y: [-4, 0], transition: { duration: 1.2, repeat: Infinity } },
        afternoon: { rotate: 360, transition: { duration: 8, repeat: Infinity, ease: "linear" } },
        evening: { y: [0, 4], transition: { duration: 1.5, repeat: Infinity } },
        night: { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity } },
    };

    return (
        <div className="bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Welcome Card */}
                <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-10">

                        {/* Animated Greeting */}
                        <div className="inline-flex items-center space-x-2 mb-4 bg-white/20 px-4 py-2 rounded-full">
                            <motion.div animate={greetingAnimation[greetingType]}>
                                <GreetingIcon className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-white font-medium">{greeting}</span>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">
                            Hello, {profileLoading ? "Admin" : adminProfile?.name || "Admin"} 👑
                        </h1>

                        <p className="text-indigo-100 mb-6">
                            Welcome back to your admin dashboard
                        </p>

                        <div className="flex gap-4 text-white/90">
                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                                <Clock className="w-4 h-4" />
                                <span className="font-mono text-sm">{formatTime(currentTime)}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{formatDate(currentTime)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Crown Decoration */}
                    <div className="absolute top-0 right-0 w-56 h-56 opacity-15">
                        <motion.div
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Crown className="w-full h-full text-white" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileMain;
