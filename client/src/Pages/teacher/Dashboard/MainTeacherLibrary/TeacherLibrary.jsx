import React, { useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    BookOpen,
    FileText,
    Video,
    Image,
    File,
    Download,
    Eye,
    Trash2,
    Upload,
    Search,
    Filter,
    ArrowLeft,
    Folder,
    Star,
    Clock,
    Share2,
    Plus,
    Grid,
    List,
    X,
} from "lucide-react"

const TeacherLibrary = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [viewMode, setViewMode] = useState("grid")
    const [selectedFile, setSelectedFile] = useState(null)
    const [showPreviewModal, setShowPreviewModal] = useState(false)

    const [files, setFiles] = useState([
        {
            id: 1,
            name: "React Fundamentals",
            type: "pdf",
            size: "2.5 MB",
            uploadDate: "2025-01-02",
            course: "Full Stack Development",
            downloads: 145,
            views: 320,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
            favorite: true,
        },
        {
            id: 2,
            name: "JavaScript ES6",
            type: "video",
            size: "125 MB",
            uploadDate: "2025-01-01",
            course: "Web Development",
            downloads: 89,
            views: 256,
            thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
            favorite: false,
        },
        {
            id: 3,
            name: "CSS Grid Cheat Sheet",
            type: "image",
            size: "1.2 MB",
            uploadDate: "2024-12-28",
            course: "Frontend Design",
            downloads: 234,
            views: 445,
            thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19",
            favorite: true,
        },
        {
            id: 4,
            name: "Node.js Template",
            type: "zip",
            size: "15 MB",
            uploadDate: "2024-12-25",
            course: "Backend Development",
            downloads: 167,
            views: 289,
            thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
            favorite: false,
        },
        {
            id: 5,
            name: "Database Design",
            type: "pdf",
            size: "3.8 MB",
            uploadDate: "2024-12-20",
            course: "Backend Development",
            downloads: 198,
            views: 367,
            thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
            favorite: true,
        },
        {
            id: 6,
            name: "UI/UX Principles",
            type: "video",
            size: "98 MB",
            uploadDate: "2024-12-15",
            course: "Design",
            downloads: 134,
            views: 298,
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
            favorite: false,
        },
    ])

    const totalFiles = files.length
    const totalSize = files.reduce((sum, f) => {
        const size = parseFloat(f.size)
        return sum + (f.size.includes("MB") ? size : size / 1024)
    }, 0)
    const totalDownloads = files.reduce((sum, f) => sum + f.downloads, 0)
    const favoriteCount = files.filter(f => f.favorite).length

    const getFileIcon = (type) => {
        switch (type) {
            case "pdf": return <FileText className="text-red-600" size={32} />
            case "video": return <Video className="text-blue-600" size={32} />
            case "image": return <Image className="text-green-600" size={32} />
            case "zip": return <Folder className="text-yellow-600" size={32} />
            default: return <File className="text-gray-600" size={32} />
        }
    }

    const getFileColor = (type) => {
        switch (type) {
            case "pdf": return "from-red-500 to-rose-500"
            case "video": return "from-blue-500 to-cyan-500"
            case "image": return "from-green-500 to-emerald-500"
            case "zip": return "from-yellow-500 to-orange-500"
            default: return "from-gray-500 to-slate-500"
        }
    }

    const handleDownload = (file) => {
        toast.success(`📥 Downloading ${file.name}...`, {
            position: "bottom-right",
            autoClose: 2000,
        })
    }

    const handleDelete = (id) => {
        setFiles(files.filter(f => f.id !== id))
        toast.warning("🗑️ File deleted", {
            position: "bottom-left",
            autoClose: 2000,
        })
    }

    const toggleFavorite = (id) => {
        setFiles(files.map(f =>
            f.id === id ? { ...f, favorite: !f.favorite } : f
        ))
        const file = files.find(f => f.id === id)
        toast.info(file.favorite ? "Removed from favorites" : "⭐ Added to favorites", {
            position: "top-center",
            autoClose: 2000,
        })
    }

    const handlePreview = (file) => {
        setSelectedFile(file)
        setShowPreviewModal(true)
    }

    const filteredFiles = files.filter(file => {
        const matchSearch =
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.course.toLowerCase().includes(searchQuery.toLowerCase())
        const matchFilter =
            filterType === "all" ||
            (filterType === "favorites" && file.favorite) ||
            file.type === filterType
        return matchSearch && matchFilter
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-teal-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    <BookOpen className="text-emerald-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Library</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Course materials
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.info("📤 Upload coming soon!")}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                        >
                            <Upload size={20} /> <span className="hidden sm:inline">Upload</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
                >
                    {[
                        { icon: File, label: "Total Files", value: totalFiles, color: "from-blue-500 to-cyan-500" },
                        { icon: Folder, label: "Storage", value: `${totalSize.toFixed(1)} MB`, color: "from-purple-500 to-pink-500" },
                        { icon: Download, label: "Downloads", value: totalDownloads, color: "from-green-500 to-emerald-500" },
                        { icon: Star, label: "Favorites", value: favoriteCount, color: "from-yellow-500 to-orange-500" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                        >
                            <div className={`bg-gradient-to-r ${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3`}>
                                <stat.icon className="text-white" size={20} />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search files..."
                                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2.5 sm:py-3 focus:border-emerald-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {["all", "favorites", "pdf", "video", "image", "zip"].map((f) => (
                                <motion.button
                                    key={f}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterType(f)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg capitalize whitespace-nowrap text-xs sm:text-sm font-medium transition-all ${filterType === f
                                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <Filter size={14} className="inline mr-1" />
                                    {f}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100"}`}
                            >
                                <Grid size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100"}`}
                            >
                                <List size={20} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Files */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={viewMode === "grid"
                        ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                        : "space-y-3 sm:space-y-4"
                    }
                >
                    {filteredFiles.map((file, idx) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden"
                        >
                            {viewMode === "grid" ? (
                                <>
                                    <div className="relative h-40 bg-gray-200">
                                        <img
                                            src={file.thumbnail}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-r ${getFileColor(file.type)} opacity-20`}></div>
                                        <button
                                            onClick={() => toggleFavorite(file.id)}
                                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white"
                                        >
                                            <Star
                                                size={18}
                                                className={file.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                                            />
                                        </button>
                                    </div>

                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`bg-gradient-to-r ${getFileColor(file.type)} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                                {getFileIcon(file.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-base mb-1 line-clamp-2">{file.name}</h3>
                                                <p className="text-sm text-gray-600">{file.course}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(file.uploadDate).toLocaleDateString()}
                                            </span>
                                            <span className="font-medium">{file.size}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} />
                                                {file.views}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Download size={12} />
                                                {file.downloads}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handlePreview(file)}
                                                className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 rounded-lg"
                                            >
                                                <Eye size={14} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDownload(file)}
                                                className="flex items-center justify-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-lg"
                                            >
                                                <Download size={14} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(file.id)}
                                                className="flex items-center justify-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 rounded-lg"
                                            >
                                                <Trash2 size={14} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`bg-gradient-to-r ${getFileColor(file.type)} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                            {getFileIcon(file.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base sm:text-lg mb-1">{file.name}</h3>
                                            <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                                                <span>{file.course}</span>
                                                <span>•</span>
                                                <span>{file.size}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={12} /> {file.views}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Download size={12} /> {file.downloads}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => toggleFavorite(file.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Star
                                                    size={18}
                                                    className={file.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                                                />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handlePreview(file)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDownload(file)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Download size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDelete(file.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredFiles.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-600 mb-2">No files found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>

            {/* Preview Modal */}
            {showPreviewModal && selectedFile && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowPreviewModal(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl"
                        >
                            <div className={`bg-gradient-to-r ${getFileColor(selectedFile.type)} p-6 rounded-t-2xl text-white`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center">
                                            {getFileIcon(selectedFile.type)}
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold mb-1">{selectedFile.name}</h2>
                                            <p className="text-sm opacity-90">{selectedFile.course}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowPreviewModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="bg-gray-100 rounded-xl h-64 mb-6 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={selectedFile.thumbnail}
                                        alt={selectedFile.name}
                                        className="max-h-full rounded-lg"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-600 mb-1">Size</p>
                                        <p className="font-bold">{selectedFile.size}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-600 mb-1">Date</p>
                                        <p className="font-bold">{new Date(selectedFile.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-600 mb-1">Views</p>
                                        <p className="font-bold">{selectedFile.views}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-600 mb-1">Downloads</p>
                                        <p className="font-bold">{selectedFile.downloads}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDownload(selectedFile)}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        <Download size={18} /> Download
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toast.success("🔗 Link copied!")}
                                        className="px-6 py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium flex items-center gap-2"
                                    >
                                        <Share2 size={18} /> Share
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}

            {/* Mobile FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.info("📤 Upload coming soon!")}
                className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40"
            >
                <Plus size={28} />
            </motion.button>
        </div>
    )
}

export default TeacherLibrary