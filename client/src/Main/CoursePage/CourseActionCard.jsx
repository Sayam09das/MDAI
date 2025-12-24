import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    CreditCard,
    CheckCircle,
    Clock,
    Video,
    PlayCircle,
    FileText,
    Infinity,
    Award,
    Download,
    Users,
    Lock,
    Sparkles,
    TrendingUp,
    Shield,
    Zap,
    Gift,
    Calendar
} from 'lucide-react';

const CourseActionCard = () => {
    // User states: 'guest', 'logged_in', 'enrolled', 'pending'
    const [userState, setUserState] = useState('guest');
    const [isSticky, setIsSticky] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const courseData = {
        price: 49.99,
        originalPrice: 199.99,
        currency: '$',
        discount: 75,
        features: [
            { icon: Video, text: '48 hours of live classes', highlight: true },
            { icon: PlayCircle, text: '325 recorded video lessons', highlight: false },
            { icon: FileText, text: 'Downloadable PDF resources', highlight: false },
            { icon: Infinity, text: 'Lifetime access to content', highlight: true },
            { icon: Award, text: 'Certificate of completion', highlight: false },
            { icon: Download, text: 'Offline viewing available', highlight: false },
            { icon: Users, text: 'Access to student community', highlight: false },
            { icon: Calendar, text: '30-day money-back guarantee', highlight: true },
        ],
        enrolledCount: 45230,
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsSticky(scrollPosition > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAction = () => {
        if (userState === 'guest') {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            // Redirect to login
            console.log('Redirecting to login...');
        } else if (userState === 'logged_in') {
            // Proceed to payment
            console.log('Processing payment...');
        } else if (userState === 'enrolled') {
            // Go to course
            console.log('Going to course...');
        }
    };

    const getButtonContent = () => {
        switch (userState) {
            case 'guest':
                return {
                    text: 'Login to Enroll',
                    icon: Lock,
                    color: 'from-gray-700 to-gray-900',
                };
            case 'logged_in':
                return {
                    text: 'Buy Now',
                    icon: ShoppingCart,
                    color: 'from-indigo-600 to-purple-600',
                };
            case 'pending':
                return {
                    text: 'Complete Payment',
                    icon: Clock,
                    color: 'from-orange-500 to-red-600',
                };
            case 'enrolled':
                return {
                    text: 'Go to Course',
                    icon: PlayCircle,
                    color: 'from-green-600 to-emerald-600',
                };
            default:
                return {
                    text: 'Enroll Now',
                    icon: ShoppingCart,
                    color: 'from-indigo-600 to-purple-600',
                };
        }
    };

    const buttonConfig = getButtonContent();
    const ButtonIcon = buttonConfig.icon;

    return (
        <>
            {/* Desktop Sticky Card */}
            <div className={`hidden lg:block transition-all duration-500 ${isSticky ? 'fixed top-20 right-8 w-96 animate-slide-in' : 'relative w-full'
                }`}>
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

                    {/* Status Badge */}
                    {userState === 'enrolled' && (
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 flex items-center justify-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-white" />
                            <span className="text-white font-bold">✅ You're Enrolled!</span>
                        </div>
                    )}

                    {userState === 'pending' && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 flex items-center justify-center space-x-2 animate-pulse">
                            <Clock className="w-5 h-5 text-white" />
                            <span className="text-white font-bold">⏳ Payment Pending</span>
                        </div>
                    )}

                    {/* Discount Banner */}
                    {userState !== 'enrolled' && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Gift className="w-5 h-5 text-white" />
                                <span className="text-white font-bold">{courseData.discount}% OFF</span>
                            </div>
                            <span className="text-white text-sm font-semibold">Limited Time!</span>
                        </div>
                    )}

                    <div className="p-6">

                        {/* Price Section */}
                        {userState !== 'enrolled' && (
                            <div className="mb-6">
                                <div className="flex items-baseline space-x-3 mb-2">
                                    <span className="text-4xl font-extrabold text-gray-900">
                                        {courseData.currency}{courseData.price}
                                    </span>
                                    <span className="text-xl text-gray-500 line-through">
                                        {courseData.currency}{courseData.originalPrice}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600 font-semibold">
                                        Save {courseData.currency}{(courseData.originalPrice - courseData.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={handleAction}
                            className={`group relative w-full px-6 py-4 bg-gradient-to-r ${buttonConfig.color} text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden mb-4`}
                        >
                            <span className="relative z-10 flex items-center justify-center space-x-2">
                                <ButtonIcon className="w-6 h-6" />
                                <span>{buttonConfig.text}</span>
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        </button>

                        {/* Secondary Action */}
                        {userState === 'logged_in' && (
                            <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 mb-4">
                                <Gift className="w-5 h-5" />
                                <span>Gift This Course</span>
                            </button>
                        )}

                        {/* Money-Back Guarantee */}
                        {userState !== 'enrolled' && (
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-6">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span>30-Day Money-Back Guarantee</span>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-6" />

                        {/* Course Includes */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                                <span>This course includes:</span>
                            </h3>

                            <div className="space-y-3">
                                {courseData.features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-indigo-50 ${feature.highlight ? 'bg-indigo-50 border border-indigo-200' : ''
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${feature.highlight
                                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600'
                                                    : 'bg-gray-100'
                                                }`}>
                                                <Icon className={`w-4 h-4 ${feature.highlight ? 'text-white' : 'text-gray-600'
                                                    }`} />
                                            </div>
                                            <span className={`text-sm ${feature.highlight ? 'font-semibold text-gray-900' : 'text-gray-700'
                                                }`}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-6" />

                        {/* Social Proof */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-indigo-600" />
                                <span className="text-gray-700">
                                    <span className="font-bold">{courseData.enrolledCount.toLocaleString()}</span> students enrolled
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-700 font-semibold">Bestseller</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User State Switcher (Demo Only - Remove in production) */}
                <div className="mt-4 bg-gray-100 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Demo Controls:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {['guest', 'logged_in', 'pending', 'enrolled'].map((state) => (
                            <button
                                key={state}
                                onClick={() => setUserState(state)}
                                className={`px-3 py-2 rounded text-xs font-semibold transition-all duration-300 ${userState === state
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {state.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                        {userState !== 'enrolled' && (
                            <div>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {courseData.currency}{courseData.price}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        {courseData.currency}{courseData.originalPrice}
                                    </span>
                                </div>
                                <span className="text-xs text-green-600 font-semibold">
                                    {courseData.discount}% OFF
                                </span>
                            </div>
                        )}
                        {userState === 'enrolled' && (
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-bold text-gray-900">You're Enrolled!</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAction}
                        className={`w-full px-6 py-3 bg-gradient-to-r ${buttonConfig.color} text-white font-bold rounded-xl shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2`}
                    >
                        <ButtonIcon className="w-5 h-5" />
                        <span>{buttonConfig.text}</span>
                    </button>
                </div>
            </div>

            {/* Login Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-scale-in">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Login Required
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            Please login or create an account to enroll in this course
                        </p>
                        <div className="flex gap-3">
                            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                                Login
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </>
    );
};

export default CourseActionCard;