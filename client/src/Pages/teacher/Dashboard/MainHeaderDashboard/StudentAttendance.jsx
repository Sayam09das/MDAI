import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-calendar/dist/Calendar.css";

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

    /* 🎯 Attendance depends on date */
    const attendance = useMemo(() => {
        if (isFutureDate(date)) {
            return null; // ❌ No data for future
        }

        // ✅ Stable pseudo-data based on date
        const seed = date.getDate() + date.getMonth() * 3;
        const present = 60 + (seed % 30); // 60–89%
        const absent = 100 - present;

        return {
            present,
            absent,
        };
    }, [date]);

    const data = attendance
        ? [
            { name: "Present", value: attendance.present },
            { name: "Absent", value: attendance.absent },
        ]
        : [];

    /* DATE NAVIGATION */
    const changeDate = (days) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        setDate(newDate);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-sm w-full"
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
                            className="w-4 h-4 cursor-pointer text-gray-500"
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
                            className="w-4 h-4 cursor-pointer text-gray-500"
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
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            {!attendance ? (
                /* 🚫 FUTURE DATE */
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
                                    data={data}
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
                </>
            )}
        </motion.div>
    );
};

export default StudentAttendance;
