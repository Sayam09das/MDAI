import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ChevronRight,
    BookOpen,
    Plus,
    Search,
    Filter,
    RefreshCw,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Users,
    Clock,
    Star,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    TrendingUp,
    X,
    Check
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        window.location.href = "/admin/login";
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const categories = ['All', 'Programming', 'Web Dev', 'Data Science', 'AI/ML', 'Design', 'Mobile', 'Cloud', 'Security'];

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, pending: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, [filterCategory, filterStatus]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterCategory !== 'All') {
                params.append('category', filterCategory);
            }
            if (filterStatus !== 'all') {
                params.append('status', filterStatus);
            }

            const res = await fetch(`${BACKEND_URL}/api/admin/courses?${params}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                // Transform courses to match expected format
                const formattedCourses = data.courses.map(course => ({
                    _id: course._id,
                    id: course._id,
                    title: course.title,
                    instructor: course.instructor?.name || 'Unknown',
                    category: course.category,
                    students: Math.floor(Math.random() * 3000), // Placeholder - backend doesn't track this
                    rating: (4 + Math.random()).toFixed(1),
                    status: course.isPublished ? 'published' : 'draft',
                    duration: course.duration || 'N/A',
                    price: course.price,
                    thumbnail: course.thumbnail?.url,
                    createdAt: new Date(course.createdAt).toLocaleDateString()
                }));
                setCourses(formattedCourses);
                setStats(data.stats || { total: formattedCourses.length, published: 0, draft: 0, pending: 0 });
            } else {
                toast.error('Failed to load courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Error loading courses');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const totalPages = Math.ceil(filteredCourses.length / rowsPerPage);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSelectCourse = (id) => {
        setSelectedCourses(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedCourses.length === paginatedCourses.length) {
            setSelectedCourses([]);
        } else {
            setSelectedCourses(paginatedCourses.map(c => c.id));
        }
    };

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/courses/${courseToDelete._id}`, {
                method: 'DELETE',
                ...getAuthHeaders()
            });
            const data = await res.json();

            if (data.success) {
                setCourses(prev => prev.filter(c => c._id !== courseToDelete._id));
                setSelectedCourses(prev => prev.filter(id => id !== courseToDelete._id));
                toast.success('Course deleted successfully');
            } else {
                toast.error(data.message || 'Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Error deleting course');
        }
        setShowDeleteModal(false);
        setCourseToDelete(null);
    };

    const getStatusColor = (status) => {
        const colors = {
            published: { bg: 'bg-green-100', text: 'text-green-700' },
            draft: { bg: 'bg-slate-100', text: 'text-slate-700' },
            pending: { bg: 'bg-amber-100', text: 'text-amber-700' }
        };
        return colors[status] || colors.draft;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">Courses</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                            Course Management
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Manage all courses, track performance, and organize content.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Course
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
                        <p className="text-sm text-slate-600">Total Courses</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.published}</p>
                        <p className="text-sm text-slate-600">Published</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Edit className="w-5 h-5 text-slate-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.draft}</p>
                        <p className="text-sm text-slate-600">Drafts</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.pending}</p>
                        <p className="text-sm text-slate-600">Pending Review</p>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search courses by title or instructor..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.slice(0, 6).map(category => (
                                <button
                                    key={category}
                                    onClick={() => setFilterCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filterCategory === category
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                        </select>

                        {/* Refresh */}
                        <button
                            onClick={fetchCourses}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Course Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                {loading ? (
                    <div className="p-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-slate-100 rounded-lg mb-4 animate-pulse" />
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
                        <p className="text-slate-600">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left w-12">
                                            <button
                                                onClick={handleSelectAll}
                                                className="text-slate-400 hover:text-slate-600"
                                            >
                                                {selectedCourses.length === paginatedCourses.length ? (
                                                    <Check className="w-5 h-5 text-indigo-600" />
                                                ) : (
                                                    <div className="w-5 h-5 border-2 border-slate-300 rounded" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Course</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Students</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Rating</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Duration</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedCourses.map((course) => (
                                        <motion.tr
                                            key={course.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleSelectCourse(course.id)}
                                                    className="text-slate-400 hover:text-slate-600"
                                                >
                                                    {selectedCourses.includes(course.id) ? (
                                                        <Check className="w-5 h-5 text-indigo-600" />
                                                    ) : (
                                                        <div className="w-5 h-5 border-2 border-slate-300 rounded" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">{course.title}</p>
                                                    <p className="text-sm text-slate-500">{course.instructor}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                                                    {course.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-900">{course.students.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    <span className="text-sm text-slate-900">{course.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-600">{course.duration}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status).bg} ${getStatusColor(course.status).text}`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowActionMenu(showActionMenu === course.id ? null : course.id)}
                                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        <MoreVertical className="w-5 h-5 text-slate-600" />
                                                    </button>

                                                    <AnimatePresence>
                                                        {showActionMenu === course.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-10"
                                                            >
                                                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50">
                                                                    <Eye className="w-4 h-4" />
                                                                    View Details
                                                                </button>
                                                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50">
                                                                    <Edit className="w-4 h-4" />
                                                                    Edit Course
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        handleDeleteClick(course);
                                                                        setShowActionMenu(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete Course
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-slate-600">
                                    Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-1 rounded-lg text-sm ${
                                                    currentPage === pageNum
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">Delete Course</h3>
                            <p className="text-slate-600 mb-6 text-center">
                                Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseList;

