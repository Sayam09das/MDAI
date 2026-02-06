import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Mail,
    Smartphone,
    MessageSquare,
    Clock,
    Check,
    X,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    Volume2,
    VolumeX,
    RefreshCw
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationSettings = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('email');

    // Notification preferences
    const [emailNotifications, setEmailNotifications] = useState({
        newUserRegistration: { enabled: true, label: 'New user registrations', description: 'Get notified when new users sign up' },
        newEnrollment: { enabled: true, label: 'New enrollments', description: 'Get notified when students enroll in courses' },
        newTeacherApplication: { enabled: true, label: 'New teacher applications', description: 'Get notified when teachers apply' },
        courseCompletion: { enabled: false, label: 'Course completions', description: 'Get notified when students complete courses' },
        payments: { enabled: true, label: 'Payment notifications', description: 'Get notified about payment activities' },
        systemAlerts: { enabled: true, label: 'System alerts', description: 'Get notified about system issues' },
        weeklyReports: { enabled: true, label: 'Weekly reports', description: 'Receive weekly summary reports' },
        marketingEmails: { enabled: false, label: 'Marketing emails', description: 'Receive promotional and marketing emails' }
    });

    const [pushNotifications, setPushNotifications] = useState({
        newMessages: { enabled: true, label: 'New messages', description: 'Get notified about new messages' },
        userReports: { enabled: true, label: 'User reports', description: 'Get notified about user-reported content' },
        systemUpdates: { enabled: true, label: 'System updates', description: 'Get notified about platform updates' },
        securityAlerts: { enabled: true, label: 'Security alerts', description: 'Get notified about security events' }
    });

    const [smsNotifications, setSmsNotifications] = useState({
        urgentAlerts: { enabled: true, label: 'Urgent alerts', description: 'Critical security and system alerts' },
        importantPayments: { enabled: false, label: 'Important payments', description: 'Major payment transactions' },
        accountLocks: { enabled: true, label: 'Account locks', description: 'When accounts are locked or suspended' }
    });

    // Quiet hours
    const [quietHours, setQuietHours] = useState({
        enabled: true,
        start: '22:00',
        end: '07:00'
    });

    const [digestSettings, setDigestSettings] = useState({
        daily: { enabled: true, time: '08:00' },
        weekly: { enabled: true, day: 'Monday', time: '09:00' },
        monthly: { enabled: false, date: '1', time: '10:00' }
    });

    const handleToggle = (category, key) => {
        const setter = category === 'email' ? setEmailNotifications :
                       category === 'push' ? setPushNotifications : setSmsNotifications;
        
        setter(prev => ({
            ...prev,
            [key]: { ...prev[key], enabled: !prev[key].enabled }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            toast.success('Notification settings saved successfully');
            setSaving(false);
        }, 1500);
    };

    const handleReset = () => {
        setEmailNotifications({
            newUserRegistration: { enabled: true, label: 'New user registrations', description: 'Get notified when new users sign up' },
            newEnrollment: { enabled: true, label: 'New enrollments', description: 'Get notified when students enroll in courses' },
            newTeacherApplication: { enabled: true, label: 'New teacher applications', description: 'Get notified when teachers apply' },
            courseCompletion: { enabled: false, label: 'Course completions', description: 'Get notified when students complete courses' },
            payments: { enabled: true, label: 'Payment notifications', description: 'Get notified about payment activities' },
            systemAlerts: { enabled: true, label: 'System alerts', description: 'Get notified about system issues' },
            weeklyReports: { enabled: true, label: 'Weekly reports', description: 'Receive weekly summary reports' },
            marketingEmails: { enabled: false, label: 'Marketing emails', description: 'Receive promotional and marketing emails' }
        });
        toast.info('Settings reset to default');
    };

    const notificationTypes = [
        { id: 'email', label: 'Email', icon: Mail, count: Object.values(emailNotifications).filter(n => n.enabled).length },
        { id: 'push', label: 'Push', icon: Bell, count: Object.values(pushNotifications).filter(n => n.enabled).length },
        { id: 'sms', label: 'SMS', icon: Smartphone, count: Object.values(smsNotifications).filter(n => n.enabled).length }
    ];

    const renderNotificationList = (notifications, category) => (
        <div className="space-y-3">
            {Object.entries(notifications).map(([key, notification]) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                            notification.enabled ? 'bg-indigo-100' : 'bg-slate-200'
                        }`}>
                            {category === 'email' && <Mail className={`w-5 h-5 ${notification.enabled ? 'text-indigo-600' : 'text-slate-500'}`} />}
                            {category === 'push' && <Bell className={`w-5 h-5 ${notification.enabled ? 'text-indigo-600' : 'text-slate-500'}`} />}
                            {category === 'sms' && <Smartphone className={`w-5 h-5 ${notification.enabled ? 'text-indigo-600' : 'text-slate-500'}`} />}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{notification.label}</p>
                            <p className="text-sm text-slate-600">{notification.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleToggle(category, key)}
                        className={`${notification.enabled ? 'text-indigo-600' : 'text-slate-400'}`}
                    >
                        {notification.enabled ? (
                            <ToggleRight className="w-10 h-6" />
                        ) : (
                            <ToggleLeft className="w-10 h-6" />
                        )}
                    </button>
                </motion.div>
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <ToastContainer />

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex">
                {notificationTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setActiveTab(type.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === type.id
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                            activeTab === type.id ? 'bg-indigo-500' : 'bg-slate-200'
                        }`}>
                            {type.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Email Notifications */}
            <AnimatePresence mode="wait">
                {activeTab === 'email' && (
                    <motion.div
                        key="email"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                            Email Notifications
                        </h3>
                        {renderNotificationList(emailNotifications, 'email')}
                    </motion.div>
                )}

                {activeTab === 'push' && (
                    <motion.div
                        key="push"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                            Push Notifications
                        </h3>
                        {renderNotificationList(pushNotifications, 'push')}
                    </motion.div>
                )}

                {activeTab === 'sms' && (
                    <motion.div
                        key="sms"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <Smartphone className="w-5 h-5 mr-2 text-indigo-600" />
                            SMS Notifications
                        </h3>
                        {renderNotificationList(smsNotifications, 'sms')}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quiet Hours */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                    Quiet Hours
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg mb-4">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${quietHours.enabled ? 'bg-indigo-100' : 'bg-slate-200'}`}>
                            {quietHours.enabled ? (
                                <Volume2 className="w-5 h-5 text-indigo-600" />
                            ) : (
                                <VolumeX className="w-5 h-5 text-slate-500" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Enable Quiet Hours</p>
                            <p className="text-sm text-slate-600">Mute non-urgent notifications during specific hours</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setQuietHours(prev => ({ ...prev, enabled: !prev.enabled }))}
                        className={quietHours.enabled ? 'text-indigo-600' : 'text-slate-400'}
                    >
                        {quietHours.enabled ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6" />}
                    </button>
                </div>

                {quietHours.enabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                            <input
                                type="time"
                                value={quietHours.start}
                                onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                            <input
                                type="time"
                                value={quietHours.end}
                                onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Email Digest */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
                    Email Digest
                </h3>
                
                <div className="space-y-4">
                    {/* Daily Digest */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                                <Clock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Daily Digest</p>
                                <p className="text-sm text-slate-600">Receive a daily summary every morning</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">at</span>
                            <input
                                type="time"
                                value={digestSettings.daily.time}
                                disabled={!digestSettings.daily.enabled}
                                onChange={(e) => setDigestSettings(prev => ({
                                    ...prev,
                                    daily: { ...prev.daily, time: e.target.value }
                                }))}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={() => setDigestSettings(prev => ({
                                    ...prev,
                                    daily: { ...prev.daily, enabled: !prev.daily.enabled }
                                }))}
                                className={digestSettings.daily.enabled ? 'text-indigo-600' : 'text-slate-400'}
                            >
                                {digestSettings.daily.enabled ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Weekly Digest */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center mr-4">
                                <Clock className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Weekly Digest</p>
                                <p className="text-sm text-slate-600">Receive a weekly summary every Monday</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={digestSettings.weekly.day}
                                disabled={!digestSettings.weekly.enabled}
                                onChange={(e) => setDigestSettings(prev => ({
                                    ...prev,
                                    weekly: { ...prev.weekly, day: e.target.value }
                                }))}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <span className="text-sm text-slate-600">at</span>
                            <input
                                type="time"
                                value={digestSettings.weekly.time}
                                disabled={!digestSettings.weekly.enabled}
                                onChange={(e) => setDigestSettings(prev => ({
                                    ...prev,
                                    weekly: { ...prev.weekly, time: e.target.value }
                                }))}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={() => setDigestSettings(prev => ({
                                    ...prev,
                                    weekly: { ...prev.weekly, enabled: !prev.weekly.enabled }
                                }))}
                                className={digestSettings.weekly.enabled ? 'text-indigo-600' : 'text-slate-400'}
                            >
                                {digestSettings.weekly.enabled ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Monthly Digest */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Monthly Digest</p>
                                <p className="text-sm text-slate-600">Receive a monthly summary on the 1st of each month</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">Day</span>
                            <input
                                type="number"
                                min="1"
                                max="28"
                                value={digestSettings.monthly.date}
                                disabled={!digestSettings.monthly.enabled}
                                onChange={(e) => setDigestSettings(prev => ({
                                    ...prev,
                                    monthly: { ...prev.monthly, date: e.target.value }
                                }))}
                                className="w-16 px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-slate-600">at</span>
                            <input
                                type="time"
                                value={digestSettings.monthly.time}
                                disabled={!digestSettings.monthly.enabled}
                                onChange={(e) => setDigestSettings(prev => ({
                                    ...prev,
                                    monthly: { ...prev.monthly, time: e.target.value }
                                }))}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={() => setDigestSettings(prev => ({
                                    ...prev,
                                    monthly: { ...prev.monthly, enabled: !prev.monthly.enabled }
                                }))}
                                className={digestSettings.monthly.enabled ? 'text-indigo-600' : 'text-slate-400'}
                            >
                                {digestSettings.monthly.enabled ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reset to Defaults
                </button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save Changes</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default NotificationSettings;

