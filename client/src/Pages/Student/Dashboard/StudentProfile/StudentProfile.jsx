import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Award,
    BookOpen,
    Edit2,
    Save,
    X,
    Upload,
    FileText,
    CheckCircle,
    Calendar,
    GraduationCap,
    Star,
    Camera,
    ChevronRight,
    Download,
    Eye,
    Trash2
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

const isPlaceholderHost = (url) => {
    try {
        const u = new URL(url);
        return u.hostname.includes("example.com");
    } catch {
        return true;
    }
};

const StudentProfile = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [files, setFiles] = useState({});
    const [previewUrls, setPreviewUrls] = useState({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        about: "",
        skills: [],
    });

    /* ================= FETCH PROFILE ================= */
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = getToken();
            if (!token) return navigate("/login");

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (!res.ok) throw new Error();

                setCurrentUser(data.user);

                setFormData({
                    fullName: data.user.fullName || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    address: data.user.address || "",
                    profileImage: extractUrl(data.user.profileImage),
                    about: data.user.about || "",
                    skills: data.user.skills || [],
                });
            } catch {
                localStorage.clear();
                navigate("/login");
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    /* ================= HANDLERS ================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleFileChange = (name, file) => {
        if (file) {
            setFiles((prev) => ({ ...prev, [name]: file }));

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addSkill = () => {
        if (
            skillInput.trim() &&
            !formData.skills.includes(skillInput.trim()) &&
            formData.skills.length < 10
        ) {
            setFormData((p) => ({ ...p, skills: [...p.skills, skillInput.trim()] }));
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const body = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "skills") {
                    body.append(key, JSON.stringify(formData.skills));
                } else {
                    body.append(key, formData[key] ?? "");
                }
            });

            Object.keys(files).forEach((key) => {
                body.append(key, files[key]);
            });

            const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${getToken()}` },
                body,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("Profile updated successfully! ✅");
            setIsEditing(false);

            // Refresh the page to show updated data
            window.location.reload();
        } catch (err) {
            alert(err.message || "Update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    /* ================= VIEW MODE ================= */
    if (!isEditing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                        {/* Cover Background */}
                        <div className="h-32 sm:h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                        </div>

                        {/* Profile Content */}
                        <div className="px-6 pb-6">
                            {/* Profile Image */}
                            <div className="relative -mt-16 sm:-mt-20 mb-4">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-400">
                                    {formData.profileImage && !isPlaceholderHost(formData.profileImage) ? (
                                        <img
                                            src={formData.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                                            {formData.fullName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name and Info */}
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                                        {formData.fullName}
                                    </h1>
                                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                                        <GraduationCap className="w-5 h-5" />
                                        <span>Student</span>
                                    </div>
                                </div>

                                {/* Contact Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <InfoItem icon={Mail} label="Email" value={formData.email} />
                                    <InfoItem icon={Phone} label="Phone" value={formData.phone} />
                                    <InfoItem icon={MapPin} label="Address" value={formData.address} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    {formData.about && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <User className="w-6 h-6 text-indigo-600" />
                                About Me
                            </h2>
                            <p className="text-slate-700 leading-relaxed">{formData.about}</p>
                        </motion.div>
                    )}

                    {/* Skills Section */}
                    {formData.skills.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Star className="w-6 h-6 text-indigo-600" />
                                Skills & Expertise
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {formData.skills.map((skill, idx) => (
                                    <motion.span
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium shadow-md"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        );
    }

    /* ================= EDIT MODE ================= */
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Edit2 className="w-8 h-8 text-indigo-600" />
                            Edit Profile
                        </h2>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-600" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Profile Picture
                            </label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-400 shadow-lg">
                                        {(previewUrls.profileImage || formData.profileImage) ? (
                                            <img
                                                src={previewUrls.profileImage || formData.profileImage}
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                                                {formData.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="profileImage"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange("profileImage", e.target.files[0])}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="profileImage"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload Photo
                                    </label>
                                    <p className="text-sm text-slate-500 mt-2">
                                        JPG, PNG or GIF. Max size 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                icon={User}
                                required
                            />
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={Mail}
                                disabled
                            />
                            <InputField
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={Phone}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter your address"
                                />
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                About Me
                            </label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                placeholder="Tell us about yourself, your interests, and goals..."
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Skills & Expertise
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    placeholder="Add a skill..."
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <AnimatePresence>
                                    {formData.skills.map((skill, idx) => (
                                        <motion.span
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full font-medium"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                            {formData.skills.length >= 10 && (
                                <p className="text-sm text-amber-600 mt-2">Maximum 10 skills allowed</p>
                            )}
                        </div>


                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

/* ================= UI COMPONENTS ================= */

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{value || "Not provided"}</p>
        </div>
    </div>
);



const InputField = ({ label, icon: Icon, ...props }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
            {label}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />}
            <input
                {...props}
                className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500`}
            />
        </div>
    </div>
);


export default StudentProfile;