import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CourseView() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCourse = async () => {
            if (!token) {
                setError("Please login to view this course");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/courses/${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load course");
                }

                setCourse(data.course);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, token]);

    // ⏳ Loading
    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading course...
            </div>
        );
    }

    // ❌ Error
    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-700 rounded">
                {error}
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <img
                    src={course.thumbnail?.url}
                    alt={course.title}
                    className="rounded-xl shadow"
                />

                <div>
                    <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                    <p className="text-gray-600 mb-4">
                        {course.description || "No description available."}
                    </p>

                    <span className="inline-block px-4 py-2 bg-green-600 text-white rounded">
                        Access Granted
                    </span>
                </div>
            </div>

            {/* CONTENT */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Course Content</h2>

                {course.lessons?.length > 0 ? (
                    <div className="space-y-3">
                        {course.lessons.map((lesson, i) => (
                            <div
                                key={i}
                                className="border p-4 rounded flex justify-between items-center"
                            >
                                <span>{lesson.title}</span>
                                <button className="bg-blue-600 text-white px-4 py-1 rounded">
                                    Play
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        No lessons added yet.
                    </p>
                )}
            </div>
        </div>
    );
}
