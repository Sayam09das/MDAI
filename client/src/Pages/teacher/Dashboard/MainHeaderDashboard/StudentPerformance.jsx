import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

/* ===== CONFIG ===== */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ===== CUSTOM TOOLTIP ===== */
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-600">
                    {payload[0].payload.name}
                </p>
                <p className="text-sm font-semibold text-blue-600">
                    {payload[0].value}% attendance
                </p>
            </div>
        );
    }
    return null;
};

const StudentPerformance = () => {
    const [range, setRange] = useState("weekly");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [summary, setSummary] = useState({
        totalStudents: 0,
        averageAttendance: 0,
    });

    /* ================= FETCH DATA FROM BACKEND ================= */
    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) {
                    setError(true);
                    return;
                }

                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/dashboard/student-performance?range=${range}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const responseData = await res.json();

                if (!res.ok || !responseData.success) {
                    setError(true);
                    return;
                }

                setData(responseData.data);
                setSummary(responseData.summary || {
                    totalStudents: 0,
                    averageAttendance: 0,
                });
            } catch (err) {
                console.error("Student performance fetch error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, [range]);

    /* ================= CALCULATE STATS FROM DATA ================= */
    const average = data.length > 0
        ? Math.round(data.reduce((sum, item) => sum + item.students, 0) / data.length)
        : summary.averageAttendance;
    const max = data.length > 0 ? Math.max(...data.map(item => item.students)) : 0;
    const min = data.length > 0 ? Math.min(...data.map(item => item.students)) : 0;

    /* ================= LOADING STATE ================= */
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
            >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Student Performance
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Loading...
                        </p>
                    </div>

                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* STATS CARDS - Mobile Only */}
                <div className="grid grid-cols-3 gap-2 mb-4 sm:hidden">
                    <div className="bg-gray-100 rounded-lg p-2 h-16 animate-pulse"></div>
                    <div className="bg-gray-100 rounded-lg p-2 h-16 animate-pulse"></div>
                    <div className="bg-gray-100 rounded-lg p-2 h-16 animate-pulse"></div>
                </div>

                {/* CHART LOADING */}
                <div className="h-48 sm:h-56 md:h-64 lg:h-72 w-full -ml-2 sm:-ml-4 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /* ================= ERROR STATE ================= */
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
            >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Student Performance
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Average: 0%
                        </p>
                    </div>

                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 
                        outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                        cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                {/* ERROR MESSAGE */}
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                    Failed to load student performance data. Please try again later.
                </div>
            </motion.div>
        );
    }

    /* ================= MAIN UI ================= */
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
        >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Student Performance
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Avg: {average}% attendance • {summary.totalStudents} students
                    </p>
                </div>

                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 
                    outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                    cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* STATS CARDS - Mobile Only */}
            <div className="grid grid-cols-3 gap-2 mb-4 sm:hidden">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Max</p>
                    <p className="text-sm font-semibold text-blue-600">{max}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Avg</p>
                    <p className="text-sm font-semibold text-green-600">{average}%</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Min</p>
                    <p className="text-sm font-semibold text-orange-600">{min}%</p>
                </div>
            </div>

            {/* CHART */}
            <div className="h-48 sm:h-56 md:h-64 lg:h-72 w-full -ml-2 sm:-ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{
                                fontSize: window.innerWidth < 640 ? 10 : 12,
                                fill: '#6b7280'
                            }}
                            axisLine={false}
                            tickLine={false}
                            dy={5}
                        />
                        <YAxis
                            tick={{
                                fontSize: window.innerWidth < 640 ? 10 : 12,
                                fill: '#6b7280'
                            }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            dx={-5}
                            width={window.innerWidth < 640 ? 30 : 40}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                        />
                        <Bar
                            dataKey="students"
                            fill="#3b82f6"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={window.innerWidth < 640 ? 30 : 50}
                            animationDuration={800}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* STATS ROW - Desktop */}
            <div className="hidden sm:flex items-center justify-around mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Maximum</p>
                    <p className="text-lg font-semibold text-blue-600">{max}%</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-lg font-semibold text-green-600">{average}%</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Minimum</p>
                    <p className="text-lg font-semibold text-orange-600">{min}%</p>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentPerformance;
