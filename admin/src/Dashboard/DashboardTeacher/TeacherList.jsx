import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    SortAsc,
    RefreshCw,
    MoreVertical,
    Eye,
    UserX,
    UserPlus,
    Trash2,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Home,
    Users,
    Star,
    Calendar,
    GraduationCap,
    CheckSquare,
    Square,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('courses');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Mock data - replace with API
    const allTeachers = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.j@mdai.edu',
            courses: 12,
            students: 2340,
            rating: 4.8,
            joined: '2023-01-15',
            status: 'active',
            avatar: 'SJ'
        },
        {
            id: 2,
            name: 'Prof. Michael Chen',
            email: 'michael.c@mdai.edu',
            courses: 8,
            students: 1890,
            rating: 4.9,
            joined: '2023-02-20',
            status: 'active',
            avatar: 'MC'
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            email: 'emily.r@mdai.edu',
            courses: 15,
            students: 3120,
            rating: 4.7,
            joined: '2022-11-10',
            status: 'active',
            avatar: 'ER'
        },
        {
            id: 4,
            name: 'Prof. David Williams',
            email: 'david.w@mdai.edu',
            courses: 6,
            students: 980,
            rating: 4.5,
            joined: '2023-03-05',
            status: 'suspended',
            avatar: 'DW'
        },
        {
            id: 5,
            name: 'Dr. Lisa Anderson',
            email: 'lisa.a@mdai.edu',
            courses: 10,
            students: 2100,
            rating: 4.6,
            joined: '2023-01-28',
            status: 'active',
            avatar: 'LA'
        },
        {
            id: 6,
            name: 'Prof. James Taylor',
            email: 'james.t@mdai.edu',
            courses: 9,
            students: 1750,
            rating: 4.8,
            joined: '2022-12-12',
            status: 'active',
            avatar: 'JT'
        },
        {
            id: 7,
            name: 'Dr. Maria Garcia',
            email: 'maria.g@mdai.edu',
            courses: 11,
            students: 2450,
            rating: 4.9,
            joined: '2023-02-14',
            status: 'active',
            avatar: 'MG'
        },
        {
            id: 8,
            name: 'Prof. Robert Brown',
            email: 'robert.b@mdai.edu',
            courses: 7,
            students: 1320,
            rating: 4.4,
            joined: '2023-03-20',
            status: 'active',
            avatar: 'RB'
        },
        {
            id: 9,
            name: 'Dr. Jennifer Lee',
            email: 'jennifer.l@mdai.edu',
            courses: 13,
            students: 2890,
            rating: 4.7,
            joined: '2022-10-08',
            status: 'active',
            avatar: 'JL'
        },
        {
            id: 10,
            name: 'Prof. Thomas Martin',
            email: 'thomas.m@mdai.edu',
            courses: 5,
            students: 850,
            rating: 4.6,
            joined: '2023-04-01',
            status: 'suspended',
            avatar: 'TM'
        },
        {
            id: 11,
            name: 'Dr. Patricia Davis',
            email: 'patricia.d@mdai.edu',
            courses: 14,
            students: 3050,
            rating: 4.8,
            joined: '2022-09-15',
            status: 'active',
            avatar: 'PD'
        },
        {
            id: 12,
            name: 'Prof. Christopher Wilson',
            email: 'chris.w@mdai.edu',
            courses: 9,
            students: 1950,
            rating: 4.7,
            joined: '2023-01-10',
            status: 'active',
            avatar: 'CW'
        }
    ];

    // Filter and sort logic
    const filteredAndSortedTeachers = useMemo(() => {
        let result = [...allTeachers];

        // Search filter
        if (searchQuery) {
            result = result.filter(t =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus !== 'all') {
            result = result.filter(t => t.status === filterStatus);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'courses') return b.courses - a.courses;
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'students') return b.students - a.students;
            if (sortBy === 'joined') return new Date(b.joined) - new Date(a.joined);
            return 0;
        });

        return result;
    }, [searchQuery, filterStatus, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedTeachers.length / rowsPerPage);
    const paginatedTeachers = filteredAndSortedTeachers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Selection handlers
    const toggleSelectAll = () => {
        if (selectedTeachers.length === paginatedTeachers.length) {
            setSelectedTeachers([]);
        } else {
            setSelectedTeachers(paginatedTeachers.map(t => t.id));
        }
    };

    const toggleSelectTeacher = (id) => {
        setSelectedTeachers(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Action handlers
    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Teacher list refreshed');
        }, 1000);
    };

    const handleAction = (action, teacher) => {
        setConfirmModal({ action, teacher });
        setShowActionMenu(null);
    };

    const confirmAction = () => {
        const { action, teacher } = confirmModal;

        const messages = {
            suspend: () => toast.warning(`${teacher.name} has been suspended`),
            activate: () => toast.success(`${teacher.name} has been activated`),
            remove: () => toast.error(`${teacher.name} has been removed`),
            view: () => toast.info(`Viewing ${teacher.name}'s profile`),
            courses: () => toast.info(`Managing courses for ${teacher.name}`)
        };

        if (messages[action]) messages[action]();
        setConfirmModal(null);
    };

    const handleBulkAction = (action) => {
        if (selectedTeachers.length === 0) {
            toast.warning('Please select teachers first');
            return;
        }

        setConfirmModal({ action, bulk: true, count: selectedTeachers.length });
    };

    const confirmBulkAction = () => {
        const { action, count } = confirmModal;

        const messages = {
            'bulk-suspend': () => toast.warning(`${count} teachers have been suspended`),
            'bulk-activate': () => toast.success(`${count} teachers have been activated`),
            'bulk-remove': () => toast.error(`${count} teachers have been removed`)
        };

        if (messages[action]) messages[action]();
        setSelectedTeachers([]);
        setConfirmModal(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                        <span>/</span>
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Teachers</span>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">Teacher List</span>
                    </nav>

                    {/* Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">All Teachers</h1>
                            <p className="mt-2 text-slate-600">
                                Manage instructors, courses, and platform access.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-5 h-5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Top Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
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

                        {/* Filters and Sort */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="courses">Most Courses</option>
                                <option value="rating">Highest Rated</option>
                                <option value="students">Most Students</option>
                                <option value="joined">Recently Joined</option>
                            </select>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                                <Filter className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedTeachers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex flex-wrap items-center justify-between gap-3"
                        >
                            <div className="flex items-center text-sm text-indigo-900">
                                <CheckSquare className="w-4 h-4 mr-2" />
                                <span className="font-medium">{selectedTeachers.length} teacher(s) selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleBulkAction('bulk-activate')}
                                    className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                >
                                    Bulk Activate
                                </button>
                                <button
                                    onClick={() => handleBulkAction('bulk-suspend')}
                                    className="px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                                >
                                    Bulk Suspend
                                </button>
                                <button
                                    onClick={() => handleBulkAction('bulk-remove')}
                                    className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Bulk Remove
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Teacher List */}
                {isLoading ? (
                    <LoadingSkeleton />
                ) : filteredAndSortedTeachers.length === 0 ? (
                    <EmptyState searchQuery={searchQuery} />
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left">
                                                <button
                                                    onClick={toggleSelectAll}
                                                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                >
                                                    {selectedTeachers.length === paginatedTeachers.length ? (
                                                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Teacher
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Courses
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Students
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Rating
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {paginatedTeachers.map((teacher) => (
                                            <motion.tr
                                                key={teacher.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleSelectTeacher(teacher.id)}
                                                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                    >
                                                        {selectedTeachers.includes(teacher.id) ? (
                                                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                                                        ) : (
                                                            <Square className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                                                            {teacher.avatar}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-slate-900">{teacher.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-600">{teacher.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900 font-medium">{teacher.courses}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900">{teacher.students.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                                                        <span className="text-sm font-medium text-slate-900">{teacher.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-600">{formatDate(teacher.joined)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'active'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {teacher.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setShowActionMenu(showActionMenu === teacher.id ? null : teacher.id)}
                                                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                        >
                                                            <MoreVertical className="w-5 h-5 text-slate-600" />
                                                        </button>

                                                        <AnimatePresence>
                                                            {showActionMenu === teacher.id && (
                                                                <ActionMenu
                                                                    teacher={teacher}
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
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {paginatedTeachers.map((teacher) => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    isSelected={selectedTeachers.includes(teacher.id)}
                                    onToggleSelect={toggleSelectTeacher}
                                    onAction={handleAction}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            rowsPerPage={rowsPerPage}
                            totalItems={filteredAndSortedTeachers.length}
                            onPageChange={setCurrentPage}
                            onRowsPerPageChange={setRowsPerPage}
                        />
                    </>
                )}
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

// Action Menu Component
const ActionMenu = ({ teacher, onAction, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
        onMouseLeave={onClose}
    >
        <button
            onClick={() => onAction('view', teacher)}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
        >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
        </button>
        <button
            onClick={() => onAction('courses', teacher)}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
        >
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Courses
        </button>
        <div className="border-t border-slate-200 my-1"></div>
        {teacher.status === 'active' ? (
            <button
                onClick={() => onAction('suspend', teacher)}
                className="w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center"
            >
                <UserX className="w-4 h-4 mr-2" />
                Suspend Account
            </button>
        ) : (
            <button
                onClick={() => onAction('activate', teacher)}
                className="w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center"
            >
                <UserPlus className="w-4 h-4 mr-2" />
                Activate Account
            </button>
        )}
        <button
            onClick={() => onAction('remove', teacher)}
            className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center"
        >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Teacher
        </button>
    </motion.div>
);

// Mobile Teacher Card
const TeacherCard = ({ teacher, isSelected, onToggleSelect, onAction, formatDate }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                    <button
                        onClick={() => onToggleSelect(teacher.id)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors mt-1"
                    >
                        {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                        )}
                    </button>
                    <div className="flex items-start space-x-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0">
                            {teacher.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 truncate">{teacher.name}</h3>
                            <p className="text-sm text-slate-600 truncate">{teacher.email}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${teacher.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {teacher.status}
                    </span>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-600">Courses</p>
                        <p className="font-medium text-slate-900">{teacher.courses}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-600">Students</p>
                        <p className="font-medium text-slate-900">{teacher.students.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <div>
                        <p className="text-xs text-slate-600">Rating</p>
                        <p className="font-medium text-slate-900">{teacher.rating}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-600">Joined</p>
                        <p className="font-medium text-slate-900 text-xs">{formatDate(teacher.joined)}</p>
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
                                onAction('view', teacher);
                                setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 text-slate-700 rounded flex items-center justify-center"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            {teacher.status === 'active' ? (
                                <button
                                    onClick={() => {
                                        onAction('suspend', teacher);
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
                                        onAction('activate', teacher);
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
                                    onAction('remove', teacher);
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

// Pagination Component
const Pagination = ({ currentPage, totalPages, rowsPerPage, totalItems, onPageChange, onRowsPerPageChange }) => {
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-700">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>

                    <div className="hidden sm:flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`px-3 py-1 rounded ${currentPage === pageNum
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <span className="sm:hidden text-sm text-slate-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Empty State
const EmptyState = ({ searchQuery }) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12">
        <div className="text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
                {searchQuery ? 'No teachers found' : 'No teachers yet'}
            </h3>
            <p className="text-slate-600">
                {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Teachers will appear here once they register'}
            </p>
        </div>
    </div>
);

// Confirmation Modal
const ConfirmationModal = ({ modal, onConfirm, onCancel }) => {
    if (!modal) return null;

    const isBulk = modal.bulk;
    const isDestructive = modal.action === 'remove' || modal.action === 'bulk-remove';

    const titles = {
        suspend: 'Suspend Account',
        activate: 'Activate Account',
        remove: 'Remove Teacher',
        'bulk-suspend': 'Bulk Suspend Teachers',
        'bulk-activate': 'Bulk Activate Teachers',
        'bulk-remove': 'Bulk Remove Teachers'
    };

    const descriptions = {
        suspend: `Are you sure you want to suspend ${modal.teacher?.name}? They will lose access to the platform.`,
        activate: `Are you sure you want to activate ${modal.teacher?.name}? They will regain platform access.`,
        remove: `Are you sure you want to remove ${modal.teacher?.name}? This action cannot be undone.`,
        'bulk-suspend': `Are you sure you want to suspend ${modal.count} teachers? They will lose access to the platform.`,
        'bulk-activate': `Are you sure you want to activate ${modal.count} teachers? They will regain platform access.`,
        'bulk-remove': `Are you sure you want to remove ${modal.count} teachers? This action cannot be undone.`
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
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${isDestructive
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

export default TeacherList;