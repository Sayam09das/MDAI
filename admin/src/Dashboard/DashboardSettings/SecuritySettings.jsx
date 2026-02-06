import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Lock,
    Eye,
    EyeOff,
    Key,
    Smartphone,
    Mail,
    AlertTriangle,
    Check,
    X,
    RefreshCw,
    ShieldCheck,
    ShieldAlert,
    Clock
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SecuritySettings = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // Password state
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // 2FA state
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    
    // Sessions
    const [activeSessions, setActiveSessions] = useState([
        { id: 1, device: 'Chrome on MacOS', location: 'Mumbai, India', lastActive: 'Now', current: true },
        { id: 2, device: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
        { id: 3, device: 'Firefox on Windows', location: 'Delhi, India', lastActive: '1 day ago', current: false }
    ]);

    // Security logs
    const [securityLogs] = useState([
        { id: 1, event: 'Password changed', date: '2024-01-15 10:30 AM', ip: '192.168.1.1', status: 'success' },
        { id: 2, event: 'Failed login attempt', date: '2024-01-14 08:15 PM', ip: '192.168.1.45', status: 'warning' },
        { id: 3, event: 'New device login', date: '2024-01-14 02:00 PM', ip: '192.168.1.100', status: 'success' },
        { id: 4, event: '2FA disabled', date: '2024-01-13 05:45 PM', ip: '192.168.1.1', status: 'info' }
    ]);

    const [passwordStrength, setPasswordStrength] = { weak: 0, fair: 1, good: 2, strong: 3 };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getPasswordStrengthColor = (strength) => {
        if (strength <= 1) return 'bg-red-500';
        if (strength === 2) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthLabel = (strength) => {
        if (strength <= 1) return 'Weak';
        if (strength === 2) return 'Fair';
        return 'Strong';
    };

    const handleUpdatePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        if (passwordForm.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            toast.success('Password updated successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSaving(false);
        }, 1500);
    };

    const handleSetup2FA = () => {
        setShowQRCode(true);
        toast.info('2FA setup initiated');
    };

    const handleVerify2FA = () => {
        setSaving(true);
        setTimeout(() => {
            setTwoFactorEnabled(true);
            setShowQRCode(false);
            toast.success('Two-factor authentication enabled');
            setSaving(false);
        }, 1500);
    };

    const handleDisable2FA = () => {
        setSaving(true);
        setTimeout(() => {
            setTwoFactorEnabled(false);
            toast.warning('Two-factor authentication disabled');
            setSaving(false);
        }, 1500);
    };

    const handleRevokeSession = (sessionId) => {
        setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
        toast.success('Session revoked');
    };

    const handleRevokeAllSessions = () => {
        setActiveSessions(prev => prev.filter(s => s.current));
        toast.success('All other sessions revoked');
    };

    const passwordStrengthValue = calculatePasswordStrength(passwordForm.newPassword);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <ToastContainer />

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-indigo-600" />
                    Change Password
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {passwordForm.newPassword && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-colors ${
                                                level <= passwordStrengthValue ? getPasswordStrengthColor(passwordStrengthValue) : 'bg-slate-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs font-medium ${
                                    passwordStrengthValue <= 1 ? 'text-red-600' :
                                    passwordStrengthValue === 2 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                    {getPasswordStrengthLabel(passwordStrengthValue)}
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        {passwordForm.confirmPassword && (
                            <p className={`text-xs mt-1 ${
                                passwordForm.newPassword === passwordForm.confirmPassword ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {passwordForm.newPassword === passwordForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdatePassword}
                        disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                        <span>Update Password</span>
                    </motion.button>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center">
                            <Smartphone className="w-5 h-5 mr-2 text-indigo-600" />
                            Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-slate-600">
                            Add an extra layer of security to your account
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
                
                <AnimatePresence mode="wait">
                    {showQRCode ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-48 h-48 bg-white rounded-lg border border-slate-200 flex items-center justify-center mb-4">
                                        <div className="w-40 h-40 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg opacity-20"></div>
                                    </div>
                                    <p className="text-xs text-slate-600">Scan with authenticator app</p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-900 mb-2">Enter verification code</h4>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Enter the 6-digit code from your authenticator app to enable 2FA
                                    </p>
                                    <div className="flex gap-2 mb-4">
                                        {[...Array(6)].map((_, i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                className="w-10 h-12 text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                onChange={(e) => {
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.focus();
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleVerify2FA}
                                            disabled={saving}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {saving ? 'Verifying...' : 'Verify & Enable'}
                                        </motion.button>
                                        <button
                                            onClick={() => setShowQRCode(false)}
                                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                                    twoFactorEnabled ? 'bg-green-100' : 'bg-slate-200'
                                }`}>
                                    {twoFactorEnabled ? (
                                        <ShieldCheck className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <ShieldAlert className="w-6 h-6 text-slate-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {twoFactorEnabled ? 'Your account is protected with 2FA' : 'Enable 2FA for enhanced security'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {twoFactorEnabled 
                                            ? 'Use your authenticator app to generate codes' 
                                            : 'Use an authenticator app like Google Authenticator'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={twoFactorEnabled ? handleDisable2FA : handleSetup2FA}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    twoFactorEnabled 
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                }`}
                            >
                                {twoFactorEnabled ? 'Disable' : 'Enable'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                    Active Sessions
                </h3>
                
                <div className="space-y-3">
                    {activeSessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                    session.current ? 'bg-green-100' : 'bg-slate-200'
                                }`}>
                                    <Smartphone className={`w-5 h-5 ${
                                        session.current ? 'text-green-600' : 'text-slate-600'
                                    }`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-slate-900">{session.device}</p>
                                        {session.current && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Current</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">{session.location} • {session.lastActive}</p>
                                </div>
                            </div>
                            {!session.current && (
                                <button
                                    onClick={() => handleRevokeSession(session.id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                
                {activeSessions.length > 1 && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleRevokeAllSessions}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            Sign out all other sessions
                        </button>
                    </div>
                )}
            </div>

            {/* Security Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                    Security Activity
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Event</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Date & Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">IP Address</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {securityLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-900">{log.event}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{log.date}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{log.ip}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            log.status === 'success' ? 'bg-green-100 text-green-700' :
                                            log.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {log.status === 'success' ? <Check className="w-3 h-3 mr-1" /> :
                                             log.status === 'warning' ? <AlertTriangle className="w-3 h-3 mr-1" /> :
                                             <Mail className="w-3 h-3 mr-1" />}
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default SecuritySettings;

