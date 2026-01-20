import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  Presentation,
  ExternalLink,
  Search,
  Filter,
  User,
  GraduationCap,
  Download,
  X
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedResource, setSelectedResource] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/resource`);
      const data = await res.json();
      setResources(data || []);
      setFilteredResources(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by resource type
    if (selectedType !== "all") {
      filtered = filtered.filter((r) => r.resourceType === selectedType);
    }

    setFilteredResources(filtered);
  }, [searchQuery, selectedType, resources]);

  const getResourceIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "slides":
        return <Presentation className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getResourceColor = (type) => {
    switch (type) {
      case "pdf":
        return "from-red-400 to-pink-500";
      case "video":
        return "from-purple-400 to-indigo-500";
      case "slides":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10 md:w-12 md:h-12" />
              <h1 className="text-3xl md:text-5xl font-bold">Learning Resources</h1>
            </div>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl">
              Explore a curated collection of educational materials from your teachers
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources, courses, or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full md:w-48 pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF Documents</option>
                <option value="video">Videos</option>
                <option value="slides">Presentations</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
            />
            <p className="mt-4 text-gray-600 text-lg">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              {searchQuery || selectedType !== "all"
                ? "No resources found"
                : "No resources available"}
            </h3>
            <p className="text-gray-500">
              {searchQuery || selectedType !== "all"
                ? "Try adjusting your search or filters"
                : "Check back later for new materials"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredResources.map((resource) => (
              <motion.div
                key={resource._id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => setSelectedResource(resource)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
              >
                {/* Thumbnail */}
                <div className={`relative h-48 bg-gradient-to-br ${getResourceColor(resource.resourceType)}`}>
                  {resource.thumbnail?.url ? (
                    <img
                      src={resource.thumbnail.url}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="w-16 h-16">
                        {getResourceIcon(resource.resourceType)}
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    {getResourceIcon(resource.resourceType)}
                    <span className="text-gray-700">{resource.resourceType.toUpperCase()}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Course Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span className="text-gray-700 font-medium">{resource.courseTitle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">{resource.teacherName}</span>
                    </div>
                  </div>

                  {/* Open Button */}
                  <motion.a
                    href={resource.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Open Resource
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getResourceIcon(selectedResource.resourceType)}
                    <span className="text-sm font-semibold text-indigo-600 uppercase">
                      {selectedResource.resourceType}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {selectedResource.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Thumbnail */}
                <div className={`relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br ${getResourceColor(selectedResource.resourceType)}`}>
                  {selectedResource.thumbnail?.url ? (
                    <img
                      src={selectedResource.thumbnail.url}
                      alt={selectedResource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="w-24 h-24">
                        {getResourceIcon(selectedResource.resourceType)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedResource.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-600">Course</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedResource.courseTitle}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-600">Teacher</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedResource.teacherName}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.a
                    href={selectedResource.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Open in Drive
                  </motion.a>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="flex-1 sm:flex-initial bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentResources;