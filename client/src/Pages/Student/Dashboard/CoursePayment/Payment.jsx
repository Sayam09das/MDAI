import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const Payment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">

                {/* LEFT: Course Summary */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Course Summary</h2>

                    <div className="border rounded-lg p-4 mb-4">
                        <img
                            src="https://via.placeholder.com/600x300"
                            alt="Course Thumbnail"
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold">
                            Full Stack Web Development
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Learn MERN stack from scratch with real projects.
                        </p>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-gray-500 text-sm">Course ID</span>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {courseId}
                            </span>
                        </div>
                    </div>

                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>✔ Lifetime access</li>
                        <li>✔ Certificate of completion</li>
                        <li>✔ 30+ hours of content</li>
                        <li>✔ Full source code</li>
                    </ul>
                </div>

                {/* RIGHT: Payment Box */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

                    <div className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Course Price</span>
                            <span className="font-semibold">₹999</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600">- ₹200</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₹799</span>
                        </div>
                    </div>

                    <button
                        onClick={() => alert("Payment gateway coming next 🚀")}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Pay Now
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 border border-gray-300 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Secure payment • 100% safe • Powered by Razorpay / Stripe
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
