import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Users,
    UserCheck,
    BookOpen,
    Star,
    TrendingUp,
    TrendingDown,
    Eye,
    UserX,
    UserPlus,
    Trash2,
    ChevronRight,
    Home,
    BarChart3,
    Clock,
    Award,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const TeacherAnalytics = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const getAuthHeaders = () => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            toast.error("Session expired. Please login again.");
            navigate("/admin/login");
            return {};
        }

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const navigate = useNavigate();
    const [selectedAction, setSelectedAction] = useState(null);
    const [actionTeacher, setActionTeacher] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [onboardingData, setOnboardingData] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const [feedbackData, setFeedbackData] = useState([]);



    /* ================= FETCH STATS ================= */
    const fetchStats = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/teacher/stats`,
                getAuthHeaders()
            );

            setMetrics([
                {
                    id: 1,
                    label: "Total Teachers",
                    value: res.data.totalTeachers,
                    icon: Users,
                    color: "indigo",
                },
                {
                    id: 2,
                    label: "Active Teachers",
                    value: res.data.activeTeachers,
                    icon: UserCheck,
                    color: "emerald",
                },
                {
                    id: 3,
                    label: "Suspended Teachers",
                    value: res.data.suspendedTeachers,
                    icon: UserX,
                    color: "rose",
                },
            ]);
        } catch (err) {
            toast.error("Failed to load teacher stats");
        }
    };

    /* ================= FETCH TEACHERS ================= */
    const fetchTeachers = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/teacher`,
                getAuthHeaders()
            );

            setTeachers(
                res.data.map((t) => ({
                    id: t._id,
                    name: t.fullName,
                    email: t.email,
                    status: t.isSuspended ? "suspended" : "active",
                    avatar: t.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join(""),
                    courseCount: t.courseCount,
                    courses: t.courses,
                }))
            );
        } catch (err) {
            toast.error("Failed to load teachers");
        }
    };

    useEffect(() => {
        fetchStats();
        fetchTeachers();
    }, []);

    /* ================= ACTION HANDLERS ================= */
    const handleAction = (action, teacher) => {
        setSelectedAction(action);
        setActionTeacher(teacher);
    };

    const confirmAction = async () => {
        if (!actionTeacher) return;

        try {
            setLoading(true);

            if (selectedAction === "suspend") {
                await axios.patch(
                    `${BASE_URL}/api/teacher/${actionTeacher.id}/suspend`,
                    {},
                    getAuthHeaders()
                );
                toast.warning(`${actionTeacher.name} suspended`);
            }

            if (selectedAction === "activate") {
                await axios.patch(
                    `${BASE_URL}/api/teacher/${actionTeacher.id}/resume`,
                    {},
                    getAuthHeaders()
                );
                toast.success(`${actionTeacher.name} activated`);
            }

            await fetchStats();
            await fetchTeachers();
        } catch (err) {
            toast.error("Action failed");
        } finally {
            setLoading(false);
            setSelectedAction(null);
            setActionTeacher(null);
        }
    };

    const cancelAction = () => {
        setSelectedAction(null);
        setActionTeacher(null);
    };


    const fetchAnalytics = async () => {
        try {
            const [onboard, courses, feedback] = await Promise.all([
                axios.get(`${BASE_URL}/api/teacher/analytics/onboarding`, getAuthHeaders()),
                axios.get(`${BASE_URL}/api/teacher/analytics/courses`, getAuthHeaders()),
                axios.get(`${BASE_URL}/api/teacher/analytics/feedback`, getAuthHeaders()),
            ]);

            setOnboardingData(onboard.data);
            setCourseData(courses.data);
            setFeedbackData(feedback.data);
        } catch {
            toast.error("Failed to load analytics");
        }
    };

    useEffect(() => {
        fetchAnalytics();

        const interval = setInterval(fetchAnalytics, 30000);
        return () => clearInterval(interval);
    }, []);

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
                        <span>Teachers</span>
                    </nav>

                    {/* Title + Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Teacher Analytics
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Track teacher engagement, course activity, and platform impact.
                            </p>
                        </div>

                        {/* 🔥 Add Teacher Button */}
                        <button
                            onClick={() => navigate("/admin/dashboard/create/teacher")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Teacher
                        </button>
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

                {/* Analytics Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                        Teacher Activity Analytics
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 1️⃣ Teacher Onboarding Growth */}
                        <div className="bg-white rounded-lg p-4 border">
                            <p className="font-medium mb-2">Teacher Onboarding Growth</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={onboardingData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 2️⃣ Courses Created Over Time */}
                        <div className="bg-white rounded-lg p-4 border">
                            <p className="font-medium mb-2">Courses Created Over Time</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={courseData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 3️⃣ Student Feedback Trends */}
                        <div className="bg-white rounded-lg p-4 border">
                            <p className="font-medium mb-2">Student Feedback Trends</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={feedbackData}>
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </motion.div>

                {/* Teacher List Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-900">Recent Teachers</h2>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
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
                                        Courses Count
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
                                {teachers.map((teacher) => (
                                    <motion.tr
                                        key={teacher.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
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
                                            <div className="text-sm text-slate-900 font-medium">{teacher.courses.map(c => c.title).join(', ') || 'No courses'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                                                <span className="text-sm font-medium text-slate-900">{teacher.courseCount}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => toast.info(`Viewing ${teacher.name}'s profile`)}
                                                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-600" />
                                                </button>
                                                {teacher.status === 'active' ? (
                                                    <button
                                                        onClick={() => handleAction('suspend', teacher)}
                                                        className="p-1 hover:bg-amber-50 rounded transition-colors"
                                                        title="Suspend Account"
                                                    >
                                                        <UserX className="w-4 h-4 text-amber-600" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction('activate', teacher)}
                                                        className="p-1 hover:bg-emerald-50 rounded transition-colors"
                                                        title="Activate Account"
                                                    >
                                                        <UserPlus className="w-4 h-4 text-emerald-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction('remove', teacher)}
                                                    className="p-1 hover:bg-red-50 rounded transition-colors"
                                                    title="Remove Teacher"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden divide-y divide-slate-200">
                        {teachers.map((teacher) => (
                            <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                                            {teacher.avatar}
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-medium text-slate-900">{teacher.name}</div>
                                            <div className="text-sm text-slate-600">{teacher.email}</div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${teacher.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {teacher.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <p className="text-xs text-slate-600">Courses</p>
                                        <p className="font-medium text-slate-900">{teacher.courses.map(c => c.title).join(', ') || 'No courses'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600">Course Count</p>
                                        <div className="flex items-center">
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                                            <span className="font-medium text-slate-900">{teacher.courseCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toast.info(`Viewing ${teacher.name}'s profile`)}
                                        className="flex-1 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors flex items-center justify-center"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </button>
                                    {teacher.status === 'active' ? (
                                        <button
                                            onClick={() => handleAction('suspend', teacher)}
                                            className="flex-1 px-3 py-2 text-sm bg-amber-50 hover:bg-amber-100 text-amber-700 rounded transition-colors flex items-center justify-center"
                                        >
                                            <UserX className="w-4 h-4 mr-1" />
                                            Suspend
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction('activate', teacher)}
                                            className="flex-1 px-3 py-2 text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition-colors flex items-center justify-center"
                                        >
                                            <UserPlus className="w-4 h-4 mr-1" />
                                            Activate
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAction('remove', teacher)}
                                        className="px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* View All Teachers CTA */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                        <button
                            onClick={() => window.location.href = '/admin/dashboard/teacher/all'}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                        >
                            View All Teachers
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {selectedAction && actionTeacher && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={cancelAction}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                                {selectedAction === 'remove' ? (
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                ) : selectedAction === 'suspend' ? (
                                    <UserX className="w-6 h-6 text-amber-600" />
                                ) : (
                                    <UserPlus className="w-6 h-6 text-emerald-600" />
                                )}
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {selectedAction === 'remove' ? 'Remove Teacher' :
                                    selectedAction === 'suspend' ? 'Suspend Account' : 'Activate Account'}
                            </h3>

                            <p className="text-slate-600 mb-6">
                                Are you sure you want to {selectedAction} <strong>{actionTeacher.name}</strong>?
                                {selectedAction === 'remove' && ' This action cannot be undone.'}
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={cancelAction}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${selectedAction === 'remove'
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : selectedAction === 'suspend'
                                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        }`}
                                >
                                    {selectedAction === 'remove' ? 'Remove' :
                                        selectedAction === 'suspend' ? 'Suspend' : 'Activate'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherAnalytics;