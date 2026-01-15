import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PaymentInfo = () => {
    const { courseId } = useParams();

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
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold">Loading payment details...</p>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 space-y-5">

                <h2 className="text-2xl font-bold text-center">
                    Course Payment
                </h2>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <p><b>📘 Course:</b> {course.title}</p>
                    <p><b>💰 Price:</b> ₹{course.price}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p><b>📧 Contact Email:</b> support@yourwebsite.com</p>
                    <p><b>📱 WhatsApp:</b> +91 XXXXXXXXXX</p>
                    <p><b>💳 Payment Method:</b> UPI / Bank Transfer</p>
                </div>

                <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                    After completing the payment, please submit your payment
                    details using the form below. Access will be granted after verification.
                </div>

                <a
                    href="https://forms.gle/YOUR_GOOGLE_FORM_LINK"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                    Submit Payment Confirmation
                </a>

                <p className="text-xs text-center text-gray-400">
                    Course access will be approved manually by admin.
                </p>
            </div>
        </div>
    );
};

export default PaymentInfo;
