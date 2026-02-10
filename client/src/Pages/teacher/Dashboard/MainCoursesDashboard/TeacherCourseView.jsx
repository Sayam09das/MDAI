import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import {
    ArrowLeft,
    BookOpen,
    Clock,
    Users,
    Edit,
    CheckCircle,
    FileText,
    Video,
    Play,
    Download,
    Calendar,
    BarChart3,
    TrendingUp
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const TeacherCourseView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/courses/${courseId}`, getAuthHeaders());
            const data = await res.json();

            if (data.success) {
                setCourse(data.course);
            } else {
                toast.error(data.message || "Failed to load course");
                navigate("/teacher-dashboard/mycourse");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            toast.error("Error loading course");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
                    <Link to="/teacher-dashboard/mycourse" className="text-indigo-600 hover:text-indigo-700">
                        Back to My Courses
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "curriculum", label: "Curriculum" },
        { id: "students", label: "Students" },
        { id: "analytics", label: "Analytics" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <ToastContainer />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto mb-6"
            >
                <button
                    onClick={() => navigate("/teacher-dashboard/mycourse")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to My Courses
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Course Banner */}
                    <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600">
                        <img
                            src={course.thumbnail?.url || "https://via.placeholder.com/1200x400?text=No+Image"}
                            alt={course.title}
                            className="w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    course.isPublished
                                        ? "bg-green-500 text-white"
                                        : "bg-orange-500 text-white"
                                }`}>
                                    {course.isPublished ? "Published" : "Draft"}
                                </span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                                    {course.category}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 p-4 border-b border-gray-200">
                        <Link
                            to={`/teacher-dashboard/edit-course/${course._id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Course
                        </Link>
                        <Link
                            to={`/teacher-dashboard/assignments/create?courseId=${course._id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Create Assignment
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-2 border-b border-gray-200 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-6xl mx-auto">
                {activeTab === "overview" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Stats Cards */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="text-2xl font-bold text-gray-800">{course.duration || "Not set"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Students</p>
                                    <p className="text-2xl font-bold text-gray-800">{course.enrolledStudents?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <BarChart3 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Price</p>
                                    <p className="text-2xl font-bold text-gray-800">${course.price || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Description</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{course.description}</p>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Requirements</h3>
                            <ul className="space-y-2">
                                {course.requirements?.map((req, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Learning Outcomes */}
                        <div className="md:col-span-3 bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">What You'll Learn</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.learningOutcomes?.map((outcome, index) => (
                                    <div key={index} className="flex items-start gap-2 text-gray-600">
                                        <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5" />
                                        {outcome}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "curriculum" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Course Curriculum</h3>
                            <Link
                                to={`/teacher-dashboard/edit-course/${course._id}`}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                            >
                                Edit Curriculum
                            </Link>
                        </div>

                        {course.modules && course.modules.length > 0 ? (
                            <div className="space-y-4">
                                {course.modules.map((module, index) => (
                                    <div key={module._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </span>
                                                <span className="font-medium text-gray-800">{module.title}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {module.lessons?.length || 0} lessons
                                            </span>
                                        </div>
                                        {module.lessons && (
                                            <div className="divide-y divide-gray-100">
                                                {module.lessons.map((lesson) => (
                                                    <div key={lesson._id} className="flex items-center justify-between px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            {lesson.type === "video" ? (
                                                                <Play className="w-4 h-4 text-red-500" />
                                                            ) : (
                                                                <FileText className="w-4 h-4 text-blue-500" />
                                                            )}
                                                            <span className="text-gray-700">{lesson.title}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No curriculum added</h3>
                                <p className="text-gray-500 mb-4">Add modules and lessons to your course</p>
                                <Link
                                    to={`/teacher-dashboard/edit-course/${course._id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Add Curriculum
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === "students" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Enrolled Students</h3>
                        
                        {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Progress</th>
                                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Enrolled</th>
                                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {course.enrolledStudents.map((student) => (
                                            <tr key={student._id} className="border-b border-gray-100">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 font-medium">
                                                                {student.fullName?.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{student.fullName}</p>
                                                            <p className="text-sm text-gray-500">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-600 rounded-full"
                                                                style={{ width: `${student.progress || 0}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-600">{student.progress || 0}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        student.paymentStatus === "PAID"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                        {student.paymentStatus || "PENDING"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No students enrolled</h3>
                                <p className="text-gray-500">Students will appear here once they enroll in your course</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === "analytics" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Course Analytics</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                <p className="text-blue-100 mb-2">Total Students</p>
                                <p className="text-4xl font-bold">{course.enrolledStudents?.length || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                                <p className="text-green-100 mb-2">Completion Rate</p>
                                <p className="text-4xl font-bold">0%</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                <p className="text-purple-100 mb-2">Revenue</p>
                                <p className="text-4xl font-bold">$0</p>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
                            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Detailed Analytics Coming Soon</h3>
                            <p className="text-gray-500">Track student engagement, completion rates, and revenue in real-time</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TeacherCourseView;
