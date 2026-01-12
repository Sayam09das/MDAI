import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import {
    BookOpen,
    Users,
    Plus,
    Search,
    Filter,
    Video,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    /* ================= FETCH COURSES ================= */
    const fetchTeacherCourses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/courses/teacher`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load courses");

            setCourses(data.courses || []);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= PUBLISH COURSE ================= */
    const publishCourse = async (courseId) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/courses/${courseId}/publish`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Publish failed");

            toast.success("🎉 Course published");
            setCourses((prev) =>
                prev.map((c) =>
                    c._id === courseId ? { ...c, isPublished: true } : c
                )
            );
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchTeacherCourses();
    }, []);

    /* ================= FILTER ================= */
    const filteredCourses = courses.filter((course) => {
        const matchSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchFilter =
            filterStatus === "all" ||
            (filterStatus === "published" && course.isPublished) ||
            (filterStatus === "draft" && !course.isPublished);

        return matchSearch && matchFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer />

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <BookOpen /> My Courses
                </h1>
                <Link
                    to="/teacher-dashboard/create-course"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} /> Create Course
                </Link>
            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or category"
                        className="pl-10 w-full border rounded-lg py-2"
                    />
                </div>

                {["all", "published", "draft"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilterStatus(f)}
                        className={`px-4 py-2 rounded-lg capitalize ${filterStatus === f
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                            }`}
                    >
                        <Filter size={14} className="inline mr-1" />
                        {f}
                    </button>
                ))}
            </div>

            {/* COURSES GRID */}
            {loading ? (
                <p className="text-center text-gray-500">Loading courses...</p>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20">
                    <AlertCircle size={60} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-lg text-gray-600">No courses found</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course._id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl shadow overflow-hidden"
                        >
                            <img
                                src={course.thumbnail?.url}
                                alt={course.title}
                                className="h-44 w-full object-cover"
                            />

                            <div className="p-4">
                                <span
                                    className={`text-xs px-3 py-1 rounded-full text-white ${course.isPublished ? "bg-green-500" : "bg-yellow-500"
                                        }`}
                                >
                                    {course.isPublished ? "Published" : "Draft"}
                                </span>

                                <h3 className="font-bold text-lg mt-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="flex justify-between text-sm mt-3 text-gray-700">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} /> {course.students || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Video size={14} /> {course.lessons || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {course.duration || "0h"}
                                    </span>
                                </div>

                                {!course.isPublished && (
                                    <button
                                        onClick={() => publishCourse(course._id)}
                                        className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-1"
                                    >
                                        <CheckCircle size={16} /> Publish
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherCourses;
