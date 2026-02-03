import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";

/* ===== CONFIG ===== */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

/* ===== DEFAULT DATA ===== */
const defaultData = [
    { month: "Jan", value: 72 },
    { month: "Feb", value: 68 },
    { month: "Mar", value: 75 },
    { month: "Apr", value: 71 },
    { month: "May", value: 78 },
    { month: "Jun", value: 82 },
    { month: "Jul", value: 79 },
    { month: "Aug", value: 85 },
    { month: "Sep", value: 81 },
    { month: "Oct", value: 88 },
    { month: "Nov", value: 86 },
    { month: "Dec", value: 90 },
];

/* ===== TOOLTIP ===== */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-xl">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-900">
                    Average: <span className="text-indigo-600">{payload[0].value}%</span>
                </p>
            </div>
        );
    }
    return null;
};

const StudentPerformanceGraph = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [range, setRange] = useState("yearly");
    const [summary, setSummary] = useState({
        average: 0,
        highest: 0,
        lowest: 0,
        trend: 0,
        trendDirection: "up",
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    /* ===== FETCH DATA FROM BACKEND ===== */
    useEffect(() => {
        const fetchPerformanceTrends = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) {
                    setError(true);
                    return;
                }

                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/dashboard/student-performance-trends?range=${range}`,
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

                if (responseData.data && responseData.data.length > 0) {
                    setData(responseData.data);
                }
                if (responseData.summary) {
                    setSummary(responseData.summary);
                }
            } catch (err) {
                console.error("Performance trends fetch error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceTrends();
    }, [range]);

    // Calculate statistics from data
    const displayData = data.length > 0 ? data : defaultData;
    const average = summary.average || Math.round(displayData.reduce((sum, item) => sum + item.value, 0) / displayData.length);
    const highest = summary.highest || Math.max(...displayData.map(item => item.value));
    const lowest = summary.lowest || Math.min(...displayData.map(item => item.value));
    const lastMonth = displayData[displayData.length - 1]?.value || 0;
    const previousMonth = displayData.length > 1 ? displayData[displayData.length - 2]?.value || 0 : 0;
    const trend = summary.trend || (lastMonth - previousMonth);
    const trendDirection = summary.trend >= 0 ? "up" : "down";

    /* ===== LOADING STATE ===== */
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
            >
                {/* HEADER */}
                <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-5">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* STATS CARDS LOADING */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-lg p-2 sm:p-3 animate-pulse">
                            <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* CHART LOADING */}
                <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 -ml-2 sm:-ml-4">
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    /* ===== ERROR STATE ===== */
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
            >
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                    Failed to load performance trends. Please try again later.
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow w-full"
        >
            {/* HEADER */}
            <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-5">
                <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Student Performance
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Yearly average: {average}%
                        </p>
                        {trend >= 0 ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                                <TrendingUp className="w-3 h-3" />
                                <span>+{trend}%</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                                <TrendingDown className="w-3 h-3" />
                                <span>-{Math.abs(trend)}%</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        aria-label="More options"
                    >
                        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36 z-10">
                            <button 
                                onClick={() => { setRange("monthly"); setShowMenu(false); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                            >
                                Monthly View
                            </button>
                            <button 
                                onClick={() => { setRange("yearly"); setShowMenu(false); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                            >
                                Yearly View
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 sm:p-3">
                    <p className="text-xs text-green-700 font-medium">Highest</p>
                    <p className="text-base sm:text-xl font-bold text-green-600 mt-1">
                        {highest}%
                    </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 sm:p-3">
                    <p className="text-xs text-blue-700 font-medium">Average</p>
                    <p className="text-base sm:text-xl font-bold text-blue-600 mt-1">
                        {average}%
                    </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-2 sm:p-3">
                    <p className="text-xs text-orange-700 font-medium">Lowest</p>
                    <p className="text-base sm:text-xl font-bold text-orange-600 mt-1">
                        {lowest}%
                    </p>
                </div>
            </div>

            {/* CHART */}
            <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 -ml-2 sm:-ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={displayData}
                        margin={{
                            top: 10,
                            right: isMobile ? 5 : 10,
                            left: isMobile ? -10 : 0,
                            bottom: 5
                        }}
                    >
                        <defs>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="50%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>

                            <filter id="shadow" height="200%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                            </filter>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />

                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#6b7280", fontSize: isMobile ? 10 : 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={5}
                        />

                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "#6b7280", fontSize: isMobile ? 10 : 12 }}
                            axisLine={false}
                            tickLine={false}
                            dx={-5}
                            width={isMobile ? 30 : 40}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: "#6366f1",
                                strokeDasharray: "3 3",
                                strokeWidth: 1,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="url(#lineColor)"
                            strokeWidth={isMobile ? 2.5 : 3}
                            dot={{
                                r: isMobile ? 3 : 4,
                                stroke: "#6366f1",
                                strokeWidth: 2,
                                fill: "white",
                            }}
                            activeDot={{
                                r: isMobile ? 5 : 7,
                                fill: "#6366f1",
                                stroke: "white",
                                strokeWidth: 2,
                                filter: "url(#shadow)",
                            }}
                            animationDuration={1200}
                            animationEasing="ease-in-out"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* INSIGHT BADGE */}
            <div className="mt-4 flex items-center justify-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                    ${trend >= 0
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                    {trend >= 0 ? (
                        <>
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Performance improving by {trend}% this month</span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>Performance decreased by {Math.abs(trend)}% this month</span>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StudentPerformanceGraph;

