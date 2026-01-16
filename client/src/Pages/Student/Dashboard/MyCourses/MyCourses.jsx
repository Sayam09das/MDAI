import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchMyCourses = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/enroll/my-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setEnrollments(data.enrollments || []);
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      {enrollments.length === 0 && (
        <p className="text-gray-500">You have not enrolled in any courses yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enrollments.map((e) => (
          <div
            key={e._id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-2">
              {e.course?.title}
            </h2>

            <span
              className={`inline-block px-3 py-1 text-sm rounded text-white mb-3 ${e.paymentStatus === "PAID"
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
                href={`/course/${e.course?._id}`}
                className="block mt-3 text-center bg-blue-600 text-white py-2 rounded"
              >
                View Course
              </a>
            ) : (
              <button
                disabled
                className="block mt-3 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
              >
                Payment Pending
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
