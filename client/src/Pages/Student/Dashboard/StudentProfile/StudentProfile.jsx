import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    User,
    Mail,
    Phone,
    MapPin,
    BookOpen,
    Edit3,
    Upload,
    Check,
    X,
    Loader2,
    Camera,
    FileText,
    CheckCircle
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ================= HELPERS ================= */
const extractUrl = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val.url) return val.url;
    return "";
};

/* ================= ANIMATION VARIANTS ================= */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 12
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ================= FETCH PROFILE ================= */
    const fetchProfile = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            const data = await res.json();
            setUser(data.user);

            setFormData({
                fullName: data.user.fullName || "",
                phone: data.user.phone || "",
                address: data.user.address || "",
                about: data.user.about || "",
                skills: data.user.skills?.join(", ") || "",
            });
        } catch (err) {
            console.error("Fetch profile error:", err);
            toast.error("Failed to load profile. Please try again.");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            // Handle skills as array
            const skillsArray = formData.skills
                ? formData.skills.split(",").map(skill => skill.trim()).filter(skill => skill)
                : [];

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "skills") {
                    data.append(key, JSON.stringify(skillsArray));
                } else {
                    data.append(key, value);
                }
            });

            if (profileImage) {
                data.append("profileImage", profileImage);
            }

            const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                body: data,
            });

            if (!res.ok) {
                throw new Error("Failed to update profile");
            }

            toast.success("Profile updated successfully! 🎉");
            setEditMode(false);
            setProfileImage(null);
            setProfileImagePreview(null);
            fetchProfile();
        } catch (err) {
            console.error("Update profile error:", err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setProfileImage(null);
        setProfileImagePreview(null);
        // Reset form data
        setFormData({
            fullName: user.fullName || "",
            phone: user.phone || "",
            address: user.address || "",
            about: user.about || "",
            skills: user.skills?.join(", ") || "",
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 text-slate-600 animate-spin" />
                    <p className="text-slate-700 text-lg font-medium">Loading profile...</p>
                </motion.div>
            </div>
        );
    }

    /* ================= VIEW MODE ================= */
    if (!editMode) {
        return (
            <>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    pauseOnHover
                    theme="light"
                />

                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-4 md:p-6 lg:p-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div
                            variants={cardVariants}
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                        >
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-gray-700 p-6 md:p-10">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    {/* Profile Image */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="relative"
                                    >
                                        {extractUrl(user.profileImage) ? (
                                            <img
                                                src={extractUrl(user.profileImage)}
                                                alt="Profile"
                                                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white/40 object-cover shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white/40 bg-white/20 flex items-center justify-center shadow-xl backdrop-blur-sm">
                                                <User className="w-14 h-14 md:w-16 md:h-16 text-white" />
                                            </div>
                                        )}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2 rounded-full shadow-lg"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </motion.div>
                                    </motion.div>

                                    {/* User Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <motion.h2
                                            variants={itemVariants}
                                            className="text-3xl md:text-4xl font-bold text-white mb-2"
                                        >
                                            {user.fullName}
                                        </motion.h2>
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-base md:text-lg mb-4"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span>{user.email}</span>
                                        </motion.div>
                                        <motion.button
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setEditMode(true)}
                                            className="bg-white text-slate-700 px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow mx-auto sm:mx-0"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Edit Profile
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 md:p-10">
                                {/* Info Grid */}
                                <motion.div
                                    variants={containerVariants}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8"
                                >
                                    <InfoCard
                                        icon={<Phone className="w-5 h-5" />}
                                        label="Phone"
                                        value={user.phone || "Not provided"}
                                    />
                                    <InfoCard
                                        icon={<MapPin className="w-5 h-5" />}
                                        label="Address"
                                        value={user.address || "Not provided"}
                                    />
                                </motion.div>

                                {/* About Section */}
                                {user.about && (
                                    <motion.div variants={itemVariants} className="mb-8">
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-slate-600" />
                                            About
                                        </h3>
                                        <motion.div
                                            whileHover={{ scale: 1.005 }}
                                            className="bg-slate-50 p-5 md:p-6 rounded-xl border border-slate-200"
                                        >
                                            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                                                {user.about}
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* Skills Section */}
                                {user.skills && user.skills.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <BookOpen className="w-6 h-6 text-slate-600" />
                                            Skills
                                        </h3>
                                        <motion.div
                                            variants={containerVariants}
                                            className="flex flex-wrap gap-2 md:gap-3"
                                        >
                                            {user.skills.map((skill, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    className="bg-slate-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    {skill}
                                                </motion.span>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </>
        );
    }

    /* ================= EDIT MODE ================= */
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                theme="light"
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-4 md:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-gray-700 p-6 md:p-10">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl md:text-4xl font-bold text-white mb-2"
                            >
                                Edit Profile
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-white/90 text-base md:text-lg"
                            >
                                Update your personal information
                            </motion.p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-10">
                            {/* Profile Image Upload */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Profile Image
                                </label>
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    {(profileImagePreview || extractUrl(user.profileImage)) ? (
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            src={profileImagePreview || extractUrl(user.profileImage)}
                                            alt="Profile preview"
                                            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-200"
                                        />
                                    ) : (
                                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                                            <Camera className="w-10 h-10 md:w-12 md:h-12 text-slate-400" />
                                        </div>
                                    )}
                                    <label className="flex-1 w-full sm:w-auto">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                        <motion.span
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center justify-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer shadow-md hover:shadow-lg hover:bg-slate-800 transition-all w-full sm:w-auto"
                                        >
                                            <Upload className="w-5 h-5" />
                                            Choose Image
                                        </motion.span>
                                    </label>
                                </div>
                            </motion.div>

                            {/* Form Fields */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-6"
                            >
                                <FormInput
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    icon={<User className="w-5 h-5" />}
                                />

                                <FormInput
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    icon={<Phone className="w-5 h-5" />}
                                />

                                <FormInput
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    icon={<MapPin className="w-5 h-5" />}
                                />

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        About
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            name="about"
                                            value={formData.about}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-700 resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Skills (comma separated)
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-700"
                                            placeholder="e.g. JavaScript, React, Node.js"
                                        />
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col-reverse sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-200"
                            >
                                <motion.button
                                    type="button"
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 sm:flex-none bg-white text-slate-700 border-2 border-slate-300 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={!loading ? { scale: 1.02 } : {}}
                                    whileTap={!loading ? { scale: 0.98 } : {}}
                                    className="flex-1 sm:flex-none bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

/* ================= COMPONENTS ================= */

const InfoCard = ({ icon, label, value }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01, y: -2 }}
        className="bg-slate-50 p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
    >
        <div className="flex items-start gap-4">
            <div className="bg-slate-700 text-white p-3 rounded-lg flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    {label}
                </p>
                <p className="text-sm md:text-base font-medium text-slate-800 break-words">
                    {value}
                </p>
            </div>
        </div>
    </motion.div>
);

const FormInput = ({ label, name, type = "text", value, onChange, placeholder, icon }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-700"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
        </div>
    </div>
);

export default StudentProfile;