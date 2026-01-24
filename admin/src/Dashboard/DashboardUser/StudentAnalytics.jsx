import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  ChevronRight,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Calendar,
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Filter,
  Download,
  RefreshCw,
  Search,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

const StudentAnalytics = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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

  // Period options
  const periods = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
    { value: '1year', label: '1 Year' }
  ];

  // Summary Statistics
  const summaryStats = [
    {
      id: 1,
      label: 'Total Students',
      value: '12,458',
      change: '+18.2%',
      isPositive: true,
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 2,
      label: 'Active Students',
      value: '8,245',
      change: '+12.8%',
      isPositive: true,
      icon: UserCheck,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 3,
      label: 'New This Month',
      value: '1,482',
      change: '+24.5%',
      isPositive: true,
      icon: UserPlus,
      color: 'cyan',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      id: 4,
      label: 'Inactive Students',
      value: '892',
      change: '-5.2%',
      isPositive: false,
      icon: UserX,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    }
  ];

  // Engagement Metrics
  const engagementMetrics = [
    {
      id: 1,
      label: 'Avg. Session Time',
      value: '42 min',
      icon: Clock,
      change: '+8%',
      isPositive: true
    },
    {
      id: 2,
      label: 'Course Completion',
      value: '68%',
      icon: CheckCircle2,
      change: '+12%',
      isPositive: true
    },
    {
      id: 3,
      label: 'Active Courses',
      value: '3.2',
      icon: BookOpen,
      change: '+5%',
      isPositive: true
    },
    {
      id: 4,
      label: 'Avg. Performance',
      value: '85%',
      icon: Award,
      change: '+3%',
      isPositive: true
    }
  ];

  // Student Growth Data (Mock)
  const monthlyGrowth = [
    { month: 'Jan', students: 320 },
    { month: 'Feb', students: 420 },
    { month: 'Mar', students: 380 },
    { month: 'Apr', students: 520 },
    { month: 'May', students: 480 },
    { month: 'Jun', students: 620 }
  ];

  // Recent Students
  const recentStudents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'active',
      enrolled: '2 days ago',
      courses: 3,
      progress: 45
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      status: 'active',
      enrolled: '5 days ago',
      courses: 2,
      progress: 78
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      status: 'active',
      enrolled: '1 week ago',
      courses: 4,
      progress: 62
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.k@example.com',
      status: 'inactive',
      enrolled: '2 weeks ago',
      courses: 1,
      progress: 12
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      status: 'active',
      enrolled: '3 weeks ago',
      courses: 3,
      progress: 89
    }
  ];

  // Status Distribution
  const statusDistribution = [
    { status: 'Active', count: 8245, percentage: 66, color: 'bg-green-500' },
    { status: 'Inactive', count: 3321, percentage: 27, color: 'bg-amber-500' },
    { status: 'Suspended', count: 892, percentage: 7, color: 'bg-red-500' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-50', text: 'text-green-700', label: 'Active' },
      inactive: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Inactive' },
      suspended: { bg: 'bg-red-50', text: 'text-red-700', label: 'Suspended' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
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
            <span className="text-indigo-600 font-medium">Students</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Student Analytics
              </h1>
              <p className="text-slate-600">
                Track student growth, engagement, and account status.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Export</span>
              </button>
              <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-slate-200 w-fit">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedPeriod === period.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Engagement Metrics */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span className={`text-xs font-medium ${metric.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-slate-600">
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Growth Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Student Growth Trend
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Monthly student registration overview
              </p>
            </div>
            <div className="p-6">
              {/* Simple Bar Chart Visualization */}
              <div className="h-64 flex items-end justify-around gap-2">
                {monthlyGrowth.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.students / 620) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg relative group cursor-pointer hover:from-indigo-600 hover:to-indigo-500 transition-colors"
                    >
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.students}
                      </span>
                    </motion.div>
                    <span className="text-xs text-slate-600 mt-2 font-medium">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-slate-200"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Status Distribution
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {statusDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {item.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {item.percentage}% of total
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Students Table */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200"
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Students
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Latest student registrations
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {student.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">
                        {student.courses}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 font-medium">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {student.enrolled}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentAnalytics;