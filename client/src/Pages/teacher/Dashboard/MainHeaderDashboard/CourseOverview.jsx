import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    Edit,
    Eye,
    BarChart3,
    Star,
    Users,
    DollarSign,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const courses = [
    {
        id: 1,
        title: "React Mastery",
        students: 1240,
        rating: 4.8,
        revenue: 52000,
        status: "Published",
    },
    {
        id: 2,
        title: "Node.js Backend",
        students: 860,
        rating: 4.6,
        revenue: 38500,
        status: "Draft",
    },
    {
        id: 3,
        title: "Full Stack MERN",
        students: 2100,
        rating: 4.9,
        revenue: 98000,
        status: "Published",
    },
];

const CourseOverview = () => {
    const handleAction = (type, course) => {
        toast.info(`${type} → ${course.title}`, {
            position: "top-right",
            autoClose: 2000,
        });
    };

    return (
        <div className="w-full px-4 md:px-8 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
            >
                <h2 className="text-2xl font-bold text-gray-800">
                    Course Overview
                </h2>
                <p className="text-gray-500 text-sm">
                    Manage your courses, students & performance
                </p>
            </motion.div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <motion.table
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full bg-white rounded-xl shadow-lg border border-gray-200"
                >
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th className="p-4 text-left">Course</th>
                            <th className="p-4 text-center">Students</th>
                            <th className="p-4 text-center">Rating</th>
                            <th className="p-4 text-center">Revenue</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courses.map((course, index) => (
                            <motion.tr
                                key={course.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-4 font-medium">
                                    {course.title}
                                </td>

                                <td className="p-4 text-center">
                                    <Users className="inline w-4 h-4 mr-1" />
                                    {course.students}
                                </td>

                                <td className="p-4 text-center">
                                    <Star className="inline w-4 h-4 text-yellow-400 mr-1" />
                                    {course.rating}
                                </td>

                                <td className="p-4 text-center">
                                    <DollarSign className="inline w-4 h-4 mr-1" />
                                    ₹{course.revenue.toLocaleString()}
                                </td>

                                <td className="p-4 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-yellow-100 text-yellow-600"
                                            }`}
                                    >
                                        {course.status}
                                    </span>
                                </td>

                                <td className="p-4 text-center space-x-3">
                                    <button
                                        onClick={() => handleAction("View", course)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleAction("Edit", course)}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleAction("Analytics", course)}
                                        className="text-purple-600 hover:text-purple-800"
                                    >
                                        <BarChart3 size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </motion.table>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid gap-4 lg:hidden">
                {courses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-md p-5 border"
                    >
                        <h3 className="font-semibold text-lg mb-2">
                            {course.title}
                        </h3>

                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>👨‍🎓 {course.students}</span>
                            <span>⭐ {course.rating}</span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-800">
                                ₹{course.revenue.toLocaleString()}
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-yellow-100 text-yellow-600"
                                    }`}
                            >
                                {course.status}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => handleAction("View", course)}
                                className="flex-1 mr-2 py-2 text-sm rounded-lg bg-blue-50 text-blue-600"
                            >
                                View
                            </button>
                            <button
                                onClick={() => handleAction("Edit", course)}
                                className="flex-1 py-2 text-sm rounded-lg bg-indigo-50 text-indigo-600"
                            >
                                Edit
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CourseOverview;
