import React from "react";
import { useParams } from "react-router-dom";

const ADMIN_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

const PayLaterRequest = () => {
    const { courseId } = useParams();

    const subject = encodeURIComponent(
        "Request to Pay After Course Completion"
    );

    const body = encodeURIComponent(
        `Hello Admin,

I would like to request permission to pay for the course after completing it.

Please find my details below:

1. Full Name:
2. Registered Email:
3. Course ID:
4. Course Name:
5. Reason for Pay After Course:
6. Expected Payment Date:

I agree that access is subject to admin approval.

Thank you.
`
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 space-y-6">

                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Pay After Course – Request
                </h2>

                <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2 border">
                    <p>
                        You can request to pay after completing the course.
                        Please send an email to the admin with the details below.
                    </p>

                    <p>
                        <b>📧 Admin Email:</b>{" "}
                        <span className="text-indigo-600 font-semibold">
                            {ADMIN_EMAIL}
                        </span>
                    </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-sm space-y-2">
                    <p className="font-semibold">📌 Must include in email:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Your full name</li>
                        <li>Registered email ID</li>
                        <li>Course name & course ID</li>
                        <li>Reason for paying later</li>
                        <li>Expected payment date</li>
                    </ul>
                </div>

                <a
                    href={`mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`}
                    className="block text-center bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                >
                    📧 Open Email & Send Request
                </a>

                <p className="text-xs text-center text-gray-400">
                    Access will be granted only after admin approval.
                </p>
            </div>
        </div>
    );
};

export default PayLaterRequest;
