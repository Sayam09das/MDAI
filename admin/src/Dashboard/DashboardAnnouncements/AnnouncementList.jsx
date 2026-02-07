import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, ChevronRight, Bell, Send, Users, Calendar,
    Check, X, Edit, Trash2, Eye, Filter, Search,
    Megaphone, RefreshCw, AlertCircle, MessageSquare
} from 'lucide-react';
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
        } 
    };
};

// Default mock data for initial render
const defaultAnnouncements = [
    { id: 1, title: 'New Python Course Launch', message: 'We are excited to announce the launch of our new Python Programming course!', type: 'all', sentBy: 'Admin', sentAt: '2024-01-15 10:30 AM', status: 'sent', recipients: 12458 },
    { id: 2, title: 'System Maintenance', message: 'Scheduled maintenance on Jan 20th from 2 AM to 4 AM IST', type: 'teachers', sentBy: 'Admin', sentAt: '2024-01-14 02:15 PM', status: 'sent', recipients: 432 },
    { id: 3, title: 'Holiday Notice', message: 'Office will remain closed on Jan 26th for Republic Day', type: 'all', sentBy: 'Admin', sentAt: '2024-01-13 09:00 AM', status: 'sent', recipients: 12458 },
    { id: 4, title: 'New Feature Update', message: 'Check out our new dark mode feature!', type: 'students', sentBy: 'Admin', sentAt: '2024-01-12 04:45 PM', status: 'sent', recipients: 8942 }
];

