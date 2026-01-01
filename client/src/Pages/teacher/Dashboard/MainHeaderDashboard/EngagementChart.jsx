import React from "react";
import { motion } from "framer-motion";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

// ---------- DATA ----------
const studentGrowthData = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Students",
            data: [1200, 1450, 1700, 1950, 2300],
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,0.2)",
            tension: 0.4,
            fill: true,
        },
    ],
};

const courseEngagementData = {
    labels: ["React", "Node", "MERN", "DSA"],
    datasets: [
        {
            label: "Engagement %",
            data: [82, 74, 91, 68],
            backgroundColor: [
                "rgba(99,102,241,0.7)",
                "rgba(34,197,94,0.7)",
                "rgba(234,179,8,0.7)",
                "rgba(239,68,68,0.7)",
            ],
            borderRadius: 8,
        },
    ],
};

const completionRateData = {
    labels: ["Completed", "In Progress", "Dropped"],
    datasets: [
        {
            data: [68, 22, 10],
            backgroundColor: [
                "rgba(34,197,94,0.8)",
                "rgba(99,102,241,0.8)",
                "rgba(239,68,68,0.8)",
            ],
        },
    ],
};

// ---------- OPTIONS ----------
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
};

const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
        legend: { position: "bottom" },
    },
};

const EngagementChart = () => {
    return (
        <div className="w-full px-4 md:px-8 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h2 className="text-2xl font-bold text-gray-800">
                    Student Engagement
                </h2>
                <p className="text-sm text-gray-500">
                    Track growth, engagement, and completion insights
                </p>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Growth */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-md border p-5 h-[300px]"
                >
                    <h3 className="font-semibold text-gray-700 mb-3">
                        Student Growth
                    </h3>
                    <Line data={studentGrowthData} options={baseOptions} />
                </motion.div>

                {/* Course Engagement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md border p-5 h-[300px]"
                >
                    <h3 className="font-semibold text-gray-700 mb-3">
                        Course Engagement
                    </h3>
                    <Bar data={courseEngagementData} options={baseOptions} />
                </motion.div>

                {/* Completion Rate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-md border p-5 h-[300px]"
                >
                    <h3 className="font-semibold text-gray-700 mb-3">
                        Completion Rate
                    </h3>
                    <Doughnut data={completionRateData} options={donutOptions} />
                </motion.div>
            </div>
        </div>
    );
};

export default EngagementChart;
