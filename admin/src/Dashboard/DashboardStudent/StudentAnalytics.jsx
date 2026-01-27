import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentAnalytics = () => {
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/auth/students`);
                setStudents(res.data.students.slice(0, 6)); // 👈 max 6 students
                setTotalStudents(res.data.totalStudents);
            } catch (error) {
                console.error('Failed to fetch students', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [BASE_URL]);

    const metrics = [
        {
            id: 1,
            title: 'Total Students',
            value: loading ? '...' : totalStudents,
            change: '+',
            trend: 'up',
            icon: Users,
            color: 'indigo'
        },
        {
            id: 2,
            title: 'Active Students',
            value: loading ? '...' : totalStudents, // optional (same for now)
            change: '+',
            trend: 'up',
            icon: UserCheck,
            color: 'emerald'
        },
        {
            id: 3,
            title: 'Course Enrollments',
            value: '—',
            change: '+',
            trend: 'up',
            icon: BookOpen,
            color: 'blue'
        },
        {
            id: 4,
            title: 'Completion Rate',
            value: '—',
            change: '-',
            trend: 'down',
            icon: TrendingUp,
            color: 'amber'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100'
        };
        return colors[color] || colors.indigo;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Student Analytics
                    </h1>
                    <p className="text-slate-600">
                        Overview of student performance and engagement
                    </p>
                </motion.div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg border ${getColorClasses(metric.color)}`}>
                                    <metric.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-slate-600 text-sm font-medium mb-1">
                                {metric.title}
                            </h3>
                            <p className="text-3xl font-bold text-slate-900">
                                {metric.value}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                Recent Students
                            </h2>
                            <button
                                onClick={() => navigate('/admin/dashboard/studentlist')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                            >
                                View All Students
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-slate-500">Loading students...</p>
                        ) : (
                            <div className="space-y-4">
                                {students.map((student) => (
                                    <div
                                        key={student._id}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-indigo-50/30"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                                            {student.fullName?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">
                                                {student.fullName}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {student.email}
                                            </p>
                                        </div>
                                        {student.isSuspended && (
                                            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                                                Suspended
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StudentAnalytics;