const AnnouncementList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'all', priority: 'normal' });
    const [stats, setStats] = useState({ total: 0, sentToAll: 0, sentToStudents: 0, sentToTeachers: 0 });
    const [userCounts, setUserCounts] = useState({ students: 0, teachers: 0 });

    useEffect(() => {
        fetchAnnouncements();
        fetchUserCounts();
    }, [filterType, searchQuery]);

    const fetchUserCounts = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/count`, getAuthHeaders());
            const data = await res.json();
            if (data.success) {
                setUserCounts(data.counts);
            }
        } catch (error) {
            console.error('Error fetching user counts:', error);
        }
    };

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterType !== 'all') {
                params.append('type', filterType);
            }
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const res = await fetch(`${BACKEND_URL}/api/admin/announcements?${params}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                // Transform announcements to match expected format
                const formattedAnnouncements = data.announcements.map(ann => ({
                    _id: ann._id,
                    id: ann._id,
                    title: ann.title,
                    message: ann.message,
                    type: ann.type,
                    sentBy: 'Admin',
                    sentAt: new Date(ann.createdAt).toLocaleString(),
                    status: 'sent',
                    recipients: ann.type === 'all' ? userCounts.students + userCounts.teachers : ann.type === 'students' ? userCounts.students : userCounts.teachers,
                    createdAt: ann.createdAt
                }));
                setAnnouncements(formattedAnnouncements);
                
                // Calculate stats
                setStats({
                    total: formattedAnnouncements.length,
                    sentToAll: formattedAnnouncements.filter(a => a.type === 'all').length,
                    sentToStudents: formattedAnnouncements.filter(a => a.type === 'students').length,
                    sentToTeachers: formattedAnnouncements.filter(a => a.type === 'teachers').length
                });
            } else {
                setAnnouncements(defaultAnnouncements);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setAnnouncements(defaultAnnouncements);
            toast.warning('Using cached data - unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newAnnouncement.title || !newAnnouncement.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/announcements`, {
                method: 'POST',
                ...getAuthHeaders(),
                body: JSON.stringify(newAnnouncement)
            });
            const data = await res.json();

            if (data.success) {
                const announcement = {
                    _id: data.announcement._id,
                    id: data.announcement._id,
                    ...newAnnouncement,
                    sentBy: 'Admin',
                    sentAt: new Date().toLocaleString(),
                    status: 'sent',
                    recipients: newAnnouncement.type === 'all' ? 12458 : newAnnouncement.type === 'students' ? 8942 : 432,
                    createdAt: new Date()
                };
                setAnnouncements(prev => [announcement, ...prev]);
                setShowCreateModal(false);
                setNewAnnouncement({ title: '', message: '', type: 'all', priority: 'normal' });
                toast.success('Announcement sent successfully!');
            } else {
                toast.error(data.message || 'Failed to create announcement');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
            toast.error('Error creating announcement');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/announcements/${id}`, {
                method: 'DELETE',
                ...getAuthHeaders()
            });
            const data = await res.json();

            if (data.success) {
                setAnnouncements(prev => prev.filter(a => a._id !== id));
                toast.success('Announcement deleted');
            } else {
                toast.error(data.message || 'Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            toast.error('Error deleting announcement');
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
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                    <Home className="w-4 h-4" /><ChevronRight className="w-4 h-4" /><span>Dashboard</span><ChevronRight className="w-4 h-4" /><span className="text-slate-900 font-medium">Announcements</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><Megaphone className="w-8 h-8 text-indigo-600" />Announcements</h1>
                        <p className="text-slate-600 mt-1">Create and manage announcements for students and teachers.</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Send className="w-5 h-5" />New Announcement
                    </motion.button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-7xl mx-auto mb-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><div className="p-2 bg-indigo-50 rounded-lg"><Bell className="w-5 h-5 text-indigo-600" /></div><p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p><p className="text-sm text-slate-600">Total Announcements</p></div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><div className="p-2 bg-cyan-50 rounded-lg"><Users className="w-5 h-5 text-cyan-600" /></div><p className="text-2xl font-bold text-slate-900 mt-2">{stats.sentToAll}</p><p className="text-sm text-slate-600">Sent to All</p></div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><div className="p-2 bg-green-50 rounded-lg"><MessageSquare className="w-5 h-5 text-green-600" /></div><p className="text-2xl font-bold text-slate-900 mt-2">{stats.sentToStudents}</p><p className="text-sm text-slate-600">To Students</p></div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><div className="p-2 bg-amber-50 rounded-lg"><Calendar className="w-5 h-5 text-amber-600" /></div><p className="text-2xl font-bold text-slate-900 mt-2">{stats.sentToTeachers}</p><p className="text-sm text-slate-600">To Teachers</p></div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-7xl mx-auto mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Search announcements..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'students', 'teachers'].map((type) => (<button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{type === 'all' ? 'All Users' : type.charAt(0).toUpperCase() + type.slice(1)}</button>))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-7xl mx-auto space-y-4">
                {filteredAnnouncements.map((announcement, index) => (
                    <motion.div key={announcement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${announcement.type === 'all' ? 'bg-indigo-100' : announcement.type === 'students' ? 'bg-green-100' : 'bg-amber-100'}`}>
                                <Bell className={`w-6 h-6 ${announcement.type === 'all' ? 'text-indigo-600' : announcement.type === 'students' ? 'text-green-600' : 'text-amber-600'}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                    <div><h3 className="text-lg font-semibold text-slate-900">{announcement.title}</h3><p className="text-sm text-slate-500">Sent to: <span className="font-medium capitalize">{announcement.type}</span> • {announcement.recipients.toLocaleString()} recipients • {announcement.sentAt}</p></div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">{announcement.status}</span>
                                </div>
                                <p className="text-slate-600 mb-4">{announcement.message}</p>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"><Eye className="w-4 h-4" />View</button>
                                    <button onClick={() => handleDelete(announcement.id)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" />Delete</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>{showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-slate-900">Create Announcement</h3><button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-600" /></button></div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 mb-2">Title *</label><input type="text" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter announcement title" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div><label className="block text-sm font-medium text-slate-700 mb-2">Message *</label><textarea value={newAnnouncement.message} onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))} placeholder="Enter your message" rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div><label className="block text-sm font-medium text-slate-700 mb-2">Send To</label><select value={newAnnouncement.type} onChange={(e) => setNewAnnouncement(prev => ({ ...prev, type: e.target.value }))} className="w-full px-4 py-2 border border-slate-200 rounded-lg"><option value="all">All Users ({userCounts.students + userCounts.teachers > 0 ? userCounts.students + userCounts.teachers : '...'})</option><option value="students">Students Only ({userCounts.students > 0 ? userCounts.students : '...'})</option><option value="teachers">Teachers Only ({userCounts.teachers > 0 ? userCounts.teachers : '...'})</option></select></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"><Send className="w-4 h-4" />Send Announcement</button>
                        </div>
                    </motion.div>
                </div>
            )}</AnimatePresence>
        </div>
    );
};

export default AnnouncementList;
