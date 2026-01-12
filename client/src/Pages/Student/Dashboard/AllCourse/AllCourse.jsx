import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AllCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    /* ================= FETCH COURSES ================= */
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/courses`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch courses");
            }

            setCourses(data.courses);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= ENROLL ================= */
    const handleEnroll = async (courseId) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/enroll/${courseId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Enrollment failed");
            }

            toast.success("Redirecting to payment...");

            // 👉 Redirect to payment page
            navigate(`/payment/${courseId}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">All Courses</h1>

            {loading && <p>Loading courses...</p>}

            {!loading && courses.length === 0 && (
                <p>No courses available</p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course._id}
                        className="bg-white rounded-lg shadow overflow-hidden"
                    >
                        <img
                            src={course.thumbnail?.url}
                            alt={course.title}
                            className="h-40 w-full object-cover"
                        />

                        <div className="p-4">
                            <h3 className="font-bold text-lg">{course.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {course.description}
                            </p>

                            <div className="flex justify-between items-center mt-3">
                                <span className="font-semibold">₹{course.price}</span>
                                <button
                                    onClick={() => handleEnroll(course._id)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Enroll
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllCourse;
