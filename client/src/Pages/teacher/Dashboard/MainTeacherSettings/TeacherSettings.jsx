import React, { useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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
} from "lucide-react"

const TeacherSettings = () => {
    const [theme, setTheme] = useState("light")
    const [language, setLanguage] = useState("en")
    const [showPassword, setShowPassword] = useState(false)

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        newStudent: true,
        classReminder: true,
        newMessage: true,
        weeklyReport: false,
    })

    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showEmail: false,
        showPhone: false,
        allowMessages: true,
    })

    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: "",
    })

    const handleNotificationToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] })
        toast.success(`✅ ${key} ${!notifications[key] ? 'enabled' : 'disabled'}`, {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const handlePrivacyToggle = (key) => {
        setPrivacy({ ...privacy, [key]: !privacy[key] })
        toast.success(`✅ Privacy updated`, {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme)
        toast.success(`🎨 Theme: ${newTheme}`, {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang)
        toast.success(`🌍 Language changed`, {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const handlePasswordChange = () => {
        if (!password.current || !password.new || !password.confirm) {
            toast.error("❌ Fill all fields", {
                position: "top-center",
                autoClose: 2000,
            })
            return
        }
        if (password.new !== password.confirm) {
            toast.error("❌ Passwords don't match", {
                position: "top-center",
                autoClose: 2000,
            })
            return
        }
        toast.success("✅ Password changed", {
            position: "top-center",
            autoClose: 2000,
        })
        setPassword({ current: "", new: "", confirm: "" })
    }

    const Toggle = ({ enabled, onChange }) => (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'
                }`}
        >
            <motion.div
                animate={{ x: enabled ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            />
        </motion.button>
    )

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
                                Customize preferences
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="space-y-6">
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
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === option.value
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <option.icon size={24} className={theme === option.value ? 'text-blue-600' : 'text-gray-600'} />
                                            <span className={`text-sm font-medium ${theme === option.value ? 'text-blue-600' : 'text-gray-700'}`}>
                                                {option.label}
                                            </span>
                                            {theme === option.value && (
                                                <Check size={16} className="text-blue-600" />
                                            )}
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
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="zh">Chinese</option>
                                <option value="ja">Japanese</option>
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
                                { key: "profileVisible", label: "Profile Visible" },
                                { key: "showEmail", label: "Show Email" },
                                { key: "showPhone", label: "Show Phone" },
                                { key: "allowMessages", label: "Allow Messages" },
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                                    placeholder="New password"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password.confirm}
                                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                                    placeholder="Confirm password"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePasswordChange}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium"
                            >
                                Change Password
                            </motion.button>

                            <div className="pt-4 border-t">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toast.info("🔐 2FA coming soon!")}
                                    className="w-full bg-green-100 text-green-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    <Smartphone size={20} />
                                    Enable 2FA
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
                            Data
                        </h2>
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toast.info("📥 Exporting...")}
                                className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Export Data
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toast.success("🧹 Cache cleared")}
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
                            {["Help Center", "Contact Support", "Terms of Service", "Privacy Policy"].map((item) => (
                                <motion.button
                                    key={item}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toast.info(`📄 Opening ${item}`)}
                                    className="w-full bg-gray-50 hover:bg-gray-100 py-3 rounded-lg font-medium text-left px-4"
                                >
                                    {item}
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
                                onClick={() => toast.success("👋 Logging out...")}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <LogOut size={20} />
                                Logout
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toast.warning("⚠️ Delete requested")}
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
    )
}

export default TeacherSettings