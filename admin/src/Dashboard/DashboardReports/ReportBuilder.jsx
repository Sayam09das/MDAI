import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home, ChevronRight, FileText, Download, Calendar, RefreshCw, Filter, Search, Check, X, Clock, TrendingUp, Users, BookOpen, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        window.location.href = "/admin/login";
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };
};

const ReportBuilder = () => {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    
    const [selectedReport, setSelectedReport] = useState('enrollment');
    const [dateRange, setDateRange] = useState('30days');
    const [generating, setGenerating] = useState(false);
    const [reportData, setReportData] = useState({
        stats: {
            totalCourses: 0,
            totalEnrollments: 0,
            totalRevenue: 0,
            avgRating: 0,
            completionRate: 0,
            totalStudents: 0
        },
        charts: {
            monthlyEnrollments: [],
            categoryData: [],
            topCourses: []
        },
        generatedReports: []
    });

    const fetchReportStats = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/reports/stats?period=${dateRange}`, getAuthHeaders());
            
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Invalid server response');
            }

            const result = await res.json();

            if (result.success) {
                setReportData(prev => ({
                    ...prev,
                    stats: result.stats || prev.stats,
                    charts: result.charts || prev.charts
                }));
                setLastUpdated(new Date());
                if (showRefresh) {
                    toast.success('Reports refreshed!');
                }
            } else {
                throw new Error(result.message || 'Failed to fetch stats');
            }
        } catch (error) {
            console.error('Error fetching report stats:', error);
            if (showRefresh) {
                toast.error('Failed to refresh reports');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [dateRange]);

    // Fetch available generated reports list
    const fetchGeneratedReports = useCallback(async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/audit-logs?action=GENERATE_REPORT&limit=20`, getAuthHeaders());
            const result = await res.json();
            if (result.success) {
                // Transform audit logs to report format
                const reports = result.logs?.map((log, index) => ({
                    id: log._id || index,
                    name: log.details?.replace('Generated report: ', '') || 'Custom Report',
                    type: 'custom',
                    lastGenerated: new Date(log.createdAt).toISOString().split('T')[0],
                    status: 'completed',
                    createdAt: log.createdAt
                })) || [];
                setReportData(prev => ({ ...prev, generatedReports: reports }));
            }
        } catch (error) {
            console.error('Error fetching generated reports:', error);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchReportStats();
        fetchGeneratedReports();
        
        // Auto-refresh every 30 seconds for real-time updates
        const intervalId = setInterval(() => {
            fetchReportStats(false);
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchReportStats, fetchGeneratedReports]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            // Simulate report generation with backend notification
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Refresh data after generation
            await fetchReportStats(false);
            await fetchGeneratedReports();
            
            toast.success(`${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report generated successfully!`);
        } catch (error) {
            toast.error('Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    const handleRefresh = () => {
        fetchReportStats(true);
        fetchGeneratedReports();
    };

    // Prepare chart data
    const chartData = reportData.charts.monthlyEnrollments?.length > 0 
        ? reportData.charts.monthlyEnrollments.map(item => ({
            name: item._id?.month ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][item._id.month - 1] : item.month || 'Unknown',
            enrollments: item.enrollments || item.count || 0,
            revenue: item.revenue || 0
        }))
        : [];

    // Format numbers
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '0';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    // Quick stats data
    const quickStatsData = [
        {
            label: 'Total Courses',
            value: loading ? '...' : formatNumber(reportData.stats.totalCourses),
            icon: BookOpen,
            color: 'indigo'
        },
        {
            label: 'Total Enrollments',
            value: loading ? '...' : formatNumber(reportData.stats.totalEnrollments),
            icon: Users,
            color: 'cyan'
        },
        {
            label: 'Total Revenue',
            value: loading ? '...' : formatCurrency(reportData.stats.totalRevenue),
            icon: DollarSign,
            color: 'green'
        },
        {
            label: 'Avg Rating',
            value: loading ? '...' : (reportData.stats.avgRating || 0).toFixed(1),
            icon: TrendingUp,
            color: 'amber'
        }
    ];

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.name.includes('Revenue') ? formatCurrency(entry.value) : formatNumber(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={mounted ? "visible" : "hidden"}
                className="max-w-7xl mx-auto space-y-6"
            >
                <ToastContainer position="top-right" />
                
                {/* Header */}
                <motion.div variants={itemVariants}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-indigo-600" />
                                Reports & Analytics
                            </h1>
                            <p className="text-slate-600 mt-1 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-500" />
                                Real-time data
                                {lastUpdated && (
                                    <span className="text-xs text-slate-400">
                                        (Updated: {lastUpdated.toLocaleTimeString()})
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2 border border-slate-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span className="text-sm font-medium">Refresh</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Report Generator */}
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">Generate Report</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Live Data
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                            <select 
                                value={selectedReport} 
                                onChange={(e) => setSelectedReport(e.target.value)} 
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="enrollment">Student Enrollment</option>
                                <option value="courses">Course Performance</option>
                                <option value="revenue">Revenue</option>
                                <option value="teachers">Teacher Activity</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                            <select 
                                value={dateRange} 
                                onChange={(e) => setDateRange(e.target.value)} 
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="90days">Last 90 Days</option>
                                <option value="1year">Last Year</option>
                            </select>
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={handleGenerate} 
                        disabled={generating}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {generating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        {generating ? 'Generating...' : 'Generate Report'}
                    </motion.button>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickStatsData.map((stat, index) => {
                            const Icon = stat.icon;
                            const colorClasses = {
                                indigo: 'bg-indigo-50 text-indigo-600',
                                cyan: 'bg-cyan-50 text-cyan-600',
                                green: 'bg-green-50 text-green-600',
                                amber: 'bg-amber-50 text-amber-600'
                            };
                            
                            return (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ y: -2 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                                >
                                    <div className={`w-10 h-10 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center mb-3`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900 mb-1">
                                        {loading ? (
                                            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded"></div>
                                        ) : (
                                            stat.value
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-600">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Enrollment Trends Chart */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Enrollment Trends</h3>
                                    <p className="text-sm text-slate-600">Monthly enrollments & revenue</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-64 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatNumber} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="enrollments" name="Enrollments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="revenue" name="Revenue ($)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-slate-400">
                                    No data available for selected period
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Category Distribution */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-cyan-50 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-cyan-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Category Distribution</h3>
                                    <p className="text-sm text-slate-600">Courses by category</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-64 bg-slate-100 animate-pulse rounded-lg"></div>
                            ) : reportData.charts.categoryData?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={reportData.charts.categoryData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis type="number" stroke="#64748b" fontSize={12} />
                                        <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} />
                                        <Tooltip />
                                        <Bar dataKey="value" name="Courses" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-slate-400">
                                    No category data available
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Top Courses */}
                {reportData.charts.topCourses?.length > 0 && (
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Top Performing Courses</h3>
                                    <p className="text-sm text-slate-600">Based on enrollments</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {reportData.charts.topCourses.slice(0, 5).map((course, index) => (
                                    <div 
                                        key={course.id || index}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 truncate max-w-xs">
                                                    {course.title || 'Unknown Course'}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {formatNumber(course.enrollments || 0)} enrollments
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-slate-900">
                                                {formatCurrency(course.revenue || 0)}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                ⭐ {course.rating || 0}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Generated Reports History */}
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <FileText className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Recent Generated Reports</h3>
                                <p className="text-sm text-slate-600">Previously generated reports</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-lg"></div>
                                ))}
                            </div>
                        ) : reportData.generatedReports.length > 0 ? (
                            <div className="space-y-3">
                                {reportData.generatedReports.slice(0, 5).map((report) => (
                                    <div 
                                        key={report.id}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{report.name}</div>
                                                <div className="text-sm text-slate-500">
                                                    Generated on {report.lastGenerated}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No reports generated yet</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ReportBuilder;
