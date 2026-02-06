import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, ChevronRight, FileText, Download, Calendar, RefreshCw, Filter, Search, Check, X, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mockReports = [
    { id: 1, name: 'Student Enrollment Report', type: 'enrollment', lastGenerated: '2024-01-15', status: 'completed' },
    { id: 2, name: 'Course Performance Report', type: 'courses', lastGenerated: '2024-01-14', status: 'completed' },
    { id: 3, name: 'Revenue Report', type: 'revenue', lastGenerated: '2024-01-13', status: 'completed' },
    { id: 4, name: 'Teacher Activity Report', type: 'teachers', lastGenerated: '2024-01-12', status: 'completed' }
];

const ReportBuilder = () => {
    const [selectedReport, setSelectedReport] = useState('enrollment');
    const [dateRange, setDateRange] = useState('30days');
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            toast.success('Report generated successfully!');
        }, 2000);
    };

    const chartData = [
        { name: 'Jan', value: 65 }, { name: 'Feb', value: 72 },
        { name: 'Mar', value: 68 }, { name: 'Apr', value: 85 },
        { name: 'May', value: 90 }, { name: 'Jun', value: 78 }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" /><ChevronRight className="w-4 h-4" /><span>Dashboard</span><ChevronRight className="w-4 h-4" /><span className="text-slate-900 font-medium">Reports</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6"><FileText className="w-8 h-8 text-indigo-600" />Reports & Analytics</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Generate Report</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                                <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                                    <option value="enrollment">Student Enrollment</option>
                                    <option value="courses">Course Performance</option>
                                    <option value="revenue">Revenue</option>
                                    <option value="teachers">Teacher Activity</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                    <option value="90days">Last 90 Days</option>
                                    <option value="1year">Last Year</option>
                                </select>
                            </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerate} disabled={generating} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                            {generating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                            {generating ? 'Generating...' : 'Generate Report'}
                        </motion.button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"><span className="text-slate-600">Total Reports</span><span className="font-bold text-slate-900">156</span></div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"><span className="text-slate-600">This Month</span><span className="font-bold text-slate-900">24</span></div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"><span className="text-slate-600">Downloads</span><span className="font-bold text-slate-900">1,245</span></div>
                        </div>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Preview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
};

export default ReportBuilder;
