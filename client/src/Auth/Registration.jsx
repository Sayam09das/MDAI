import React, { useState } from 'react';
import { User, Mail, Lock, GraduationCap, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Phone, MapPin, Check, Sparkles } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from "../config/api";


const Registration = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Name must be at least 3 characters';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (formData.address.trim().length < 10) {
            newErrors.address = 'Please enter a complete address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all fields correctly");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        phone: formData.phone,
                        address: formData.address,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            toast.success("🎉 Registration successful!");
            setIsSuccess(true);

            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);

        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };



    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        return strength;
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Left Side - Welcome Section (Desktop Only) */}
                <div className="hidden lg:flex flex-col justify-center p-8 xl:p-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl xl:rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}></div>
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                            <img
                                src="https://res.cloudinary.com/dp4ohisdc/image/upload/v1766995359/logo_odzmqw.jpg"
                                alt="logo"
                                className="w-20 h-20 object-contain rounded-xl"
                            />
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-bold mb-4">Welcome to Learning Platform</h2>
                        <p className="text-lg text-indigo-100 mb-8">Join thousands of students and teachers in a journey of knowledge and growth</p>
                        <div className="space-y-4">
                            {[
                                { text: 'Access to premium courses' },
                                { text: 'Interactive learning experience' },
                                { text: 'Expert instructors' },
                                { text: 'Lifetime access to materials' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="text-indigo-50">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 text-center">
                        <div className="lg:hidden inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">Create Account</h1>
                        <p className="text-indigo-100 text-xs sm:text-sm">Start your learning journey today</p>
                    </div>

                    {/* Form */}
                    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-4">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                                <p className="text-gray-600 mb-6">Your account has been created successfully</p>
                                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
                            </div>
                        ) : (
                            <div className="space-y-3.5 sm:space-y-4 lg:space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${errors.fullName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                        {formData.fullName && !errors.fullName && formData.fullName.length >= 3 && (
                                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.fullName && (
                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.fullName}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                        {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.email && (
                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${errors.password ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            ) : (
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="mt-1.5 sm:mt-2">
                                            <div className="flex gap-1 mb-1">
                                                {[25, 50, 75, 100].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 sm:h-1.5 flex-1 rounded-full transition-all ${passwordStrength >= level
                                                            ? passwordStrength === 100 ? 'bg-green-500' : passwordStrength >= 75 ? 'bg-blue-500' : passwordStrength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                            : 'bg-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {passwordStrength === 100 ? 'Strong' : passwordStrength >= 75 ? 'Good' : passwordStrength >= 50 ? 'Fair' : 'Weak'} password
                                            </p>
                                        </div>
                                    )}
                                    {errors.password && (
                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.password}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${errors.confirmPassword ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            ) : (
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            )}
                                        </button>
                                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                            <CheckCircle className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.confirmPassword && (
                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.confirmPassword}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Phone & Address Grid */}
                                <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${errors.phone ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'
                                                    }`}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                <span className="text-xs">{errors.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${errors.address ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'
                                                    }`}
                                                placeholder="New York, USA"
                                            />
                                        </div>
                                        {errors.address && (
                                            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                <span className="text-xs">{errors.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 sm:mt-6"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-sm sm:text-base">Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm sm:text-base">Create Account</span>
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </>
                                    )}
                                </button>

                                {/* Login Link */}
                                <div className="text-center pt-3 sm:pt-4">
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                        Already have an account?{' '}
                                        <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                                            Sign In
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-2 sm:bottom-4 left-0 right-0 text-center px-4">
                <p className="text-gray-500 text-xs">
                    By signing up, you agree to our{' '}
                    <a href="/terms" className="text-indigo-600 hover:underline">Terms</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-indigo-600 hover:underline">Privacy</a>
                </p>
            </div>
        </div>
    );
};

export default Registration;