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
            const res = await fetch(`${BACKEND_URL}/api/enroll/${courseId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Enrollment failed");
            }

            toast.success("Redirecting to payment...");
            navigate(`/payment/${courseId}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Explore Our Courses
            </h1>

            {loading && <p className="text-center">Loading courses...</p>}

            {!loading && courses.length === 0 && (
                <p className="text-center text-gray-500">No courses available</p>
            )}

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {courses.map((course) => (
                    <div
                        key={course._id}
                        className="bg-white rounded-xl shadow overflow-hidden"
                    >
                        {/* Thumbnail */}
                        <img
                            src={course.thumbnail?.url}
                            alt={course.title}
                            className="h-56 w-full object-cover"
                        />

                        <div className="p-6">
                            {/* Title */}
                            <h2 className="text-2xl font-bold mb-2">
                                {course.title}
                            </h2>

                            {/* Description */}
                            <p className="text-gray-600 mb-4">
                                {course.description}
                            </p>

                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                                <p><strong>Category:</strong> {course.category}</p>
                                <p><strong>Duration:</strong> {course.duration}</p>
                                <p><strong>Level:</strong> {course.level}</p>
                                <p><strong>Language:</strong> {course.language}</p>
                            </div>

                            {/* Requirements */}
                            {course.requirements?.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-1">Requirements</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {course.requirements.map((req, i) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Learning Outcomes */}
                            {course.learningOutcomes?.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-1">What you’ll learn</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {course.learningOutcomes.map((out, i) => (
                                            <li key={i}>{out}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Price & Enroll */}
                            <div className="flex justify-between items-center mt-6">
                                <span className="text-2xl font-bold text-indigo-600">
                                    ₹{course.price}
                                </span>

                                <button
                                    onClick={() => handleEnroll(course._id)}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                                >
                                    Enroll Now
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
