import React from "react";
import { useParams } from "react-router-dom";

const Payment = () => {
    const { courseId } = useParams();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">
                    Payment Page
                </h1>
                <p>Course ID: {courseId}</p>
                <p className="mt-4 text-gray-600">
                    Payment gateway integration coming soon 🚀
                </p>
            </div>
        </div>
    );
};

export default Payment;
