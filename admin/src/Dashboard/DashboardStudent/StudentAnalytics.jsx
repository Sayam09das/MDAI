import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentAnalytics = () => {
    const navigate = useNavigate();

    const metrics = [
        {
            id: 1,
            title: 'Total Students',
            value: '12,458',
            change: '+18.2%',
            trend: 'up',
            icon: Users,
            color: 'indigo'
        },
        {
            id: 2,
            title: 'Active Students',
            value: '9,234',
            change: '+12.5%',
            trend: 'up',
            icon: UserCheck,
            color: 'emerald'
        },
        {
            id: 3,
            title: 'Course Enrollments',
            value: '45,678',
            change: '+24.3%',
            trend: 'up',
            icon: BookOpen,
            color: 'blue'
        },
        {
            id: 4,
            title: 'Completion Rate',
            value: '78.5%',
            change: '-2.1%',
            trend: 'down',
            icon: TrendingUp,
            color: 'amber'
        }
    ];

    const recentActivities = [
        { student: 'Emma Wilson', action: 'Completed "Advanced JavaScript"', time: '2 hours ago' },
        { student: 'James Chen', action: 'Enrolled in "React Fundamentals"', time: '3 hours ago' },
        { student: 'Sarah Johnson', action: 'Achieved 95% on final exam', time: '5 hours ago' },
        { student: 'Michael Brown', action: 'Started "Python Basics"', time: '6 hours ago' },
        { student: 'Lisa Davis', action: 'Completed 3 courses this week', time: '8 hours ago' }
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

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg border ${getColorClasses(metric.color)}`}>
                                    <metric.icon className="w-6 h-6" />
                                </div>
                                <span
                                    className={`text-sm font-medium px-2 py-1 rounded-full ${metric.trend === 'up'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-red-50 text-red-600'
                                        }`}
                                >
                                    {metric.change}
                                </span>
                            </div>
                            <h3 className="text-slate-600 text-sm font-medium mb-1">
                                {metric.title}
                            </h3>
                            <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                Recent Activities
                            </h2>
                            <button
                                onClick={() => navigate('/admin/dashboard/studentlist')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors group"
                            >
                                View All Students
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.05 }}
                                    className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                        {activity.student.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-900 font-medium mb-1">
                                            {activity.student}
                                        </p>
                                        <p className="text-slate-600 text-sm mb-1">
                                            {activity.action}
                                        </p>
                                        <p className="text-slate-400 text-xs">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Side Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Performance Distribution */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Performance Distribution
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Excellent (90-100%)', value: 35, color: 'emerald' },
                                    { label: 'Good (80-89%)', value: 40, color: 'blue' },
                                    { label: 'Fair (70-79%)', value: 18, color: 'amber' },
                                    { label: 'Needs Improvement', value: 7, color: 'red' }
                                ].map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm text-slate-600">{item.label}</span>
                                            <span className="text-sm font-semibold text-slate-900">
                                                {item.value}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.value}%` }}
                                                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                                                className={`h-full rounded-full ${item.color === 'emerald' ? 'bg-emerald-500' :
                                                        item.color === 'blue' ? 'bg-blue-500' :
                                                            item.color === 'amber' ? 'bg-amber-500' :
                                                                'bg-red-500'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Export Student Data', icon: '📊' },
                                    { label: 'Send Bulk Email', icon: '📧' },
                                    { label: 'Generate Report', icon: '📄' },
                                    { label: 'Manage Courses', icon: '📚' }
                                ].map((action, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                                    >
                                        <span className="text-xl">{action.icon}</span>
                                        <span className="text-sm font-medium text-slate-700">
                                            {action.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StudentAnalytics;