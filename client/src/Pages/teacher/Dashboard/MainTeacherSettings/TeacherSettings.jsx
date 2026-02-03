import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Settings,
    ArrowLeft,
    User,
    Bell,
    Lock,
    Globe,
    Moon,
    Sun,
    Monitor,
    Mail,
    MessageSquare,
    Eye,
    EyeOff,
    Shield,
    Smartphone,
    Download,
    Trash2,
    HelpCircle,
    LogOut,
    Check,
    Loader2,
    UserCircle,
    BookOpen,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const TeacherSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [theme, setTheme] = useState("system");
    const [language, setLanguage] = useState("en");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        newStudent: true,
        classReminder: true,
        newMessage: true,
        weeklyReport: false,
    });

    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showEmail: false,
        showPhone: false,
        allowMessages: true,
    });

    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    // Get auth token
    const getToken = () => {
        return localStorage.getItem("token") || sessionStorage.getItem("token");
    };

    // Fetch teacher settings and profile
    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const token = getToken();

            // Fetch settings
            const settingsRes = await fetch(`${API_URL}/teacher/settings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const settingsData = await settingsRes.json();
            if (settingsData.success && settingsData.settings) {
                if (settingsData.settings.theme) setTheme(settingsData.settings.theme);
                if (settingsData.settings.language) setLanguage(settingsData.settings.language);
                if (settingsData.settings.notifications) {
                    setNotifications(prev => ({
                        ...prev,
                        ...settingsData.settings.notifications
                    }));
                }
                if (settingsData.settings.privacy) {
                    setPrivacy(prev => ({
                        ...prev,
                        ...settingsData.settings.privacy
                    }));
                }
            }

            // Fetch profile
            const profileRes = await fetch(`${API_URL}/teacher/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const profileData = await profileRes.json();
            if (profileData.success) {
                setProfile(profileData.teacher);
            }
        } catch (error) {
            console.error("Fetch settings error:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Save settings to API
    const saveSettings = async (data) => {
        try {
            setSaving(true);
            const token = getToken();

            const res = await fetch(`${API_URL}/teacher/settings`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const dataRes = await res.json();
            if (dataRes.success) {
                return true;
            } else {
                throw new Error(dataRes.message || "Failed to save settings");
            }
        } catch (error) {
            console.error("Save settings error:", error);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationToggle = async (key) => {
        const newValue = !notifications[key];
        setNotifications({ ...notifications, [key]: newValue });

        try {
            await saveSettings({ notifications: { [key]: newValue } });
            toast.success(`✅ ${key.charAt(0).toUpperCase() + key.slice(1)} ${newValue ? 'enabled' : 'disabled'}`, {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (error) {
            // Revert on error
            setNotifications({ ...notifications, [key]: !newValue });
            toast.error("❌ Failed to update notification setting");
        }
    };

    const handlePrivacyToggle = async (key) => {
        const newValue = !privacy[key];
        setPrivacy({ ...privacy, [key]: newValue });

        try {
            await saveSettings({ privacy: { [key]: newValue } });
            toast.success(`✅ Privacy updated`, {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (error) {
            // Revert on error
            setPrivacy({ ...privacy, [key]: !newValue });
            toast.error("❌ Failed to update privacy setting");
        }
    };

    const handleThemeChange = async (newTheme) => {
        setTheme(newTheme);

        try {
            await saveSettings({ theme: newTheme });
            toast.success(`🎨 Theme: ${newTheme}`, {
                position: "top-center",
                autoClose: 2000,
            });
            applyTheme(newTheme);
        } catch (error) {
            // Revert on error
            setTheme(theme);
            toast.error("❌ Failed to update theme");
        }
    };

    const applyTheme = (themeValue) => {
        if (themeValue === "dark") {
            document.documentElement.classList.add("dark");
        } else if (themeValue === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            // System preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    };

    // Listen for system theme changes
    useEffect(() => {
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => applyTheme("system");
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    const handleLanguageChange = async (newLang) => {
        setLanguage(newLang);

        try {
            await saveSettings({ language: newLang });
            toast.success(`🌐 Language changed to ${newLang.toUpperCase()}`, {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (error) {
            setLanguage(language);
            toast.error("❌ Failed to update language");
        }
    };

    const handlePasswordChange = async () => {
        if (!password.current || !password.new || !password.confirm) {
            toast.error("❌ Fill all fields", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }
        if (password.new !== password.confirm) {
            toast.error("❌ Passwords don't match", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }
        if (password.new.length < 8) {
            toast.error("❌ Password must be at least 8 characters", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        try {
            setPasswordLoading(true);
            const token = getToken();

            const res = await fetch(`${API_URL}/teacher/change-password`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: password.current,
                    newPassword: password.new,
                    confirmPassword: password.confirm,
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("✅ Password changed successfully", {
                    position: "top-center",
                    autoClose: 2000,
                });
                setPassword({ current: "", new: "", confirm: "" });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(`❌ ${error.message || "Failed to change password"}`, {
                position: "top-center",
                autoClose: 2000,
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleExportData = async () => {
        try {
            toast.info("📥 Preparing your data export...", {
                position: "top-center",
                autoClose: 2000,
            });

            const token = getToken();
            const profileRes = await fetch(`${API_URL}/teacher/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const profileData = await profileRes.json();

            if (profileData.success) {
                const dataStr = JSON.stringify(profileData.teacher, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `teacher-profile-${new Date().toISOString().split("T")[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success("✅ Data exported successfully", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.error("❌ Failed to export data", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleClearCache = () => {
        // Clear local storage except auth data
        const keysToKeep = ["token", "userRole", "userId"];
        const allKeys = Object.keys(localStorage);
        allKeys.forEach((key) => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        toast.success("✅ Cache cleared", {
            position: "top-center",
            autoClose: 2000,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("userId");
        toast.success("👋 Logged out successfully", {
            position: "top-center",
            autoClose: 2000,
        });
        setTimeout(() => {
            window.location.href = "/auth/login";
        }, 1500);
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(
            "⚠️ Are you sure you want to delete your account? This action cannot be undone."
        );
        if (confirmed) {
            toast.warning("⚠️ Please contact support to delete your account", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const Toggle = ({ enabled, onChange, disabled }) => (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={disabled ? null : onChange}
            className={`relative w-12 h-6 rounded-full transition-colors ${
                enabled
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : "bg-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={disabled}
        >
            <motion.div
                animate={{ x: enabled ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            />
        </motion.button>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-indigo-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1, x: -3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </motion.button>
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                <Settings className="text-blue-600 flex-shrink-0" size={28} />
                                <span>Settings</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                Customize your preferences
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="space-y-6">
                    {/* Profile Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <UserCircle className="text-blue-600" size={24} />
                            Profile Overview
                        </h2>
                        {profile && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <img
                                    src={profile.profileImage?.url || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{profile.fullName}</h3>
                                    <p className="text-gray-600 text-sm">{profile.email}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Member since {new Date(profile.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        profile.isVerified 
                                            ? "bg-green-100 text-green-700" 
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {profile.isVerified ? "✓ Verified" : "Pending Verification"}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        !profile.isSuspended 
                                            ? "bg-blue-100 text-blue-700" 
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {profile.isSuspended ? "Suspended" : "Active"}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Appearance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <Monitor className="text-blue-600" size={24} />
                            Appearance
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-3 block">Theme</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: "light", icon: Sun, label: "Light" },
                                        { value: "dark", icon: Moon, label: "Dark" },
                                        { value: "system", icon: Monitor, label: "System" },
                                    ].map((option) => (
                                        <motion.button
                                            key={option.value}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleThemeChange(option.value)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                                theme === option.value
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <option.icon
                                                size={24}
                                                className={
                                                    theme === option.value ? "text-blue-600" : "text-gray-600"
                                                }
                                            />
                                            <span
                                                className={`text-sm font-medium ${
                                                    theme === option.value ? "text-blue-600" : "text-gray-700"
                                                }`}
                                            >
                                                {option.label}
                                            </span>
                                            {theme === option.value && <Check size={16} className="text-blue-600" />}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Language */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <Globe className="text-green-600" size={24} />
                            Language
                        </h2>
                        <div>
                            <label className="text-sm text-gray-600 mb-2 block">Display Language</label>
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="en">English</option>
                                <option value="es">Español (Spanish)</option>
                                <option value="fr">Français (French)</option>
                                <option value="de">Deutsch (German)</option>
                                <option value="zh">中文 (Chinese)</option>
                                <option value="ja">日本語 (Japanese)</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Notifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <Bell className="text-yellow-600" size={24} />
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            {[
                                { key: "email", icon: Mail, label: "Email Notifications" },
                                { key: "push", icon: Bell, label: "Push Notifications" },
                                { key: "sms", icon: MessageSquare, label: "SMS Notifications" },
                                { key: "newStudent", icon: User, label: "New Students" },
                                { key: "classReminder", icon: Bell, label: "Class Reminders" },
                                { key: "newMessage", icon: MessageSquare, label: "New Messages" },
                                { key: "weeklyReport", icon: Mail, label: "Weekly Reports" },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className="text-gray-600" />
                                        <span className="text-sm sm:text-base">{item.label}</span>
                                    </div>
                                    <Toggle
                                        enabled={notifications[item.key]}
                                        onChange={() => handleNotificationToggle(item.key)}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Privacy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="text-purple-600" size={24} />
                            Privacy
                        </h2>
                        <div className="space-y-4">
                            {[
                                { key: "profileVisible", label: "Profile Visible to Students" },
                                { key: "showEmail", label: "Show Email Address" },
                                { key: "showPhone", label: "Show Phone Number" },
                                { key: "allowMessages", label: "Allow Messages from Students" },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between py-2">
                                    <span className="text-sm sm:text-base">{item.label}</span>
                                    <Toggle
                                        enabled={privacy[item.key]}
                                        onChange={() => handlePrivacyToggle(item.key)}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Security */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <Lock className="text-red-600" size={24} />
                            Security
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password.current}
                                        onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-lg p-3 pr-12 focus:border-blue-500 focus:outline-none"
                                        placeholder="Current password"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">New Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password.new}
                                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                                    placeholder="New password (min 8 characters)"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password.confirm}
                                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePasswordChange}
                                disabled={passwordLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {passwordLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Changing...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </motion.button>

                            <div className="pt-4 border-t">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toast.info("🔐 2FA coming soon!")}
                                    className="w-full bg-green-100 text-green-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    <Smartphone size={20} />
                                    Enable 2FA (Coming Soon)
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <Download className="text-indigo-600" size={24} />
                            Data Management
                        </h2>
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleExportData}
                                className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Export My Data
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClearCache}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Trash2 size={20} />
                                Clear Cache
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Support */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                            <HelpCircle className="text-blue-600" size={24} />
                            Support
                        </h2>
                        <div className="space-y-3">
                            {[
                                { label: "Help Center", icon: BookOpen },
                                { label: "Contact Support", icon: MessageSquare },
                                { label: "Terms of Service", icon: FileText },
                                { label: "Privacy Policy", icon: Shield },
                            ].map((item) => (
                                <motion.button
                                    key={item.label}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toast.info(`📄 Opening ${item.label}`)}
                                    className="w-full bg-gray-50 hover:bg-gray-100 py-3 rounded-lg font-medium text-left px-4 flex items-center gap-3"
                                >
                                    <item.icon size={20} className="text-gray-600" />
                                    {item.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Danger Zone */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 border-2 border-red-200"
                    >
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
                            <Trash2 size={24} />
                            Danger Zone
                        </h2>
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <LogOut size={20} />
                                Logout
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDeleteAccount}
                                className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Trash2 size={20} />
                                Delete Account
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Simple FileText component since it's not imported
const FileText = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
    </svg>
);

export default TeacherSettings;

