import React from "react";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, CheckCircle } from "lucide-react";

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
        <div className="w-full mt-4 sm:mt-5 md:mt-6">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    Student Overview
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Welcome back, {student.name} 👋
                </p>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5 md:mt-6">
                <StatCard
                    title="Total Courses"
                    value={totalCourses}
                    icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
                    gradient="from-blue-500 to-cyan-500"
                    delay={0.1}
                />
                <StatCard
                    title="Ongoing Courses"
                    value={ongoingCourses}
                    icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
                    gradient="from-amber-500 to-orange-500"
                    delay={0.2}
                />
                <StatCard
                    title="Completed Courses"
                    value={completedCourses}
                    icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                    gradient="from-emerald-500 to-green-500"
                    delay={0.3}
                />
            </div>

            {/* COURSE LIST */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-4 sm:mt-5 md:mt-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100"
            >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                        Enrolled Courses
                    </h3>
                </div>

                <ul className="space-y-2 sm:space-y-3">
                    {student.courses.map((course, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                            className="flex justify-between items-center gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
                        >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${course.status === "completed"
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                    }`} />
                                <span className="text-sm sm:text-base text-gray-700 font-medium truncate">
                                    {course.title}
                                </span>
                            </div>
                            <span
                                className={`text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap ${course.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {course.status}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon, gradient, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
            {/* Icon Background */}
            <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center opacity-90`}>
                {icon}
            </div>

            {/* Content */}
            <div className="relative">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1 sm:mb-2">
                    {title}
                </p>
                <motion.h3
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: delay + 0.2 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
                >
                    {value}
                </motion.h3>
            </div>

            {/* Decorative Circle */}
            <div className={`absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${gradient} rounded-full opacity-10 blur-xl`} />
        </motion.div>
    );
};

export default StudentOverview;