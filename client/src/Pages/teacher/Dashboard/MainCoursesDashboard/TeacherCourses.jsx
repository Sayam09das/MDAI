import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle,
    AlertCircle,
    Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showMobileMenu, setShowMobileMenu] = useState(false);

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
            if (!res.ok) throw new Error(data.message);

            setCourses(data.courses);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= PUBLISH ================= */
    const publishCourse = async (id) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/courses/${id}/publish`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("🎉 Course published");

            setCourses((prev) =>
                prev.map((c) =>
                    c._id === id ? { ...c, isPublished: true } : c
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
            course.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchFilter =
            filterStatus === "all" ||
            (filterStatus === "published" && course.isPublished) ||
            (filterStatus === "draft" && !course.isPublished);

        return matchSearch && matchFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <ToastContainer />

            {/* Mobile Header */}
            <div className="lg:hidden bg-white p-4 flex justify-between items-center">
                <h1 className="font-bold flex items-center gap-2">
                    <BookOpen /> Courses
                </h1>
                <Menu onClick={() => setShowMobileMenu(!showMobileMenu)} />
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BookOpen /> My Courses
                    </h1>
                    <Link
                        to="/teacher-dashboard/create-course"
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus /> Create
                    </Link>
                </div>

                {/* Search & Filter */}
                <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="pl-10 w-full border rounded-lg py-2"
                        />
                    </div>

                    {["all", "published", "draft"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilterStatus(f)}
                            className={`px-4 py-2 rounded-lg ${filterStatus === f
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200"
                                }`}
                        >
                            <Filter size={14} /> {f}
                        </button>
                    ))}
                </div>

                {/* Courses */}
                {loading && <p>Loading...</p>}

                {!loading && filteredCourses.length === 0 && (
                    <div className="text-center py-16">
                        <AlertCircle size={48} className="mx-auto text-gray-400" />
                        <p>No courses found</p>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course._id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-lg shadow overflow-hidden"
                        >
                            <img
                                src={course.thumbnail?.url}
                                alt={course.title}
                                className="h-40 w-full object-cover"
                            />

                            <div className="p-4">
                                <span
                                    className={`text-xs px-3 py-1 rounded-full ${course.isPublished
                                            ? "bg-green-500 text-white"
                                            : "bg-yellow-500 text-white"
                                        }`}
                                >
                                    {course.isPublished ? "Published" : "Draft"}
                                </span>

                                <h3 className="font-bold mt-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm mt-2">
                                    <Clock size={14} /> {course.duration}
                                </div>

                                {!course.isPublished && (
                                    <button
                                        onClick={() => publishCourse(course._id)}
                                        className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg"
                                    >
                                        <CheckCircle size={14} /> Publish
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherCourses;
