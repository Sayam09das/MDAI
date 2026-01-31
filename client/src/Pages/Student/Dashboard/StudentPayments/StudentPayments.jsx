import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/student/enrollments`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load payments");

        setPayments(data.enrollments || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusBadge = (status) => {
    const statusStyles = {
      PAID: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      LATER: "bg-gray-100 text-gray-800",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Payments & Receipts</h2>

      {payments.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No payments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => {
            const courseTitle =
              typeof p.course === "object" && p.course !== null
                ? p.course.title
                : "Course Removed";

            return (
              <div
                key={p._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {courseTitle}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          p.paymentStatus
                        )}`}
                      >
                        {p.paymentStatus}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Receipt No:</span>{" "}
                        {p.receipt?.receiptNumber || "Not generated"}
                      </p>

                      {p.verifiedAt && (
                        <p>
                          <span className="font-medium">Verified On:</span>{" "}
                          {new Date(p.verifiedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    {p.paymentStatus === "PAID" && p.receipt?.url ? (
                      <a
                        href={p.receipt.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Receipt
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {p.paymentStatus === "PENDING"
                          ? "Payment pending verification"
                          : "Receipt not available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentPayments;
