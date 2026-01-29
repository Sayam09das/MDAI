import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    Award,
    Edit3,
    Upload,
    X,
    Check,
    Plus,
    Eye,
    Loader2,
    BookOpen,
    GraduationCap,
    FileText,
    Camera
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

/* ================= ANIMATION VARIANTS ================= */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 }
    }
};

const Teacherprofile = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [files, setFiles] = useState({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        gender: "male",
        profileImage: "",
        class10Certificate: "",
        class12Certificate: "",
        collegeCertificate: "",
        phdOrOtherCertificate: "",
        joinWhatsappGroup: false,
        about: "",
        skills: [],
        experience: 0,
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
                    gender: data.user.gender || "male",
                    profileImage: extractUrl(data.user.profileImage),
                    class10Certificate: extractUrl(data.user.class10Certificate),
                    class12Certificate: extractUrl(data.user.class12Certificate),
                    collegeCertificate: extractUrl(data.user.collegeCertificate),
                    phdOrOtherCertificate: extractUrl(data.user.phdOrOtherCertificate),
                    joinWhatsappGroup: data.user.joinWhatsappGroup || false,
                    about: data.user.about || "",
                    skills: data.user.skills || [],
                    experience: data.user.experience || 0,
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
        setFiles((prev) => ({ ...prev, [name]: file }));
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

            const res = await fetch(`${BACKEND_URL}/api/teacher/update/me`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${getToken()}` },
                body,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("Profile updated ✅");
            setIsEditing(false);
        } catch (err) {
            alert(err.message || "Update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                    <p className="text-white text-lg font-medium">Loading profile...</p>
                </motion.div>
            </div>
        );
    }

    /* ================= VIEW MODE ================= */
    if (!isEditing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 md:p-6 lg:p-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-7xl mx-auto"
                >
                    {/* Main Container */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 md:p-10 lg:p-12">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                {/* Profile Info */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
                                    {/* Profile Image */}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="relative"
                                    >
                                        {formData.profileImage && !isPlaceholderHost(formData.profileImage) ? (
                                            <img
                                                src={formData.profileImage}
                                                alt="Profile"
                                                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/30 object-cover shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center shadow-xl backdrop-blur-sm">
                                                <span className="text-5xl md:text-6xl font-bold text-white">
                                                    {formData.fullName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                                        >
                                            Active
                                        </motion.div>
                                    </motion.div>

                                    {/* Name & Details */}
                                    <div className="flex-1 min-w-0">
                                        <motion.h1
                                            variants={itemVariants}
                                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 break-words"
                                        >
                                            {formData.fullName}
                                        </motion.h1>
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-white/90 text-base md:text-lg mb-3 md:mb-4"
                                        >
                                            Professional Educator
                                        </motion.p>
                                        <motion.div
                                            variants={itemVariants}
                                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-medium"
                                        >
                                            <Briefcase className="w-5 h-5" />
                                            <span>{formData.experience} years experience</span>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto justify-center"
                                >
                                    <Edit3 className="w-5 h-5" />
                                    Edit Profile
                                </motion.button>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 md:p-10 lg:p-12">
                            {/* Info Cards Grid */}
                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
                            >
                                <InfoCard
                                    icon={<Mail className="w-6 h-6" />}
                                    label="Email"
                                    value={formData.email}
                                />
                                <InfoCard
                                    icon={<Phone className="w-6 h-6" />}
                                    label="Phone"
                                    value={formData.phone}
                                />
                                <InfoCard
                                    icon={<MapPin className="w-6 h-6" />}
                                    label="Address"
                                    value={formData.address}
                                />
                            </motion.div>

                            {/* About Section */}
                            {formData.about && (
                                <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-3">
                                        <User className="w-7 h-7 text-indigo-600" />
                                        About
                                    </h2>
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm"
                                    >
                                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                                            {formData.about}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Skills Section */}
                            {formData.skills && formData.skills.length > 0 && (
                                <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-3">
                                        <BookOpen className="w-7 h-7 text-indigo-600" />
                                        Skills & Expertise
                                    </h2>
                                    <motion.div
                                        variants={containerVariants}
                                        className="flex flex-wrap gap-2 md:gap-3"
                                    >
                                        {formData.skills.map((skill, idx) => (
                                            <motion.span
                                                key={idx}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base shadow-md"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Certificates Section */}
                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-3">
                                    <Award className="w-7 h-7 text-indigo-600" />
                                    Certifications & Qualifications
                                </h2>
                                <motion.div
                                    variants={containerVariants}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                                >
                                    <CertificateCard
                                        title="Class 10 Certificate"
                                        src={formData.class10Certificate}
                                        icon={<GraduationCap className="w-6 h-6" />}
                                    />
                                    <CertificateCard
                                        title="Class 12 Certificate"
                                        src={formData.class12Certificate}
                                        icon={<GraduationCap className="w-6 h-6" />}
                                    />
                                    <CertificateCard
                                        title="College Degree"
                                        src={formData.collegeCertificate}
                                        icon={<FileText className="w-6 h-6" />}
                                    />
                                    <CertificateCard
                                        title="Advanced Certification"
                                        src={formData.phdOrOtherCertificate}
                                        icon={<Award className="w-6 h-6" />}
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    /* ================= EDIT MODE ================= */
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 md:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Edit Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 md:p-10 lg:p-12">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
                        >
                            Edit Profile
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/90 text-base md:text-lg"
                        >
                            Update your professional information
                        </motion.p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 lg:p-12">
                        {/* Profile Image Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 md:mb-10"
                        >
                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                Profile Image
                            </label>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {formData.profileImage && !isPlaceholderHost(formData.profileImage) ? (
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        src={formData.profileImage}
                                        alt="Profile preview"
                                        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <Camera className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                                    </div>
                                )}
                                <label className="flex-1 w-full sm:w-auto">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange("profileImage", e.target.files[0])}
                                    />
                                    <motion.span
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
                                    >
                                        <Upload className="w-5 h-5" />
                                        Choose Image
                                    </motion.span>
                                </label>
                            </div>
                        </motion.div>

                        {/* Basic Info Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                        >
                            <FormInput
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            <FormInput
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                disabled
                            />
                            <FormInput
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                            />
                            <FormInput
                                label="Experience (Years)"
                                name="experience"
                                type="number"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                            />
                        </motion.div>

                        {/* Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <FormInput
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                            />
                        </motion.div>

                        {/* About */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8"
                        >
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                About
                            </label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-700 resize-none"
                                placeholder="Tell us about yourself, your teaching philosophy, and experience..."
                            />
                        </motion.div>

                        {/* Skills Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-8"
                        >
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Skills & Expertise
                            </label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-700"
                                    placeholder="Add a skill (press Enter)"
                                />
                                <motion.button
                                    type="button"
                                    onClick={addSkill}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add
                                </motion.button>
                            </div>
                            <AnimatePresence mode="popLayout">
                                {formData.skills.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {formData.skills.map((skill, idx) => (
                                            <motion.span
                                                key={skill}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-gray-200"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Certificates Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mb-10"
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                                Certificates & Qualifications
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <CertificateEdit
                                    name="class10Certificate"
                                    title="Class 10 Certificate"
                                    src={formData.class10Certificate}
                                    onFileChange={handleFileChange}
                                />
                                <CertificateEdit
                                    name="class12Certificate"
                                    title="Class 12 Certificate"
                                    src={formData.class12Certificate}
                                    onFileChange={handleFileChange}
                                />
                                <CertificateEdit
                                    name="collegeCertificate"
                                    title="College Degree"
                                    src={formData.collegeCertificate}
                                    onFileChange={handleFileChange}
                                />
                                <CertificateEdit
                                    name="phdOrOtherCertificate"
                                    title="Advanced Certification"
                                    src={formData.phdOrOtherCertificate}
                                    onFileChange={handleFileChange}
                                />
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-gray-200"
                        >
                            <motion.button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 sm:flex-none bg-white text-gray-700 border-2 border-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
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
    );
};

/* ================= COMPONENTS ================= */

const InfoCard = ({ icon, label, value }) => (
    <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm"
    >
        <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-3 rounded-xl flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {label}
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 break-words">
                    {value}
                </p>
            </div>
        </div>
    </motion.div>
);

const CertificateCard = ({ title, src, icon }) => {
    const hasValidSrc = src && !isPlaceholderHost(src);

    return (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-3 rounded-xl inline-flex mb-4">
                {icon}
            </div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">{title}</h4>
            {hasValidSrc ? (
                <div className="space-y-3">
                    <img
                        src={src}
                        alt={title}
                        className="w-full h-32 md:h-40 object-cover rounded-xl border border-gray-200"
                    />
                    <motion.a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View Certificate
                    </motion.a>
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">No certificate uploaded</p>
            )}
        </motion.div>
    );
};

const CertificateEdit = ({ name, title, src, onFileChange }) => {
    const hasValidSrc = src && !isPlaceholderHost(src);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-2xl border border-gray-200"
        >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                {title}
            </label>
            {hasValidSrc && (
                <motion.img
                    whileHover={{ scale: 1.02 }}
                    src={src}
                    alt={title}
                    className="w-full h-32 object-cover rounded-xl border border-gray-200 mb-3"
                />
            )}
            <label>
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => onFileChange(name, e.target.files[0])}
                />
                <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-500 px-4 py-2.5 rounded-xl font-semibold cursor-pointer hover:bg-indigo-50 transition-colors text-sm w-full"
                >
                    <Upload className="w-4 h-4" />
                    {hasValidSrc ? 'Replace' : 'Upload'}
                </motion.span>
            </label>
        </motion.div>
    );
};

const FormInput = ({ label, name, type = "text", value, onChange, placeholder, disabled = false, min }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
    </div>
);

export default Teacherprofile;