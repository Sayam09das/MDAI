import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ChevronRight,
    Search,
    Filter,
    Download,
    RefreshCw,
    MoreVertical,
    Eye,
    Edit,
    Ban,
    Trash2,
    Mail,
    UserCheck,
    UserX,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';

const StudentListPreview = () => {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
    };

    // Sample student data (10-15 students)
    const students = [
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            enrolledCourses: 5,
            status: 'active',
            joinDate: 'Jan 15, 2026',
            lastActive: '2 hours ago'
        },
        {
            id: 2,
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            enrolledCourses: 3,
            status: 'active',
            joinDate: 'Jan 18, 2026',
            lastActive: '1 day ago'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@example.com',
            enrolledCourses: 7,
            status: 'active',
            joinDate: 'Jan 20, 2026',
            lastActive: '3 hours ago'
        },
        {
            id: 4,
            name: 'David Kim',
            email: 'david.kim@example.com',
            enrolledCourses: 2,
            status: 'suspended',
            joinDate: 'Dec 10, 2025',
            lastActive: '2 weeks ago'
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            email: 'lisa.anderson@example.com',
            enrolledCourses: 4,
            status: 'active',
            joinDate: 'Jan 22, 2026',
            lastActive: '30 min ago'
        },
        {
            id: 6,
            name: 'James Wilson',
            email: 'james.wilson@example.com',
            enrolledCourses: 6,
            status: 'active',
            joinDate: 'Jan 12, 2026',
            lastActive: '5 hours ago'
        },
        {
            id: 7,
            name: 'Maria Garcia',
            email: 'maria.garcia@example.com',
            enrolledCourses: 3,
            status: 'active',
            joinDate: 'Jan 25, 2026',
            lastActive: 'Just now'
        },
        {
            id: 8,
            name: 'Robert Taylor',
            email: 'robert.taylor@example.com',
            enrolledCourses: 1,
            status: 'suspended',
            joinDate: 'Nov 28, 2025',
            lastActive: '1 month ago'
        },
        {
            id: 9,
            name: 'Jennifer Brown',
            email: 'jennifer.brown@example.com',
            enrolledCourses: 5,
            status: 'active',
            joinDate: 'Jan 19, 2026',
            lastActive: '1 hour ago'
        },
        {
            id: 10,
            name: 'Christopher Lee',
            email: 'christopher.lee@example.com',
            enrolledCourses: 4,
            status: 'active',
            joinDate: 'Jan 23, 2026',
            lastActive: '4 hours ago'
        },
        {
            id: 11,
            name: 'Amanda White',
            email: 'amanda.white@example.com',
            enrolledCourses: 2,
            status: 'active',
            joinDate: 'Jan 21, 2026',
            lastActive: '6 hours ago'
        },
        {
            id: 12,
            name: 'Daniel Martinez',
            email: 'daniel.martinez@example.com',
            enrolledCourses: 8,
            status: 'active',
            joinDate: 'Jan 10, 2026',
            lastActive: '2 hours ago'
        }
    ];

    // Filter options
    const statusFilters = [
        { value: 'all', label: 'All Students', count: students.length },
        { value: 'active', label: 'Active', count: students.filter(s => s.status === 'active').length },
        { value: 'suspended', label: 'Suspended', count: students.filter(s => s.status === 'suspended').length }
    ];

    // Filtered students
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // Status badge component
    const StatusBadge = ({ status }) => {
        const config = {
            active: {
                bg: 'bg-green-50',
                text: 'text-green-700',
                border: 'border-green-200',
                icon: CheckCircle2,
                label: 'Active'
            },
            suspended: {
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                icon: XCircle,
                label: 'Suspended'
            }
        };

        const { bg, text, border, icon: Icon, label } = config[status] || config.active;

        return (
            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${text} ${border}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
            </span>
        );
    };

    // Action Menu Component
    const ActionMenu = ({ studentId, studentName, status }) => {
        const isOpen = activeMenu === studentId;

        const handleAction = (action) => {
            console.log(`${action} student:`, studentName);
            setActiveMenu(null);
            // Add your action logic here
        };

        return (
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveMenu(isOpen ? null : studentId)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <MoreVertical className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenu(null)}
                            />

                            {/* Menu */}
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-20"
                            >
                                <div className="py-1">
                                    <button
                                        onClick={() => handleAction('view')}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Eye className="w-4 h-4 text-slate-500" />
                                        <span>View Profile</span>
                                    </button>
                                    <button
                                        onClick={() => handleAction('edit')}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-slate-500" />
                                        <span>Edit Details</span>
                                    </button>
                                    <button
                                        onClick={() => handleAction('email')}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        <span>Send Email</span>
                                    </button>
                                </div>

                                <div className="border-t border-slate-100 py-1">
                                    <button
                                        onClick={() => handleAction(status === 'active' ? 'suspend' : 'activate')}
                                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm ${status === 'active'
                                                ? 'text-amber-600 hover:bg-amber-50'
                                                : 'text-green-600 hover:bg-green-50'
                                            } transition-colors`}
                                    >
                                        <Ban className="w-4 h-4" />
                                        <span>{status === 'active' ? 'Suspend Account' : 'Activate Account'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleAction('delete')}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete Student</span>
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={mounted ? "visible" : "hidden"}
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Breadcrumb & Header */}
                <motion.div variants={itemVariants}>
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                        <Home className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-600">Dashboard</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-600">Students</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-indigo-600 font-medium">Student List</span>
                    </div>

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Student List Preview
                            </h1>
                            <p className="text-slate-600">
                                Showing {filteredStudents.length} of {students.length} students
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors flex items-center space-x-2 border border-slate-200 bg-white shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">Export</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: 90 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Status Filter Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedStatus(filter.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedStatus === filter.value
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {filter.label}
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedStatus === filter.value
                                            ? 'bg-indigo-500'
                                            : 'bg-slate-200'
                                        }`}>
                                        {filter.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 lg:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Student Table */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    {/* Table Header */}
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Student Records
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Manage and monitor student accounts
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Enrolled Courses
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Account Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                <AnimatePresence mode="popLayout">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student, index) => (
                                            <motion.tr
                                                key={student.id}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                {/* Student Name */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
                                                            {student.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-900">
                                                                {student.name}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                Joined {student.joinDate}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900">
                                                        {student.email}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Last active: {student.lastActive}
                                                    </div>
                                                </td>

                                                {/* Enrolled Courses */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className="text-2xl font-bold text-indigo-600">
                                                            {student.enrolledCourses}
                                                        </span>
                                                        <span className="text-xs text-slate-500 ml-2">
                                                            {student.enrolledCourses === 1 ? 'course' : 'courses'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Account Status */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={student.status} />
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <ActionMenu
                                                        studentId={student.id}
                                                        studentName={student.name}
                                                        status={student.status}
                                                    />
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
                                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                                        No students found
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        Try adjusting your search or filter criteria
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Showing <span className="font-semibold text-slate-900">{filteredStudents.length}</span> of <span className="font-semibold text-slate-900">{students.length}</span> students
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2">
                                <span>View All Students</span>
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudentListPreview;