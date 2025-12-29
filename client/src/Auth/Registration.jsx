import React, { useState } from 'react';
import { User, Mail, Lock, GraduationCap, BookOpen, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Registration = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Name must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                // In real app: navigate('/login')
                alert('Registration successful! Redirecting to login...');
            }, 2000);
        }, 1500);
    };

    const handleRoleSelect = (role) => {
        setFormData(prev => ({
            ...prev,
            role
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .input-focus-ring:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
      `}</style>

            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-32 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md relative z-10 animate-scaleIn">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 animate-float">
                                <GraduationCap className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fadeInUp">
                                Join Us Today
                            </h1>
                            <p className="text-indigo-100 text-sm md:text-base animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                Start your learning journey with thousands of students
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-10">
                        {isSuccess ? (
                            <div className="text-center animate-scaleIn">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                                <p className="text-gray-600 mb-6">Redirecting you to login page...</p>
                                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full animate-pulse"></div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Full Name */}
                                <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none input-focus-ring transition-all duration-300 ${errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm animate-slideInRight">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.fullName}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none input-focus-ring transition-all duration-300 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm animate-slideInRight">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none input-focus-ring transition-all duration-300 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm animate-slideInRight">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.password}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none input-focus-ring transition-all duration-300 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm animate-slideInRight">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.confirmPassword}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Role Selection */}
                                <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Select Your Role
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleRoleSelect('student')}
                                            className={`relative p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer group ${formData.role === 'student'
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-indigo-200 bg-white'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`p-3 rounded-full transition-all duration-300 ${formData.role === 'student'
                                                        ? 'bg-indigo-600'
                                                        : 'bg-gray-100 group-hover:bg-indigo-100'
                                                    }`}>
                                                    <GraduationCap className={`w-6 h-6 ${formData.role === 'student' ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'
                                                        }`} />
                                                </div>
                                                <span className={`font-semibold ${formData.role === 'student' ? 'text-indigo-600' : 'text-gray-700'
                                                    }`}>
                                                    Student
                                                </span>
                                            </div>
                                            {formData.role === 'student' && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center animate-scaleIn">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleRoleSelect('teacher')}
                                            className={`relative p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer group ${formData.role === 'teacher'
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-200 bg-white'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`p-3 rounded-full transition-all duration-300 ${formData.role === 'teacher'
                                                        ? 'bg-purple-600'
                                                        : 'bg-gray-100 group-hover:bg-purple-100'
                                                    }`}>
                                                    <BookOpen className={`w-6 h-6 ${formData.role === 'teacher' ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'
                                                        }`} />
                                                </div>
                                                <span className={`font-semibold ${formData.role === 'teacher' ? 'text-purple-600' : 'text-gray-700'
                                                    }`}>
                                                    Teacher
                                                </span>
                                            </div>
                                            {formData.role === 'teacher' && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center animate-scaleIn">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Create Account</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Login Link */}
                                <div className="text-center mt-6 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                                    <p className="text-gray-600 text-sm">
                                        Already have an account?{' '}
                                        <a
                                            href="#login"
                                            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                                        >
                                            Sign In
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Text */}
                <div className="text-center mt-6 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
                    <p className="text-gray-600 text-sm">
                        By signing up, you agree to our{' '}
                        <a href="#terms" className="text-indigo-600 hover:underline">Terms</a>
                        {' '}and{' '}
                        <a href="#privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;