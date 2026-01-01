import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    TrendingUp,
    TrendingDown,
    IndianRupee,
    Award,
    Wallet,
    BarChart2,
} from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const earningsData = {
    monthlyEarnings: 128500,
    growth: 18.4,
    bestCourse: "Full Stack MERN",
    payoutStatus: "Processed",
};

const chartData = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Monthly Earnings (₹)",
            data: [62000, 74000, 86000, 104000, 128500],
            backgroundColor: "rgba(99, 102, 241, 0.7)",
            borderRadius: 8,
        },
    ],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: {
            ticks: {
                callback: (value) => `₹${value / 1000}k`,
            },
        },
    },
};

const EarningsOverview = () => {
    const handleViewAnalytics = () => {
        toast.info("Redirecting to full analytics...", {
            autoClose: 2000,
            position: "top-right",
        });
    };

    return (
        <div className="w-full px-4 md:px-8 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Earnings & Analytics
                    </h2>
                    <p className="text-sm text-gray-500">
                        High-level performance overview
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewAnalytics}
                    className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700"
                >
                    <BarChart2 size={18} />
                    View Full Analytics
                </motion.button>
            </motion.div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    {/* Monthly Earnings */}
                    <div className="bg-white p-5 rounded-xl shadow-md border">
                        <div className="flex items-center gap-3 mb-2">
                            <IndianRupee className="text-indigo-600" />
                            <h3 className="font-semibold text-gray-700">
                                Monthly Earnings
                            </h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹{earningsData.monthlyEarnings.toLocaleString()}
                        </p>
                    </div>

                    {/* Growth */}
                    <div className="bg-white p-5 rounded-xl shadow-md border">
                        <div className="flex items-center gap-3 mb-2">
                            {earningsData.growth >= 0 ? (
                                <TrendingUp className="text-green-600" />
                            ) : (
                                <TrendingDown className="text-red-600" />
                            )}
                            <h3 className="font-semibold text-gray-700">
                                Growth Rate
                            </h3>
                        </div>
                        <p
                            className={`text-2xl font-bold ${earningsData.growth >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {earningsData.growth}% this month
                        </p>
                    </div>

                    {/* Best Course */}
                    <div className="bg-white p-5 rounded-xl shadow-md border">
                        <div className="flex items-center gap-3 mb-2">
                            <Award className="text-yellow-500" />
                            <h3 className="font-semibold text-gray-700">
                                Top Course
                            </h3>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                            {earningsData.bestCourse}
                        </p>
                    </div>

                    {/* Payout */}
                    <div className="bg-white p-5 rounded-xl shadow-md border">
                        <div className="flex items-center gap-3 mb-2">
                            <Wallet className="text-indigo-600" />
                            <h3 className="font-semibold text-gray-700">
                                Payout Status
                            </h3>
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-600">
                            {earningsData.payoutStatus}
                        </span>
                    </div>
                </motion.div>

                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md border p-5 lg:col-span-2 h-[360px]"
                >
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Earnings Trend (Last 5 Months)
                    </h3>
                    <Bar data={chartData} options={chartOptions} />
                </motion.div>
            </div>
        </div>
    );
};

export default EarningsOverview;
