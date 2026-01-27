import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ChevronRight,
    Search,
    Filter,
    ArrowUpDown,
    RefreshCw,
    MoreVertical,
    Eye,
    Ban,
    CheckCircle,
    Trash2,
    ChevronLeft,
    AlertTriangle,
    Loader2,
    X,
    CheckSquare,
    Square
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const BASE_URL = import.meta.env.VITE_BACKEND_URL;


// Confirm Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, isDanger = false, isProcessing = false }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                    {/* Icon */}
                    <div className={`p-6 ${isDanger ? 'bg-red-50' : 'bg-slate-50'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-100' : 'bg-slate-100'}`}>
                            <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-red-600' : 'text-slate-600'}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 p-6 bg-slate-50 border-t border-slate-200">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 ${isDanger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{confirmText}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// Action Dropdown Component
const ActionDropdown = ({ student, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { id: 'view', label: 'View Profile', icon: Eye, color: 'text-slate-700' },
        {
            id: student.status === 'active' ? 'suspend' : 'activate',
            label: student.status === 'active' ? 'Suspend Account' : 'Activate Account',
            icon: student.status === 'active' ? Ban : CheckCircle,
            color: student.status === 'active' ? 'text-amber-600' : 'text-green-600'
        },
        { id: 'delete', label: 'Delete Account', icon: Trash2, color: 'text-red-600', isDanger: true }
    ];

    const handleAction = (actionId) => {
        setIsOpen(false);
        onAction(student, actionId);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-20"
                        >
                            {actions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <React.Fragment key={action.id}>
                                        {action.isDanger && index > 0 && (
                                            <div className="border-t border-slate-100" />
                                        )}
                                        <button
                                            onClick={() => handleAction(action.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm ${action.color} hover:bg-slate-50 transition-colors`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{action.label}</span>
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const config = {
        active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Active' },
        suspended: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Suspended' }
    };
    const { bg, text, border, label } = config[status] || config.active;

    return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${text} ${border}`}>
            {label}
        </span>
    );
};

// Student Table Component
const StudentTable = ({ students, selectedStudents, onSelectStudent, onSelectAll, onAction, onSuspend, onResume, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-3 p-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No students found</h3>
                <p className="text-sm text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    const allSelected = students.length > 0 && students.every(s => selectedStudents.includes(s.id));

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-left w-12">
                            <button
                                onClick={() => onSelectAll(!allSelected)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                {allSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Student Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Courses</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {students.map((student, index) => (
                        <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.3 }}
                            className="hover:bg-slate-50 transition-colors"
                        >
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onSelectStudent(student.id)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    {selectedStudents.includes(student.id)
                                        ? <CheckSquare className="w-5 h-5" />
                                        : <Square className="w-5 h-5" />
                                    }
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                        {student.firstName[0]}{student.lastName[0]}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">
                                        {student.firstName} {student.lastName}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                            <td className="px-6 py-4">
                                <div className="group relative inline-block">
                                    <span className="text-sm font-semibold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors">
                                        {student.courseCount || 0}
                                    </span>
                                    {Array.isArray(student.courseNames) && student.courseNames.length > 0 && (
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                            <div className="bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg min-w-[200px] max-w-xs border border-slate-700">
                                                <div className="font-semibold mb-1 text-indigo-300">Enrolled Courses:</div>
                                                <ul className="space-y-1 max-h-32 overflow-y-auto">
                                                    {student.courseNames.map((courseName, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <span className="text-indigo-400 mr-1.5 flex-shrink-0">•</span>
                                                            <span className="text-slate-100">{courseName}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{student.joinedDate}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={student.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    {student.status === 'active' ? (
                                        <button
                                            onClick={() => onSuspend(student.id)}
                                            className="px-3 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
                                        >
                                            Suspend
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onResume(student.id)}
                                            className="px-3 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                                        >
                                            Resume
                                        </button>
                                    )}
                                    <ActionDropdown student={student} onAction={onAction} />
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main Student List Component
const StudentListPreview = () => {
    const navigate = useNavigate();
    const [allStudents, setAllStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, student: null });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                console.error('No admin token found');
                navigate('/admin/login');
                return;
            }

            const res = await axios.get(
                `${BASE_URL}/api/auth/students`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('API Response:', res.data); // Debug log

            const formattedStudents = res.data.students.map((student) => {
                // Split full name properly
                const nameParts = student.fullName?.trim().split(' ') || ['Unknown', 'User'];
                const firstName = nameParts[0] || 'Unknown';
                const lastName = nameParts.slice(1).join(' ') || 'User';

                console.log('Student course data:', {
                    id: student._id,
                    courseCount: student.courseCount,
                    courseNames: student.courseNames
                }); // Debug log

                return {
                    id: student._id,
                    firstName,
                    lastName,
                    email: student.email,
                    status: student.isSuspended ? 'suspended' : 'active',
                    joinedDate: new Date(student.createdAt).toLocaleDateString(),
                    courseCount: student.courseCount || 0,
                    courseNames: Array.isArray(student.courseNames) ? student.courseNames : [],
                };
            });

            console.log('Formatted Students:', formattedStudents); // Debug log
            setAllStudents(formattedStudents);
        } catch (error) {
            console.error('Failed to fetch students', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuspendStudent = async (studentId) => {
        try {
            const token = localStorage.getItem('adminToken');

            await axios.patch(
                `${BASE_URL}/api/auth/student/${studentId}/suspend`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update UI instantly
            setAllStudents((prev) =>
                prev.map((student) =>
                    student.id === studentId
                        ? { ...student, status: 'suspended' }
                        : student
                )
            );
        } catch (error) {
            console.error('Failed to suspend student', error);
            alert('Failed to suspend student. Please try again.');
        }
    };

    const handleResumeStudent = async (studentId) => {
        try {
            const token = localStorage.getItem('adminToken');

            await axios.patch(
                `${BASE_URL}/api/auth/student/${studentId}/resume`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update UI instantly
            setAllStudents((prev) =>
                prev.map((student) =>
                    student.id === studentId
                        ? { ...student, status: 'active' }
                        : student
                )
            );
        } catch (error) {
            console.error('Failed to resume student', error);
            alert('Failed to resume student. Please try again.');
        }
    };

    // Filter and sort logic
    const filteredStudents = allStudents
        .filter(student => {
            const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.joinedDate) - new Date(a.joinedDate);
            if (sortBy === 'oldest') return new Date(a.joinedDate) - new Date(b.joinedDate);
            return 0;
        });

    // Pagination
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + rowsPerPage);

    // Handlers
    const handleAction = (student, action) => {
        if (action === 'view') {
            console.log('View student:', student);
            // Navigate to student profile page or open modal
        } else if (action === 'delete') {
            setConfirmModal({
                isOpen: true,
                action,
                student,
                isBulk: false
            });
        } else if (action === 'suspend') {
            handleSuspendStudent(student.id);
        } else if (action === 'activate') {
            handleResumeStudent(student.id);
        }
    };

    const handleConfirm = async () => {
        setIsProcessing(true);
        
        try {
            const { action, student, isBulk } = confirmModal;
            
            if (action === 'delete') {
                if (isBulk) {
                    // Handle bulk delete
                    console.log('Bulk delete:', selectedStudents);
                    // Add your bulk delete API call here
                } else {
                    // Handle single delete
                    console.log('Delete student:', student);
                    // Add your delete API call here
                }
            } else if (action === 'suspend') {
                if (isBulk) {
                    // Handle bulk suspend
                    for (const studentId of selectedStudents) {
                        await handleSuspendStudent(studentId);
                    }
                } else {
                    await handleSuspendStudent(student.id);
                }
            } else if (action === 'activate') {
                if (isBulk) {
                    // Handle bulk activate
                    for (const studentId of selectedStudents) {
                        await handleResumeStudent(studentId);
                    }
                } else {
                    await handleResumeStudent(student.id);
                }
            }
            
            if (isBulk) {
                setSelectedStudents([]);
            }
        } catch (error) {
            console.error('Action failed:', error);
            alert('Action failed. Please try again.');
        } finally {
            setIsProcessing(false);
            setConfirmModal({ isOpen: false, action: null, student: null });
        }
    };

    const handleSelectStudent = (id) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (selectAll) => {
        setSelectedStudents(selectAll ? paginatedStudents.map(s => s.id) : []);
    };

    const handleBulkAction = (action) => {
        setConfirmModal({
            isOpen: true,
            action,
            student: null,
            isBulk: true
        });
    };

    const getModalConfig = () => {
        const { action, student, isBulk } = confirmModal;
        const count = selectedStudents.length;

        if (action === 'delete') {
            return {
                title: isBulk ? `Delete ${count} Students?` : 'Delete Student?',
                message: isBulk
                    ? `You are about to permanently delete ${count} student accounts. This action cannot be undone.`
                    : `You are about to permanently delete ${student?.firstName} ${student?.lastName}'s account. This action cannot be undone.`,
                confirmText: 'Delete',
                isDanger: true
            };
        } else if (action === 'suspend') {
            return {
                title: isBulk ? `Suspend ${count} Students?` : 'Suspend Student?',
                message: isBulk
                    ? `${count} student accounts will be suspended and unable to access courses.`
                    : `${student?.firstName} ${student?.lastName} will be suspended and unable to access courses.`,
                confirmText: 'Suspend',
                isDanger: false
            };
        } else if (action === 'activate') {
            return {
                title: isBulk ? `Activate ${count} Students?` : 'Activate Student?',
                message: isBulk
                    ? `${count} student accounts will be reactivated.`
                    : `${student?.firstName} ${student?.lastName} will be reactivated.`,
                confirmText: 'Activate',
                isDanger: false
            };
        }
        return {};
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                        <Home className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                        <span>Dashboard</span>
                        <ChevronRight className="w-4 h-4" />
                        <span>Students</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900 font-medium">Student List</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">All Students</h1>
                    <p className="text-slate-600">Manage student accounts, access, and activity.</p>
                </div>

                {/* Controls Bar */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                            <button 
                                onClick={fetchStudents}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {selectedStudents.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-indigo-50 border border-indigo-200 rounded-lg p-4"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <span className="text-sm font-medium text-indigo-900">
                                    {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                                </span>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleBulkAction('activate')}
                                        className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                                    >
                                        Activate
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('suspend')}
                                        className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100"
                                    >
                                        Suspend
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('delete')}
                                        className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setSelectedStudents([])}
                                        className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <StudentTable
                        students={paginatedStudents}
                        selectedStudents={selectedStudents}
                        onSelectStudent={handleSelectStudent}
                        onSelectAll={handleSelectAll}
                        onAction={handleAction}
                        onSuspend={handleSuspendStudent}
                        onResume={handleResumeStudent}
                        isLoading={isLoading}
                    />

                    {/* Pagination */}
                    {filteredStudents.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span>Rows per page:</span>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => {
                                            setRowsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="px-2 py-1 border border-slate-200 rounded text-sm"
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="ml-4">
                                        {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredStudents.length)} of {filteredStudents.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        let page;
                                        if (totalPages <= 5) {
                                            page = i + 1;
                                        } else if (currentPage <= 3) {
                                            page = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            page = totalPages - 4 + i;
                                        } else {
                                            page = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'border border-slate-200 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, action: null, student: null })}
                onConfirm={handleConfirm}
                isProcessing={isProcessing}
                {...getModalConfig()}
            />
        </div>
    );
};

export default StudentListPreview;