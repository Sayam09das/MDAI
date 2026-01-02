import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    BookOpen,
    Upload,
    X,
    Save,
    ArrowLeft,
    Image as ImageIcon,
    DollarSign,
    Tag,
    FileText,
    Eye,
    Sparkles,
    CheckCircle,
    AlertCircle,
    Trash2,
    Camera,
    Edit3,
    Clock,
    Users,
    Star,
    TrendingUp,
    Zap,
} from "lucide-react"

const CreateCourse = () => {
    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Development",
        thumbnail: null,
        duration: "",
        level: "Beginner",
        language: "English",
        requirements: [],
        learningOutcomes: [],
        instructor: "John Doe",
    })

    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [currentRequirement, setCurrentRequirement] = useState("")
    const [currentOutcome, setCurrentOutcome] = useState("")
    const [showPreview, setShowPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("basic")
    const fileInputRef = useRef(null)

    const categories = [
        { value: "Development", icon: "💻", color: "from-blue-500 to-cyan-500" },
        { value: "Data Science", icon: "📊", color: "from-green-500 to-emerald-500" },
        { value: "Design", icon: "🎨", color: "from-purple-500 to-pink-500" },
        { value: "Business", icon: "💼", color: "from-yellow-500 to-orange-500" },
        { value: "Marketing", icon: "📢", color: "from-red-500 to-rose-500" },
        { value: "Photography", icon: "📷", color: "from-indigo-500 to-violet-500" },
    ]

    const levels = ["Beginner", "Intermediate", "Advanced", "Expert"]
    const languages = ["English", "Spanish", "French", "German", "Mandarin", "Japanese"]

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5000000) {
                toast.error("⚠️ File size should be less than 5MB", {
                    position: "top-center",
                    autoClose: 3000,
                })
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setThumbnailPreview(reader.result)
                setCourseData({ ...courseData, thumbnail: file })
                toast.success("✅ Thumbnail uploaded successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const removeThumbnail = () => {
        setThumbnailPreview(null)
        setCourseData({ ...courseData, thumbnail: null })
        toast.info("🗑️ Thumbnail removed", {
            position: "bottom-left",
            autoClose: 2000,
        })
    }

    const addRequirement = () => {
        if (currentRequirement.trim()) {
            setCourseData({
                ...courseData,
                requirements: [...courseData.requirements, currentRequirement.trim()],
            })
            setCurrentRequirement("")
            toast.success("✅ Requirement added", {
                position: "bottom-right",
                autoClose: 1500,
            })
        }
    }

    const removeRequirement = (index) => {
        setCourseData({
            ...courseData,
            requirements: courseData.requirements.filter((_, i) => i !== index),
        })
    }

    const addOutcome = () => {
        if (currentOutcome.trim()) {
            setCourseData({
                ...courseData,
                learningOutcomes: [...courseData.learningOutcomes, currentOutcome.trim()],
            })
            setCurrentOutcome("")
            toast.success("✅ Learning outcome added", {
                position: "bottom-right",
                autoClose: 1500,
            })
        }
    }

    const removeOutcome = (index) => {
        setCourseData({
            ...courseData,
            learningOutcomes: courseData.learningOutcomes.filter((_, i) => i !== index),
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!courseData.title.trim()) {
            toast.error("❌ Course title is required", {
                position: "top-center",
                autoClose: 3000,
            })
            return
        }

        if (!courseData.description.trim()) {
            toast.error("❌ Course description is required", {
                position: "top-center",
                autoClose: 3000,
            })
            return
        }

        if (!courseData.price) {
            toast.error("❌ Course price is required", {
                position: "top-center",
                autoClose: 3000,
            })
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.success("🎉 Course created successfully!", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        })

        setIsSubmitting(false)

        // Reset form (optional)
        // setCourseData({ ... reset to initial state })
    }

    const handleSaveDraft = () => {
        toast.info("💾 Course saved as draft", {
            position: "bottom-center",
            autoClose: 3000,
        })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white shadow-md sticky top-0 z-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    <BookOpen className="text-indigo-600" size={28} />
                                    Create New Course
                                </h1>
                                <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                                    Share your knowledge with students worldwide
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 sm:gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowPreview(true)}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                                <Eye size={18} /> Preview
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSaveDraft}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors font-medium"
                            >
                                <Save size={18} /> <span className="hidden sm:inline">Draft</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Form */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Tabs */}
                        <motion.div variants={itemVariants} className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-2">
                            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                                {[
                                    { id: "basic", label: "Basic Info", icon: FileText },
                                    { id: "details", label: "Details", icon: Edit3 },
                                    { id: "media", label: "Media", icon: ImageIcon },
                                ].map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                                                : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                    >
                                        <tab.icon size={18} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Basic Info Tab */}
                        <AnimatePresence mode="wait">
                            {activeTab === "basic" && (
                                <motion.div
                                    key="basic"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Sparkles size={16} className="text-indigo-600" />
                                            Course Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={courseData.title}
                                            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                            placeholder="e.g., Complete Web Development Bootcamp"
                                            className="w-full border-2 border-gray-200 rounded-lg p-3 sm:p-4 focus:border-indigo-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            {courseData.title.length}/100 characters
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                            <FileText size={16} className="text-indigo-600" />
                                            Course Description *
                                        </label>
                                        <textarea
                                            value={courseData.description}
                                            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                            placeholder="Describe what students will learn in this course..."
                                            rows={6}
                                            className="w-full border-2 border-gray-200 rounded-lg p-3 sm:p-4 focus:border-indigo-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            {courseData.description.length}/500 characters
                                        </p>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                                <DollarSign size={16} className="text-green-600" />
                                                Course Price *
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    value={courseData.price}
                                                    onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                                                    placeholder="99.99"
                                                    className="w-full border-2 border-gray-200 rounded-lg pl-8 pr-4 py-3 sm:py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                                <Tag size={16} className="text-purple-600" />
                                                Category *
                                            </label>
                                            <select
                                                value={courseData.category}
                                                onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 sm:py-4 focus:border-indigo-500 focus:outline-none transition-colors"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.icon} {cat.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Details Tab */}
                            {activeTab === "details" && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 space-y-6"
                                >
                                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                                <Clock size={16} className="text-blue-600" />
                                                Duration
                                            </label>
                                            <input
                                                type="text"
                                                value={courseData.duration}
                                                onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                                                placeholder="e.g., 40 hours"
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-orange-600" />
                                                Level
                                            </label>
                                            <select
                                                value={courseData.level}
                                                onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors"
                                            >
                                                {levels.map((level) => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                                🌐 Language
                                            </label>
                                            <select
                                                value={courseData.language}
                                                onChange={(e) => setCourseData({ ...courseData, language: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors"
                                            >
                                                {languages.map((lang) => (
                                                    <option key={lang} value={lang}>{lang}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                                            <CheckCircle size={16} className="text-green-600" />
                                            Requirements
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={currentRequirement}
                                                onChange={(e) => setCurrentRequirement(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                                                placeholder="Add a requirement..."
                                                className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={addRequirement}
                                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
                                            >
                                                Add
                                            </motion.button>
                                        </div>
                                        <div className="space-y-2">
                                            {courseData.requirements.map((req, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
                                                >
                                                    <span className="text-sm">{req}</span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeRequirement(idx)}
                                                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                                                    >
                                                        <X size={16} />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Star size={16} className="text-yellow-600" />
                                            Learning Outcomes
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={currentOutcome}
                                                onChange={(e) => setCurrentOutcome(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && addOutcome()}
                                                placeholder="What will students learn?"
                                                className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={addOutcome}
                                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
                                            >
                                                Add
                                            </motion.button>
                                        </div>
                                        <div className="space-y-2">
                                            {courseData.learningOutcomes.map((outcome, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="flex items-center justify-between bg-purple-50 p-3 rounded-lg"
                                                >
                                                    <span className="text-sm">{outcome}</span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeOutcome(idx)}
                                                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                                                    >
                                                        <X size={16} />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Media Tab */}
                            {activeTab === "media" && (
                                <motion.div
                                    key="media"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Camera size={16} className="text-indigo-600" />
                                            Course Thumbnail *
                                        </label>

                                        {!thumbnailPreview ? (
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                                            >
                                                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                                                <p className="text-lg font-medium mb-2">Click to upload thumbnail</p>
                                                <p className="text-sm text-gray-500">
                                                    PNG, JPG or WEBP (Max 5MB)
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Recommended: 1280x720px
                                                </p>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleThumbnailChange}
                                                    className="hidden"
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative group"
                                            >
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail preview"
                                                    className="w-full h-64 sm:h-80 object-cover rounded-xl"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                                                    >
                                                        <Edit3 size={16} /> Change
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={removeThumbnail}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                                                    >
                                                        <Trash2 size={16} /> Remove
                                                    </motion.button>
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleThumbnailChange}
                                                    className="hidden"
                                                />
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Zap size={18} className="text-indigo-600" />
                                            Pro Tips for Thumbnails
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                Use high-quality, clear images that represent your course
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                Include text overlay with course title or key benefit
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                Use contrasting colors to make your thumbnail stand out
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                Maintain consistency with your brand colors
                                            </li>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Sparkles className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle />
                                        Publish Course
                                    </>
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSaveDraft}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                            >
                                <Save />
                                Save as Draft
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Right Column – Live Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block"
                    >
                        <div className="sticky top-28 bg-white rounded-2xl shadow-xl overflow-hidden">
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="preview"
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                    <ImageIcon size={48} className="text-gray-400" />
                                </div>
                            )}

                            <div className="p-6 space-y-4">
                                <h3 className="text-lg font-bold">
                                    {courseData.title || "Course Title"}
                                </h3>

                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {courseData.description || "Course description preview..."}
                                </p>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} /> 0 students
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star size={14} /> New
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t">
                                    <span className="text-xl font-bold text-indigo-600">
                                        ${courseData.price || "0.00"}
                                    </span>
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                        {courseData.level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPreview(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
                                {thumbnailPreview && (
                                    <img
                                        src={thumbnailPreview}
                                        alt="preview"
                                        className="w-full h-64 object-cover"
                                    />
                                )}

                                <div className="p-6 space-y-4">
                                    <h2 className="text-2xl font-bold">
                                        {courseData.title || "Course Title"}
                                    </h2>

                                    <p className="text-gray-700">
                                        {courseData.description || "Course description..."}
                                    </p>

                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                            {courseData.category}
                                        </span>
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                                            {courseData.level}
                                        </span>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                            {courseData.language}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-semibold"
                                    >
                                        Close Preview
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CreateCourse                                