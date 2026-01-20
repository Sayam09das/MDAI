import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit2, Trash2, FileText, Video, Presentation, Upload } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const teacherName = localStorage.getItem("teacherName");
  const token = localStorage.getItem("token");

  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseTitle: "",
    driveLink: "",
    resourceType: "pdf",
  });

  const fetchResources = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/resource/teacher?teacherName=${teacherName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    fd.append("teacherName", teacherName);
    if (thumbnail) fd.append("thumbnail", thumbnail);

    const url = editingId
      ? `${BACKEND_URL}/api/resource/${editingId}`
      : `${BACKEND_URL}/api/resource`;

    const method = editingId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      resetForm();
      fetchResources();
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setThumbnail(null);
    setThumbnailPreview(null);
    setFormData({
      title: "",
      description: "",
      courseTitle: "",
      driveLink: "",
      resourceType: "pdf",
    });
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFormData({
      title: r.title,
      description: r.description,
      courseTitle: r.courseTitle,
      driveLink: r.driveLink,
      resourceType: r.resourceType,
    });
    setThumbnailPreview(r.thumbnail?.url);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await fetch(`${BACKEND_URL}/api/resource/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchResources();
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Teaching Resources
          </h1>
          <p className="text-gray-600">Manage and organize your educational materials</p>
        </motion.div>

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="mb-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Resource
        </motion.button>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={resetForm}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? "Edit Resource" : "Add New Resource"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      placeholder="Resource title"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      placeholder="Describe the resource"
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      name="courseTitle"
                      value={formData.courseTitle}
                      placeholder="Course name"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drive Link
                    </label>
                    <input
                      type="url"
                      name="driveLink"
                      value={formData.driveLink}
                      placeholder="https://drive.google.com/..."
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Type
                    </label>
                    <select
                      name="resourceType"
                      value={formData.resourceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="video">Video</option>
                      <option value="slides">Presentation Slides</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                      {thumbnailPreview ? (
                        <div className="space-y-4">
                          <img
                            src={thumbnailPreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnail(null);
                              setThumbnailPreview(null);
                            }}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="thumbnail-upload"
                          />
                          <label
                            htmlFor="thumbnail-upload"
                            className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Click to upload
                          </label>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      {editingId ? "Update Resource" : "Create Resource"}
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources yet</h3>
            <p className="text-gray-500">Start by adding your first teaching resource</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {resources.map((resource) => (
              <motion.div
                key={resource._id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500">
                  {resource.thumbnail?.url ? (
                    <img
                      src={resource.thumbnail.url}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      {getResourceIcon(resource.resourceType)}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-medium text-indigo-600 flex items-center gap-1">
                    {getResourceIcon(resource.resourceType)}
                    {resource.resourceType.toUpperCase()}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="text-xs text-indigo-600 font-medium mb-4">
                    {resource.courseTitle}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(resource)}
                      className="flex-1 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(resource._id)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherResources;