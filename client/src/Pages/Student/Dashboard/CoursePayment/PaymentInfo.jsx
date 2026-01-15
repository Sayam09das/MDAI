import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PAYMENT_UPI = import.meta.env.VITE_PAYMENT_UPI;
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;
const SUPPORT_WHATSAPP = import.meta.env.VITE_SUPPORT_WHATSAPP;
const PAYMENT_FORM = import.meta.env.VITE_PAYMENT_FORM;

const PaymentInfo = () => {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 space-y-6">

                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Complete Your Payment
                </h2>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2 border">
                    <p><b>📘 Course:</b> {course.title}</p>
                    <p className="text-lg">
                        <b>💰 Amount:</b>
                        <span className="text-indigo-600 font-bold ml-1">
                            ₹{course.price}
                        </span>
                    </p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl space-y-2 text-sm">
                    <p><b>📲 Pay on (UPI / Phone):</b></p>
                    <p className="font-semibold text-indigo-700">
                        {PAYMENT_UPI}
                    </p>

                    <p><b>💬 WhatsApp Support:</b></p>
                    <p className="font-semibold text-green-600">
                        {SUPPORT_WHATSAPP}
                    </p>

                    <p><b>📧 Support Email:</b></p>
                    <p className="font-semibold">
                        {SUPPORT_EMAIL}
                    </p>
                </div>

                <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    👉 After payment, please fill the form below.
                    <br />
                    ⚠️ Access will be granted after admin verification.
                </div>

                <a
                    href={PAYMENT_FORM}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition"
                >
                    Submit Payment Details
                </a>

                <p className="text-xs text-center text-gray-400">
                    Need help? Contact us on WhatsApp or Email.
                </p>
            </div>
        </div>
    );
};

export default PaymentInfo;
