import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    AlertTriangle,
    BarChart3,
    PieChart,
    Activity,
    Award,
    Target,
    Calendar,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { getExamResults, getExam, getExamStats } from '../../../../lib/api/examApi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExamAnalytics = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [exam, setExam] = useState(null);
    const [results, setResults] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExamData();
    }, [examId]);

    const fetchExamData = async () => {
        try {
            setLoading(true);
            
            const examRes = await getExam(examId);
            if (examRes.success) {
                setExam(examRes.exam);
            }
            
            const resultsRes = await getExamResults(examId);
            if (resultsRes.success) {
                setResults(resultsRes.attempts);
            }
            
            const statsRes = await getExamStats(examId);
            if (statsRes.success) {
                setStats(statsRes.stats);
            }
        } catch (err) {
            setError('Failed to load exam analytics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '-';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    // Calculate additional analytics
    const calculateAnalytics = () => {
        if (!results || results.length === 0) return null;

        const submitted = results.filter(r => r.status === 'SUBMITTED' || r.status === 'AUTO_SUBMITTED');
        const passed = submitted.filter(r => r.passed);
        const failed = submitted.filter(r => !r.passed);
        const disqualified = results.filter(r => r.status === 'DISQUALIFIED');

        // Score distribution
        const scoreRanges = [
            { label: '0-20%', min: 0, max: 20, count: 0 },
            { label: '21-40%', min: 21, max: 40, count: 0 },
            { label: '41-60%', min: 41, max: 60, count: 0 },
            { label: '61-80%', min: 61, max: 80, count: 0 },
            { label: '81-100%', min: 81, max: 100, count: 0 }
        ];

        submitted.forEach(r => {
            const score = r.percentage || 0;
            const range = scoreRanges.find(r => score >= r.min && score <= r.max);
            if (range) range.count++;
        });

        // Time analysis
        const timeTaken = submitted.map(r => r.timeTaken || 0).filter(t => t > 0);
        const avgTime = timeTaken.length > 0 
            ? timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length 
            : 0;

        // Violation analysis
        const totalViolations = submitted.reduce((sum, r) => sum + (r.totalViolations || 0), 0);
        const studentsWithViolations = submitted.filter(r => (r.totalViolations || 0) > 0).length;

        return {
            totalAttempts: results.length,
            submitted: submitted.length,
            passed: passed.length,
            failed: failed.length,
            disqualified: disqualified.length,
            passRate: submitted.length > 0 ? (passed.length / submitted.length) * 100 : 0,
            scoreRanges,
            avgTime,
            totalViolations,
            studentsWithViolations,
            avgViolationsPerStudent: submitted.length > 0 
                ? (totalViolations / submitted.length).toFixed(2) 
                : 0
        };
    };

    const analytics = calculateAnalytics();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Analytics</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/teacher-dashboard/exams')}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/teacher-dashboard/exams')}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Exams
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <PieChart className="w-8 h-8 text-indigo-600" />
                                Exam Analytics
                            </h1>
                            <p className="text-gray-600 mt-1">{exam?.title || 'Exam Analytics'}</p>
                        </div>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{analytics?.totalAttempts || 0}</p>
                        <p className="text-gray-500">Total Attempts</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{analytics?.passRate?.toFixed(1) || 0}%</p>
                        <p className="text-gray-500">Pass Rate</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {formatDuration(analytics?.avgTime)}
                        </p>
                        <p className="text-gray-500">Avg Time</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {analytics?.avgViolationsPerStudent || 0}
                        </p>
                        <p className="text-gray-500">Avg Violations</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Score Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                            Score Distribution
                        </h2>
                        
                        <div className="space-y-4">
                            {analytics?.scoreRanges.map((range, index) => {
                                const percentage = analytics.submitted > 0 
                                    ? (range.count / analytics.submitted) * 100 
                                    : 0;
                                
                                return (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{range.label}</span>
                                            <span className="font-medium">{range.count} students</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className={`h-4 rounded-full transition-all ${
                                                    index === 0 ? 'bg-red-500' :
                                                    index === 1 ? 'bg-orange-500' :
                                                    index === 2 ? 'bg-yellow-500' :
                                                    index === 3 ? 'bg-blue-500' :
                                                    'bg-green-500'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-gray-600">Fail (0-20%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-gray-600">Below Avg (21-60%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-gray-600">Pass (61-100%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Target className="w-6 h-6 text-indigo-600" />
                            Performance Summary
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="flex justify-center mb-2">
                                    <Award className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats?.highestPercentage?.toFixed(1) || 0}%
                                </p>
                                <p className="text-sm text-gray-600">Highest Score</p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="flex justify-center mb-2">
                                    <TrendingUp className="w-8 h-8 text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats?.avgPercentage?.toFixed(1) || 0}%
                                </p>
                                <p className="text-sm text-gray-600">Average Score</p>
                            </div>

                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <div className="flex justify-center mb-2">
                                    <TrendingDown className="w-8 h-8 text-orange-600" />
                                </div>
                                <p className="text-2xl font-bold text-orange-600">
                                    {stats?.lowestPercentage?.toFixed(1) || 0}%
                                </p>
                                <p className="text-sm text-gray-600">Lowest Score</p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="flex justify-center mb-2">
                                    <Activity className="w-8 h-8 text-purple-600" />
                                </div>
                                <p className="text-2xl font-bold text-purple-600">
                                    {stats?.avgTimeTaken?.toFixed(0) || 0}s
                                </p>
                                <p className="text-sm text-gray-600">Avg Time (sec)</p>
                            </div>
                        </div>
                    </div>

                    {/* Attempt Status */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-indigo-600" />
                            Attempt Status
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-700">Passed</span>
                                </div>
                                <span className="font-bold text-green-600">{analytics?.passed || 0}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                    <span className="text-gray-700">Failed</span>
                                </div>
                                <span className="font-bold text-red-600">{analytics?.failed || 0}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    <span className="text-gray-700">Disqualified</span>
                                </div>
                                <span className="font-bold text-yellow-600">{analytics?.disqualified || 0}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-700">Violations Reported</span>
                                </div>
                                <span className="font-bold text-blue-600">{analytics?.totalViolations || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Violation Analysis */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-indigo-600" />
                            Security Analysis
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-yellow-600">
                                    {analytics?.studentsWithViolations || 0}
                                </p>
                                <p className="text-sm text-gray-600">Students with Violations</p>
                            </div>

                            <div className="bg-indigo-50 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-indigo-600">
                                    {analytics?.submitted > 0 
                                        ? ((analytics.studentsWithViolations / analytics.submitted) * 100).toFixed(1)
                                        : 0}%
                                </p>
                                <p className="text-sm text-gray-600">Violation Rate</p>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">Recommendations</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                {analytics?.passRate < 50 && (
                                    <li>• Consider reviewing exam difficulty or providing study materials</li>
                                )}
                                {analytics?.avgViolationsPerStudent > 2 && (
                                    <li>• High violation rate detected - review security settings</li>
                                )}
                                {analytics?.avgTime < (exam?.duration * 60 * 0.5) && (
                                    <li>• Students are finishing quickly - may indicate questions are too easy</li>
                                )}
                                {analytics?.passRate >= 80 && (
                                    <li>• Good pass rate! Consider making next exam slightly more challenging</li>
                                )}
                                <li>• Monitor tab switch patterns for potential cheating attempts</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamAnalytics;

