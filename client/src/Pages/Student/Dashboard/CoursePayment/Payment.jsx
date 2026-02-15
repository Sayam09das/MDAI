import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    ShieldCheck,
    ArrowLeft,
    CheckCircle,
    Clock,
    Award,
    Globe,
    BookOpen,
    Users,
    Star,
    Tag,
    Sparkles,
    Lock,
    CreditCard,
    Gift
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Payment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ================= FETCH COURSE ================= */
    const fetchCourse = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/courses/${courseId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch course");
            }

            setCourse(data.course);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                    <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Course</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Trust Banner */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-4 mb-8 text-white">
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <ShieldCheck className="w-5 h-5" />
                        <p className="font-medium">Secure Payment Gateway • 30-Day Money Back Guarantee</p>
                        <Lock className="w-5 h-5" />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT: FULL COURSE DETAILS */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Image & Title */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative h-72 bg-gradient-to-br from-indigo-100 to-purple-100">
                                <img
                                    src={course.thumbnail?.url}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-gray-900">4.8</span>
                                        <span className="text-gray-600 text-sm">(2.4k)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                        <Sparkles className="w-4 h-4" />
                                        {course.category}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        <Award className="w-4 h-4" />
                                        {course.level}
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                    {course.title}
                                </h1>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {course.description}
                                </p>
                            </div>
                        </div>

                        {/* Course Info Grid */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                                Course Information
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Tag className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Category</p>
                                        <p className="font-semibold text-gray-900">{course.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                                        <p className="font-semibold text-gray-900">{course.duration}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Award className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Level</p>
                                        <p className="font-semibold text-gray-900">{course.level}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Language</p>
                                        <p className="font-semibold text-gray-900">{course.language}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Requirements */}
                        {course.requirements?.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                                    Requirements
                                </h3>
                                <ul className="space-y-3">
                                    {course.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                                </div>
                                            </div>
                                            <span className="text-gray-700">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Learning Outcomes */}
                        {course.learningOutcomes?.length > 0 && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-indigo-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-indigo-600" />
                                    What You'll Learn
                                </h3>
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    {course.learningOutcomes.map((out, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{out}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: PAYMENT SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Main Payment Card */}
                            <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                                    <h2 className="text-2xl font-bold mb-1">Order Summary</h2>
                                    <p className="text-indigo-100 text-sm">Review your purchase</p>
                                </div>

                                <div className="p-6">
                                    {/* Price Breakdown */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                            <span className="text-gray-600">Course Price</span>
                                            <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <Gift className="w-4 h-4 text-green-600" />
                                                Discount
                                            </span>
                                            <span className="font-semibold text-green-600">$0</span>
                                        </div>

                                        <div className="pt-4 border-t-2 border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                                                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                    ${course.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {/* PAY NOW */}
                                        <button
                                            onClick={() => {
                                                toast.info("🔐 Redirecting to payment instructions...", {
                                                    position: "top-center",
                                                    autoClose: 2000,
                                                });

                                                setTimeout(() => {
                                                    navigate(`/payment-info/${courseId}`); // your new page
                                                }, 2000);
                                            }}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            Proceed to Pay
                                        </button>


                                        <button
                                            onClick={() => {
                                                navigate(`/payment-demo/${courseId}`);
                                            }}
                                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            ⏳ Pay After Course Ends
                                        </button>


                                        {/* CANCEL */}
                                        <button
                                            onClick={() => navigate(-1)}
                                            className="w-full border-2 border-gray-300 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                                        >
                                            Cancel Order
                                        </button>
                                    </div>


                                    {/* Security Badge */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                            <Lock className="w-4 h-4" />
                                            <span>Secure payment powered by Razorpay/Stripe</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits Card */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-green-600" />
                                    What's Included
                                </h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        Lifetime access to course
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        Certificate of completion
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        Access on mobile and desktop
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        30-day money-back guarantee
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;