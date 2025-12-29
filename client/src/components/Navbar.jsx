import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import brandLogo from "../assets/logo.jpeg";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center space-x-2 group">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center">
                                <img
                                    src={brandLogo}   // change to your image path
                                    alt="Teacher"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <span className="text-xl font-semibold text-gray-900 tracking-tight">
                                MDAI
                            </span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
                            >
                                {item.name}
                                <span className="absolute bottom-1 left-3 lg:left-4 right-3 lg:right-4 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                            </a>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex md:items-center md:space-x-3 lg:space-x-4">
                        <a
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-gray-700 
             hover:text-indigo-600 transition-colors duration-200 
             border border-indigo-500  rounded-md"
                        >
                            Login
                        </a>

                        <a
                            href="/register"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                        >
                            Register
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.name}
                        </a>
                    ))}
                    <div className="pt-4 space-y-2 border-t border-gray-100 mt-2">
                        <a
                            href="#login"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-center border border-indigo-500 "
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Login
                        </a>
                        <a
                            href="#register"
                            className="block px-4 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 text-center shadow-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Register
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;