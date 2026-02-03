import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "react-calendar/dist/Calendar.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* COLORS */
const COLORS = {
    present: "#7dd3fc",
    absent: "#fdba74",
};

const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
};

const StudentAttendance = () => {
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch attendance data from backend
    const fetchAttendance = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Format date as YYYY-MM-DD
            const dateStr = date.toISOString().split('T')[0];
            
            const res = await fetch(
                `${BACKEND_URL}/api/teacher/dashboard/attendance?date=${dateStr}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch attendance");
            }

            setAttendance(data.attendance);
        } catch (err) {
            console.error("Fetch Attendance Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    // Calculate chart data
    const chartData = useMemo(() => {
        if (!attendance) return [];
        return [
            { name: "Present", value: attendance.present || 0 },
            { name: "Absent", value: attendance.absent || 0 },
        ];
    }, [attendance]);

    /* DATE NAVIGATION */
    const changeDate = (days) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        setDate(newDate);
    };

    // Show loading state
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-52 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            </motion.div>
        );
    }

    // Show error state
    if (error && !attendance) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Student Attendance
                    </h3>
                </div>
                <div className="h-52 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-semibold text-gray-400">
                        Unable to load attendance
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                        {error}
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-sm w-full h-full"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Student Attendance
                </h3>

                {/* DATE CONTROL */}
                <div className="relative">
                    <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                        <ChevronLeft
                            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => changeDate(-1)}
                        />

                        <span
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="cursor-pointer text-gray-700"
                        >
                            {date.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>

                        <ChevronRight
                            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => changeDate(1)}
                        />
                    </div>

                    {showCalendar && (
                        <div className="absolute right-0 mt-2 z-50 bg-white rounded-xl shadow-lg p-2">
                            <Calendar
                                value={date}
                                onChange={(d) => {
                                    setDate(d);
                                    setShowCalendar(false);
                                }}
                                maxDate={new Date()}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            {!attendance ? (
                /* 🚫 NO DATA */
                <div className="h-52 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-semibold text-gray-400">
                        No attendance data
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                        Attendance will be available after the class
                    </span>
                </div>
            ) : (
                /* ✅ DONUT CHART */
                <>
                    <div className="relative h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    stroke="none"
                                >
                                    <Cell fill={COLORS.present} />
                                    <Cell fill={COLORS.absent} />
                                </Pie>

                                {/* 🔥 TOOLTIP */}
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value}%`,
                                        name,
                                    ]}
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "none",
                                        fontSize: "12px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* CENTER */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">
                                {attendance.present}%
                            </span>
                            <span className="text-xs text-gray-500">
                                Attendance
                            </span>
                        </div>
                    </div>

                    {/* LEGEND */}
                    <div className="flex items-center justify-center gap-6 mt-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ background: COLORS.present }}
                            />
                            <span className="text-gray-600">
                                Present ({attendance.present}%)
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ background: COLORS.absent }}
                            />
                            <span className="text-gray-600">
                                Absent ({attendance.absent}%)
                            </span>
                        </div>
                    </div>

                    {/* STUDENT COUNTS */}
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{attendance.presentCount} present</span>
                        <span className="text-gray-300">|</span>
                        <span>{attendance.absentCount} absent</span>
                        <span className="text-gray-300">|</span>
                        <span>{attendance.totalStudents} total</span>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default StudentAttendance;

