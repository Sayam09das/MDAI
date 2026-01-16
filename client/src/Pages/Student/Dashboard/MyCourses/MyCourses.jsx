import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ FIX: use correct token key
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!token) {
        setError("Please login to view your courses");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${BACKEND_URL}/api/enroll/my-courses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unauthorized or session expired");
        }

        // ✅ Remove broken enrollments (course deleted / null)
        const validEnrollments = (data.enrollments || []).filter(
          (e) => e.course !== null
        );

        setEnrollments(validEnrollments);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [token]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading your courses...
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      {enrollments.length === 0 && (
        <p className="text-gray-500">No enrolled courses yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enrollments.map((e) => (
          <div
            key={e._id}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <img
              src={e.course.thumbnail?.url}
              alt={e.course.title}
              className="h-40 w-full object-cover rounded mb-3"
            />

            <h2 className="text-lg font-semibold">
              {e.course.title}
            </h2>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded text-white ${e.paymentStatus === "PAID"
                  ? "bg-green-600"
                  : e.paymentStatus === "LATER"
                    ? "bg-red-600"
                    : "bg-yellow-500"
                }`}
            >
              {e.paymentStatus}
            </span>

            {e.paymentStatus === "PAID" ? (
              <a
                href={`/student-dashboard/course/${e.course._id}`}
                className="block mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
              >
                View Course
              </a>
            ) : (
              <button
                disabled
                className="block mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
              >
                Payment Required
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
