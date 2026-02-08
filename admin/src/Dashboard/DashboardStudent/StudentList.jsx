import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    ChevronRight, 
    Users, 
    Search, 
    Filter, 
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    MoreVertical,
    UserCheck,
    UserX
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        if (window.location.pathname.includes('/admin')) {
            window.location.href = "/admin/login";
        }
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };
};

const ITEMS_PER_PAGE = 20;

const StudentList = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/students`, getAuthHeaders());
            const result = await res.json();
            
            if (result.success) {
                setStudents(result.users || []);
                setTotalStudents(result.users?.length || 0);
                setTotalPages(Math.ceil((result.users?.length || 0) / ITEMS_PER_PAGE));
            } else {
                toast.error('Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Filter students
    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && !student.isSuspended) ||
            (statusFilter === 'suspended' && student.isSuspended);
        
        return matchesSearch && matchesStatus;
    });

    // Paginate
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getStatusBadge = (isSuspended) => {
        if (isSuspended) {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Suspended
                </span>
            );
        }
        return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Active
            </span>
        );
    };

    const getVerifiedBadge = (isVerified) => {
        if (isVerified) {
            return (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3" /> Verified
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 text-amber-600 text-xs">
                <AlertCircle className="w-3 h-3" /> Unverified
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-6"
            >
                <ToastContainer position="top-right" />

                {/* Breadcrumb & Header */}
                <div>
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                        <Home className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-600">Dashboard</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-600">Users</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-indigo-600 font-medium">Students</span>
                    </div>

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                All Students
                            </h1>
                            <p className="text-slate-600">
                                Complete list of all registered students ({totalStudents} total)
                            </p>
                        </div>

                        <button
                            onClick={fetchStudents}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Student List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Verification
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(10)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                                    <div>
                                                        <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                                                        <div className="h-3 bg-slate-200 rounded w-48"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-40"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-20"></div></td>
                                        </tr>
                                    ))
                                ) : paginatedStudents.length > 0 ? (
                                    paginatedStudents.map((student, index) => (
                                        <motion.tr
                                            key={student.id || student._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-500">
                                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                                                        {student.fullName?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {student.fullName || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            ID: {student._id?.substring(0, 8)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        <span>{student.email || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                        <span>{student.phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(student.isSuspended)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getVerifiedBadge(student.isVerified)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">
                                                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>No students found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        // Show only first, last, and around current page
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-slate-600 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return (
                                                <span key={page} className="px-2 text-slate-400">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default StudentList;

