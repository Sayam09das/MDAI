import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Video, Download, Eye, Search, Filter, X, Star,
  Clock, Calendar, Folder, Grid, List, SortAsc, SortDesc,
  Play, Pause, BookOpen, Archive, Link, Image, Music,
  Code, Zap, TrendingUp, Award, CheckCircle2, Heart,
  Share2, MoreVertical, ChevronDown, ChevronRight, FolderOpen,
  File, ExternalLink, Bookmark, Headphones, FileCode
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentResources = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [savedResources, setSavedResources] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState([1]);
  const [selectedResource, setSelectedResource] = useState(null);

  const resources = {
    folders: [
      {
        id: 1,
        name: "Advanced React & Next.js",
        course: "Web Development",
        items: [
          {
            id: 1,
            title: "React 18 New Features Guide",
            type: "pdf",
            size: "2.4 MB",
            pages: 24,
            uploadDate: "2026-01-08",
            views: 1234,
            downloads: 456,
            rating: 4.8,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
            description: "Comprehensive guide to React 18's concurrent features",
            tags: ["React", "JavaScript", "Frontend"]
          },
          {
            id: 2,
            title: "Next.js Server Components Deep Dive",
            type: "video",
            duration: "45:32",
            size: "156 MB",
            uploadDate: "2026-01-07",
            views: 2341,
            downloads: 234,
            rating: 4.9,
            thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=300&h=200&fit=crop",
            description: "Master server components in Next.js 14",
            tags: ["Next.js", "React", "SSR"]
          },
          {
            id: 3,
            title: "Performance Optimization Checklist",
            type: "pdf",
            size: "1.8 MB",
            pages: 12,
            uploadDate: "2026-01-06",
            views: 892,
            downloads: 321,
            rating: 4.7,
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
            description: "Essential tips for optimizing React applications",
            tags: ["Performance", "React", "Optimization"]
          },
          {
            id: 4,
            title: "Custom Hooks Workshop Recording",
            type: "video",
            duration: "1:23:45",
            size: "287 MB",
            uploadDate: "2026-01-05",
            views: 1567,
            downloads: 445,
            rating: 5.0,
            thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop",
            description: "Live workshop on creating reusable custom hooks",
            tags: ["Hooks", "React", "Workshop"]
          }
        ]
      },
      {
        id: 2,
        name: "Machine Learning Essentials",
        course: "Data Science",
        items: [
          {
            id: 5,
            title: "Python for Data Science Cheat Sheet",
            type: "pdf",
            size: "3.2 MB",
            pages: 8,
            uploadDate: "2026-01-08",
            views: 3421,
            downloads: 1234,
            rating: 4.9,
            thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop",
            description: "Quick reference for Python data science libraries",
            tags: ["Python", "Data Science", "Reference"]
          },
          {
            id: 6,
            title: "Neural Networks Fundamentals",
            type: "video",
            duration: "56:18",
            size: "198 MB",
            uploadDate: "2026-01-07",
            views: 2876,
            downloads: 567,
            rating: 4.8,
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
            description: "Understanding neural networks from scratch",
            tags: ["ML", "Neural Networks", "AI"]
          },
          {
            id: 7,
            title: "Jupyter Notebook Templates",
            type: "code",
            size: "245 KB",
            uploadDate: "2026-01-06",
            views: 1543,
            downloads: 892,
            rating: 4.6,
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
            description: "Ready-to-use Jupyter notebook templates",
            tags: ["Jupyter", "Python", "Templates"]
          }
        ]
      },
      {
        id: 3,
        name: "UX/UI Design Resources",
        course: "Design",
        items: [
          {
            id: 8,
            title: "Design System Component Library",
            type: "file",
            size: "45 MB",
            uploadDate: "2026-01-08",
            views: 2134,
            downloads: 678,
            rating: 4.9,
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
            description: "Complete Figma design system with 200+ components",
            tags: ["Figma", "Design System", "UI"]
          },
          {
            id: 9,
            title: "Color Theory Masterclass",
            type: "video",
            duration: "38:45",
            size: "134 MB",
            uploadDate: "2026-01-07",
            views: 1876,
            downloads: 432,
            rating: 4.7,
            thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=200&fit=crop",
            description: "Master color theory for modern UI design",
            tags: ["Color Theory", "Design", "UI"]
          },
          {
            id: 10,
            title: "Typography Best Practices",
            type: "pdf",
            size: "4.1 MB",
            pages: 18,
            uploadDate: "2026-01-06",
            views: 1432,
            downloads: 543,
            rating: 4.8,
            thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop",
            description: "Comprehensive guide to typography in web design",
            tags: ["Typography", "Design", "Web"]
          }
        ]
      }
    ]
  };

  const categories = [
    { value: 'all', label: 'All Resources', icon: Folder },
    { value: 'pdf', label: 'PDFs', icon: FileText },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'code', label: 'Code', icon: Code },
    { value: 'file', label: 'Files', icon: File }
  ];

  const courses = ['all', 'Web Development', 'Data Science', 'Design'];

  useEffect(() => {
    toast.info(
      <div className="flex items-center gap-2">
        <Folder className="w-5 h-5" />
        <div>
          <div className="font-semibold">Resource Library Ready</div>
          <div className="text-sm opacity-90">Access all your course materials</div>
        </div>
      </div>,
      {
        position: window.innerWidth < 768 ? "top-center" : "top-right",
        autoClose: 3000,
      }
    );
  }, []);

  const handleDownload = (resource) => {
    toast.success(
      <div className="flex items-center gap-2">
        <Download className="w-5 h-5" />
        <div>
          <div className="font-semibold">Download Started</div>
          <div className="text-sm opacity-90">{resource.title}</div>
        </div>
      </div>,
      {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 2000,
      }
    );
  };

  const handleView = (resource) => {
    setSelectedResource(resource);
    toast.info(
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5" />
        <span>Opening {resource.type === 'video' ? 'video' : 'document'}...</span>
      </div>,
      {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 1500,
      }
    );
  };

  const handleSave = (resourceId) => {
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter(id => id !== resourceId));
      toast.info('Removed from saved', {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 2000,
      });
    } else {
      setSavedResources([...savedResources, resourceId]);
      toast.success(
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5" />
          <span>Saved to your library</span>
        </div>,
        {
          position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
          autoClose: 2000,
        }
      );
    }
  };

  const handleShare = (resource) => {
    toast.success(
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5" />
        <span>Share link copied!</span>
      </div>,
      {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 2000,
      }
    );
  };

  const toggleFolder = (folderId) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter(id => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'code':
        return <FileCode className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'text-red-600 bg-red-100';
      case 'video':
        return 'text-blue-600 bg-blue-100';
      case 'code':
        return 'text-green-600 bg-green-100';
      case 'audio':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredResources = resources.folders
    .filter(folder => selectedCourse === 'all' || folder.course === selectedCourse)
    .map(folder => ({
      ...folder,
      items: folder.items.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
    }))
    .filter(folder => folder.items.length > 0);

  const allResources = filteredResources.flatMap(folder => folder.items);

  const sortedResources = [...allResources].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalStats = {
    pdfs: allResources.filter(r => r.type === 'pdf').length,
    videos: allResources.filter(r => r.type === 'video').length,
    code: allResources.filter(r => r.type === 'code').length,
    files: allResources.filter(r => r.type === 'file').length,
    total: allResources.length
  };

  const ResourceCard = ({ resource, index }) => {
    const isSaved = savedResources.includes(resource.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="relative">
          <img 
            src={resource.thumbnail}
            alt={resource.title}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${getTypeColor(resource.type)}`}>
              {getTypeIcon(resource.type)}
              <span className="capitalize">{resource.type}</span>
            </div>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => handleSave(resource.id)}
              className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>
            <button
              onClick={() => handleShare(resource)}
              className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            {resource.duration && (
              <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                <Clock className="w-3 h-3" />
                {resource.duration}
              </div>
            )}
            {resource.pages && (
              <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                <FileText className="w-3 h-3" />
                {resource.pages} pages
              </div>
            )}
            <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm text-white rounded-lg text-xs font-semibold ml-auto">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {resource.rating}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {resource.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {resource.views.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {resource.downloads}
              </div>
            </div>
            <span>{resource.size}</span>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleView(resource)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Eye className="w-4 h-4" />
              View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload(resource)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ResourceListItem = ({ resource, index }) => {
    const isSaved = savedResources.includes(resource.id);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex items-center gap-4"
      >
        <img 
          src={resource.thumbnail}
          alt={resource.title}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <div className={`p-1.5 rounded-lg ${getTypeColor(resource.type)}`}>
              {getTypeIcon(resource.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{resource.title}</h3>
              <p className="text-sm text-gray-600 truncate">{resource.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
            <span>{resource.size}</span>
            {resource.duration && <span>{resource.duration}</span>}
            {resource.pages && <span>{resource.pages} pages</span>}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {resource.rating}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleSave(resource.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={() => handleView(resource)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </button>
          <button
            onClick={() => handleDownload(resource)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-3 sm:p-6 lg:p-8">
      <ToastContainer 
        position={window.innerWidth < 768 ? "top-center" : "top-right"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16 sm:mt-0"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Resource Library
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Access all your course materials and downloads
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {[
              { icon: Folder, label: 'Total Resources', value: totalStats.total, color: 'blue' },
              { icon: FileText, label: 'PDFs', value: totalStats.pdfs, color: 'red' },
              { icon: Video, label: 'Videos', value: totalStats.videos, color: 'purple' },
              { icon: Code, label: 'Code Files', value: totalStats.code, color: 'green' },
              { icon: Bookmark, label: 'Saved', value: savedResources.length, color: 'yellow' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-lg"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white font-semibold text-gray-700 transition-colors"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name (A-Z)</option>
                </select>

                <div className="flex gap-2 bg-white rounded-xl p-1 shadow">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCourse === course
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }`}
                >
                  {course === 'all' ? 'All Courses' : course}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources Display */}
        <AnimatePresence mode="wait">
          {sortedResources.length > 0 ? (
            viewMode === 'grid' ? (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {sortedResources.map((resource, index) => (
                  <ResourceCard key={resource.id} resource={resource} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {sortedResources.map((resource, index) => (
                  <ResourceListItem key={resource.id} resource={resource} index={index} />
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              key="no-resources"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 sm:py-20"
            >
              <Folder className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resource Preview Modal */}
        <AnimatePresence>
          {selectedResource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedResource(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(selectedResource.type)}`}>
                      {getTypeIcon(selectedResource.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedResource.title}</h3>
                      <p className="text-sm text-gray-600">{selectedResource.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  <img 
                    src={selectedResource.thumbnail}
                    alt={selectedResource.title}
                    className="w-full h-64 sm:h-96 object-cover rounded-xl mb-6"
                  />

                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{selectedResource.description}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Views</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {selectedResource.views.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Downloads</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{selectedResource.downloads}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">Rating</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{selectedResource.rating}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(selectedResource.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDownload(selectedResource)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download {selectedResource.type === 'video' ? 'Video' : 'File'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleShare(selectedResource)}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </motion.button>
                  </div>

                  {selectedResource.type === 'video' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Play className="w-5 h-5" />
                        <span className="font-semibold">
                          Video Duration: {selectedResource.duration}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedResource.pages && (
                    <div className="mt-6 p-4 bg-red-50 rounded-xl">
                      <div className="flex items-center gap-2 text-red-700">
                        <FileText className="w-5 h-5" />
                        <span className="font-semibold">
                          PDF Document: {selectedResource.pages} pages
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Folder View (Alternative) */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Course</h2>
          {filteredResources.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    {expandedFolders.includes(folder.id) ? (
                      <FolderOpen className="w-6 h-6 text-white" />
                    ) : (
                      <Folder className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{folder.name}</h3>
                    <p className="text-sm text-gray-600">
                      {folder.items.length} resources • {folder.course}
                    </p>
                  </div>
                </div>
                {expandedFolders.includes(folder.id) ? (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedFolders.includes(folder.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-200"
                  >
                    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {folder.items.map((resource, idx) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => handleView(resource)}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                                {resource.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>{resource.size}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {resource.rating}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(resource);
                              }}
                              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentResources;