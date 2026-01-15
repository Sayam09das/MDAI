import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const [error, setError] = useState("");
    const token = localStorage.getItem("adminToken");

    const fetchEnrollments = async () => {
        if (!token) {
            setError("Admin not logged in");
            return;
        }

        try {
            const res = await fetch(
                `${BACKEND_URL}/api/admin/enrollments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Unauthorized or session expired");
            }

            const data = await res.json();
            setEnrollments(data.enrollments || []);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const updatePayment = async (id, status) => {
        if (!token) return;

        try {
            await fetch(
                `${BACKEND_URL}/api/admin/enrollments/${id}/payment-status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            fetchEnrollments();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Student Payments</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <table className="w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Student</th>
                        <th className="p-2 border">Course</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {enrollments.length === 0 && (
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                No enrollments found
                            </td>
                        </tr>
                    )}

                    {enrollments.map((e) => (
                        <tr key={e._id}>
                            <td className="p-2 border">{e.student?.email}</td>
                            <td className="p-2 border">{e.course?.title || "N/A"}</td>

                            <td className="p-2 border">
                                <span
                                    className={`px-3 py-1 rounded text-white ${e.paymentStatus === "PAID"
                                            ? "bg-green-600"
                                            : e.paymentStatus === "LATER"
                                                ? "bg-red-600"
                                                : "bg-yellow-500"
                                        }`}
                                >
                                    {e.paymentStatus}
                                </span>
                            </td>

                            <td className="p-2 border space-x-2">
                                <button
                                    onClick={() => updatePayment(e._id, "PAID")}
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    Paid
                                </button>

                                <button
                                    onClick={() => updatePayment(e._id, "LATER")}
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Pay Later
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
