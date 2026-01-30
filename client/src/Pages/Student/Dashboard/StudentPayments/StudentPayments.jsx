import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/student/enrollments`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setPayments(data.enrollments || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <p>Loading payments...</p>;
  }

  return (
    <div>
      <h2>My Payments & Receipts</h2>

      {payments.length === 0 && <p>No payments found.</p>}

      {payments.map((p) => {
        const courseTitle =
          typeof p.course === "object" && p.course !== null
            ? p.course.title
            : "Course Removed";

        return (
          <div key={p._id}>
            <hr />

            <p>
              <strong>Course:</strong> {courseTitle}
            </p>

            <p>
              <strong>Status:</strong> {p.paymentStatus}
            </p>

            <p>
              <strong>Receipt No:</strong>{" "}
              {p.receipt?.receiptNumber || "Not generated"}
            </p>

            {p.receipt?.url ? (
              <p>
                <a
                  href={p.receipt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  👉 View / Print Receipt
                </a>
              </p>
            ) : (
              <p>👉 Receipt not available</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StudentPayments;
