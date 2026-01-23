import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const Login = () => {
    const logoUrl = import.meta.env.VITE_LOGO_URL;
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: ''
    });

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        return '';
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error for this field
        setValidationErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        // Clear general error
        setError('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        // Validate all fields
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (emailError || passwordError) {
            setValidationErrors({
                email: emailError,
                password: passwordError
            });
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call - Replace with actual authentication
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Example: Simulated error for demo
            // In production, replace with actual API call
            const mockAuth = Math.random() > 0.5;

            if (!mockAuth) {
                throw new Error('Invalid credentials');
            }

            // On success, redirect or set auth token
            console.log('Login successful');
            // window.location.href = '/admin/dashboard';

        } catch (err) {
            if (err.message === 'Invalid credentials') {
                setError('Invalid email or password. Please try again.');
            } else if (err.message.includes('Network')) {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const errorVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <a href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
                                <img
                                    src={logoUrl || "/logo.png"}
                                    alt="MDAI Logo"
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>

                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                    MDAI
                                </span>
                                <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
                            </div>
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >
                    {/* Login Card */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 sm:p-10">
                        {/* Security Badge */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2">
                                <Shield className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-indigo-700">Secure admin access</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                                Sign in to MDAI Admin
                            </h1>
                            <p className="text-sm text-slate-600">
                                Authorized administrators only.
                            </p>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    variants={errorVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className={`w-full pl-12 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed ${validationErrors.email
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-slate-300'
                                            }`}
                                        placeholder="admin@mdai.com"
                                        autoComplete="email"
                                        aria-invalid={validationErrors.email ? 'true' : 'false'}
                                        aria-describedby={validationErrors.email ? 'email-error' : undefined}
                                    />
                                </div>
                                <AnimatePresence>
                                    {validationErrors.email && (
                                        <motion.p
                                            variants={errorVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            id="email-error"
                                            className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{validationErrors.email}</span>
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed ${validationErrors.password
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-slate-300'
                                            }`}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        aria-invalid={validationErrors.password ? 'true' : 'false'}
                                        aria-describedby={validationErrors.password ? 'password-error' : undefined}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none disabled:cursor-not-allowed"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {validationErrors.password && (
                                        <motion.p
                                            variants={errorVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            id="password-error"
                                            className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{validationErrors.password}</span>
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                whileHover={!isLoading ? { scale: 1.01 } : {}}
                                whileTap={!isLoading ? { scale: 0.99 } : {}}
                                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3 rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Protected by enterprise-grade security
                    </p>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <p className="text-xs text-slate-500">
                            © MDAI — Admin Dashboard
                        </p>
                        <a
                            href="https://mdai-self.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-xs text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <span>Go to Main Platform</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;