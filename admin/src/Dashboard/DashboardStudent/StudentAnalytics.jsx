import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserCheck,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    RefreshCw,
    Home,
    ChevronRight,
    BarChart3,
    Clock,
    Award,
    BookOpen,
    Target,
    Activity,
    Calendar,
    Eye,
    UserX,
    UserPlus,
    Trash2,
    MoreVertical,
    CheckSquare,
    Square,
    Star,
    Download,
    Mail,
    Phone
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentAnalytics = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data - replace with API
    const metrics = [
        {
            id: 1,
            label: 'Total Students',
            value: '12,458',
            icon: Users,
            trend: { value: '+18.2%', isPositive: true },
            color: 'indigo'
        },
        {
            id: 2,
            label: 'Active Students',
            value: '9,234',
            icon: UserCheck,
            trend: { value: '+12.5%', isPositive: true },
            color: 'emerald'
        },
        {
            id: 3,
            label: 'Course Enrollments',
            value: '45,678',
            icon: BookOpen,
            trend: { value: '+24.3%', isPositive: true },
            color: 'blue'
        },
        {
            id: 4,
            label: 'Completion Rate',
            value: '78.5%',
            icon: Award,
            trend: { value: '-2.1%', isPositive: false },
            color: 'amber'
        }
    ];

    const students = [
        {
            id: 1,
            name: 'Alex Johnson',
            email: 'alex.j@student.com',
            phone: '+1 234-567-8901',
            enrolledCourses: 8,
            completedCourses: 6,
            avgScore: 92,
            lastActive: '2024-01-25',
            joined: '2023-06-15',
            status: 'active',
            avatar: 'AJ'
        },
        {
            id: 2,
            name: 'Maria Garcia',
            email: 'maria.g@student.com',
            phone: '+1 234-567-8902',
            enrolledCourses: 12,
            completedCourses: 10,
            avgScore: 95,
            lastActive: '2024-01-26',
            joined: '2023-05-20',
            status: 'active',
            avatar: 'MG'
        },
        {
            id: 3,
            name: 'David Chen',
            email: 'david.c@student.com',
            phone: '+1 234-567-8903',
            enrolledCourses: 5,
            completedCourses: 3,
            avgScore: 88,
            lastActive: '2024-01-20',
            joined: '2023-08-10',
            status: 'active',
            avatar: 'DC'
        },
        {
            id: 4,
            name: 'Sarah Williams',
            email: 'sarah.w@student.com',
            phone: '+1 234-567-8904',
            enrolledCourses: 6,
            completedCourses: 4,
            avgScore: 85,
            lastActive: '2024-01-15',
            joined: '2023-07-05',
            status: 'suspended',
            avatar: 'SW'
        },
        {
            id: 5,
            name: 'James Taylor',
            email: 'james.t@student.com',
            phone: '+1 234-567-8905',
            enrolledCourses: 10,
            completedCourses: 8,
            avgScore: 91,
            lastActive: '2024-01-26',
            joined: '2023-04-12',
            status: 'active',
            avatar: 'JT'
        },
        {
            id: 6,
            name: 'Emily Brown',
            email: 'emily.b@student.com',
            phone: '+1 234-567-8906',
            enrolledCourses: 7,
            completedCourses: 5,
            avgScore: 89,
            lastActive: '2024-01-24',
            joined: '2023-06-28',
            status: 'active',
            avatar: 'EB'
        },
        {
            id: 7,
            name: 'Michael Lee',
            email: 'michael.l@student.com',
            phone: '+1 234-567-8907',
            enrolledCourses: 9,
            completedCourses: 7,
            avgScore: 93,
            lastActive: '2024-01-25',
            joined: '2023-05-15',
            status: 'active',
            avatar: 'ML'
        },
        {
            id: 8,
            name: 'Jessica Martinez',
            email: 'jessica.m@student.com',
            phone: '+1 234-567-8908',
            enrolledCourses: 4,
            completedCourses: 2,
            avgScore: 80,
            lastActive: '2024-01-22',
            joined: '2023-09-01',
            status: 'active',
            avatar: 'JM'
        },
        {
            id: 9,
            name: 'Robert Anderson',
            email: 'robert.a@student.com',
            phone: '+1 234-567-8909',
            enrolledCourses: 11,
            completedCourses: 9,
            avgScore: 94,
            lastActive: '2024-01-26',
            joined: '2023-03-20',
            status: 'active',
            avatar: 'RA'
        },
        {
            id: 10,
            name: 'Lisa Davis',
            email: 'lisa.d@student.com',
            phone: '+1 234-567-8910',
            enrolledCourses: 6,
            completedCourses: 4,
            avgScore: 87,
            lastActive: '2024-01-23',
            joined: '2023-07-18',
            status: 'active',
            avatar: 'LD'
        }
    ];

    // Filter and sort
    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.lastActive) - new Date(a.lastActive);
        if (sortBy === 'score') return b.avgScore - a.avgScore;
        if (sortBy === 'courses') return b.enrolledCourses - a.enrolledCourses;
        return 0;
    });

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Student data refreshed');
        }, 1000);
    };

    const toggleSelectAll = () => {
        if (selectedStudents.length === paginatedStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(paginatedStudents.map(s => s.id));
        }
    };

    const toggleSelectStudent = (id) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAction = (action, student) => {
        setConfirmModal({ action, student });
        setShowActionMenu(null);
    };

    const confirmAction = () => {
        const { action, student } = confirmModal;

        const messages = {
            suspend: () => toast.warning(`${student.name} has been suspended`),
            activate: () => toast.success(`${student.name} has been activated`),
            remove: () => toast.error(`${student.name} has been removed`),
            view: () => toast.info(`Viewing ${student.name}'s profile`),
            contact: () => toast.info(`Contacting ${student.name}`)
        };

        if (messages[action]) messages[action]();
        setConfirmModal(null);
    };

    const handleBulkAction = (action) => {
        if (selectedStudents.length === 0) {
            toast.warning('Please select students first');
            return;
        }
        setConfirmModal({ action, bulk: true, count: selectedStudents.length });
    };

    const confirmBulkAction = () => {
        const { action, count } = confirmModal;

        if (action === 'bulk-suspend') {
            toast.warning(`${count} students suspended`);
        } else if (action === 'bulk-activate') {
            toast.success(`${count} students activated`);
        } else if (action === 'bulk-remove') {
            toast.error(`${count} students removed`);
        }

        setSelectedStudents([]);
        setConfirmModal(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-600 bg-emerald-50';
        if (score >= 80) return 'text-blue-600 bg-blue-50';
        if (score >= 70) return 'text-amber-600 bg-amber-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <ToastContainer />

            {/* Page Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                        <Home className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900 font-medium">Dashboard</span>
                        <ChevronRight className="w-4 h-4" />
                        <span>Students</span>
                    </nav>

                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Student Analytics</h1>
                        <p className="mt-2 text-slate-600">
                            Track student engagement, performance, and platform activity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Metrics Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
                                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                                </div>
                                {metric.trend && (
                                    <div className={`flex items-center space-x-1 ${metric.trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {metric.trend.isPositive ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4" />
                                        )}
                                        <span className="text-sm font-medium">{metric.trend.value}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-slate-600">{metric.label}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Analytics Charts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                        Student Activity Analytics
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-50 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] border border-slate-200">
                            <Activity className="w-12 h-12 text-slate-400 mb-3" />
                            <p className="text-slate-600 font-medium">Enrollment Trends</p>
                            <p className="text-sm text-slate-500 mt-1">Chart data loading...</p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] border border-slate-200">
                            <Target className="w-12 h-12 text-slate-400 mb-3" />
                            <p className="text-slate-600 font-medium">Performance Distribution</p>
                            <p className="text-sm text-slate-500 mt-1">Chart data loading...</p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] border border-slate-200">
                            <GraduationCap className="w-12 h-12 text-slate-400 mb-3" />
                            <p className="text-slate-600 font-medium">Completion Rates</p>
                            <p className="text-sm text-slate-500 mt-1">Chart data loading...</p>
                        </div>
                    </div>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="recent">Recently Active</option>
                                <option value="score">Highest Score</option>
                                <option value="courses">Most Courses</option>
                            </select>

                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-5 h-5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    <AnimatePresence>
                        {selectedStudents.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex flex-wrap items-center justify-between gap-3"
                            >
                                <div className="flex items-center text-sm text-indigo-900">
                                    <CheckSquare className="w-4 h-4 mr-2" />
                                    <span className="font-medium">{selectedStudents.length} student(s) selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleBulkAction('bulk-activate')}
                                        className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                                    >
                                        Bulk Activate
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('bulk-suspend')}
                                        className="px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                                    >
                                        Bulk Suspend
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('bulk-remove')}
                                        className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                    >
                                        Bulk Remove
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Student Table - Desktop */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="hidden lg:block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <button onClick={toggleSelectAll} className="p-1 hover:bg-slate-200 rounded">
                                            {selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0 ? (
                                                <CheckSquare className="w-5 h-5 text-indigo-600" />
                                            ) : (
                                                <Square className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Enrolled</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Completed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Avg Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Last Active</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {paginatedStudents.map((student, index) => (
                                    <motion.tr
                                        key={student.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleSelectStudent(student.id)}
                                                className="p-1 hover:bg-slate-200 rounded"
                                            >
                                                {selectedStudents.includes(student.id) ? (
                                                    <CheckSquare className="w-5 h-5 text-indigo-600" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-slate-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                                                    {student.avatar}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{student.name}</div>
                                                    <div className="text-xs text-slate-500">Joined {formatDate(student.joined)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600">{student.email}</div>
                                            <div className="text-xs text-slate-500">{student.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{student.enrolledCourses}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900">{student.completedCourses}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(student.avgScore)}`}>
                                                {student.avgScore}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600">{formatDate(student.lastActive)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowActionMenu(showActionMenu === student.id ? null : student.id)}
                                                    className="p-1 hover:bg-slate-100 rounded"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-slate-600" />
                                                </button>

                                                <AnimatePresence>
                                                    {showActionMenu === student.id && (
                                                        <ActionMenu
                                                            student={student}
                                                            onAction={handleAction}
                                                            onClose={() => setShowActionMenu(null)}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                    {paginatedStudents.map((student, index) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            index={index}
                            isSelected={selectedStudents.includes(student.id)}
                            onToggleSelect={toggleSelectStudent}
                            onAction={handleAction}
                            formatDate={formatDate}
                            getScoreColor={getScoreColor}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    totalItems={filteredStudents.length}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                modal={confirmModal}
                onConfirm={confirmModal?.bulk ? confirmBulkAction : confirmAction}
                onCancel={() => setConfirmModal(null)}
            />
        </div>
    );
};

/* ================= ACTION MENU ================= */
const ActionMenu = ({ student, onAction, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
        onMouseLeave={onClose}
    >
        <button
            onClick={() => onAction('view', student)}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
        >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
        </button>
        <button
            onClick={() => onAction('contact', student)}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
        >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
        </button>
        <div className="border-t border-slate-200 my-1"></div>
        {student.status === 'active' ? (
            <button
                onClick={() => onAction('suspend', student)}
                className="w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center"
            >
                <UserX className="w-4 h-4 mr-2" />
                Suspend Account
            </button>
        ) : (
            <button
                onClick={() => onAction('activate', student)}
                className="w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center"
            >
                <UserPlus className="w-4 h-4 mr-2" />
                Activate Account
            </button>
        )}
        <button
            onClick={() => onAction('remove', student)}
            className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center"
        >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Student
        </button>
    </motion.div>
);

/* ================= MOBILE CARD ================= */
const StudentCard = ({ student, index, isSelected, onToggleSelect, onAction, formatDate, getScoreColor }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                    <button
                        onClick={() => onToggleSelect(student.id)}
                        className="p-1 hover:bg-slate-100 rounded mt-1"
                    >
                        {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                        )}
                    </button>
                    <div className="flex items-start space-x-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0">
                            {student.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 truncate">{student.name}</h3>
                            <p className="text-sm text-slate-600 truncate">{student.email}</p>
                            <p className="text-xs text-slate-500">{student.phone}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {student.status}
                    </span>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-slate-100 rounded"
                    >
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-600">Enrolled</p>
                        <p className="font-medium text-slate-900">{student.enrolledCourses}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-600">Completed</p>
                        <p className="font-medium text-slate-900">{student.completedCourses}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <div>
                        <p className="text-xs text-slate-600">Avg Score</p>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${getScoreColor(student.avgScore)}`}>
                            {student.avgScore}%
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-600">Last Active</p>
                        <p className="font-medium text-slate-900 text-xs">{formatDate(student.lastActive)}</p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-200 pt-3 space-y-2"
                    >
                        <button
                            onClick={() => {
                                onAction('view', student);
                                setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 text-slate-700 rounded flex items-center justify-center"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            {student.status === 'active' ? (
                                <button
                                    onClick={() => {
                                        onAction('suspend', student);
                                        setShowMenu(false);
                                    }}
                                    className="px-3 py-2 text-sm bg-amber-50 hover:bg-amber-100 text-amber-700 rounded flex items-center justify-center"
                                >
                                    <UserX className="w-4 h-4 mr-1" />
                                    Suspend
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        onAction('activate', student);
                                        setShowMenu(false);
                                    }}
                                    className="px-3 py-2 text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded flex items-center justify-center"
                                >
                                    <UserPlus className="w-4 h-4 mr-1" />
                                    Activate
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    onAction('remove', student);
                                    setShowMenu(false);
                                }}
                                className="px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded flex items-center justify-center"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ================= PAGINATION ================= */
const Pagination = ({ currentPage, totalPages, rowsPerPage, totalItems, onPageChange, onRowsPerPageChange }) => {
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3 mt-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-700">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-slate-700">
                        {startItem}-{endItem} of {totalItems}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>

                    <span className="text-sm text-slate-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

/* ================= CONFIRMATION MODAL ================= */
const ConfirmationModal = ({ modal, onConfirm, onCancel }) => {
    if (!modal) return null;

    const isDestructive = modal.action === 'remove' || modal.action === 'bulk-remove';

    const titles = {
        suspend: 'Suspend Account',
        activate: 'Activate Account',
        remove: 'Remove Student',
        'bulk-suspend': 'Bulk Suspend Students',
        'bulk-activate': 'Bulk Activate Students',
        'bulk-remove': 'Bulk Remove Students'
    };

    const descriptions = {
        suspend: `Are you sure you want to suspend ${modal.student?.name}?`,
        activate: `Are you sure you want to activate ${modal.student?.name}?`,
        remove: `Are you sure you want to remove ${modal.student?.name}? This action cannot be undone.`,
        'bulk-suspend': `Are you sure you want to suspend ${modal.count} students?`,
        'bulk-activate': `Are you sure you want to activate ${modal.count} students?`,
        'bulk-remove': `Are you sure you want to remove ${modal.count} students? This action cannot be undone.`
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isDestructive ? 'bg-red-100' :
                            modal.action.includes('suspend') ? 'bg-amber-100' : 'bg-emerald-100'
                        }`}>
                        {isDestructive ? (
                            <Trash2 className="w-6 h-6 text-red-600" />
                        ) : modal.action.includes('suspend') ? (
                            <UserX className="w-6 h-6 text-amber-600" />
                        ) : (
                            <UserPlus className="w-6 h-6 text-emerald-600" />
                        )}
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {titles[modal.action]}
                    </h3>

                    <p className="text-slate-600 mb-6">
                        {descriptions[modal.action]}
                    </p>

                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium ${isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : modal.action.includes('suspend')
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StudentAnalytics;