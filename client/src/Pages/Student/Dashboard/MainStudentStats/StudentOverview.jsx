import React from "react";
import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";

const StudentOverview = () => {
    // 🔹 Dummy student data
    const student = {
        name: "Sayam Das",
        courses: [
            { title: "Data Structures", status: "completed" },
            { title: "DBMS", status: "ongoing" },
            { title: "Computer Architecture", status: "ongoing" },
            { title: "Operating Systems", status: "completed" },
        ],
    };

    const totalCourses = student.courses.length;
    const completedCourses = student.courses.filter(
        (c) => c.status === "completed"
    ).length;
    const ongoingCourses = student.courses.filter(
        (c) => c.status === "ongoing"
    ).length;

    return (
        <div className="w-full mt-6">
            {/* HEADER */}
            <h2 className="text-xl font-bold text-gray-900">
                Student Overview
            </h2>
            <p className="text-gray-600 mt-1">
                Welcome back, {student.name} 👋
            </p>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <StatCard title="Total Courses" value={totalCourses} />
                <StatCard title="Ongoing Courses" value={ongoingCourses} />
                <StatCard title="Completed Courses" value={completedCourses} />
            </div>

            {/* COURSE LIST */}
            <div className="mt-6 bg-white rounded-xl p-5 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Enrolled Courses
                </h3>

                <ul className="space-y-3">
                    {student.courses.map((course, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center border-b pb-2 last:border-none"
                        >
                            <span className="text-gray-700">
                                {course.title}
                            </span>
                            <span
                                className={`text-sm font-medium px-3 py-1 rounded-full ${course.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {course.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-xl p-5 shadow"
        >
            <p className="text-gray-600 text-sm">{title}</p>

            <h3 className="text-3xl font-bold text-gray-900 mt-2">
                <NumberTicker value={value} />
            </h3>
        </motion.div>
    );
};

export default StudentOverview;
