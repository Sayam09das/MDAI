import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    ChevronRight, 
    Server, 
    Database, 
    Activity, 
    Wifi, 
    WifiOff, 
    RefreshCw, 
    AlertTriangle, 
    CheckCircle, 
    Clock, 
    TrendingUp, 
    HardDrive, 
    Zap,
    Cpu,
    Globe,
    Mail,
    Bell,
    Terminal
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAdminSocket } from '../../context/AdminSocketContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Default mock data for fallback
const defaultServices = [
    { name: 'API Server', status: 'operational', uptime: '99.9%', latency: '45ms' },
    { name: 'Database', status: 'operational', uptime: '100%', latency: '12ms' },
    { name: 'CDN', status: 'operational', uptime: '99.8%', latency: '23ms' },
    { name: 'Storage', status: 'operational', uptime: '99.9%', latency: '89ms' },
    { name: 'Email Service', status: 'operational', uptime: '98.5%', latency: '156ms' },
    { name: 'Push Notifications', status: 'operational', uptime: '99.7%', latency: '67ms' }
];

const SystemHealth = () => {
    const { isConnected, lastHealthData, alerts, requestHealthUpdate, clearAlerts } = useAdminSocket();
    
    const [loading, setLoading] = useState(true);
    const [systemStats, setSystemStats] = useState(null);
    const [services, setServices] = useState([]);
    const [recentAlerts, setRecentAlerts] = useState([]);
    const [realtimeData, setRealtimeData] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Fetch initial system health from API
    const fetchSystemHealth = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${BACKEND_URL}/api/admin/system/health/realtime`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            if (data.success) {
                setRealtimeData(data);
                setLastUpdate(new Date());
                
                // Update services from realtime data
                if (data.services) {
                    setServices(data.services);
                }
                
                // Update stats
                setSystemStats({
                    users: { total: data.metrics?.totalUsers || 0 },
                    content: { courses: data.metrics?.totalCourses || 0 },
                    memory: data.memory,
                    database: data.database
                });
            }
        } catch (error) {
            console.error('Error fetching system health:', error);
            setServices(defaultServices);
            setRecentAlerts([
                { id: 1, type: 'warning', message: 'Unable to connect to server', time: 'Just now' }
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSystemHealth();
        
        // Set up polling interval (every 30 seconds as backup to socket)
        const intervalId = setInterval(() => {
            if (autoRefresh) {
                fetchSystemHealth();
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchSystemHealth, autoRefresh]);

    // Update realtime data from socket
    useEffect(() => {
        if (lastHealthData) {
            setRealtimeData(lastHealthData);
            setLastUpdate(new Date());
            
            if (lastHealthData.services) {
                setServices(lastHealthData.services);
            }
            
            if (lastHealthData.memory || lastHealthData.database) {
                setSystemStats(prev => ({
                    ...prev,
                    memory: lastHealthData.memory,
                    database: lastHealthData.database
                }));
            }
        }
    }, [lastHealthData]);

    // Update alerts from socket
    useEffect(() => {
        if (alerts.length > 0) {
            setRecentAlerts(alerts.map((alert, index) => ({
                id: alert.id || index,
                type: alert.type,
                message: alert.message,
                time: 'Just now',
                source: alert.source
            })));
        }
    }, [alerts]);

    const handleRefresh = useCallback(() => {
        requestHealthUpdate();
        fetchSystemHealth();
        toast.success('System health refreshed');
    }, [requestHealthUpdate, fetchSystemHealth]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'operational': case 'healthy': case 'connected':
                return 'text-green-600';
            case 'degraded': case 'warning':
                return 'text-amber-600';
            case 'critical': case 'disconnected':
                return 'text-red-600';
            default:
                return 'text-slate-600';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'operational': case 'healthy': case 'connected':
                return 'bg-green-100';
            case 'degraded': case 'warning':
                return 'bg-amber-100';
            case 'critical': case 'disconnected':
                return 'bg-red-100';
            default:
                return 'bg-slate-100';
        }
    };

    const getMemoryColor = (percent) => {
        if (percent > 85) return 'bg-red-500';
        if (percent > 70) return 'bg-amber-500';
        return 'bg-green-500';
    };

    const formatMemory = (mb) => {
        if (mb >= 1024) {
            return `${(mb / 1024).toFixed(2)} GB`;
        }
        return `${mb} MB`;
    };

    // Calculate overall system health
    const overallStatus = realtimeData?.health?.status || 'healthy';
    const isSystemHealthy = overallStatus === 'healthy' || overallStatus === 'operational';

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb & Header */}
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium">System Health</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Server className="w-8 h-8 text-indigo-600" />
                            System Health
                        </h1>
                        <p className="text-slate-600 mt-1">Real-time monitoring dashboard</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {isConnected ? (
                                <>
                                    <Wifi className="w-4 h-4" />
                                    <span className="text-sm font-medium">Live</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-4 h-4" />
                                    <span className="text-sm font-medium">Offline</span>
                                </>
                            )}
                        </div>

                        {/* Auto Refresh Toggle */}
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                autoRefresh 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
                            {autoRefresh ? 'Auto' : 'Manual'}
                        </button>

                        {/* Refresh Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </motion.button>
                    </div>
                </div>

                {/* Last Update Time */}
                {lastUpdate && (
                    <div className="mb-4 text-sm text-slate-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                )}

                {/* Status Overview Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Overall Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl shadow-sm border p-4 ${
                            isSystemHealthy ? 'border-green-200' : 'border-red-200'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Activity className={`w-5 h-5 ${isSystemHealthy ? 'text-green-600' : 'text-red-600'}`} />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isSystemHealthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {realtimeData?.health?.overall || 'Checking...'}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {isSystemHealthy ? 'All Systems' : 'Issues Detected'}
                        </p>
                        <p className="text-sm text-slate-600">
                            {isSystemHealthy ? 'Operational' : 'Needs Attention'}
                        </p>
                    </motion.div>

                    {/* API Uptime */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Zap className="w-5 h-5 text-cyan-600" />
                            <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full">
                                Live
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {realtimeData?.server?.uptime?.formatted || '99.9%'}
                        </p>
                        <p className="text-sm text-slate-600">Server Uptime</p>
                    </motion.div>

                    {/* Memory Usage */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <HardDrive className="w-5 h-5 text-purple-600" />
                            <span className={`text-xs font-medium ${getStatusColor(realtimeData?.memory?.status)}`}>
                                {realtimeData?.memory?.percent || 0}%
                            </span>
                        </div>
                        <div className="mb-2">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${realtimeData?.memory?.percent || 0}%` }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-full ${getMemoryColor(realtimeData?.memory?.percent || 0)}`}
                                />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                            {formatMemory(realtimeData?.memory?.heapUsed || 0)}
                        </p>
                        <p className="text-xs text-slate-600">
                            / {formatMemory(realtimeData?.memory?.heapTotal || 0)} Heap
                        </p>
                    </motion.div>

                    {/* Database Connections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Database className={`w-5 h-5 ${getStatusColor(realtimeData?.database?.status)}`} />
                            <span className={`text-xs font-medium ${getStatusColor(realtimeData?.database?.status)}`}>
                                {realtimeData?.database?.status || 'unknown'}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {realtimeData?.database?.collections?.total || 0}
                        </p>
                        <p className="text-sm text-slate-600">Total Collections</p>
                    </motion.div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* System Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-indigo-600" />
                                System Metrics
                            </h3>
                            <span className="text-sm text-slate-500">Live from server</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* CPU/Node */}
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Cpu className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs text-slate-600">Node.js</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {realtimeData?.server?.nodeVersion || 'v18.x'}
                                </p>
                            </div>

                            {/* Platform */}
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-slate-600">Platform</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-900 capitalize">
                                    {realtimeData?.server?.platform || 'linux'}
                                </p>
                            </div>

                            {/* Users */}
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-indigo-600" />
                                    <span className="text-xs text-slate-600">Users</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {realtimeData?.metrics?.totalUsers || 0}
                                </p>
                            </div>

                            {/* Courses */}
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Server className="w-4 h-4 text-cyan-600" />
                                    <span className="text-xs text-slate-600">Courses</span>
                                </div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {realtimeData?.metrics?.totalCourses || 0}
                                </p>
                            </div>
                        </div>

                        {/* Memory Details */}
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-slate-900 mb-3">Memory Details</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-600">Heap Used</p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formatMemory(realtimeData?.memory?.heapUsed || 0)}
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-600">Heap Total</p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formatMemory(realtimeData?.memory?.heapTotal || 0)}
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-600">RSS Memory</p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formatMemory(realtimeData?.memory?.used || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Service Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Services
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {(services.length > 0 ? services : defaultServices).map((service, index) => (
                                <div 
                                    key={service.name + index} 
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${getStatusBg(service.status).replace('bg-', '').replace('-100', '-500')}`} />
                                        <span className="font-medium text-slate-900 text-sm">{service.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs ${getStatusColor(service.status)}`}>
                                            {service.latency}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Real-time Alerts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-amber-600" />
                                Real-time Alerts
                            </h3>
                            {alerts.length > 0 && (
                                <button 
                                    onClick={clearAlerts}
                                    className="text-xs text-indigo-600 hover:text-indigo-700"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {recentAlerts.length > 0 ? (
                                recentAlerts.map((alert) => (
                                    <div 
                                        key={alert.id} 
                                        className={`flex items-start gap-3 p-3 rounded-lg ${
                                            alert.type === 'critical' 
                                                ? 'bg-red-50' 
                                                : alert.type === 'warning'
                                                ? 'bg-amber-50'
                                                : 'bg-blue-50'
                                        }`}
                                    >
                                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                                            alert.type === 'critical' 
                                                ? 'text-red-600' 
                                                : alert.type === 'warning'
                                                ? 'text-amber-600'
                                                : 'text-blue-600'
                                        }`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">
                                                {alert.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    alert.type === 'critical' 
                                                        ? 'bg-red-100 text-red-700'
                                                        : alert.type === 'warning'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {alert.type.toUpperCase()}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {alert.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                    <p>No active alerts</p>
                                    <p className="text-sm">All systems running smoothly</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Database Collections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Database className="w-5 h-5 text-indigo-600" />
                                Database Collections
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBg(realtimeData?.database?.status)}`}>
                                {realtimeData?.database?.status || 'connected'}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'Users', count: realtimeData?.database?.collections?.users || 0 },
                                { name: 'Teachers', count: realtimeData?.database?.collections?.teachers || 0 },
                                { name: 'Courses', count: realtimeData?.database?.collections?.courses || 0 },
                                { name: 'Enrollments', count: realtimeData?.database?.collections?.enrollments || 0 },
                                { name: 'Resources', count: realtimeData?.database?.collections?.resources || 0 },
                            ].map((collection) => (
                                <div key={collection.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-900">{collection.name}</span>
                                    <span className="text-sm text-indigo-600 font-semibold">
                                        {collection.count.toLocaleString()}
                                    </span>
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

