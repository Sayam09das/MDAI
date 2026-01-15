import { useEffect, useState } from "react";

export default function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const token = localStorage.getItem("adminToken");

    const fetchEnrollments = async () => {
        const res = await fetch(
            "https://mdai-0jhi.onrender.com/api/admin/enrollments",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setEnrollments(data.enrollments || []);
    };

    const updatePayment = async (id, status) => {
        await fetch(
            `https://mdai-0jhi.onrender.com/api/admin/enrollments/${id}/payment-status`,
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
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Student Payments</h1>

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
