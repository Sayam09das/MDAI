import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    Bell,
    Megaphone,
    Clock,
    Filter,
    Search,
    Volume2,
    Users,
    AlertCircle,
    Info
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [stats, setStats] = useState({ total: 0, forAll: 0, forTeachers: 0 });

    useEffect(() => {
        fetchAnnouncements();
    }, [filterType, searchQuery]);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const res = await fetch(`${BACKEND_URL}/api/teacher/announcements?${params}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                const formattedAnnouncements = data.announcements.map(ann => ({
                    id: ann.id,
                    title: ann.title,
                    message: ann.message,
                    type: ann.type,
                    priority: ann.priority,
                    sentBy: ann.sentBy,
                    sentAt: new Date(ann.sentAt).toLocaleString(),
                    createdAt: ann.createdAt
                }));

                let filtered = formattedAnnouncements;
                if (filterType !== 'all') {
                    filtered = formattedAnnouncements.filter(ann => ann.type === filterType);
                }

                setAnnouncements(filtered);

                // Calculate stats
                setStats({
                    total: formattedAnnouncements.length,
                    forAll: formattedAnnouncements.filter(a => a.type === 'all').length,
                    forTeachers: formattedAnnouncements.filter(a => a.type === 'teachers').length
                });
            } else {
                toast.error('Failed to fetch announcements');
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'teachers':
                return <Users className="w-5 h-5 text-amber-600" />;
            case 'students':
                return <Volume2 className="w-5 h-5 text-green-600" />;
            default:
                return <Bell className="w-5 h-5 text-indigo-600" />;
        }
    };

    const filteredAnnouncements = announcements.filter(ann => {
        const matchesSearch = ann.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || ann.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer />
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" /><ChevronRight className="w-4 h-4" /><span>Dashboard</span><ChevronRight className="w-4 h-4" /><span className="text-slate-900 font-medium">Announcements</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><Megaphone className="w-8 h-8 text-indigo-600" />Announcements</h1>
                        <p className="text-slate-600 mt-1">Stay updated with the latest announcements from administrators.</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Bell className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                                <p className="text-sm text-slate-600">Total Announcements</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Volume2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.forAll}</p>
                                <p className="text-sm text-slate-600">For All Users</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Users className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.forTeachers}</p>
                                <p className="text-sm text-slate-600">For Teachers Only</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                className="max-w-7xl mx-auto mb-6"
            >
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'all', label: 'For All' },
                                { key: 'teachers', label: 'Teachers' }
                            ].map((type) => (
                                <button
                                    key={type.key}
                                    onClick={() => setFilterType(type.key)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filterType === type.key
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Announcements List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }} 
                className="max-w-7xl mx-auto space-y-4"
            >
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                                <div className="flex-1">
                                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-2" />
                                    <div className="h-4 bg-slate-200 rounded w-full mb-4" />
                                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Megaphone className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Announcements</h3>
                        <p className="text-slate-600">There are no announcements to display at the moment.</p>
                    </div>
                ) : (
                    filteredAnnouncements.map((announcement, index) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedAnnouncement(announcement)}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                <div className={`p-3 rounded-lg flex-shrink-0 ${announcement.type === 'all' ? 'bg-indigo-100' : announcement.type === 'teachers' ? 'bg-amber-100' : 'bg-green-100'}`}>
                                    {getTypeIcon(announcement.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-lg font-semibold text-slate-900">{announcement.title}</h3>
                                            {announcement.priority === 'high' && (
                                                <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                                    <AlertCircle className="w-3 h-3 inline mr-1" />
                                                    Priority
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${announcement.type === 'all' ? 'bg-indigo-100 text-indigo-700' : announcement.type === 'teachers' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                {announcement.type === 'all' ? 'All Users' : announcement.type === 'teachers' ? 'Teachers' : 'Students'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{announcement.sentAt}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 mb-3 line-clamp-2">{announcement.message}</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span>By: {announcement.sentBy}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Announcement Detail Modal */}
            {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedAnnouncement(null)}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${selectedAnnouncement.type === 'all' ? 'bg-indigo-100' : selectedAnnouncement.type === 'teachers' ? 'bg-amber-100' : 'bg-green-100'}`}>
                                    {getTypeIcon(selectedAnnouncement.type)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{selectedAnnouncement.title}</h3>
                                    <p className="text-sm text-slate-500">{selectedAnnouncement.sentAt}</p>
                                </div>
                            </div>
                        </div>
                        <div className="prose prose-slate max-w-none mb-6">
                            <p className="text-slate-700 whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className="text-sm text-slate-500">
                                <span className="mr-4">By: {selectedAnnouncement.sentBy}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${selectedAnnouncement.type === 'all' ? 'bg-indigo-100 text-indigo-700' : selectedAnnouncement.type === 'teachers' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                    {selectedAnnouncement.type === 'all' ? 'All Users' : selectedAnnouncement.type === 'teachers' ? 'Teachers' : 'Students'}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedAnnouncement(null)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Announcements;

