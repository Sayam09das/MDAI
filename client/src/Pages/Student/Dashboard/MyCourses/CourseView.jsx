import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CheckCircle,
    PlayCircle,
    BookOpen,
    AlertCircle,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CourseView() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        // ✅ Guard: invalid route
        if (!courseId || courseId === ":courseId") {
            setError("Invalid course");
            setLoading(false);
            return;
        }

        // ✅ Guard: not logged in
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchCourse = async () => {
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
    }, [courseId, token, navigate]);

    /* ===============================
       UI STATES
    ================================ */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 font-medium">Loading course...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-100 text-red-700 p-6 rounded-lg flex gap-3">
                    <AlertCircle />
                    {error}
                </div>
            </div>
        );
    }

    if (!course) return null;

    /* ===============================
       MAIN VIEW
    ================================ */

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-6">
                    <img
                        src={course.thumbnail?.url}
                        alt={course.title}
                        className="rounded-lg w-full h-64 object-cover"
                    />

                    <div>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-gray-600 mt-3">
                            {course.description || "No description available."}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                            <CheckCircle size={18} />
                            Access Granted
                        </div>

                        {/* LIVE CLASSES */}
                        <div className="mt-6">
                            <button
                                onClick={() =>
                                    navigate(
                                        `/student-dashboard/student-live-classes/${course._id}`
                                    )
                                }
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                            >
                                <PlayCircle size={20} />
                                Join Live Classes
                            </button>
                        </div>
                    </div>
                </div>

                {/* COURSE CONTENT */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="text-indigo-600" />
                        <h2 className="text-xl font-semibold">Course Content</h2>
                    </div>

                    {course.lessons?.length > 0 ? (
                        <div className="space-y-3">
                            {course.lessons.map((lesson, i) => (
                                <div
                                    key={lesson._id || i}
                                    className="border rounded-lg p-4 flex justify-between items-center"
                                >
                                    <span>{lesson.title}</span>
                                    <button
                                        disabled
                                        className="bg-gray-300 text-white px-4 py-2 rounded cursor-not-allowed"
                                    >
                                        Play
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No lessons added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
