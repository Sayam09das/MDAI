import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, PlayCircle, BookOpen, AlertCircle } from "lucide-react";

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"
                    />
                    <p className="text-gray-700 font-medium">Loading course...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto"
            >
                {/* HEADER */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Thumbnail */}
                        <div className="relative h-64 sm:h-80 lg:h-auto bg-gray-200">
                            <img
                                src={course.thumbnail?.url}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="p-6 sm:p-8 flex flex-col justify-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                {course.title}
                            </h1>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {course.description || "No description available."}
                            </p>

                            <div className="inline-flex items-center gap-2 self-start px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-semibold">Access Granted</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CONTENT */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                            Course Content
                        </h2>
                    </div>

                    {course.lessons?.length > 0 ? (
                        <div className="space-y-3">
                            {course.lessons.map((lesson, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-semibold text-gray-700">
                                                {i + 1}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            {lesson.title}
                                        </span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                                    >
                                        <PlayCircle className="w-4 h-4" />
                                        Play
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600">No lessons added yet.</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}