import React, { useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    BookOpen,
    Users,
    Video,
    Star,
    Edit,
    Save,
    X,
    Camera,
    ArrowLeft,
    Briefcase,
    GraduationCap,
    Globe,
    ExternalLink,
} from "lucide-react"

const TeacherProfile = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [showAvatarModal, setShowAvatarModal] = useState(false)

    const [profile, setProfile] = useState({
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        bio: "Passionate educator with 10+ years of experience in web development and computer science. Dedicated to helping students achieve their full potential through innovative teaching methods.",
        title: "Senior Software Engineering Instructor",
        department: "Computer Science",
        joinDate: "2015-09-01",
        education: "Ph.D. in Computer Science, Stanford University",
        specialization: "Full Stack Development, Cloud Computing, AI/ML",
        website: "www.sarahjohnson.dev",
        linkedin: "linkedin.com/in/sarahjohnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    })

    const [tempProfile, setTempProfile] = useState(profile)

    const stats = [
        { icon: BookOpen, label: "Courses", value: "12", color: "from-blue-500 to-cyan-500" },
        { icon: Users, label: "Students", value: "2,450", color: "from-green-500 to-emerald-500" },
        { icon: Video, label: "Sessions", value: "340", color: "from-purple-500 to-pink-500" },
        { icon: Star, label: "Rating", value: "4.9", color: "from-yellow-500 to-orange-500" },
    ]

    const achievements = [
        { title: "Teacher of the Year", year: "2024", icon: Award },
        { title: "Outstanding Educator", year: "2023", icon: GraduationCap },
        { title: "Innovation in Teaching", year: "2022", icon: Star },
    ]

    const handleEdit = () => {
        setTempProfile(profile)
        setIsEditing(true)
    }

    const handleSave = () => {
        setProfile(tempProfile)
        setIsEditing(false)
        toast.success("✅ Profile updated successfully!", {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const handleCancel = () => {
        setTempProfile(profile)
        setIsEditing(false)
    }

    const handleAvatarChange = () => {
        toast.success("📸 Avatar updated!", {
            position: "bottom-right",
            autoClose: 2000,
        })
        setShowAvatarModal(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    <User className="text-blue-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Profile</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Manage your account
                                </p>
                            </div>
                        </div>

                        {!isEditing ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                            >
                                <Edit size={20} /> <span className="hidden sm:inline">Edit</span>
                            </motion.button>
                        ) : (
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg"
                                >
                                    <Save size={20} /> <span className="hidden sm:inline">Save</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    className="px-4 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Avatar Card */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative"
                                >
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-200"
                                    />
                                    {isEditing && (
                                        <button
                                            onClick={() => setShowAvatarModal(true)}
                                            className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Camera size={20} />
                                        </button>
                                    )}
                                </motion.div>
                            </div>

                            {!isEditing ? (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold mb-2">{profile.name}</h2>
                                    <p className="text-indigo-600 font-medium mb-4">{profile.title}</p>
                                    <p className="text-sm text-gray-600 mb-4">{profile.department}</p>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={tempProfile.name}
                                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        className="w-full text-xl font-bold text-center mb-2 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={tempProfile.title}
                                        onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                                        className="w-full text-center mb-2 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={tempProfile.department}
                                        onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })}
                                        className="w-full text-sm text-center mb-4 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                    />
                                </>
                            )}

                            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-current" />
                                ))}
                                <span className="ml-2 text-gray-600 font-medium">4.9</span>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Award className="text-yellow-500" size={20} />
                                Achievements
                            </h3>
                            <div className="space-y-3">
                                {achievements.map((achievement, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
                                    >
                                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                            <achievement.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{achievement.title}</p>
                                            <p className="text-xs text-gray-600">{achievement.year}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="bg-white rounded-xl shadow-lg p-4"
                                >
                                    <div className={`bg-gradient-to-r ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                                        <stat.icon className="text-white" size={20} />
                                    </div>
                                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* About */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <User className="text-blue-600" size={20} />
                                About
                            </h3>
                            {!isEditing ? (
                                <p className="text-gray-700">{profile.bio}</p>
                            ) : (
                                <textarea
                                    value={tempProfile.bio}
                                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                                    rows={4}
                                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none"
                                />
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Mail className="text-indigo-600" size={20} />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                                        <Mail className="text-blue-600" size={20} />
                                    </div>
                                    {!isEditing ? (
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium truncate">{profile.email}</p>
                                        </div>
                                    ) : (
                                        <input
                                            type="email"
                                            value={tempProfile.email}
                                            onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                            className="flex-1 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                                        <Phone className="text-green-600" size={20} />
                                    </div>
                                    {!isEditing ? (
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{profile.phone}</p>
                                        </div>
                                    ) : (
                                        <input
                                            type="tel"
                                            value={tempProfile.phone}
                                            onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                            className="flex-1 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                                        <MapPin className="text-purple-600" size={20} />
                                    </div>
                                    {!isEditing ? (
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="font-medium">{profile.location}</p>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={tempProfile.location}
                                            onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                                            className="flex-1 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Briefcase className="text-purple-600" size={20} />
                                Professional Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-600 mb-1 block">Education</label>
                                    {!isEditing ? (
                                        <p className="font-medium">{profile.education}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            value={tempProfile.education}
                                            onChange={(e) => setTempProfile({ ...tempProfile, education: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 mb-1 block">Specialization</label>
                                    {!isEditing ? (
                                        <p className="font-medium">{profile.specialization}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            value={tempProfile.specialization}
                                            onChange={(e) => setTempProfile({ ...tempProfile, specialization: e.target.value })}
                                            className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} />
                                    <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Globe className="text-blue-600" size={20} />
                                Online Presence
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                                        <ExternalLink className="text-blue-600" size={20} />
                                    </div>
                                    {!isEditing ? (
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600">Website</p>
                                            <a href={`https://${profile.website}`} className="font-medium text-blue-600 hover:underline truncate block">
                                                {profile.website}
                                            </a>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={tempProfile.website}
                                            onChange={(e) => setTempProfile({ ...tempProfile, website: e.target.value })}
                                            className="flex-1 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                                        <ExternalLink className="text-indigo-600" size={20} />
                                    </div>
                                    {!isEditing ? (
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600">LinkedIn</p>
                                            <a href={`https://${profile.linkedin}`} className="font-medium text-blue-600 hover:underline truncate block">
                                                {profile.linkedin}
                                            </a>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={tempProfile.linkedin}
                                            onChange={(e) => setTempProfile({ ...tempProfile, linkedin: e.target.value })}
                                            className="flex-1 border-2 border-gray-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Avatar Modal */}
            {showAvatarModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowAvatarModal(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Change Avatar</h3>
                                    <button onClick={() => setShowAvatarModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <img
                                        src={profile.avatar}
                                        alt="Current avatar"
                                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAvatarChange}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        <Camera size={18} /> Upload New Photo
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    )
}

export default TeacherProfile