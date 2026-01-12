import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        return <div className="p-10 text-center">Loading course...</div>;
    }

    if (!course) {
        return <div className="p-10 text-center">Course not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">

                {/* LEFT: COURSE DETAILS */}
                <div className="bg-white rounded-xl shadow p-6">
                    <img
                        src={course.thumbnail?.url}
                        alt={course.title}
                        className="rounded-lg mb-4 h-48 w-full object-cover"
                    />

                    <h2 className="text-xl font-bold mb-2">
                        {course.title}
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        {course.description}
                    </p>

                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>✔ Lifetime access</li>
                        <li>✔ Certificate of completion</li>
                        <li>✔ {course.duration}</li>
                        <li>✔ Language: {course.language}</li>
                    </ul>
                </div>

                {/* RIGHT: PAYMENT */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    <div className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Course Price</span>
                            <span className="font-semibold">₹{course.price}</span>
                        </div>

                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600">₹0</span>
                        </div>

                        <hr className="my-2" />

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₹{course.price}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => toast.info("Payment gateway coming next 🚀")}
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
                        Secure payment • Powered by Razorpay / Stripe
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
