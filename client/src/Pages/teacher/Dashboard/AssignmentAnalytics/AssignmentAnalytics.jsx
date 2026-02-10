import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Download,
    TrendingUp,
    TrendingDown,
    Users,
    CheckCircle,
    Clock,
    AlertCircle,
    BarChart3,
    PieChart,
    Award
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AssignmentAnalytics = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const token = localStorage.getItem("token");

    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        submitted: 0,
        graded: 0,
        late: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
    });
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [assignmentId]);

    const fetchData = async () => {
        try {
            // Fetch assignment details
            const assignmentRes = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const assignmentData = await assignmentRes.json();

            if (assignmentData.success) {
                setAssignment(assignmentData.assignment);
            }

            // Fetch submissions
            const submissionsRes = await fetch(`${BACKEND_URL}/api/submissions/assignment/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const submissionsData = await submissionsRes.json();

            if (submissionsData.success) {
                setSubmissions(submissionsData.submissions);
                
                // Calculate detailed stats
                const gradedSubs = submissionsData.submissions.filter(s => s.status === "graded");
                const scores = gradedSubs.map(s => s.marks || 0);
                
                const submittedCount = submissionsData.submissions.filter(s => s.submittedAt).length;
                const lateCount = submissionsData.submissions.filter(s => s.isLate).length;

                setStats({
                    total: submissionsData.submissions.length,
                    submitted: submittedCount,
                    graded: submissionsData.stats.graded || gradedSubs.length,
                    late: lateCount,
                    averageScore: gradedSubs.length > 0 
                        ? (gradedSubs.reduce((sum, s) => sum + (s.marks || 0), 0) / gradedSubs.length).toFixed(1)
                        : 0,
                    highestScore: scores.length > 0 ? Math.max(...scores) : 0,
                    lowestScore: scores.length > 0 ? Math.min(...scores) : 0
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        setExporting(true);

        // Prepare CSV data
        const headers = ["Student Name", "Email", "Submitted At", "Status", "Late", "Marks", "Feedback"];
        const rows = submissions.map(sub => [
            sub.student?.name || "Unknown",
            sub.student?.email || "",
            sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "Not submitted",
            sub.status,
            sub.isLate ? "Yes" : "No",
            sub.marks !== null ? sub.marks : "-",
            sub.feedback || "-"
        ]);

        // Add assignment summary at the top
        let csvContent = "\n";
        csvContent += "ASSIGNMENT ANALYTICS REPORT\n";
        csvContent += "========================\n";
        csvContent += `Assignment: ${assignment?.title}\n`;
        csvContent += `Course: ${assignment?.course?.title}\n`;
        csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
        
        csvContent += "SUMMARY STATISTICS\n";
        csvContent += "==================\n";
        csvContent += `Total Students: ${stats.total}\n`;
        csvContent += `Submitted: ${stats.submitted} (${((stats.submitted / stats.total) * 100).toFixed(1)}%)\n`;
        csvContent += `Pending: ${stats.total - stats.submitted}\n`;
        csvContent += `Late Submissions: ${stats.late}\n`;
        csvContent += `Graded: ${stats.graded}\n`;
        csvContent += `Average Score: ${stats.averageScore}\n`;
        csvContent += `Highest Score: ${stats.highestScore}\n`;
        csvContent += `Lowest Score: ${stats.lowestScore}\n\n`;
        
        csvContent += "STUDENT SUBMISSIONS\n";
        csvContent += "===================\n";
        
        // Add headers
        csvContent += headers.join(",") + "\n";
        
        // Add data rows
        rows.forEach(row => {
            csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
        });

        // Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `assignment_analytics_${assignment?.title?.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExporting(false);
    };

    // Calculate grade distribution
    const calculateGradeDistribution = () => {
        const gradedSubs = submissions.filter(s => s.status === "graded");
        const distribution = {
            "A (90-100)": 0,
            "B (80-89)": 0,
            "C (70-79)": 0,
            "D (60-69)": 0,
            "F (<60)": 0
        };

        gradedSubs.forEach(sub => {
            const percentage = (sub.marks / assignment.maxMarks) * 100;
            if (percentage >= 90) distribution["A (90-100)"]++;
            else if (percentage >= 80) distribution["B (80-89)"]++;
            else if (percentage >= 70) distribution["C (70-79)"]++;
            else if (percentage >= 60) distribution["D (60-69)"]++;
            else distribution["F (<60)"]++;
        });

        return distribution;
    };

    const gradeDistribution = calculateGradeDistribution();
    const submissionRate = stats.total > 0 ? ((stats.submitted / stats.total) * 100).toFixed(1) : 0;
    const gradingRate = stats.submitted > 0 ? ((stats.graded / stats.submitted) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Assignment not found</h2>
                    <button
                        onClick={() => navigate("/teacher-dashboard/assignments")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Back to Assignments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/teacher-dashboard/assignments")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Assignments
                    </button>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 className="w-8 h-8 text-indigo-600" />
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                    Assignment Analytics
                                </h1>
                            </div>
                            <p className="text-gray-600">{assignment.title}</p>
                            <p className="text-sm text-gray-500">{assignment.course?.title}</p>
                        </div>

                        <button
                            onClick={exportToCSV}
                            disabled={exporting}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" />
                            {exporting ? "Exporting..." : "Export CSV"}
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-sm text-gray-500">Total Students</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.submitted}</p>
                                <p className="text-sm text-gray-500">Submitted ({submissionRate}%)</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total - stats.submitted}</p>
                                <p className="text-sm text-gray-500">Pending</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
                                <p className="text-sm text-gray-500">Late</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5" />
                            <span className="text-sm opacity-80">Average Score</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.averageScore}</p>
                        <p className="text-sm opacity-80">out of {assignment.maxMarks}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-500">Highest Score</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.highestScore}</p>
                        <p className="text-sm text-gray-500">Top performer</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-gray-500">Lowest Score</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.lowestScore}</p>
                        <p className="text-sm text-gray-500">Needs attention</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-500">Graded</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.graded}</p>
                        <p className="text-sm text-gray-500">{gradingRate}% completion</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <span className="text-sm text-gray-500">On-Time Rate</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {stats.submitted > 0 
                                ? ((1 - stats.late / stats.submitted) * 100).toFixed(0)
                                : 0}%
                        </p>
                        <p className="text-sm text-gray-500">submitted on time</p>
                    </motion.div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Grade Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <PieChart className="w-6 h-6 text-indigo-600" />
                            Grade Distribution
                        </h2>

                        <div className="space-y-4">
                            {Object.entries(gradeDistribution).map(([grade, count]) => {
                                const percentage = stats.graded > 0 ? (count / stats.graded) * 100 : 0;
                                const colors = {
                                    "A (90-100)": "bg-green-500",
                                    "B (80-89)": "bg-blue-500",
                                    "C (70-79)": "bg-yellow-500",
                                    "D (60-69)": "bg-orange-500",
                                    "F (<60)": "bg-red-500"
                                };

                                return (
                                    <div key={grade}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{grade}</span>
                                            <span className="text-gray-500">{count} students</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`${colors[grade] || "bg-gray-500"} h-3 rounded-full transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Submission Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                            Submission Overview
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="w-24 h-24 mx-auto relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#22c55e"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(submissionRate / 100) * 251.2} 251.2`}
                                            className="transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-800">{submissionRate}%</span>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-2">Submission Rate</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <div className="w-24 h-24 mx-auto relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#f59e0b"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(gradingRate / 100) * 251.2} 251.2`}
                                            className="transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-800">{gradingRate}%</span>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-2">Grading Rate</p>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-gray-600">Submitted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-gray-600">Pending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-gray-600">Late</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Students Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-white rounded-xl shadow-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Student Performance</h2>
                        <p className="text-sm text-gray-500">{submissions.length} students</p>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No submissions yet</h3>
                            <p className="text-gray-500">Student submissions will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submission Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Late
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Marks
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {submissions.map((sub) => (
                                        <tr key={sub._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        {sub.student?.profileImage ? (
                                                            <img
                                                                src={sub.student.profileImage}
                                                                alt={sub.student.name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <Users className="w-5 h-5 text-indigo-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {sub.student?.name || "Unknown Student"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {sub.student?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    sub.status === "graded" 
                                                        ? "bg-green-100 text-green-700"
                                                        : sub.submittedAt
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {sub.status === "graded" ? "Graded" : sub.submittedAt ? "Submitted" : "Not Submitted"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {sub.submittedAt 
                                                    ? new Date(sub.submittedAt).toLocaleString()
                                                    : "-"
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {sub.isLate ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                        Late
                                                    </span>
                                                ) : sub.submittedAt ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        On Time
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {sub.marks !== null ? (
                                                    <span className="font-semibold text-green-600">
                                                        {sub.marks} / {assignment.maxMarks}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/teacher-dashboard/assignments/${assignmentId}/submissions`}
                                                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                                >
                                                    Review
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AssignmentAnalytics;

