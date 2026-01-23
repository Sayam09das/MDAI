import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, BarChart3, Shield, ExternalLink } from 'lucide-react';

const GetStarted = () => {
    const logoUrl = import.meta.env.VITE_LOGO_URL;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: Users,
            title: "User Management",
            description: "Control students, teachers, and roles"
        },
        {
            icon: BookOpen,
            title: "Course Control",
            description: "Manage live classes, PDFs, and content"
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Monitor platform performance"
        },
        {
            icon: Shield,
            title: "Security First",
            description: "Role-based access and protection"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
                                <img
                                    src={logoUrl}
                                    alt="MDAI Logo"
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>

                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                MDAI
                            </span>
                        </div>
                        <a
                            href="https://mdai-self.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <span className="text-sm font-medium hidden sm:inline">Go to Main Website</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 mb-8"
                    >
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">Admin Portal</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        MDAI Admin Panel
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Manage courses, users, analytics, and platform intelligence — securely and efficiently.
                    </p>

                    <a href="/login">
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </motion.button>
                    </a>
                </motion.div>
            </section>

            {/* Feature Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)" }}
                            className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Get Started Section */}
            <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Ready to manage the MDAI platform?
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Access powerful tools and insights to elevate your learning platform.
                        </p>
                        <a href="/login" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto"
                            >
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </a>

                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <p className="text-sm text-slate-500">
                            © MDAI – Admin Dashboard
                        </p>
                        <a
                            href="https://mdai-self.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <span>Main Platform</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GetStarted;