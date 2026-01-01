import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Upload,
    X,
    Save,
    ImageIcon,
    DollarSign,
    Tag,
    FileText,
    BookOpen
} from 'lucide-react';

const CreateCourse = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        thumbnail: null
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const categories = [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'UI/UX Design',
        'Digital Marketing',
        'Business',
        'Photography',
        'Music',
        'Language Learning'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setFormData(prev => ({ ...prev, thumbnail: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
            toast.success('Thumbnail uploaded successfully!');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const fakeEvent = { target: { files: [file] } };
            handleFileChange(fakeEvent);
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
        setThumbnailPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.info('Thumbnail removed');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Please enter a course title');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Please enter a course description');
            return;
        }
        if (!formData.price) {
            toast.error('Please enter a course price');
            return;
        }
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }
        if (!formData.thumbnail) {
            toast.error('Please upload a thumbnail');
            return;
        }

        toast.success('Course created successfully! 🎉', {
            position: "top-center",
            autoClose: 3000,
        });

        console.log('Course Data:', formData);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8 sm:px-6 lg:px-8">
            <ToastContainer />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create New Course</h1>
                    <p className="text-gray-600">Fill in the details to create your course</p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10"
                >
                    <div className="space-y-6">
                        {/* Title */}
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <BookOpen className="w-4 h-4" />
                                Course Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter course title"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FileText className="w-4 h-4" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your course"
                                rows="5"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            />
                        </motion.div>

                        {/* Price and Category Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <motion.div variants={itemVariants}>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    Price (USD)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </motion.div>

                            {/* Category */}
                            <motion.div variants={itemVariants}>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Tag className="w-4 h-4" />
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </motion.div>
                        </div>

                        {/* Thumbnail Upload */}
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <ImageIcon className="w-4 h-4" />
                                Course Thumbnail
                            </label>

                            {!thumbnailPreview ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all ${isDragging
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-semibold text-purple-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500">PNG, JPG or WEBP (max. 5MB)</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative rounded-lg overflow-hidden group"
                                >
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="w-full h-64 sm:h-80 object-cover"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={removeThumbnail}
                                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transition-opacity"
                                        >
                                            Change Image
                                        </motion.button>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleSubmit}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Save className="w-5 h-5" />
                                Create Course
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CreateCourse;