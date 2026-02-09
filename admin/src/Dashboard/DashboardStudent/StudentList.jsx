import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    ChevronRight, 
    Users, 
    Search, 
    RefreshCw,
    Mail,
    Phone,
    Calendar,
    Eye,
    CheckCircle,
    AlertCircle,
    UserCheck,
    UserX,
    Loader2,
    ShieldAlert
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
    const [actionLoading, setActionLoading] = useState({}); // Track per-student actions
    const [showConfirmModal, setShowConfirmModal] = useState(null); // { type: 'suspend'|'resume', student }

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchQuery,
                status: statusFilter
            });
            
            const res = await fetch(`${BACKEND_URL}/api/admin/users/students?${params}`, getAuthHeaders());
            const result = await res.json();
            
            if (result.success) {
                setStudents(result.users || []);
                setTotalStudents(result.pagination?.total || 0);
                setTotalPages(result.pagination?.pages || 0);
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
    }, [currentPage, statusFilter]);

    // Filter students locally for search
    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
    });

    // Handle suspend student
    const handleSuspendStudent = async (studentId) => {
        setActionLoading(prev => ({ ...prev, [studentId]: 'suspend' }));
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/students/${studentId}/suspend`, {
                method: 'PATCH',
                ...getAuthHeaders()
            });
            
            const result = await res.json();
            
            if (result.success) {
                toast.success(`Student suspended successfully`);
                // Update local state
                setStudents(prev => prev.map(s => 
                    s._id === studentId ? { ...s, isSuspended: true } : s
                ));
            } else {
                toast.error(result.message || 'Failed to suspend student');
            }
        } catch (error) {
            console.error('Suspend error:', error);
            toast.error('Failed to suspend student');
        } finally {
            setActionLoading(prev => ({ ...prev, [studentId]: null }));
            setShowConfirmModal(null);
        }
    };

    // Handle resume student
    const handleResumeStudent = async (studentId) => {
        setActionLoading(prev => ({ ...prev, [studentId]: 'resume' }));
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/students/${studentId}/resume`, {
                method: 'PATCH',
                ...getAuthHeaders()
            });
            
            const result = await res.json();
            
            if (result.success) {
                toast.success(`Student activated successfully`);
                // Update local state
                setStudents(prev => prev.map(s => 
                    s._id === studentId ? { ...s, isSuspended: false } : s
                ));
            } else {
                toast.error(result.message || 'Failed to activate student');
            }
        } catch (error) {
            console.error('Resume error:', error);
            toast.error('Failed to activate student');
        } finally {
            setActionLoading(prev => ({ ...prev, [studentId]: null }));
            setShowConfirmModal(null);
        }
    };

    const getStatusBadge = (isSuspended) => {
        if (isSuspended) {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                    <UserX className="w-3 h-3" /> Suspended
                </span>
            );
        }
        return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                <UserCheck className="w-3 h-3" /> Active
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

    const getActionButtons = (student) => {
        const isLoading = actionLoading[student._id];
        const isSuspended = student.isSuspended;
        
        return (
            <div className="flex items-center gap-2">
                {isSuspended ? (
                    <button
                        onClick={() => setShowConfirmModal({ type: 'resume', student })}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading === 'resume' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <UserCheck className="w-3 h-3" />
                        )}
                        Resume
                    </button>
                ) : (
                    <button
                        onClick={() => setShowConfirmModal({ type: 'suspend', student })}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading === 'suspend' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <UserX className="w-3 h-3" />
                        )}
                        Suspend
                    </button>
                )}
            </div>
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
                                Manage student accounts and permissions ({totalStudents} total)
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
                                ) : filteredStudents.length > 0 ? (
                                    filteredStudents.map((student, index) => (
                                        <motion.tr
                                            key={student._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`hover:bg-slate-50 transition-colors ${student.isSuspended ? 'bg-red-50/30' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-500">
                                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${student.isSuspended ? 'bg-red-100 text-red-600' : 'bg-indigo-600 text-white'}`}>
                                                        {student.fullName?.charAt(0) || student.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {student.fullName || student.name || 'Unknown'}
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
                                                {getActionButtons(student)}
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

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                showConfirmModal.type === 'suspend' ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                                {showConfirmModal.type === 'suspend' ? (
                                    <UserX className="w-6 h-6 text-red-600" />
                                ) : (
                                    <UserCheck className="w-6 h-6 text-green-600" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {showConfirmModal.type === 'suspend' ? 'Suspend Student?' : 'Resume Student?'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {showConfirmModal.type === 'suspend' 
                                        ? 'This will prevent the student from logging in.'
                                        : 'This will allow the student to access their account again.'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                            <p className="font-medium text-slate-900">
                                {showConfirmModal.student.fullName || showConfirmModal.student.name}
                            </p>
                            <p className="text-sm text-slate-600">
                                {showConfirmModal.student.email}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(null)}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (showConfirmModal.type === 'suspend') {
                                        handleSuspendStudent(showConfirmModal.student._id);
                                    } else {
                                        handleResumeStudent(showConfirmModal.student._id);
                                    }
                                }}
                                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                                    showConfirmModal.type === 'suspend'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {showConfirmModal.type === 'suspend' ? 'Yes, Suspend' : 'Yes, Resume'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// Add handlePageChange function
const handlePageChange = (page) => {
    const statusFilter = document.querySelector('select')?.value || 'all';
    // This will be handled by the component's state
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default StudentList;

