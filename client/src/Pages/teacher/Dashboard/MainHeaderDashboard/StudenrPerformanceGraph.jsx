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

/* ===== DATA ===== */
const data = [
    { month: "Jan", value: 52 },
    { month: "Feb", value: 32 },
    { month: "Mar", value: 58 },
    { month: "Apr", value: 36 },
    { month: "May", value: 34 },
    { month: "Jun", value: 29 },
    { month: "Jul", value: 43 },
    { month: "Aug", value: 14 },
    { month: "Sep", value: 32 },
    { month: "Oct", value: 35 },
    { month: "Nov", value: 66 },
    { month: "Dec", value: 72 },
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

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Calculate statistics
    const average = Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length);
    const highest = Math.max(...data.map(item => item.value));
    const lowest = Math.min(...data.map(item => item.value));
    const lastMonth = data[data.length - 1].value;
    const previousMonth = data[data.length - 2].value;
    const trend = lastMonth > previousMonth;
    const trendValue = Math.abs(lastMonth - previousMonth);

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
                        {trend ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                                <TrendingUp className="w-3 h-3" />
                                <span>+{trendValue}%</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                                <TrendingDown className="w-3 h-3" />
                                <span>-{trendValue}%</span>
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
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">
                                Export Data
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">
                                View Details
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">
                                Settings
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
                        data={data}
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
                    ${trend
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                    {trend ? (
                        <>
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Performance improving by {trendValue}% this month</span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>Performance decreased by {trendValue}% this month</span>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StudentPerformanceGraph;