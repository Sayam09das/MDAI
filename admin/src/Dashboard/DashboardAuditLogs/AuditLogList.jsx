import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ChevronRight, Clock, User, Activity, FileText, Search, Filter, Download, Eye, RefreshCw } from 'lucide-react';
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

// Default mock data for fallback
const defaultLogs = [
    { id: 1, _id: '1', action: 'User Login', user: 'Admin', ip: '192.168.1.1', timestamp: '2024-01-15 10:30:45', status: 'success' },
    { id: 2, _id: '2', action: 'Course Created', user: 'Admin', ip: '192.168.1.1', timestamp: '2024-01-15 10:25:12', status: 'success' },
    { id: 3, _id: '3', action: 'Student Suspended', user: 'Admin', ip: '192.168.1.1', timestamp: '2024-01-15 10:20:33', status: 'warning' },
    { id: 4, _id: '4', action: 'Settings Updated', user: 'Admin', ip: '192.168.1.1', timestamp: '2024-01-15 10:15:00', status: 'success' },
    { id: 5, _id: '5', action: 'Failed Login', user: 'Unknown', ip: '192.168.1.45', timestamp: '2024-01-15 10:10:22', status: 'error' }
];

const AuditLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ total: 0, success: 0, warnings: 0, errors: 0 });

    useEffect(() => {
        fetchLogs();
    }, [filterStatus, searchQuery]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus !== 'all') {
                params.append('status', filterStatus);
            }
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const res = await fetch(`${BACKEND_URL}/api/admin/audit-logs?${params}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                // Transform logs to match expected format
                const formattedLogs = data.logs.map(log => ({
                    _id: log._id,
                    id: log._id,
                    action: log.action,
                    user: log.adminId?.name || log.user || 'Admin',
                    ip: log.ip || 'N/A',
                    timestamp: new Date(log.createdAt).toLocaleString(),
                    status: log.status
                }));
                setLogs(formattedLogs);

                // Set stats
                setStats({
                    total: data.stats?.total || formattedLogs.length,
                    success: data.stats?.success || formattedLogs.filter(l => l.status === 'success').length,
                    warnings: data.stats?.warnings || formattedLogs.filter(l => l.status === 'warning').length,
                    errors: data.stats?.errors || formattedLogs.filter(l => l.status === 'error').length
                });
            } else {
                setLogs(defaultLogs);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            setLogs(defaultLogs);
            toast.warning('Using cached data - unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            log.user?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" /><ChevronRight className="w-4 h-4" /><span>Dashboard</span><ChevronRight className="w-4 h-4" /><span className="text-slate-900 font-medium">Audit Logs</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6"><Activity className="w-8 h-8 text-indigo-600" />Audit Logs</h1>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><p className="text-2xl font-bold text-slate-900">{stats.total}</p><p className="text-sm text-slate-600">Total Events</p></motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><p className="text-2xl font-bold text-green-600">{stats.success}</p><p className="text-sm text-slate-600">Successful</p></motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><p className="text-2xl font-bold text-amber-600">{stats.warnings}</p><p className="text-sm text-slate-600">Warnings</p></motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><p className="text-2xl font-bold text-red-600">{stats.errors}</p><p className="text-sm text-slate-600">Errors</p></motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg" /></div>
                        <div className="flex gap-2">{['all', 'success', 'warning', 'error'].map(status => (<button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-sm ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}</button>))}</div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Action</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">IP Address</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-900">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{log.user}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.ip}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{log.timestamp}</td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${log.status === 'success' ? 'bg-green-100 text-green-700' : log.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{log.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
};
export default AuditLogList;
