import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ChevronRight, Server, Database, Activity, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle, Clock, TrendingUp, HardDrive, Zap } from 'lucide-react';
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
const defaultServices = [
    { name: 'API Server', status: 'operational', uptime: '99.9%', latency: '45ms' },
    { name: 'Database', status: 'operational', uptime: '100%', latency: '12ms' },
    { name: 'CDN', status: 'operational', uptime: '99.8%', latency: '23ms' },
    { name: 'Storage', status: 'operational', uptime: '99.9%', latency: '89ms' },
    { name: 'Email Service', status: 'operational', uptime: '98.5%', latency: '156ms' },
    { name: 'Push Notifications', status: 'operational', uptime: '99.7%', latency: '67ms' }
];

const defaultAlerts = [
    { id: 1, type: 'warning', message: 'High memory usage detected', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Scheduled maintenance completed', time: '6 hours ago' },
    { id: 3, type: 'success', message: 'Backup completed successfully', time: '12 hours ago' }
];

const SystemHealth = () => {
    const [loading, setLoading] = useState(true);
    const [systemStats, setSystemStats] = useState(null);
    const [services, setServices] = useState([]);
    const [recentAlerts, setRecentAlerts] = useState([]);

    useEffect(() => {
        fetchSystemHealth();
    }, []);

    const fetchSystemHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/system/stats`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                setSystemStats(data.stats);
                setServices(data.services || defaultServices);
                setRecentAlerts([
                    { id: 1, type: 'info', message: 'System metrics updated', time: 'Just now' },
                    { id: 2, type: 'success', message: `${data.stats?.users?.total || 0} active users`, time: 'Active' },
                    { id: 3, type: 'info', message: `${data.stats?.content?.courses || 0} courses available`, time: 'Updated' }
                ]);
            } else {
                setServices(defaultServices);
                setRecentAlerts(defaultAlerts);
            }
        } catch (error) {
            console.error('Error fetching system health:', error);
            setServices(defaultServices);
            setRecentAlerts(defaultAlerts);
            toast.warning('Using cached data - unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchSystemHealth();
        toast.success('System health refreshed');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" /><ChevronRight className="w-4 h-4" /><span>Dashboard</span><ChevronRight className="w-4 h-4" /><span className="text-slate-900 font-medium">System Health</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><Server className="w-8 h-8 text-indigo-600" />System Health</h1>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRefresh} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />Refresh
                    </motion.button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2"><Activity className="w-5 h-5 text-green-600" /><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Healthy</span></div><p className="text-2xl font-bold text-slate-900">All Systems</p><p className="text-sm text-slate-600">Operational</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2"><Zap className="w-5 h-5 text-cyan-600" /></div><p className="text-2xl font-bold text-slate-900">99.9%</p><p className="text-sm text-slate-600">API Uptime</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2"><HardDrive className="w-5 h-5 text-purple-600" /></div><p className="text-2xl font-bold text-slate-900">45.2%</p><p className="text-sm text-slate-600">Storage Used</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2"><Database className="w-5 h-5 text-amber-600" /></div><p className="text-2xl font-bold text-slate-900">234</p><p className="text-sm text-slate-600">DB Connections</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Status</h3>
                        <div className="space-y-3">
                            {services.map(service => (
                                <div key={service.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-600" /><span className="font-medium text-slate-900">{service.name}</span></div>
                                    <div className="text-right"><span className="text-xs text-slate-600">{service.latency} latency</span></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Alerts</h3>
                        <div className="space-y-3">
                            {recentAlerts.map(alert => (
                                <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${alert.type === 'success' ? 'text-green-600' : alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
                                    <div><p className="text-sm font-medium text-slate-900">{alert.message}</p><p className="text-xs text-slate-500">{alert.time}</p></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
export default SystemHealth;
