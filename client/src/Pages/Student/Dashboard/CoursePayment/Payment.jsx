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
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

                {/* LEFT: FULL COURSE DETAILS */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                    <img
                        src={course.thumbnail?.url}
                        alt={course.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />

                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-gray-600 mb-6">{course.description}</p>

                    {/* Meta Info */}
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                        <p><strong>Category:</strong> {course.category}</p>
                        <p><strong>Duration:</strong> {course.duration}</p>
                        <p><strong>Level:</strong> {course.level}</p>
                        <p><strong>Language:</strong> {course.language}</p>
                    </div>

                    {/* Requirements */}
                    {course.requirements?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Requirements</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {course.requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Learning Outcomes */}
                    {course.learningOutcomes?.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">What you’ll learn</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {course.learningOutcomes.map((out, i) => (
                                    <li key={i}>{out}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* RIGHT: PAYMENT SUMMARY */}
                <div className="bg-white rounded-xl shadow p-6 h-fit">
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
