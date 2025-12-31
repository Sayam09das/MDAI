import React, { useState } from 'react';
import { Mail, Linkedin, Github, Twitter, Send, CheckCircle } from 'lucide-react';

const Footer = () => {
    const logoUrl = import.meta.env.VITE_LOGO_URL;
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isHovered, setIsHovered] = useState(null);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            setTimeout(() => {
                setEmail('');
                setIsSubmitted(false);
            }, 3000);
        }
    };

    const platformLinks = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const resourceLinks = [
        { name: 'FAQs', href: '/faqs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms & Conditions', href: '/terms' },
    ];

    const socialLinks = [
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: 'https://linkedin.com',
            color: 'hover:text-blue-600'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            href: 'https://twitter.com',
            color: 'hover:text-sky-500'
        },
        {
            name: 'GitHub',
            icon: Github,
            href: 'https://github.com',
            color: 'hover:text-gray-900'
        },
    ];

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Column 1 - Brand */}
                    <div className="sm:col-span-2 lg:col-span-4">
                        <div className="space-y-4">
                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10  rounded-lg flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                                    <img
                                        src={logoUrl}
                                        alt="MDAI Logo"
                                        className="w-10 h-10 object-contain rounded-xl"
                                    />
                                </div>

                                <span className="text-2xl font-semibold text-gray-900 tracking-tight">
                                    MDAI
                                </span>
                            </div>


                            {/* Tagline */}
                            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                                Learn smarter with AI-powered education. Transform your learning journey with personalized courses and intelligent insights.
                            </p>

                            {/* Newsletter */}
                            <div className="pt-2">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Stay Updated
                                </h4>
                                <div className="relative">
                                    <div className="flex items-center">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                required
                                                disabled={isSubmitted}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleNewsletterSubmit(e);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={handleNewsletterSubmit}
                                            disabled={isSubmitted}
                                            className={`px-4 py-2.5 rounded-r-lg font-medium text-sm transition-all duration-300 ${isSubmitted
                                                ? 'bg-green-600 text-white'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                }`}
                                        >
                                            {isSubmitted ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <Send className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {isSubmitted && (
                                        <p className="text-xs text-green-600 mt-2 animate-pulse">
                                            Thanks for subscribing!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 - Platform */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Platform
                        </h3>
                        <ul className="space-y-3">
                            {platformLinks.map((link, index) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onMouseEnter={() => setIsHovered(`platform-${index}`)}
                                        onMouseLeave={() => setIsHovered(null)}
                                        className="text-gray-600 hover:text-indigo-600 text-sm transition-colors duration-200 inline-block"
                                    >
                                        <span className={`transition-transform duration-200 inline-block ${isHovered === `platform-${index}` ? 'translate-x-1' : ''
                                            }`}>
                                            {link.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Resources */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {resourceLinks.map((link, index) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onMouseEnter={() => setIsHovered(`resource-${index}`)}
                                        onMouseLeave={() => setIsHovered(null)}
                                        className="text-gray-600 hover:text-indigo-600 text-sm transition-colors duration-200 inline-block"
                                    >
                                        <span className={`transition-transform duration-200 inline-block ${isHovered === `resource-${index}` ? 'translate-x-1' : ''
                                            }`}>
                                            {link.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Contact & Social */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Contact Us
                        </h3>
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email Support</p>
                                <a
                                    href="mailto:support@mdai.com"
                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200 inline-flex items-center group"
                                >
                                    <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                    support@mdai.com
                                </a>
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-sm text-gray-600 mb-3">Follow Us</p>
                                <div className="flex items-center space-x-4">
                                    {socialLinks.map((social) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={social.name}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-gray-600 ${social.color} transition-all duration-200 transform hover:scale-110`}
                                                aria-label={social.name}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <p className="text-sm text-gray-600 text-center sm:text-left">
                            © {new Date().getFullYear()} MDAI. All rights reserved.
                        </p>

                        <div className="flex items-center space-x-6">
                            <a
                                href="#privacy"
                                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            >
                                Privacy
                            </a>
                            <a
                                href="#terms"
                                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            >
                                Terms
                            </a>
                            <a
                                href="#cookies"
                                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            >
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;