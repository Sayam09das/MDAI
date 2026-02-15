import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    CreditCard,
    Lock,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowLeft,
    Shield,
    Building2,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Sparkles
} from "lucide-react";

const PaymentDemo = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [step, setStep] = useState(1); // 1: form, 2: processing, 3: success
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === "cardNumber") {
            formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
            if (formattedValue.length > 19) return;
        }

        // Format expiry date
        if (name === "expiryDate") {
            formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2");
            if (formattedValue.length > 5) return;
        }

        // Format CVV
        if (name === "cvv" && value.length > 3) return;

        // Format phone
        if (name === "phone" && value.length > 10) return;

        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setStep(2);

        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            setStep(3);
        }, 3000);
    };

    useEffect(() => {
        if (step === 3) {
            // Auto redirect after success to course page
            const timer = setTimeout(() => {
                navigate(`/course/${courseId}`);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [step, navigate, courseId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                        disabled={processing}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            Payment Details
                        </span>
                        <span className={`text-sm font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            Processing
                        </span>
                        <span className={`text-sm font-medium ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            Confirmation
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    </div>
                </div>

                {/* Step 1: Payment Form */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold mb-1">Secure Payment</h1>
                                    <p className="text-indigo-100 text-sm">Demo Payment Gateway</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-semibold">SSL Secure</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            {/* Card Information */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-indigo-600" />
                                    Card Information
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cardholder Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={formData.cardName}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    required
                                                    maxLength="3"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Information */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                    Billing Information
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="9876543210"
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Billing Address
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Enter your complete address"
                                                required
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                            />
                                            <MapPin className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-blue-900 mb-1">Your payment is secure</p>
                                    <p className="text-blue-700">
                                        This is a demo payment page. No actual payment will be processed. All data is for demonstration purposes only.
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <Lock className="w-5 h-5" />
                                Pay Securely
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Processing */}
                {step === 2 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Processing Payment</h2>
                            <p className="text-gray-600 mb-6">
                                Please wait while we securely process your payment. This may take a few moments.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Shield className="w-4 h-4" />
                                <span>256-bit SSL Encrypted</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-12 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                            <p className="text-green-100">Your transaction has been completed successfully</p>
                        </div>

                        <div className="p-8 sm:p-12 text-center">
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                        <h3 className="font-bold text-gray-900">Course Access Granted</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        You now have full access to your course content. Start learning right away!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Transaction ID</span>
                                        <span className="font-mono font-semibold text-gray-900">TXN-{Date.now()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Date & Time</span>
                                        <span className="font-semibold text-gray-900">{new Date().toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Status</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                                            <CheckCircle className="w-4 h-4" />
                                            Completed
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600">
                                    Redirecting to dashboard in <span className="font-semibold">5 seconds</span>...
                                </p>

                                <button
                                    onClick={() => navigate(`/course/${courseId}`)}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg"
                                >
                                    Go to Course Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentDemo;